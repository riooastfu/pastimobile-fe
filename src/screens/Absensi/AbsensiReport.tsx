import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ListRenderItem,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment/min/moment-with-locales';
import { useFocusEffect } from '@react-navigation/native';
import { getAbsensiByPin } from '../../api/absensi';
import { useAuth } from '../../providers/AuthProviders';
import {
    responsiveWidth,
    spacing,
    fontSizes,
    radius,
} from '../../utils/responsive';
import Skeleton from '../../components/skeleton';

interface AbsenItemRenderProps {
    tgl_masuk: string;
    jam_masuk: string;
    jam_pulang: string;
}

const AbsensiReport = () => {
    const { userData } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [absensi, setAbsensi] = useState<AbsenItemRenderProps[]>([]);

    const absenItemRender: ListRenderItem<AbsenItemRenderProps> = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={{ rowGap: spacing.sm }}>
                <View style={{ flexDirection: 'row', columnGap: spacing.sm, alignItems: 'center' }}>
                    <Icon name="calendar" size={responsiveWidth(5)} color={'#6DA6BF'} />
                    <Text style={{ fontWeight: 'bold', fontSize: fontSizes.md }}>
                        {moment(item.tgl_masuk).locale('id').format('dddd DD-MM-YYYY')}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Text>Masuk</Text>
                        {item.jam_pulang !== item.jam_masuk && <Text>Keluar</Text>}
                    </View>
                    <View style={{ marginLeft: spacing.sm }}>
                        <Text>: {item.jam_masuk}</Text>
                        {item.jam_pulang !== item.jam_masuk && <Text>: {item.jam_pulang}</Text>}
                    </View>
                </View>
            </View>
            <View>
                <Text>{item.jam_masuk <= '08:00:59' ? 'Tepat' : 'Terlambat'}</Text>
            </View>
        </View>
    );

    const fetchData = useCallback(async () => {
        if (!isRefresh) setIsLoading(true);
        try {
            const absensiResponse = await getAbsensiByPin(userData.pin_absen);
            if (absensiResponse.status === 'success') {
                setAbsensi(absensiResponse.data);
            } else {
                Alert.alert('Gagal mendapatkan data absensi', absensiResponse.message);
                setAbsensi([]);
            }
            setIsLoading(false);
            setIsRefresh(false);
        } catch (error: any) {
            Alert.alert('Peringatan', `Terjadi kesalahan saat mendapatkan data absensi! ${error.message || ''}`);
            setAbsensi([]);
            setIsLoading(false);
            setIsRefresh(false);
        }
    }, [userData.pin_absen, isRefresh]);


    const onRefresh = useCallback(async () => {
        setIsRefresh(true);
        await fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderContent = () => {
        if (isLoading && !isRefresh) {
            return (
                <FlatList
                    data={[1, 2, 3, 4, 5]}
                    renderItem={
                        () => (
                            <View style={styles.itemContainer}>
                                <View style={{ rowGap: spacing.sm }}>
                                    <View style={{ flexDirection: 'row', columnGap: spacing.sm, alignItems: 'center' }}>
                                        <Skeleton width={responsiveWidth(5)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                        <Skeleton width={responsiveWidth(25)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <Skeleton width={responsiveWidth(12)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                            <Skeleton width={responsiveWidth(12)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                        </View>
                                        <View style={{ marginLeft: spacing.sm }}>
                                            <Skeleton width={responsiveWidth(15)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                            <Skeleton width={responsiveWidth(15)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Skeleton width={responsiveWidth(20)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                </View>
                            </View>
                        )
                    }
                    keyExtractor={item => `skeleton-${item}`}
                    showsVerticalScrollIndicator={false}
                />
            );
        }

        if (!isLoading && absensi.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Data absensi tidak ditemukan.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={absensi}
                renderItem={absenItemRender}
                keyExtractor={(item, index) => `${item.tgl_masuk}-${item.jam_masuk}-${index}`}
                refreshing={isRefresh}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={absensi.length === 0 ? styles.emptyListContainer : undefined}
            />
        );
    };

    return <SafeAreaView style={styles.safeArea}>{renderContent()}</SafeAreaView>;
};

export default AbsensiReport;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        flex: 1,
        padding: spacing.md,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: spacing.sm,
        padding: spacing.md,
        borderWidth: 0.5,
        borderRadius: radius.sm,
        borderColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: fontSizes.md,
        color: '#888',
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
