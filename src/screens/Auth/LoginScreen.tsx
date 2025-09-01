import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { logo } from '../../assets/logo/logo';
import { useAuth } from '../../providers/auth-provider';
import { useTheme } from '../../providers/theme-provider';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native';
import { useLoading } from '../../hooks/use-loading';

const LoginScreen = () => {
    const { msg, onLogin } = useAuth();
    const { colors } = useTheme();
    const { isLoading } = useLoading();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={logo} style={{ width: wp('30%'), height: wp('30%'), resizeMode: 'contain' }} />
                <Text style={{ fontWeight: 'bold', fontSize: wp('5%'), color: colors.text }}>PASTI Mobile</Text>
            </View>
            <View style={{ rowGap: 15 }}>
                <View>
                    <Text style={{ fontSize: wp('3%'), fontWeight: 'bold', color: colors.text }}>Username</Text>
                    <TextInput
                        style={{
                            borderBottomWidth: wp('0.1%'),
                            borderBottomColor: colors.border,
                            color: colors.text,
                            paddingVertical: 8
                        }}
                        placeholder='Masukkan username'
                        placeholderTextColor={colors.textSecondary}
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <View>
                    <Text style={{ fontSize: wp('3%'), fontWeight: 'bold', color: colors.text }}>Password</Text>
                    <TextInput
                        style={{
                            borderBottomWidth: wp('0.1%'),
                            borderBottomColor: colors.border,
                            color: colors.text,
                            paddingVertical: 8
                        }}
                        placeholder='Masukkan password'
                        placeholderTextColor={colors.textSecondary}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={() => onLogin(username, password)}
                disabled={isLoading}
                style={[
                    styles.loginButton,
                    (isLoading) && styles.loginButtonDisabled,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                )}
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.error, fontSize: wp('3%') }}>{msg}</Text>
            </View>
        </KeyboardAvoidingView>
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
    btnText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff'
    },
    loginButton: {
        padding: 12,
        backgroundColor: '#56C58D',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('1%'),
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    loginButtonDisabled: {
        backgroundColor: '#ccc',
        elevation: 0,
        shadowOpacity: 0,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: wp('4%'),
    },
})