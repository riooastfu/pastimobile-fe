import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import axios from 'axios'
import { baseurl } from '../../helpers/baseurl'
import { useAuth } from '../../providers/AuthProviders'

const ResetPassword = () => {
    const { userData, onLogout } = useAuth()

    const [isLoading, setIsloading] = useState<boolean>(false);

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const onSimpan = async () => {
        setIsloading(true);
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            setIsloading(false)
            return Alert.alert('Warning', 'Mohon isi inputan dengan simbol *')
        }

        await axios.post(`${baseurl}/users/reset`, {
            namauser: userData.namauser,
            old_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        })
            .then(async (res) => {
                setIsloading(false)
                return Alert.alert('Sukses', 'Berhasil mengubah kata sandi', [
                    { text: 'OK', onPress: () => onLogout() }
                ])
            })
            .catch(error => {
                if (error.response) {
                    Alert.alert('Warning', error.response.data.msg)
                    // console.log(error.response.data.msg);
                }
                setIsloading(false);
            });
    }
    return (

        <View style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 10 }}>
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
            <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 15 }}>
                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Kata Sandi Lama*</Text>
                    <TextInput
                        style={{ borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10, textAlignVertical: 'top', }}
                        placeholder='Masukkan Sandi Lama'
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                    />
                </View>
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
        </View>
    )
}

export default ResetPassword

const styles = StyleSheet.create({})