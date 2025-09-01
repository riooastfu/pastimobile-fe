import React from 'react';
import { StyleSheet, View, StatusBar, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAbsensiScreen } from './hooks/useAbsensiScreen';
import { 
  FloatingButtons, 
  LoadingOverlay, 
  LocationHeader, 
  AbsensiErrorState,
  LocationErrorBanner,
  MockLocationWarning 
} from './components/absensi-screen';

const AbsensiScreen: React.FC = () => {
  const {
    isLoading,
    listRadiusMap,
    initLoc,
    mapRef,
    isInsideRadius,
    onToCurrentPosition,
    error,
    locationError,
    mockLocationDetected,
    retryFetchRadius,
    retryLocation,
    dismissMockLocationWarning,
  } = useAbsensiScreen();

  const isUserInsideRadius = isInsideRadius();

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={false}
        />
        <AbsensiErrorState error={error} onRetry={retryFetchRadius} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      <LocationHeader isInsideRadius={isUserInsideRadius} />
      
      {locationError && (
        <LocationErrorBanner 
          error={locationError} 
          onRetry={retryLocation}
          onDismiss={() => {}}
        />
      )}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={initLoc}
          showsUserLocation
          showsMyLocationButton={false}
          mapType="standard"
        >
          <Marker
            coordinate={{
              latitude: initLoc.latitude,
              longitude: initLoc.longitude,
            }}
            title="Lokasi Saya"
            description={isUserInsideRadius ? 'Dalam radius absensi' : 'Di luar radius absensi'}
            pinColor={isUserInsideRadius ? '#4CAF50' : '#F44336'}
          />

          {listRadiusMap.map((item, index) => {
            const center = JSON.parse(item.tikor);
            return (
              <Circle
                key={`radius-${index}`}
                center={center}
                radius={item.radius}
                fillColor={isUserInsideRadius ? 'rgba(76, 175, 80, 0.15)' : 'rgba(0, 121, 174, 0.15)'}
                strokeColor={isUserInsideRadius ? '#4CAF50' : '#0079AE'}
                strokeWidth={2}
              />
            );
          })}
        </MapView>

        <FloatingButtons
          isInsideRadius={isUserInsideRadius}
          onLocationPress={onToCurrentPosition}
          initLoc={initLoc}
        />
      </View>

      {isLoading && <LoadingOverlay />}
      
      {mockLocationDetected && (
        <MockLocationWarning 
          onDismiss={dismissMockLocationWarning}
          onExit={() => BackHandler.exitApp()}
        />
      )}
    </SafeAreaView>
  );
};

export default AbsensiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});