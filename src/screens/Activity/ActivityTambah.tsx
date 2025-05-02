import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Dropdown } from 'react-native-element-dropdown'
import { DropDownType, RootStackParamList } from '../../../types'
import { useAuth } from '../../providers/AuthProviders'
import axios from 'axios'
import { baseurl } from '../../helpers/baseurl'
import { NavigationProp, useNavigation } from '@react-navigation/native'

const statusItems: DropDownType[] = [
    { label: 'Masuk', value: 'Masuk' },
    { label: 'Izin', value: 'Izin' },
    { label: 'Cuti', value: 'Cuti' },
    { label: 'Sakit', value: 'Sakit' },
    { label: 'Dinas', value: 'Dinas' },
    { label: 'Kerja di Rumah', value: 'Kerja di Rumah' },
    { label: 'Libur', value: 'Libur' },
]

const ActivityTambah = () => {
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [isLoading, setIsloading] = useState<boolean>(false);
    const [dateValue, setDateValue] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState<boolean>(false);
    const [jamMasukValue, setJamMasukValue] = useState<string>('');
    const [jamMasuk, setJamMasuk] = useState<Date>(new Date());
    const [showJamMasuk, setShowJamMasuk] = useState<boolean>(false);
    const [jamPulangValue, setJamPulangValue] = useState<string>('');
    const [jamPulang, setJamPulang] = useState<Date>(new Date());
    const [showJamPulang, setShowJamPulang] = useState<boolean>(false);
    const [valueStatus, setValueStatus] = useState<string>('');

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(!show);
        setDate(currentDate);
        setDateValue(moment(currentDate).format('DD-MM-YYYY'))
    };
    const onChangeJamMasuk = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentJam = selectedDate || date;
        setShowJamMasuk(!showJamMasuk);
        setJamMasuk(currentJam);
        setJamMasukValue(moment(currentJam).format('hh:mm:ss'))
    };
    const onChangeJamPulang = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentJam = selectedDate || date;
        setShowJamPulang(!showJamPulang);
        setJamPulang(currentJam);
        setJamPulangValue(moment(currentJam).format('hh:mm:ss'))
    };

    const renderItem = (item: DropDownType) => {
        return (
            <View style={{ padding: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <Text style={{ flex: 1, fontSize: wp('3.5'), color: '#000' }}>{item.label}</Text>
            </View>
        );
    };

    const onSimpan = async () => {
        setIsloading(true);
        let nik = userData.karyawanid
        while (nik.toString().length < 10) {
            nik = '0' + nik;
        }

        if (dateValue === '' || jamMasukValue === '' || jamPulangValue === '' || valueStatus === '') {
            setIsloading(false);
            return Alert.alert('Warning', 'Mohon isi inputan dengan simbol *')
        }

        try {
            const laporan = await axios.post(`${baseurl}/lapHarian/tanggal`, {
                nik: userData.karyawanid,
                tanggal: moment(date).format('YYYY-MM-DD')
            });

            if (laporan.data.data.length) {
                setIsloading(false);
                return Alert.alert('Warning', 'Header aktivitas sudah ada.')
            }

            const simpan = await axios.post(
                `${baseurl}/insertLapHarian/${userData.karyawanid}`,
                {
                    id_laporan: nik + '_' + date.toISOString().substring(0, 10), //masih perlu diperbaiki bagian '0000000'
                    nik: userData.karyawanid,
                    nik_kantor: userData.nik_kantor,
                    tanggal: date.toISOString().substring(0, 10),
                    jam_masuk: moment(jamMasuk).format('hh:mm:ss'),
                    jam_pulang: moment(jamPulang).format('hh:mm:ss'),
                    status_kerja: valueStatus,
                    kesehatan_tanggal: '0000-00-00',
                    kesehatan_nama: userData.nama_karyawan,
                    kesehatan_dept: userData.departemen,
                    kesehatan_jabatan: userData.jabatan,
                    kesehatan_pt: userData.pt,
                    kesehatan_suhu: '',
                    kesehatan_keluarga: '',
                    kesehatan_kontak: '',
                    kesehatan_resiko: '',
                    kesehatan_pagi: '',
                    kesehatan_malam: '',
                    kesehatan_berobat: '',
                },
            );

            if (simpan) {
                setIsloading(false);
                return Alert.alert('Sukses', 'Berhasil menyimpan header Aktivitas', [{
                    text: 'OK', onPress: () => navigation.navigate('Aktivitas')
                }]);
            }
        } catch (error) {
            setIsloading(false);
            return Alert.alert('Something went wrong', 'Gagal menyimpan header.')
        }
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
            <View style={{ padding: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                <View style={{ padding: 10, backgroundColor: '#dff2e8', justifyContent: 'center', alignItems: 'center', borderRadius: wp('30%') }}>
                    <Icon name='profile' size={wp('5%')} color={'#56C58D'} />
                </View>
                <Text style={{ fontWeight: 'bold', color: '#56C58D' }}>Aktivitas Header</Text>
            </View>

            <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 15 }}>
                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Tanggal Masuk*</Text>
                    <TextInput
                        style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                        editable={false}
                        placeholder='Pilih Tanggal'
                        value={dateValue}
                    />
                    <TouchableWithoutFeedback onPress={() => setShow(true)}>
                        <Icon name='calendar' size={wp('6%')} style={{ position: 'absolute', right: 7, bottom: 7 }} />
                    </TouchableWithoutFeedback>
                    {
                        show &&
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={date}
                            mode={'date'}
                            display='default'
                            onChange={onChangeDate}
                            maximumDate={new Date(2200, 12, 31)}
                            minimumDate={new Date(2005, 1, 1)}
                        />

                    }
                </View>

                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Jam Masuk*</Text>
                    <TextInput
                        style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                        editable={false}
                        placeholder='Pilih Jam Masuk'
                        value={jamMasukValue}
                    />
                    <TouchableWithoutFeedback onPress={() => setShowJamMasuk(true)}>
                        <Icon name='clockcircleo' size={wp('6%')} style={{ position: 'absolute', right: 7, bottom: 7 }} />
                    </TouchableWithoutFeedback>
                    {
                        showJamMasuk &&
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={jamMasuk}
                            mode={'time'}
                            display='default'
                            onChange={onChangeJamMasuk}
                        />

                    }
                </View>

                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Jam Pulang*</Text>
                    <TextInput
                        style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                        editable={false}
                        placeholder='Pilih Jam Pulang'
                        value={jamPulangValue}
                    />
                    <TouchableWithoutFeedback onPress={() => setShowJamPulang(true)}>
                        <Icon name='clockcircleo' size={wp('6%')} style={{ position: 'absolute', right: 7, bottom: 7 }} />
                    </TouchableWithoutFeedback>
                    {
                        showJamPulang &&
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={jamPulang}
                            mode={'time'}
                            display='default'
                            onChange={onChangeJamPulang}
                        />

                    }
                </View>

                <View style={{ rowGap: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Status Kerja*</Text>
                    <Dropdown
                        style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                        placeholderStyle={{ fontSize: wp('3.5%') }}
                        selectedTextStyle={{ fontSize: wp('3.5%') }}
                        // inputSearchStyle={{ fontSize: wp('3.5%') }}
                        // search
                        data={statusItems}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Pilih Status Kerja"
                        // searchPlaceholder="contoh: Dhani"
                        value={valueStatus}
                        onChange={item => {
                            setValueStatus(item.value);
                        }}
                        renderItem={renderItem}
                    />
                </View>

                <TouchableOpacity onPress={onSimpan} style={{ padding: 10, backgroundColor: '#56C58D', borderRadius: wp('1%'), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>Simpan</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ActivityTambah

const styles = StyleSheet.create({})