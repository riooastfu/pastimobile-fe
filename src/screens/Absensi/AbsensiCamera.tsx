import { ActivityIndicator, Alert, Image, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, PhotoFile, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { RootStackParamList } from '../../types';
import { createAbsenKeluar, createAbsenMasuk } from '../../api/absensi';
import { useAuth } from '../../providers/AuthProviders';
import { fontSizes, radius, responsiveWidth, responsiveHeight, scale, spacing } from '../../utils/responsive';

type AbsensiCameraScreenRouteProp = RouteProp<RootStackParamList, 'AbsensiCamera'>;

const AbsensiCamera: React.FC = () => {
    const route = useRoute<AbsensiCameraScreenRouteProp>();
    const { position } = route.params;
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const device = useCameraDevice('front', { physicalDevices: ['wide-angle-camera'] });
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [photo, setPhoto] = useState<PhotoFile>();
    const [status, setStatus] = useState('checkin');

    const cameraRef = useRef<Camera>(null);

    useFocusEffect(
        useCallback(() => {
            setIsActive(true);
            return () => {
                setIsActive(false);
            };
        }, [])
    );

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Absensi');
        }, 480000); // 8 minutes timeout

        return () => clearTimeout(timer);
    }, [navigation]);

    const onTakePicturePressed = async () => {
        const photo = await cameraRef.current?.takePhoto({ enableShutterSound: false });
        if (photo) {
            photo.path = 'file://' + photo?.path;
        }
        setPhoto(photo);
    };

    const onChangeStatus = () => {
        setStatus(prev => {
            const newStatus = prev === 'checkin' ? 'checkout' : 'checkin';
            ToastAndroid.showWithGravity(
                newStatus === 'checkin' ? 'Absen Masuk Aktif' : 'Absen Pulang Aktif',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            return newStatus;
        });
    };

    const onSave = async () => {
        setIsLoading(true);
        try {
            if (!photo) {
                Alert.alert('Gagal', 'Foto tidak ada.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
                return;
            }

            const res = status === 'checkin' ? await createAbsenMasuk({
                image: {
                    uri: photo.path,
                    type: 'image/jpg',
                    name: photo.path.split('/')[8],
                },
                pin: `${userData.pin_absen}`,
                coordinate: JSON.stringify(position),
                scan_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }) : await createAbsenKeluar({
                image: {
                    uri: photo.path,
                    type: 'image/jpg',
                    name: photo.path.split('/')[8],
                },
                pin: `${userData.pin_absen}`,
                coordinate: JSON.stringify(position),
                scan_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            });
            const message = status === 'checkin' ? 'masuk' : 'keluar';
            if (res.status === 'success') {
                Alert.alert('Sukses', `Berhasil absen ${message}.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
            } else {
                Alert.alert('Gagal', `Absen ${message} tidak berhasil. ${res.message}`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
            }
        } catch {
            Alert.alert('Gagal', `Absen ${status === 'checkin' ? 'masuk' : 'keluar'} tidak berhasil`, [{ text: 'OK' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const onCancel = () => setPhoto(undefined);

    if (!hasPermission || !device) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
            {photo ? (
                <View style={styles.photoContainer}>
                    <View style={styles.statusIndicator}>
                        <Text style={styles.statusText}>{status === 'checkin' ? 'Absen Masuk' : 'Absen Pulang'}</Text>
                        <Text style={styles.dateText}>{moment(new Date()).format('DD-MM-YYYY')}</Text>
                    </View>
                    <Image source={{ uri: photo.path }} style={[StyleSheet.absoluteFill, { zIndex: -1 }]} />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                            <Icon name="close" size={scale(30)} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSave} style={styles.saveButton}>
                            <Icon name="check" size={scale(30)} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <Camera
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isActive}
                        photo={true}
                    />
                    <View style={styles.cameraContainer}>
                        <View style={styles.statusIndicatorCamera}>
                            <Text style={styles.statusTextCamera}>{status === 'checkin' ? 'Absen Masuk' : 'Absen Pulang'}</Text>
                        </View>
                        <View style={styles.captureButtonOuter}>
                            <TouchableOpacity onPress={onTakePicturePressed} style={styles.captureButtonInner} />
                        </View>
                        <View style={styles.statusToggleContainer}>
                            <TouchableOpacity onPress={onChangeStatus}>
                                <Icon name={status === 'checkin' ? 'login' : 'logout'} size={scale(22)} color={status === 'checkin' ? '#000' : '#deac09'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

export default AbsensiCamera;

const styles = StyleSheet.create({
    container: { flex: 1 },
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
        marginBottom: 40,
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
        bottom: scale(50),
        borderRadius: radius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    captureButtonInner: {
        width: scale(60),
        height: scale(60),
        borderRadius: radius.round,
        backgroundColor: '#fff',
    },
    statusToggleContainer: {
        width: scale(50),
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        alignSelf: 'flex-start',
        marginLeft: spacing.lg,
        bottom: scale(55),
        borderRadius: radius.round,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
});
