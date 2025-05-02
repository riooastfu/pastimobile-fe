import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
} from 'react-native-maps';
import getDistance from 'geolib/es/getPreciseDistance';
import { RootStackParamList } from '../../types';
import { isMockingLocation } from 'react-native-turbo-mock-location-detector';
import { getMapRadius } from '../../api/absensi';
import { responsiveWidth, spacing, fontSizes, radius } from '../../utils/responsive';

interface initLocProps {
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

const AbsensiScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listRadiusMap, setListRadiusMap] = useState<ListRadiusMapProps[]>([]);
  const [initLoc, setInitLoc] = useState<initLocProps>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const onGetInitLoc = () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      location => {
        setInitLoc({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      },
      () => {
        Alert.alert('Terjadi suatu kesalahan', 'Gagal memuat titik lokasi anda.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
    setIsLoading(false);
  };

  const isInsideRadius = () => {
    const currentPosition = initLoc;
    return listRadiusMap.some(item => {
      const distance = getDistance(currentPosition, JSON.parse(item.tikor));
      return distance <= item.radius;
    });
  };

  const isLocationMocked = () => {
    isMockingLocation()
      .then(res => {
        if (res.isLocationMocked) {
          Alert.alert('Peringatan!', 'Kamu terdeteksi menggunakan aplikasi penyamar lokasi. Silahkan dinonaktifkan terlebih dahulu.', [
            { text: 'OK', onPress: () => BackHandler.exitApp() },
          ]);
        }
      })
      .catch(console.log);
  };

  const onToCurrentPosition = () => {
    onGetInitLoc();
    mapRef.current?.animateToRegion(initLoc);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const radiusMap = await getMapRadius();
      if (radiusMap.status === 'success') {
        setListRadiusMap(radiusMap.data);
      } else {
        Alert.alert('Gagal mendapatkan radius map', radiusMap.message);
      }
    } catch (error) {
      console.log('fetchData Error [AbsensiScreen]:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    isLocationMocked();
  }, []);

  useFocusEffect(() => {
    onGetInitLoc();
    isInsideRadius();
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={initLoc}
      >
        <Marker
          coordinate={{ latitude: initLoc.latitude, longitude: initLoc.longitude }}
          title="Lokasi Saya"
          description={isInsideRadius() ? 'Inside circle' : 'Outside circle'}
        />
        {listRadiusMap.map((item, index) => (
          <Circle
            key={index}
            center={JSON.parse(item.tikor)}
            radius={item.radius}
            fillColor={'rgba(0, 121, 174, 0.2)'}
            strokeColor={'#0079AE'}
            strokeWidth={2}
          />
        ))}
      </MapView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" />
          </View>
        </View>
      )}

      <View style={styles.headbarContainer}>
        <View style={styles.headbarIconContainer}>
          <FontistoIcon name="map" size={responsiveWidth(8)} />
        </View>
        <View style={styles.headbarTextContainer}>
          <Text style={styles.headbarTitle}>Status Lokasi</Text>
          <View style={[styles.headbarStatus, { backgroundColor: isInsideRadius() ? '#A7e847' : 'tomato' }]}>
            <Text style={styles.headbarStatusText}>
              {isInsideRadius() ? 'Kamu sudah berada dalam radius!' : 'Kamu sedang tidak berada dalam radius!'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.circle, { bottom: spacing.xl * 4 }]}>
        <TouchableOpacity
          onPress={() => {
            isInsideRadius()
              ? navigation.navigate('AbsensiCamera', { position: initLoc })
              : Alert.alert('Kamu sedang berada di luar radius.');
          }}
        >
          <Icon name="camerao" size={responsiveWidth(6)} color={'#0079AE'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.circle, { bottom: spacing.xl * 7 }]}>
        <TouchableOpacity onPress={onToCurrentPosition}>
          <FontistoIcon name="crosshairs" size={responsiveWidth(6)} color={'#0079AE'} />
        </TouchableOpacity>
      </View>

      <View style={styles.circle}>
        <TouchableOpacity onPress={() => navigation.navigate('AbsensiReport')}>
          <FeatherIcon name="check-square" size={responsiveWidth(6)} color={'#0079AE'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AbsensiScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    borderRadius: radius.md,
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
    padding: spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
  },
  headbarStatusText: {
    color: '#fff',
    fontSize: fontSizes.sm,
  },
  circle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    position: 'absolute',
    borderRadius: responsiveWidth(12),
    bottom: spacing.xl,
    right: spacing.lg,
  },
});
