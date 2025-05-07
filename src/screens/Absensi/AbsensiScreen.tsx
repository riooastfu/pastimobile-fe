import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Geolocation from '@react-native-community/geolocation';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region, // Import Region type
} from 'react-native-maps';
import getDistance from 'geolib/es/getPreciseDistance';
import { RootStackParamList } from '../../types'; // Asumsikan path ini benar
import { isMockingLocation } from 'react-native-turbo-mock-location-detector'; // Asumsikan path ini benar
import { getMapRadius } from '../../api/absensi'; // Asumsikan path ini benar
import { responsiveWidth, spacing, fontSizes, radius } from '../../utils/responsive'; // Asumsikan path ini benar

// Interface untuk lokasi pengguna (hanya latitude dan longitude)
interface UserCoordinates {
  latitude: number;
  longitude: number;
}

// Interface untuk Region peta (sebelumnya initLocProps)
interface MapRegionProps extends Region { }

interface ListRadiusMapProps {
  tikor: string;
  nama_lokasi: string;
  radius: number;
}

const DEFAULT_LATITUDE_DELTA = 0.015;
const DEFAULT_LONGITUDE_DELTA = 0.0121;

// Default region jika lokasi belum diketahui (misalnya, tengah Indonesia)
const INITIAL_MAP_REGION: MapRegionProps = {
  latitude: -2.548926,
  longitude: 118.0148634,
  latitudeDelta: 30, // Zoom out untuk melihat Indonesia
  longitudeDelta: 30,
};


const AbsensiScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView | null>(null);
  const watchId = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listRadiusMap, setListRadiusMap] = useState<ListRadiusMapProps[]>([]);

  // State untuk lokasi aktual pengguna (dari GPS)
  const [userPosition, setUserPosition] = useState<UserCoordinates | null>(null);

  // State untuk region yang ditampilkan peta
  const [mapDisplayRegion, setMapDisplayRegion] = useState<MapRegionProps>(INITIAL_MAP_REGION);

  // State untuk menandai apakah lokasi pengguna pertama kali sudah didapatkan
  const [isUserLocationKnown, setIsUserLocationKnown] = useState<boolean>(false);


  const handleMockLocationCheck = useCallback(async () => {
    try {
      const mockResult = await isMockingLocation();
      if (mockResult.isLocationMocked) {
        Alert.alert(
          'Peringatan!',
          'Kamu terdeteksi menggunakan aplikasi penyamar lokasi. Aplikasi akan ditutup.',
          [{ text: 'OK', onPress: () => BackHandler.exitApp() }],
          { cancelable: false }
        );
        return true;
      }
    } catch (error) {
      console.log('Error checking mock location:', error);
    }
    return false;
  }, []);


  const isInsideRadius = useCallback(() => {
    if (!userPosition) {
      return false;
    }
    return listRadiusMap.some(item => {
      try {
        const targetLocation = JSON.parse(item.tikor);
        if (typeof targetLocation.latitude !== 'number' || typeof targetLocation.longitude !== 'number') {
          console.warn('Invalid tikor format:', item.tikor);
          return false;
        }
        const distance = getDistance(userPosition, targetLocation);
        return distance <= item.radius;
      } catch (e) {
        console.error("Error parsing tikor or calculating distance:", item.tikor, e);
        return false;
      }
    });
  }, [userPosition, listRadiusMap]);

  const fetchRadiusData = useCallback(async () => {
    // setIsLoading(true) sudah di set di awal atau oleh onGetCurrentLocation
    try {
      const radiusMap = await getMapRadius();
      if (radiusMap.status === 'success') {
        setListRadiusMap(radiusMap.data);
      } else {
        Alert.alert('Gagal Mendapatkan Radius', radiusMap.message || 'Tidak dapat memuat data radius dari server.');
      }
    } catch (error) {
      console.log('fetchRadiusData Error [AbsensiScreen]:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil data radius.');
    }
    // setIsLoading(false) akan dihandle setelah lokasi juga berhasil/gagal didapat
  }, []);

  const onGetCurrentLocation = useCallback((animateMap = false) => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        if (await handleMockLocationCheck()) {
          setIsLoading(false); // Tetap matikan loading jika mock terdeteksi
          return;
        }

        const currentUserPos: UserCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserPosition(currentUserPos);

        if (!isUserLocationKnown) {
          // Jika ini lokasi pertama, set map region ke lokasi pengguna
          const newRegion = {
            ...currentUserPos,
            latitudeDelta: DEFAULT_LATITUDE_DELTA,
            longitudeDelta: DEFAULT_LONGITUDE_DELTA,
          };
          setMapDisplayRegion(newRegion);
          setIsUserLocationKnown(true);
          if (animateMap && mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        } else if (animateMap && mapRef.current) {
          // Jika bukan lokasi pertama tapi diminta animasi (misal tombol center)
          mapRef.current.animateToRegion({
            ...currentUserPos,
            latitudeDelta: mapDisplayRegion.latitudeDelta, // Gunakan delta saat ini
            longitudeDelta: mapDisplayRegion.longitudeDelta,
          }, 1000);
        }
        setIsLoading(false);
      },
      (error) => {
        console.log('getCurrentPosition Error:', error);
        Alert.alert('Gagal Mendapatkan Lokasi', 'Tidak dapat mengambil lokasi Anda saat ini. Pastikan GPS aktif.');
        setIsLoading(false);
        if (!isUserLocationKnown) {
          // Jika gagal mendapatkan lokasi awal, setidaknya kita tahu usaha telah dilakukan
          // Agar UI tidak stuck di loading peta selamanya. Peta akan tetap di initial region.
          setIsUserLocationKnown(true);
        }
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [handleMockLocationCheck, isUserLocationKnown, mapDisplayRegion.latitudeDelta, mapDisplayRegion.longitudeDelta]);


  useEffect(() => {
    fetchRadiusData();
    onGetCurrentLocation(true); // Dapatkan lokasi awal & pusatkan peta

    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        await handleMockLocationCheck();
      }
      appState.current = nextAppState;
    });

    watchId.current = Geolocation.watchPosition(
      async (position) => {
        if (await handleMockLocationCheck()) {
          if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
          return;
        }

        const newCurrentUserPos: UserCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserPosition(newCurrentUserPos); // Hanya update posisi user, jangan map region

        if (!isUserLocationKnown) {
          // Ini seharusnya sudah dihandle oleh onGetCurrentLocation, tapi sebagai fallback
          const newRegion = {
            ...newCurrentUserPos,
            latitudeDelta: DEFAULT_LATITUDE_DELTA,
            longitudeDelta: DEFAULT_LONGITUDE_DELTA,
          };
          setMapDisplayRegion(newRegion);
          setIsUserLocationKnown(true);
          if (mapRef.current) mapRef.current.animateToRegion(newRegion, 1000);
        }
        // Matikan loading jika masih aktif (misalnya setelah loading awal)
        if (isLoading) setIsLoading(false);
      },
      (error) => {
        console.log('watchPosition Error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000,
      }
    );

    return () => {
      if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRadiusData, handleMockLocationCheck]); // onGetCurrentLocation & isUserLocationKnown dikeluarkan dari deps untuk mencegah re-run effect yang tidak perlu


  useFocusEffect(
    useCallback(() => {
      handleMockLocationCheck();
      // Jika ingin ada sedikit refresh saat fokus:
      // if (isUserLocationKnown) { // Hanya jika lokasi sudah pernah diketahui
      //    onGetCurrentLocation(false); // False agar tidak selalu animasi saat fokus
      // }
    }, [handleMockLocationCheck]) // isUserLocationKnown, onGetCurrentLocation dikeluarkan agar tidak sering trigger
  );

  const onToCurrentPosition = () => {
    if (userPosition) {
      const targetRegion = {
        latitude: userPosition.latitude,
        longitude: userPosition.longitude,
        latitudeDelta: mapDisplayRegion.latitudeDelta, // Pertahankan zoom level pengguna saat ini
        longitudeDelta: mapDisplayRegion.longitudeDelta, // Pertahankan zoom level pengguna saat ini
      };
      setMapDisplayRegion(targetRegion); // Update state agar konsisten
      mapRef.current?.animateToRegion(targetRegion, 1000);
    } else {
      onGetCurrentLocation(true); // Jika belum ada userPosition, coba dapatkan dan animasikan
    }
  };

  const handleAttendance = () => {
    if (!userPosition) {
      Alert.alert('Lokasi Tidak Diketahui', 'Belum bisa mendapatkan lokasi Anda.');
      return;
    }
    if (isInsideRadius()) {
      // Kirim userPosition yang valid ke AbsensiCamera
      navigation.navigate('AbsensiCamera', {
        position: {
          ...userPosition,
          // Jika AbsensiCamera membutuhkan delta, bisa tambahkan default atau dari mapDisplayRegion
          latitude: DEFAULT_LATITUDE_DELTA,
          longitude: DEFAULT_LONGITUDE_DELTA,
        }
      });
    } else {
      Alert.alert('Di Luar Radius', 'Anda sedang berada di luar radius absensi yang ditentukan.');
    }
  };

  // Callback untuk onRegionChangeComplete pada MapView
  const onMapRegionChangeComplete = (region: Region) => {
    setMapDisplayRegion(region); // Update mapDisplayRegion dengan region baru dari interaksi pengguna
  };

  return (
    <View style={styles.container}>
      {isUserLocationKnown ? ( // Render peta jika kita sudah mencoba mendapatkan lokasi (berhasil atau tidak)
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={mapDisplayRegion} // Gunakan initialRegion untuk set posisi awal
          region={mapDisplayRegion} // Kontrol region peta dengan mapDisplayRegion
          onRegionChangeComplete={onMapRegionChangeComplete} // Update mapDisplayRegion saat pengguna geser/zoom
          showsUserLocation={false} // Kita pakai Marker custom
        >
          {userPosition && ( // Hanya render Marker jika userPosition ada
            <Marker
              coordinate={userPosition} // Pin menggunakan userPosition
              title="Lokasi Saya"
              description={isInsideRadius() ? 'Di dalam radius absensi' : 'Di luar radius absensi'}
            />
          )}
          {listRadiusMap.map((item, index) => {
            try {
              const center = JSON.parse(item.tikor);
              if (typeof center.latitude !== 'number' || typeof center.longitude !== 'number') return null;
              return (
                <Circle
                  key={index.toString()}
                  center={center}
                  radius={item.radius}
                  fillColor={'rgba(0, 121, 174, 0.2)'}
                  strokeColor={'#0079AE'}
                  strokeWidth={2}
                />
              );
            } catch (e) {
              console.error("Error parsing tikor for Circle:", item.tikor, e);
              return null;
            }
          })}
        </MapView>
      ) : (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0079AE" />
            <Text style={{ marginTop: spacing.sm }}>Mencari lokasi Anda...</Text>
          </View>
        </View>
      )}

      {isLoading && isUserLocationKnown && ( // Tampilkan loading tambahan jika ada proses lain setelah peta muncul
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0079AE" />
          </View>
        </View>
      )}

      <View style={styles.headbarContainer}>
        {/* ... (UI Headbar tidak berubah signifikan) ... */}
        <View style={styles.headbarIconContainer}>
          <FontistoIcon name="map" size={responsiveWidth(8)} color="#333" />
        </View>
        <View style={styles.headbarTextContainer}>
          <Text style={styles.headbarTitle}>Status Lokasi</Text>
          <View style={[styles.headbarStatus, { backgroundColor: isInsideRadius() ? '#A7e847' : 'tomato' }]}>
            <Text style={styles.headbarStatusText}>
              {userPosition ? (isInsideRadius() ? 'Anda berada dalam radius!' : 'Anda di luar radius!') : 'Mencari lokasi...'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.circleButton, { bottom: spacing.xl * 4, right: spacing.lg }]}>
        <TouchableOpacity onPress={handleAttendance} disabled={isLoading || !userPosition}>
          <Icon name="camerao" size={responsiveWidth(6)} color={'#0079AE'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.circleButton, { bottom: spacing.xl * 7, right: spacing.lg }]}>
        <TouchableOpacity onPress={onToCurrentPosition} disabled={isLoading}>
          <FontistoIcon name="crosshairs" size={responsiveWidth(6)} color={'#0079AE'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.circleButton, { bottom: spacing.xl, right: spacing.lg }]}>
        <TouchableOpacity onPress={() => navigation.navigate('AbsensiReport')} disabled={isLoading}>
          <FeatherIcon name="check-square" size={responsiveWidth(6)} color={'#0079AE'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AbsensiScreen;

// Styles tetap sama, tidak perlu diubah dari versi sebelumnya
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadingBox: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  headbarContainer: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    columnGap: spacing.md,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  headbarIconContainer: {
    alignItems: 'center',
  },
  headbarTextContainer: {
    rowGap: spacing.sm,
  },
  headbarTitle: {
    color: '#000',
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  headbarStatus: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
  },
  headbarStatusText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  circleButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    position: 'absolute',
    borderRadius: responsiveWidth(12),
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },
});