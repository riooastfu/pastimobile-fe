import React from 'react'

import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import HomeScreen from '../screens/Home/HomeScreen';
import CutiScreen from '../screens/Cuti/CutiScreen';
import ActivityScreen from '../screens/Activity/ActivityScreen';
import AbsensiScreen from '../screens/Absensi/AbsensiScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const BottomTab = createBottomTabNavigator();

export default function TabNavigation() {
    return (
        <BottomTab.Navigator
            screenOptions={{
                headerTitleStyle: {
                    fontSize: Math.round(wp('4%'))
                },
                headerTitleAlign: 'center',
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0
                }
            }}
        >
            <BottomTab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Icon name="home" color={focused ? '#56C58D' : '#A5ACA5'} size={size} />
                    ),
                    tabBarActiveTintColor: '#56C58D',
                    tabBarInactiveTintColor: '#A5ACA5',
                    headerShown: false
                }}
            />
            <BottomTab.Screen
                name='Cuti'
                component={CutiScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Icon name="rocket1" color={focused ? '#56C58D' : '#A5ACA5'} size={size} />
                    ),
                    tabBarActiveTintColor: '#56C58D',
                    tabBarInactiveTintColor: '#A5ACA5',
                }}
            />
            <BottomTab.Screen
                name='Aktivitas'
                component={ActivityScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Icon name="form" color={focused ? '#56C58D' : '#A5ACA5'} size={size} />
                    ),
                    tabBarActiveTintColor: '#56C58D',
                    tabBarInactiveTintColor: '#A5ACA5',
                }}
            />
            <BottomTab.Screen
                name='Absensi'
                component={AbsensiScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Icon name="solution1" color={focused ? '#56C58D' : '#A5ACA5'} size={size} />
                    ),
                    headerShown: false,
                    tabBarActiveTintColor: '#56C58D',
                    tabBarInactiveTintColor: '#A5ACA5',
                }}
            />
            <BottomTab.Screen
                name='Profil'
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Icon name="user" color={focused ? '#56C58D' : '#A5ACA5'} size={size} />
                    ),
                    tabBarActiveTintColor: '#56C58D',
                    tabBarInactiveTintColor: '#A5ACA5',
                }}
            />
        </BottomTab.Navigator>
    )
}