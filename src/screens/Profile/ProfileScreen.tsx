import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useAuth } from '../../providers/auth-provider'
import DeviceInfo from 'react-native-device-info'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker'

const ProfileScreen = () => {
    const { userData, onLogout } = useAuth()
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

    // Load saved profile image on component mount
    useEffect(() => {
        loadProfileImage();
    }, []);

    const loadProfileImage = async () => {
        try {
            const savedImage = await AsyncStorage.getItem(`profile_image_${userData.nik_kantor}`);
            if (savedImage) {
                setProfileImage(savedImage);
            }
        } catch (error) {
            console.log('Error loading profile image:', error);
        }
    };

    const saveProfileImage = async (imageUri: string) => {
        try {
            await AsyncStorage.setItem(`profile_image_${userData.nik_kantor}`, imageUri);
        } catch (error) {
            console.log('Error saving profile image:', error);
            Alert.alert('Error', 'Gagal menyimpan foto profil');
        }
    };

    const removeProfileImage = async () => {
        try {
            await AsyncStorage.removeItem(`profile_image_${userData.nik_kantor}`);
            setProfileImage(null);
        } catch (error) {
            console.log('Error removing profile image:', error);
        }
    };

    const showImagePickerOptions = () => {
        const options = [
            { text: 'Ambil Foto', onPress: () => openCamera() },
            { text: 'Pilih dari Galeri', onPress: () => openGallery() },
        ];

        if (profileImage) {
            options.push({ text: 'Hapus Foto', onPress: () => confirmRemoveImage() });
        }

        options.push({ text: 'Batal', onPress: () => { } });

        Alert.alert('Ubah Foto Profil', 'Pilih sumber foto', options);
    };

    const confirmRemoveImage = () => {
        Alert.alert(
            'Hapus Foto',
            'Apakah Anda yakin ingin menghapus foto profil?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: removeProfileImage }
            ]
        );
    };

    const openCamera = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            maxWidth: 500,
            maxHeight: 500,
            includeBase64: false,
        };

        launchCamera(options, handleImageResponse);
    };

    const openGallery = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            maxWidth: 500,
            maxHeight: 500,
            includeBase64: false,
        };

        launchImageLibrary(options, handleImageResponse);
    };

    const handleImageResponse = (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
            return;
        }

        if (response.assets && response.assets[0]) {
            const imageUri = response.assets[0].uri;
            if (imageUri) {
                setIsLoadingImage(true);
                setProfileImage(imageUri);
                saveProfileImage(imageUri);
                setIsLoadingImage(false);
            }
        }
    };

    const renderProfileImage = () => {
        if (isLoadingImage) {
            return (
                <View style={styles.profileImageContainer}>
                    <ActivityIndicator size="small" color="#6DA6BF" />
                </View>
            );
        }

        if (profileImage) {
            return (
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                        onError={() => {
                            console.log('Error loading image, reverting to default');
                            setProfileImage(null);
                            removeProfileImage();
                        }}
                    />
                    <View style={styles.cameraIconOverlay}>
                        <Icon name='camera' size={wp('3%')} color={'#fff'} />
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.profileImageContainer}>
                <Icon name='aliwangwang-o1' size={wp('8%')} color={'#6DA6BF'} />
                <View style={styles.cameraIconOverlay}>
                    <Icon name='camera' size={wp('3%')} color={'#fff'} />
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 10 }}>
            <View style={{ padding: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
                <TouchableOpacity
                    onPress={showImagePickerOptions}
                    activeOpacity={0.7}
                >
                    {renderProfileImage()}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: wp('4%'), fontWeight: 'bold' }}>{userData.nama_karyawan}</Text>
                    {/* <Text style={{ fontSize: wp('3%'), color: '#c55656', fontWeight: 'bold' }}>{userData.nik_kantor}</Text> */}
                    <Text style={{ fontSize: wp('3.5%'), color: '#56C58D' }}>ID Kantor - {userData.nik_kantor}</Text>
                </View>
            </View>

            <View style={{ padding: 15, rowGap: 15, backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ResetPassword', { isForced: false })} style={{ flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
                    <Icon name='key' size={wp('5%')} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                        <Text style={{}}>Ubah Kata Sandi</Text>
                        <Icon name='right' size={wp('5%')} style={{ right: 0 }} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ padding: 15, backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={onLogout} style={{ flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
                    <Icon name='user' size={wp('5%')} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                        <Text style={{}}>Logout</Text>
                        <Icon name='right' size={wp('5%')} style={{ right: 0 }} />
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={{ alignSelf: 'center', fontSize: wp('3%'), fontWeight: 'bold', color: '#bbb' }}>PASTI Mobile v{DeviceInfo.getVersion()}</Text>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    profileImageContainer: {
        width: wp('14%'),
        height: wp('14%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#fff',
        shadowColor: "#000",
        elevation: 5,
        position: 'relative'
    },
    profileImage: {
        width: wp('14%'),
        height: wp('14%'),
        borderRadius: 100,
        resizeMode: 'cover'
    },
    cameraIconOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#6DA6BF',
        borderRadius: 10,
        width: wp('5%'),
        height: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    }
})