import { ActivityIndicator, Alert, Button, FlatList, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment/min/moment-with-locales';
import axios from 'axios';
import { baseurl } from '../../helpers/baseurl';
import { useAuth } from '../../providers/AuthProviders';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { deleteLaporanKesehatanById, getLaporanKesehatanByNik, getLaporanKesehatanByTanggal } from '../../api/aktivitas';

type LaporanKesehatan = {
    id_laporan: string;
    tanggal: Date;
    jam_masuk: number;
    jam_pulang: number;
    status_kerja: String
};


const ActivityScreen = () => {
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()

    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string>();
    const [dateValue, setDateValue] = useState<string>('');
    const [laporanKesehatan, setLaporanKesehatan] = useState<LaporanKesehatan[]>([]);

    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState<boolean>(false);

    const onGetLaporanHarianByTanggal = async () => {
        setIsLoading(true);
        try {
            const res = await getLaporanKesehatanByTanggal(userData.karyawanid, date);

            if (res.data.status === 'success') {
                setLaporanKesehatan(res.data.data);
            } else {
                Alert.alert('Error', res.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Terjadi kesalahan internal. Silakan coba lagi.');
        }
        setIsLoading(false);
    }

    const onDelete = async (id_laporan: string) => {
        setIsLoading(true)
        try {
            const res = await deleteLaporanKesehatanById(id_laporan);
            if (res.status === 'success') {
                Alert.alert('Success', res.message);
            } else {
                Alert.alert('Error', res.message);
            }
            setLaporanKesehatan(prev => prev.filter(item => item.id_laporan !== id_laporan))
        } catch (error) {
            return Alert.alert('Warning', 'Gagal menghapus data')
        }
        setIsLoading(false)
    }

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(!show);
        setDate(currentDate);
        setDateValue(moment(selectedDate).format('DD-MM-YYYY'))
    };

    const onRefresh = useCallback(async () => {
        setIsRefresh(true);
        try {
            fetchData();
            setDateValue('');
        } catch (error) {
            Alert.alert('Something went wrong during refresh!');
        } finally {
            setIsRefresh(false);
        }
    }, []);

    const onRefreshIcon = useCallback(async () => {
        setIsRefresh(true);
        try {
            fetchData();
            setDateValue('');
        } catch (error) {
            Alert.alert('Something went wrong during refresh!');
        } finally {
            setIsRefresh(false);
        }
    }, []);


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getLaporanKesehatanByNik(userData.karyawanid)

            if (res.status === 'success') {
                setLaporanKesehatan(res.data);
            } else {
                Alert.alert('Error', res.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Terjadi kesalahan internal. Silakan coba lagi.');
        }
        setIsLoading(false);
    }

    const renderItem = ({ item }: { item: LaporanKesehatan }) => {
        return (
            <View style={{ padding: 15, borderWidth: wp('0.1%'), marginBottom: 10, borderColor: '#ddd', flexDirection: 'row', columnGap: 15, borderRadius: wp('1%') }}>
                <TouchableOpacity onPress={() => navigation.navigate('ActivityEdit', { id_laporan: item.id_laporan })} style={{ flex: 1, flexDirection: 'row', columnGap: 15 }}>
                    <View style={{ borderWidth: wp('0.1%'), borderColor: '#ddd', borderRadius: wp('2%'), overflow: 'hidden' }}>
                        <View style={{ backgroundColor: '#0079AE', paddingHorizontal: 30, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{moment(item.tanggal).locale('id').format('MMM')}</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }}>
                            <Text>{moment(item.tanggal).locale('id').format('ddd')}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>{moment(item.tanggal).format('DD')}</Text>
                            <Text>{moment(item.tanggal).format('yyyy')}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 5, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>{item.status_kerja}</Text>
                        <Text>{item.jam_masuk} - {item.jam_pulang}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Warning', 'Apakah kamu yakin ingin menghapus?', [{ text: 'Ya', onPress: () => onDelete(item.id_laporan) }, { text: 'Tidak' }])}>
                    <Icon name='close' size={wp('5%')} />
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 10 }}>
            {isLoading &&
                <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: wp('20%'), height: wp('20%'), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', opacity: 0.5, borderRadius: wp('2%') }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                </View>
            }
            <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 5 }}>
                {/* <View style={{ paddingHorizontal: 40 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3%') }}>Cari by tanggal</Text>
                </View> */}
                <View style={{ rowGap: 6, flexDirection: 'row', alignItems: 'center', columnGap: 15 }}>
                    <TouchableOpacity onPress={onGetLaporanHarianByTanggal}>
                        <Icon name='search1' size={wp('6%')} />
                    </TouchableOpacity>
                    <TextInput
                        style={{ flex: 1, height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                        editable={false}
                        placeholder='Cari berdasarkan tanggal'
                        value={dateValue}
                    />
                    <TouchableWithoutFeedback onPress={() => setShow(true)}>
                        <Icon name='calendar' size={wp('6%')} style={{ position: 'absolute', right: 7, bottom: 7 }} />
                    </TouchableWithoutFeedback>
                    {
                        show &&
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display='default'
                            onChange={onChange}
                        />
                    }
                </View>
            </View>

            <SafeAreaView style={{ backgroundColor: '#fff', padding: 15, rowGap: 15 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ActivityTambah')} style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                    <Icon name='pluscircle' size={wp('4%')} color='#56C58D' />
                    <Text style={{ color: '#56C58D' }}>Aktivitas</Text>
                </TouchableOpacity>
                {
                    laporanKesehatan.length !== 0 ?
                        <FlatList
                            data={laporanKesehatan}
                            renderItem={renderItem}
                            keyExtractor={item => item.id_laporan}
                            extraData={selectedId}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 120 }}
                            refreshing={isRefresh}
                            onRefresh={onRefresh}
                        />
                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: 15 }}>
                            <Text style={{ fontSize: wp('3%'), color: '#ddd' }}>Belum ada Aktivitas.</Text>
                            <TouchableOpacity onPress={onRefreshIcon} style={{ justifyContent: 'center', alignItems: 'center', rowGap: 5 }}>
                                <Icon name='reload1' size={wp('5%')} color={'#ddd'} />
                                <Text style={{ fontSize: wp('3%'), color: '#ddd' }}>Tekan untuk Reload</Text>
                            </TouchableOpacity>
                        </View>
                }
            </SafeAreaView>
        </View>
    )
}

export default ActivityScreen

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        width: '80%',
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
})