import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Camera,
    Frame,
    PhotoFile,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor
} from 'react-native-vision-camera';
import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { useFaceDetector, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { RootStackParamList } from '../../types';
import { createAbsenMasuk } from '../../api/absensi';
import { useAuth } from '../../providers/auth-provider';
import { fontSizes, radius, responsiveWidth, scale, spacing } from '../../utils/responsive';
import { FaceScanner } from '../../assets/image/image';
import { logger } from '../../utils/logger';
import { showAlert } from '../../utils/alert-helper';

type AbsensiCameraScreenRouteProp = RouteProp<RootStackParamList, 'AbsensiCamera'>;

// Constants
const CAMERA_TIMEOUT = 480000; // 8 minutes
const FACE_DETECTION_CONFIG: FaceDetectionOptions = {
    performanceMode: 'fast',
    landmarkMode: 'all',
    classificationMode: 'all',
    minFaceSize: 0.15,
    trackingEnabled: false,
};
const FACE_CENTER_TOLERANCE = 0.15; // 15% from center
const MIN_FACE_AREA = 15000;
const EYE_DISTANCE_RANGE = { min: 20, max: 200 };

const AbsensiCamera: React.FC = () => {
    // Navigation and route
    const route = useRoute<AbsensiCameraScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { position } = route.params;
    const { userData } = useAuth();

    // Camera setup
    const device = useCameraDevice('front', { physicalDevices: ['wide-angle-camera'] });
    const { hasPermission, requestPermission } = useCameraPermission();
    const cameraRef = useRef<Camera>(null);

    // State management
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [photo, setPhoto] = useState<PhotoFile | undefined>();
    const [isFaceDetected, setIsFaceDetected] = useState(false);
    const [faceStatus, setFaceStatus] = useState('Mohon arahkan wajah ke kamera!');

    // Refs
    const lastFaceDetectedRef = useRef(false);

    // Effects
    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            return () => setIsActive(false);
        }, [])
    );

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission]);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('BottomTab', { screen: 'Absensi' });
        }, CAMERA_TIMEOUT);
        return () => clearTimeout(timer);
    }, [navigation]);

    // Photo handlers
    const handleTakePhoto = useCallback(async () => {
        try {
            const photo = await cameraRef.current?.takePhoto({
                enableShutterSound: false,
            });
            if (photo) {
                photo.path = 'file://' + photo.path;
                setPhoto(photo);
            }
        } catch (error) {
            showAlert.camera.photoFailed();
        }
    }, []);

    const handleSaveAttendance = useCallback(async () => {
        if (!photo) {
            showAlert.camera.photoNotFound(() => navigation.goBack());
            return;
        }

        setIsLoading(true);
        try {
            const response = await createAbsenMasuk({
                image: {
                    uri: photo.path,
                    type: 'image/jpg',
                    name: `absen_${userData.nik_kantor}`,
                },
                pin: `${userData.pin_absen}`,
                coordinate: JSON.stringify(position),
                scan_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            });

            if (response.status === 'success') {
                showAlert.attendance.success('masuk', () => navigation.goBack());
            } else {
                showAlert.attendance.failed(response.message);
            }
        } catch (error) {
            logger.error('Error saving attendance:', error);
            showAlert.attendance.failed('Terjadi kesalahan saat absen.');
        } finally {
            setIsLoading(false);
        }
    }, [photo, userData, position, navigation]);

    const handleCancelPhoto = useCallback(() => setPhoto(undefined), []);

    // Face detection setup
    const { detectFaces } = useFaceDetector(FACE_DETECTION_CONFIG);

    // Face validation functions
    const isFaceCentered = useCallback((face: Face, frameWidth: number, frameHeight: number): boolean => {
        const faceCenterX = face.bounds.x + face.bounds.width / 2;
        const faceCenterY = face.bounds.y + face.bounds.height / 2;
        const frameCenterX = frameWidth / 2;
        const frameCenterY = frameHeight / 2;

        const acceptableXRange = frameWidth * FACE_CENTER_TOLERANCE;
        const acceptableYRange = frameHeight * FACE_CENTER_TOLERANCE;

        return Math.abs(faceCenterX - frameCenterX) < acceptableXRange &&
            Math.abs(faceCenterY - frameCenterY) < acceptableYRange;
    }, []);

    const isFaceQualityGood = useCallback((face: Face): boolean => {
        const requiredLandmarks = [
            'LEFT_EYE', 'RIGHT_EYE', 'NOSE_BASE',
            'MOUTH_BOTTOM', 'LEFT_CHEEK', 'RIGHT_CHEEK'
        ] as const;

        const hasAllLandmarks = requiredLandmarks.every(
            landmark => face?.landmarks?.[landmark] !== undefined
        );

        const faceArea = face.bounds.width * face.bounds.height;
        const isFaceSizeValid = faceArea > MIN_FACE_AREA;

        let areEyesValid = false;
        if (face.landmarks?.LEFT_EYE && face.landmarks?.RIGHT_EYE) {
            const eyeDistance = Math.sqrt(
                Math.pow(face.landmarks.RIGHT_EYE.x - face.landmarks.LEFT_EYE.x, 2) +
                Math.pow(face.landmarks.RIGHT_EYE.y - face.landmarks.LEFT_EYE.y, 2)
            );
            areEyesValid = eyeDistance >= EYE_DISTANCE_RANGE.min &&
                eyeDistance <= EYE_DISTANCE_RANGE.max;
        }

        return hasAllLandmarks && isFaceSizeValid && areEyesValid;
    }, []);

    const processFaceDetection = useCallback((faces: Face[], frameWidth: number, frameHeight: number) => {
        const updateFaceState = (detected: boolean, status: string) => {
            if (lastFaceDetectedRef.current !== detected) {
                setIsFaceDetected(detected);
                setFaceStatus(status);
                lastFaceDetectedRef.current = detected;
            }
        };

        if (faces.length === 0) {
            updateFaceState(false, 'Mohon arahkan wajah ke kamera!');
            return;
        }

        if (faces.length > 1) {
            updateFaceState(false, 'Hanya satu wajah yang diperbolehkan!');
            return;
        }

        const face = faces[0];

        if (!isFaceQualityGood(face)) {
            updateFaceState(false, 'Pastikan wajah terlihat jelas!');
            return;
        }

        if (!isFaceCentered(face, frameWidth, frameHeight)) {
            updateFaceState(false, 'Posisikan wajah di tengah kamera!');
            return;
        }

        updateFaceState(true, 'Wajah terdeteksi! Siap mengambil foto.');
    }, [isFaceQualityGood, isFaceCentered]);

    const handleDetectedFaces = Worklets.createRunOnJS(processFaceDetection);
    const frameCountRef = useRef(0);

    const frameProcessor = useFrameProcessor((frame: Frame) => {
        'worklet';
        // Process every 3rd frame to improve performance
        frameCountRef.current++;
        if (frameCountRef.current % 3 !== 0) return;

        const faces = detectFaces(frame) ?? [];
        handleDetectedFaces(faces, frame.width, frame.height);
    }, [handleDetectedFaces]);

    // Loading state
    if (!hasPermission || !device) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Render components
    const renderPhotoPreview = () => (
        <View style={styles.photoContainer}>
            <View style={styles.statusIndicator}>
                <Text style={styles.statusText}>Absen Masuk</Text>
                <Text style={styles.dateText}>{moment().format('DD-MM-YYYY')}</Text>
            </View>
            <Image source={{ uri: photo!.path }} style={[StyleSheet.absoluteFill, { zIndex: -1 }]} />
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleCancelPhoto} style={styles.cancelButton}>
                    <Icon name="close" size={scale(30)} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveAttendance} style={styles.saveButton}>
                    <Icon name="check" size={scale(30)} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCameraView = () => (
        <>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                photo={true}
                frameProcessor={frameProcessor}
            />

            <View style={styles.frameOverlay}>
                <Image
                    source={FaceScanner}
                    style={{
                        width: 250,
                        height: 300,
                        tintColor: isFaceDetected ? 'lime' : 'white',
                        opacity: 0.3,
                    }}
                    resizeMode="contain"
                />
                <View style={styles.statusMessageContainer}>
                    <Text style={[
                        styles.statusMessage,
                        { color: isFaceDetected ? 'lime' : '#deac09' }
                    ]}>
                        {faceStatus}
                    </Text>
                </View>
            </View>

            <View style={styles.cameraContainer}>
                <View style={styles.statusIndicatorCamera}>
                    <Text style={styles.statusTextCamera}>Absen Masuk</Text>
                </View>
                <View style={[
                    styles.captureButtonOuter,
                    { backgroundColor: isFaceDetected ? 'rgba(86, 197, 141,0.5)' : 'rgba(255, 255, 255, 0.5)' }
                ]}>
                    <TouchableOpacity
                        disabled={!isFaceDetected}
                        onPress={handleTakePhoto}
                        style={[
                            styles.captureButtonInner,
                            { backgroundColor: isFaceDetected ? '#56c58d' : '#fff' }
                        ]}
                    />
                </View>
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <View style={styles.loaderBackground}>
                        <ActivityIndicator size="large" />
                    </View>
                </View>
            )}
            <StatusBar hidden />
            {photo ? renderPhotoPreview() : renderCameraView()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderBackground: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
        borderRadius: radius.sm,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: spacing.md,
    },
    frameOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusMessageContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: radius.md,
        maxWidth: '80%',
    },
    statusMessage: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: fontSizes.sm,
    },
    statusIndicator: {
        padding: spacing.md,
        margin: 25,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: radius.round,
        alignItems: 'center',
    },
    statusText: {
        color: '#deac09',
        fontWeight: 'bold',
        fontSize: fontSizes.md,
    },
    dateText: {
        color: '#fff',
        fontSize: fontSizes.sm,
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 50,
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
    },
    cancelButton: {
        width: scale(55),
        height: scale(55),
        borderRadius: radius.round,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        width: scale(55),
        height: scale(55),
        borderRadius: radius.round,
        backgroundColor: 'rgba(86, 197, 141,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraContainer: {
        flex: 1,
        padding: spacing.xxxl + 10,
        justifyContent: 'space-between',
    },
    statusIndicatorCamera: {
        padding: spacing.sm,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: radius.round,
    },
    statusTextCamera: {
        color: '#deac09',
        fontSize: fontSizes.md,
    },
    captureButtonOuter: {
        width: scale(65),
        height: scale(65),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        alignSelf: 'center',
        bottom: scale(60),
        borderRadius: radius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    captureButtonInner: {
        width: scale(60),
        height: scale(60),
        borderRadius: radius.round,
        backgroundColor: '#fff',
    },
});

export default AbsensiCamera;