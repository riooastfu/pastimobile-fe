import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Fumi } from 'react-native-textinput-effects'
import IonIcons from 'react-native-vector-icons/Ionicons';
import { logo } from '../../assets/logo/logo';
import { useAuth } from '../../providers/AuthProviders';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const LoginScreen = () => {
    const { setMsg, msg, onLogin } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={logo} style={{ width: wp('30%'), height: wp('30%'), resizeMode: 'contain' }} />
                <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>PASTI Mobile</Text>
            </View>
            <View style={{ rowGap: 15 }}>
                <View>
                    <Text style={{ fontSize: wp('3%'), fontWeight: 'bold' }}>Username</Text>
                    <TextInput
                        style={{ borderBottomWidth: wp('0.1%') }}
                        placeholder='Masukkan username'
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <View>
                    <Text style={{ fontSize: wp('3%'), fontWeight: 'bold' }}>Password</Text>
                    <TextInput
                        style={{ borderBottomWidth: wp('0.1%') }}
                        placeholder='Masukkan password'
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => onLogin(username, password)} style={{ backgroundColor: '#81b3c9', padding: 15, alignItems: 'center', borderRadius: wp('1%') }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'tomato', fontSize: wp('3%') }}>{msg}</Text>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        rowGap: 15,
        justifyContent: 'center'
    },

    content1: {
        width: '100%',
        height: '30%',
        backgroundColor: '#d77301',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 150,
        marginBottom: 20,

    },

    content2: {
        width: '100%',
        height: '70%',
    },

    title: {
        fontSize: 45,
        fontWeight: 'bold',
        color: 'black',
    },

    input: {
        marginTop: 25,
        marginHorizontal: 30,
        borderRadius: 50,
        elevation: 5,
    },

    button: {
        marginTop: 25,
        width: '91%',
        height: 60,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#d77301',
    },

    btnText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff'
    },
})