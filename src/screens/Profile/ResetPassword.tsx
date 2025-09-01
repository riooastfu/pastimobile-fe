import { ActivityIndicator, Alert, BackHandler, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useAuth } from '../../providers/auth-provider'
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types'
import api from '../../services/api'

type ResetPasswordRouteProps = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPassword = () => {
    const route = useRoute<ResetPasswordRouteProps>()
    const isForced = route.params?.isForced || false;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const { userData, onLogout, onPasswordReset } = useAuth();

    const [isLoading, setIsloading] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    // Disable back button if the password reset is forced
    useFocusEffect(
        React.useCallback(() => {
            if (isForced) {
                // Set navigation options dynamically
                navigation.setOptions({
                    headerLeft: () => null, // Remove back button
                    gestureEnabled: false   // Disable swipe back gesture
                });

                // Handle hardware back button
                const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                    // Prevent going back if reset is forced
                    return isForced;
                });

                return () => backHandler.remove();
            }
        }, [isForced, navigation])
    );

    const onSimpan = async () => {
        setIsloading(true);
        if (newPassword === '' || confirmPassword === '') {
            setIsloading(false)
            return Alert.alert('Warning', 'Mohon isi inputan dengan simbol *')
        }

        try {
            const reset = await api.post(`/auth/password/reset`, {
                namauser: userData.namauser,
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            if (reset.data.status === "success") {
                return Alert.alert('Sukses', reset.data.message, [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (isForced) {
                                onLogout();
                            } else {
                                navigation.goBack();
                            }
                        }
                    }
                ])
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return Alert.alert('Gagal', error.response.data.message, [
                    {
                        text: 'OK',
                    }
                ])
            }
            // Handle network error
            else if (error.request) {
                return Alert.alert('Gagal', "Tidak dapat terhubung ke server. Periksa koneksi internet anda.", [
                    {
                        text: 'OK',
                    }
                ])
            }
            // Handle other errors
            else {
                return Alert.alert('Gagal', "Terjadi kesalahan Internal", [
                    {
                        text: 'OK',
                    }
                ])
            }
        } finally {
            setIsloading(false)
        }
    }
    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 10 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {isLoading &&
                <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: wp('20%'), height: wp('20%'), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', opacity: 0.5, borderRadius: wp('2%') }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                </View>
            }
            <View style={{ padding: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
                <Icon name='key' size={wp('5%')} color={'#a35d5d'} />
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Ubah Kata Sandi</Text>
            </View>

            {isForced && (
                <View style={{ padding: 15, backgroundColor: '#fff5f5' }}>
                    <Text style={{ color: '#a35d5d', textAlign: 'center' }}>
                        Password Anda telah kedaluwarsa. Mohon perbarui password Anda untuk melanjutkan.
                    </Text>
                </View>
            )}

            <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 15 }}>
                {/* <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Kata Sandi Lama*</Text>
                    <TextInput
                        style={{ borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10, textAlignVertical: 'top', }}
                        placeholder='Masukkan Sandi Lama'
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                    />
                </View> */}
                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Kata Sandi Baru*</Text>
                    <TextInput
                        style={{ borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10, textAlignVertical: 'top', }}
                        placeholder='Masukkan Sandi Baru'
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                </View>
                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Konfirmasi Kata Sandi*</Text>
                    <TextInput
                        style={{ borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10, textAlignVertical: 'top', }}
                        placeholder='Konfirmasi Sandi Baru'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity onPress={onSimpan} style={{ padding: 10, backgroundColor: '#56C58D', alignItems: 'center', justifyContent: 'center', borderRadius: wp('1%') }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>Ubah Kata Sandi</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ResetPassword

const styles = StyleSheet.create({})