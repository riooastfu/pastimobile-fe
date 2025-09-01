import { StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationRef, useAuth } from '../providers/auth-provider';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/Auth/LoginScreen';
import TabNavigation from './tab-navigation';
import AbsensiReport from '../screens/Absensi/AbsensiReport';
import AbsensiCamera from '../screens/Absensi/AbsensiCamera';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CutiMenu from '../screens/Cuti/CutiMenu';
import CutiHistory from '../screens/Cuti/CutiHistory';
import CutiPengajuan from '../screens/Cuti/CutiPengajuan';
import ActivityTambah from '../screens/Activity/ActivityTambah';
import ActivityEdit from '../screens/Activity/ActivityEdit';
import ResetPassword from '../screens/Profile/ResetPassword';
import VersionGate from '../components/version-gate';
import { useLoading } from '../hooks/use-loading';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
    const { userToken } = useAuth();
    const { isLoading } = useLoading();
    const [passwordExpired, setPasswordExpired] = useState(false);
    const [initialRoute, setInitialRoute] = useState('BottomTab');

    // Check password expiration status when component mounts or token changes
    useEffect(() => {
        const checkPasswordStatus = async () => {
            if (userToken) {
                const status = await AsyncStorage.getItem('passwordExpired');
                const isExpired = status === 'true';
                setPasswordExpired(isExpired);

                // Set initial route based on password expiration
                if (isExpired) {
                    setInitialRoute('ResetPassword');
                } else {
                    setInitialRoute('BottomTab');
                }
            }
        };

        checkPasswordStatus();
    }, [userToken]);

    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            {userToken !== ""
                ?
                <VersionGate>
                    <Stack.Navigator
                        initialRouteName={initialRoute}
                        screenOptions={{
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
                            <Stack.Screen
                                name='ResetPassword'
                                component={ResetPassword}
                                options={({ route }) => ({
                                    // Set options based on whether this is a forced reset
                                    headerLeft: passwordExpired ? () => null : undefined,
                                    gestureEnabled: !passwordExpired
                                })}
                                initialParams={{ isForced: passwordExpired }}
                            />
                        </Stack.Group>
                    </Stack.Navigator>
                </VersionGate>
                :
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            }
        </NavigationContainer>
    )
}

export default AuthNavigation