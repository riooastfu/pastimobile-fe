import { useEffect, useRef, useState, useCallback } from 'react';
import { BackHandler } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect } from '@react-navigation/native';
import { getPreciseDistance } from 'geolib';
import { isMockingLocation } from 'react-native-turbo-mock-location-detector';
import { getMapRadius } from '../../../api/absensi';

interface InitLocationProps {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface ListRadiusMapProps {
    tikor: string;
    nama_lokasi: string;
    radius: number;
}

const INITIAL_LOCATION: InitLocationProps = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
};

const GEOLOCATION_OPTIONS = {
    timeout: 10000,
    enableHighAccuracy: false,
};

export const useAbsensiScreen = () => {
    const mapRef = useRef<MapView | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listRadiusMap, setListRadiusMap] = useState<ListRadiusMapProps[]>([]);
    const [initLoc, setInitLoc] = useState<InitLocationProps>(INITIAL_LOCATION);
    const [error, setError] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [mockLocationDetected, setMockLocationDetected] = useState<boolean>(false);

    const getCurrentLocation = useCallback(() => {
        setIsLoading(true);
        setLocationError(null);

        Geolocation.getCurrentPosition(
            (location) => {
                const newLocation = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                };
                setInitLoc(newLocation);
                setIsLoading(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLocationError('Gagal memuat lokasi Anda. Pastikan GPS aktif');
                setIsLoading(false);
            },
            GEOLOCATION_OPTIONS
        );
    }, []);

    const isInsideRadius = useCallback((): boolean => {
        if (!initLoc.latitude || !initLoc.longitude || listRadiusMap.length === 0) {
            return false;
        }

        const currentPosition = {
            latitude: initLoc.latitude,
            longitude: initLoc.longitude,
        };

        return listRadiusMap.some((item) => {
            try {
                const centerPoint = JSON.parse(item.tikor);
                const distance = getPreciseDistance(currentPosition, centerPoint);
                return distance <= item.radius;
            } catch (error) {
                console.error('Error parsing location coordinates:', error);
                return false;
            }
        });
    }, [initLoc, listRadiusMap]);

    const checkLocationMocking = useCallback(async () => {
        try {
            const result = await isMockingLocation();
            if (result.isLocationMocked) {
                setMockLocationDetected(true);
            }
        } catch (error) {
            console.error('Mock location detection error:', error);
        }
    }, []);

    const onToCurrentPosition = useCallback(() => {
        getCurrentLocation();
        if (mapRef.current && initLoc.latitude && initLoc.longitude) {
            mapRef.current.animateToRegion(initLoc);
        }
    }, [getCurrentLocation, initLoc]);

    const fetchRadiusData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const radiusMap = await getMapRadius();
            if (radiusMap.status === 'success') {
                setListRadiusMap(radiusMap.data);
            } else {
                setError('Gagal memuat data lokasi absensi');
            }
        } catch (error) {
            console.error('fetchRadiusData Error [AbsensiScreen]:', error);
            setError('Gagal memuat data lokasi. Silakan coba lagi');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial setup
    useEffect(() => {
        fetchRadiusData();
        checkLocationMocking();
    }, [fetchRadiusData, checkLocationMocking]);

    // Focus effect for location updates
    useFocusEffect(
        useCallback(() => {
            getCurrentLocation();
        }, [getCurrentLocation])
    );

    return {
        isLoading,
        listRadiusMap,
        initLoc,
        mapRef,
        isInsideRadius,
        onToCurrentPosition,
        getCurrentLocation,
        error,
        locationError,
        mockLocationDetected,
        retryFetchRadius: fetchRadiusData,
        retryLocation: getCurrentLocation,
        dismissMockLocationWarning: () => setMockLocationDetected(false),
    };
};