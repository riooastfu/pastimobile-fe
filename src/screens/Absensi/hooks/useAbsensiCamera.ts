import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
    Camera,
    Frame,
    PhotoFile,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
} from 'react-native-vision-camera';
import {
    NavigationProp,
    RouteProp,
    useFocusEffect,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import moment from 'moment';
import {
    useFaceDetector,
    Face,
    FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { RootStackParamList } from '../../../types';
import { createAbsenMasuk } from '../../../api/absensi';
import { useAuth } from '../../../providers/auth-provider';
import { showAlert } from '../../../utils/alert-helper';

type AbsensiCameraScreenRouteProp = RouteProp<RootStackParamList, 'AbsensiCamera'>;

interface FaceValidationResult {
    isValid: boolean;
    message: string;
}

const FACE_DETECTION_OPTIONS: FaceDetectionOptions = {
    performanceMode: 'fast',
    landmarkMode: 'all',
    classificationMode: 'all',
    minFaceSize: 0.15,
    trackingEnabled: false,
};

const CAMERA_TIMEOUT = 480000; // 8 minutes

export const useAbsensiCamera = () => {
    const route = useRoute<AbsensiCameraScreenRouteProp>();
    const { position } = route.params;
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const device = useCameraDevice('front', { physicalDevices: ['wide-angle-camera'] });
    const { hasPermission, requestPermission } = useCameraPermission();
    const cameraRef = useRef<Camera>(null);
    const lastFaceDetectedRef = useRef<boolean>(false);

    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [photo, setPhoto] = useState<PhotoFile | undefined>();
    const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);
    const [faceStatus, setFaceStatus] = useState<string>('Mohon arahkan wajah ke kamera!');

    const { detectFaces } = useFaceDetector(FACE_DETECTION_OPTIONS);

    // Face validation utilities
    const isFaceCentered = useCallback((face: Face, frameWidth: number, frameHeight: number): boolean => {
        const faceCenterX = face.bounds.x + face.bounds.width / 2;
        const faceCenterY = face.bounds.y + face.bounds.height / 2;
        const frameCenterX = frameWidth / 2;
        const frameCenterY = frameHeight / 2;

        const acceptableXRange = frameWidth * 0.15;
        const acceptableYRange = frameHeight * 0.15;

        const isXCentered = Math.abs(faceCenterX - frameCenterX) < acceptableXRange;
        const isYCentered = Math.abs(faceCenterY - frameCenterY) < acceptableYRange;

        return isXCentered && isYCentered;
    }, []);

    const isFaceQualityGood = useCallback((face: Face): boolean => {
        const hasAllLandmarks = Boolean(
            face?.landmarks?.LEFT_EYE &&
            face?.landmarks?.RIGHT_EYE &&
            face?.landmarks?.NOSE_BASE &&
            face?.landmarks?.MOUTH_BOTTOM &&
            face?.landmarks?.LEFT_CHEEK &&
            face?.landmarks?.RIGHT_CHEEK
        );

        const faceArea = face.bounds.width * face.bounds.height;
        const minFaceArea = 15000;

        let eyesValid = false;
        if (face.landmarks?.LEFT_EYE && face.landmarks?.RIGHT_EYE) {
            const eyeDistance = Math.sqrt(
                Math.pow(face.landmarks.RIGHT_EYE.x - face.landmarks.LEFT_EYE.x, 2) +
                Math.pow(face.landmarks.RIGHT_EYE.y - face.landmarks.LEFT_EYE.y, 2)
            );
            eyesValid = eyeDistance > 20 && eyeDistance < 200;
        }

        return hasAllLandmarks && faceArea > minFaceArea && eyesValid;
    }, []);

    const validateFaces = useCallback((
        faces: Face[],
        frameWidth: number,
        frameHeight: number
    ): FaceValidationResult => {
        if (faces.length === 0) {
            return {
                isValid: false,
                message: 'Mohon arahkan wajah ke kamera!',
            };
        }

        if (faces.length > 1) {
            return {
                isValid: false,
                message: 'Hanya satu wajah yang diperbolehkan!',
            };
        }

        const face = faces[0];

        if (!isFaceQualityGood(face)) {
            return {
                isValid: false,
                message: 'Pastikan wajah terlihat jelas!',
            };
        }

        if (!isFaceCentered(face, frameWidth, frameHeight)) {
            return {
                isValid: false,
                message: 'Posisikan wajah di tengah kamera!',
            };
        }

        return {
            isValid: true,
            message: 'Wajah terdeteksi! Siap mengambil foto.',
        };
    }, [isFaceQualityGood, isFaceCentered]);

    const processFaceDetection = useCallback(
        async (faces: Face[], frameWidth: number, frameHeight: number) => {
            const validation = validateFaces(faces, frameWidth, frameHeight);

            if (validation.isValid !== lastFaceDetectedRef.current) {
                setIsFaceDetected(validation.isValid);
                setFaceStatus(validation.message);
                lastFaceDetectedRef.current = validation.isValid;

                if (validation.isValid) {
                    console.log('✅ Face properly detected and centered');
                } else {
                    console.log('❌', validation.message);
                }
            }
        },
        [validateFaces]
    );

    const handleDetectedFaces = Worklets.createRunOnJS(processFaceDetection);

    const frameProcessor = useFrameProcessor(
        (frame: Frame) => {
            'worklet';
            const faces = detectFaces(frame) ?? [];
            handleDetectedFaces(faces, frame.width, frame.height);
        },
        [handleDetectedFaces]
    );

    // Camera operations
    const handleTakePhoto = useCallback(async () => {
        if (!cameraRef.current || !isFaceDetected) return;

        try {
            const photo = await cameraRef.current.takePhoto({
                enableShutterSound: false,
            });

            if (photo) {
                photo.path = 'file://' + photo.path;
                setPhoto(photo);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            showAlert.camera.photoFailed();
        }
    }, [isFaceDetected]);

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
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            
            let errorMessage = 'Terjadi kesalahan saat absen.';
            
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Proses absen membutuhkan waktu lebih lama. Silakan tunggu atau coba lagi.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server sedang bermasalah. Silakan coba lagi dalam beberapa saat.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (!error.response) {
                errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            }
            
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                showAlert.network(() => handleSaveAttendance());
            } else {
                showAlert.attendance.failed(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [photo, userData, position, navigation]);

    const handleCancelPhoto = useCallback(() => {
        setPhoto(undefined);
    }, []);

    // Effects
    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            return () => setIsActive(false);
        }, [])
    );

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('BottomTab', {
                screen: 'Absensi',
            });
        }, CAMERA_TIMEOUT);

        return () => clearTimeout(timer);
    }, [navigation]);

    return {
        // Camera props
        device,
        hasPermission,
        isActive,
        cameraRef,
        frameProcessor,

        // State
        isLoading,
        photo,
        isFaceDetected,
        faceStatus,

        // Actions
        handleTakePhoto,
        handleSaveAttendance,
        handleCancelPhoto,
    };
};