/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Camera, PhotoFile, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


function App() {
  const device = useCameraDevice('front', { physicalDevices: ['wide-angle-camera'] });
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();

  const cameraRef = useRef<Camera>(null)

  // useFocusEffect(
  //   useCallback(() => {
  //     setIsActive(true);
  //     return () => {
  //       setIsActive(false);
  //     }
  //   }, [])
  // )

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission])

  const onTakePicturePressed = async () => {
    const photo = await cameraRef.current?.takePhoto({
      enableShutterSound: false,
    });

    setPhoto(photo);
    console.log("photo>> ", photo);
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  if (!device) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Kamera tidak terdeteksi.</Text>
      </View>
    )
  }
  return (
    <View style={{ flex: 1, }}>
      <StatusBar hidden />

      {
        photo ? (
          <Image source={{ uri: 'file://' + photo.path }} style={StyleSheet.absoluteFill} />
        )
          :
          (
            <>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
              />

              <TouchableOpacity
                onPress={onTakePicturePressed}
                style={{ width: 40, height: 40, position: 'absolute', alignSelf: 'center', bottom: 50, borderRadius: 100, backgroundColor: '#fff' }}
              />
            </>
          )
      }
    </View>
  )
}

export default App;
