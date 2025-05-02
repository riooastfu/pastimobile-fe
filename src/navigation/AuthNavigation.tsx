import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../providers/AuthProviders';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/Auth/LoginScreen';
import TabNavigation from './TabNavigation';
import AbsensiReport from '../screens/Absensi/AbsensiReport';
import AbsensiCamera from '../screens/Absensi/AbsensiCamera';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CutiMenu from '../screens/Cuti/CutiMenu';
import CutiHistory from '../screens/Cuti/CutiHistory';
import CutiPengajuan from '../screens/Cuti/CutiPengajuan';
import ActivityTambah from '../screens/Activity/ActivityTambah';
import ActivityEdit from '../screens/Activity/ActivityEdit';
import ResetPassword from '../screens/Profile/ResetPassword';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={StyleSheet.absoluteFill}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            {userToken !== ""
                ?
                <Stack.Navigator screenOptions={{
                    headerTitleStyle: {
                        color: '#000',
                        fontSize: Math.round(wp('4%'))
                    },
                    headerTintColor: '#000',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    animation: 'slide_from_right'

                }}>
                    <Stack.Screen name='BottomTab' component={TabNavigation} options={{ headerShown: false }} />

                    <Stack.Group screenOptions={{ title: 'Absensi' }}>
                        <Stack.Screen name='AbsensiReport' component={AbsensiReport} />
                        <Stack.Screen name='AbsensiCamera' component={AbsensiCamera} options={{ headerShown: false }} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ title: 'Cuti' }}>
                        <Stack.Screen name='CutiMenu' component={CutiMenu} />
                        <Stack.Screen name='CutiHistory' component={CutiHistory} />
                        <Stack.Screen name='CutiPengajuan' component={CutiPengajuan} options={{ headerStyle: { backgroundColor: '#fff5f5' } }} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ title: 'Aktivitas' }}>
                        <Stack.Screen name='ActivityTambah' component={ActivityTambah} />
                        <Stack.Screen name='ActivityEdit' component={ActivityEdit} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ title: 'Profil' }}>
                        <Stack.Screen name='ResetPassword' component={ResetPassword} />
                    </Stack.Group>

                </Stack.Navigator>
                :
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>

            }
        </NavigationContainer>
    )
}

export default AuthNavigation 