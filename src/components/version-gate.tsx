// components/VersionGate.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Platform, View, ActivityIndicator } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getAppVersion } from '../api/home';

const VersionGate = ({ children }: { children: React.ReactNode }) => {
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    const openStore = () => {
        const url =
            Platform.OS === 'ios'
                ? 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID'
                : 'https://play.google.com/store/apps/details?id=com.pastimobile&hl=id';
        Linking.openURL(url);
    };

    const compareVersions = (current: string, server: string): boolean => {
        const parseVersion = (v: string) => v.split('.').map(Number);
        const currentParts = parseVersion(current);
        const serverParts = parseVersion(server);
        
        for (let i = 0; i < Math.max(currentParts.length, serverParts.length); i++) {
            const curr = currentParts[i] || 0;
            const serv = serverParts[i] || 0;
            if (curr < serv) return true; // needs update
            if (curr > serv) return false; // current is newer
        }
        return false; // versions are equal
    };

    const checkVersion = async () => {
        try {
            const currentVersion = DeviceInfo.getVersion();
            const appVersion = await getAppVersion();

            if (appVersion.status !== 'success') {
                console.warn('Version check failed:', appVersion.message);
                setIsAllowed(true); // fail-safe: allow access on error
                return;
            }

            const needsUpdate = compareVersions(currentVersion, appVersion.data.version);

            if (needsUpdate) {
                const buttons = [
                    {
                        text: 'Update',
                        onPress: openStore,
                    },
                ];

                if (!appVersion.data.force_update) {
                    buttons.push({
                        text: 'Nanti',
                        onPress: () => setIsAllowed(true),
                    });
                }

                Alert.alert('Update Tersedia', appVersion.message, buttons, {
                    cancelable: !appVersion.data.force_update,
                });

                if (appVersion.data.force_update) {
                    setIsAllowed(false);
                }
                return;
            }

            // App is up-to-date
            setIsAllowed(true);
        } catch (error) {
            console.warn('Version check error:', error);
            setIsAllowed(true); // fail-safe: allow access on error
        }
    };

    useEffect(() => {
        checkVersion();
    }, []);

    if (isAllowed === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return isAllowed ? <>{children}</> : null;
};

export default VersionGate;
