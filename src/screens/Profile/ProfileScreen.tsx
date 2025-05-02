import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useAuth } from '../../providers/AuthProviders'
import DeviceInfo from 'react-native-device-info'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../types'

const ProfileScreen = () => {
    const { userData, onLogout } = useAuth()
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 10 }}>
            <View style={{ padding: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
                <View style={{
                    width: wp('14%'), height: wp('14%'), justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: '#fff', shadowColor: "#000", elevation: 5
                }}>
                    <Icon name='aliwangwang-o1' size={wp('8%')} color={'#6DA6BF'} />
                </View>
                <View>
                    <Text style={{ fontSize: wp('4%'), fontWeight: 'bold' }}>{userData.nama_karyawan}</Text>
                    {/* <Text style={{ fontSize: wp('3%'), color: '#c55656', fontWeight: 'bold' }}>{userData.nik_kantor}</Text> */}
                    <Text style={{ fontSize: wp('3.5%'), color: '#56C58D' }}>{`${userData.jabatan} - ${userData.golongan}`}</Text>
                </View>
            </View>

            <View style={{ padding: 15, backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} style={{ flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
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

const styles = StyleSheet.create({})