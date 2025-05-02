import { ActivityIndicator, Alert, Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../providers/AuthProviders';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DropDownType, RootStackParamList } from '../../../types';
import axios from 'axios';
import { baseurl } from '../../helpers/baseurl';
import moment from 'moment';
import { getWorkingDays } from '../../utils/hari-libur';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type CutiData = {
    id_cuti: string;
    periode: string;
    nik: number;
    tanggal_berlaku: Date;
    tanggal_berakhir: Date;
    hak_cuti: number;
    sisa_hutang: number;
    saldo: number;
    aktif: number;
}

type CutiDetail = {
    id: string;
    tanggal_mulai: Date;
    tanggal_berakhir: Date;
    total_hari: number;
    alasan: string;
    alamat_cuti: string;
    approval: number;
    created_at: string;
    updated_at: string;
    tipe_cuti: string;
}

type CutiPengajuanRouteProps = RouteProp<RootStackParamList, 'CutiPengajuan'>
const CutiPengajuan = () => {
    const route = useRoute<CutiPengajuanRouteProps>()
    const { id_cuti } = route.params
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [telp, setTelp] = useState<string>('');
    const [alamat, setAlamat] = useState<string>('');
    const [keperluan, setKeperluan] = useState<string>('');
    const [jenisCuti, setJenisCuti] = useState<string>('CT');

    const [cutiData, setCutiData] = useState<CutiData[]>([]);
    const [cutiDetail, setCutiDetail] = useState<CutiDetail[]>([]);
    const [cutiDetailLike, setCutiDetailLike] = useState<CutiDetail[]>([]);

    const [holidays, setHolidays] = useState<string[]>([]);
    const [tanggalDari, setTanggalDari] = useState<Date>(new Date());
    const [tanggalDariShow, setTanggalDariShow] = useState<boolean>(false);
    const [tanggalDariText, setTanggalDariText] = useState<string>('Dari');
    const [tanggalSampai, setTanggalSampai] = useState<Date>(new Date());
    const [tanggalSampaiShow, setTanggalSampaiShow] = useState<boolean>(false);
    const [tanggalSampaiText, setTanggalSampaiText] = useState<string>('Sampai');

    //State For Dropdown
    const [dataPIC, setDataPIC] = useState<DropDownType[]>([]);
    const [valuePIC, setValuePIC] = useState<string>('');
    const [dataAtasan, setDataAtasan] = useState<DropDownType[]>([]);
    const [valueAtasan, setValueAtasan] = useState<string>('');

    const [totalHariLibur, settotalHariLibur] = useState<number>(0)

    const onGetCutiData = async () => {
        try {
            const res = await axios.get(`${baseurl}/getCutiById/${id_cuti}`);
            if (res) {
                setCutiData(res.data);
            }
        } catch (error) {
            Alert.alert('Something went wrong.', '')
        }
    };

    const onGetCutiDetailLike = async () => {
        let n = 10;
        let string_nik = userData.karyawanid;
        let nik_length = string_nik.toString().length;

        for (let i = 1; i <= n - nik_length; i++) {
            string_nik = '0' + string_nik;
        }
        try {
            //Get cuti data specifically
            const cutidetail = await axios.get(`${baseurl}/getCutiDt/${id_cuti}`);
            if (cutidetail) {
                setCutiDetail(cutidetail.data);
            }
            const cutidetaillike = await axios.get(`${baseurl}/getCutiDtLike/${string_nik}`);
            if (cutidetaillike) {
                setCutiDetailLike(cutidetaillike.data);
            }
        } catch (error) {
            console.log('onGetCutiDetailLike>> ', error);
        }
    };

    const onGetHoliday = async () => {
        try {
            let n = [];
            const res = await axios.get(`${baseurl}/getDataCYDHOL`);
            if (res) {
                for (let i = 0; i < res.data.length; i++) {
                    n.push(moment(res.data[i].Tanggal_Libur).format('YYYY-MM-DD'));
                }
                setHolidays(n);
            }
        } catch (error) {
            console.log('onGetHoliday>>', error);
        }
    };

    const onGetPic = async () => {
        try {
            const res = await axios.get(`${baseurl}/dataKaryawanByDepart/${userData.karyawanid}&${userData.departemen}&${userData.pt}`);
            if (res) {
                setDataPIC(res.data);
            }
        } catch (error) {
            console.log("onGetPic>> ", error)
        }
    }

    const onGetAtasan = async () => {
        try {
            // Get Departemen Parent First and make it for res param
            const departemen = await axios.get(`${baseurl}/departemen/${userData.departemen}`);
            if (departemen) {
                const atasan = await axios.get(`${baseurl}/dataAtasan/${userData.karyawanid}&${userData.departemen}&${departemen.data.parent}&${userData.pt}`);

                if (atasan) {
                    setDataAtasan(atasan.data);
                }
            }
        } catch (error) {
            console.log("onGetAtasan>> ", error)
        }
    }

    const onChangeTanggalDari = async (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || tanggalDari;
        setTanggalDariShow(Platform.OS === 'ios');
        setTanggalDari(currentDate);
        let tempDate = new Date(currentDate);
        let fDate = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`;
        setTanggalDariText(fDate);
    };

    const onChangeTanggalSampai = async (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || tanggalSampai;
        setTanggalSampaiShow(Platform.OS === 'ios');
        setTanggalSampai(currentDate);
        let tempDate = new Date(currentDate);
        let fDate = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}-${tempDate.getDate()}`;
        setTanggalSampaiText(fDate);

        //update total hari
        settotalHariLibur(getWorkingDays(tanggalDari, currentDate, holidays))
    };

    const onShowModeTanggalDari = (mode: boolean) => {
        setTanggalDariShow(!mode);
    };

    const onShowModeTanggalSampai = (mode: boolean) => {
        setTanggalSampaiShow(!mode);
    };

    const onPullToRefresh = () => {
        setRefresh(true);
        onGetCutiData();
        onGetCutiDetailLike();
        onGetHoliday();
        onGetPic();
        onGetAtasan();
        setTimeout(() => {
            setRefresh(false);
        }, 1000)
    }

    const renderItem = (item: DropDownType) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    const renderItemAtasan = (item: DropDownType) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    const onSave = async () => {
        let pesan: string = '';
        var x: number = 0;

        //Cek apakah cuti yang diajukan mencukupi saldo
        if (cutiDetail != null) {
            for (const item of cutiDetail) {
                if (item.approval != 3 && item.approval != 0) {
                    x = x + item.total_hari
                }
            }
        }
        // if (totalHariLibur > cutiData[0].saldo) {
        //     pesan += '- Cuti yang diajukan melebihi saldo \n'
        // }
        if (tanggalDari > tanggalSampai) {
            pesan += '- Pengajuan tanggal salah \n'
        }
        if (tanggalDari < new Date()) {
            pesan += '- Tanggal yang diajukan sudah lewat \n'
        }
        if (tanggalDari > cutiData[0].tanggal_berakhir) {
            pesan += '- Tanggal diajukan diluar masa berlaku \n'
        }
        for (let i = 0; i < cutiDetailLike.length; i++) {
            let tanggal_mulai = new Date(cutiDetailLike[i].tanggal_mulai);
            let tanggal_berakhir = new Date(cutiDetailLike[i].tanggal_berakhir);
            if (tanggalDari.getTime() >= tanggal_mulai.getTime() && tanggalSampai.getTime() <= tanggal_berakhir.getTime()) {
                pesan += '- Tanggal cuti sudah pernah diajukan \n'

            }
            else if (tanggalDari.getTime() >= tanggal_mulai.getTime() && tanggalDari.getTime() <= tanggal_berakhir.getTime()) {
                pesan += '- Tanggal cuti sudah pernah diajukan \n'

            }
            else if (tanggalSampai.getTime() >= tanggal_mulai.getTime() && tanggalSampai.getTime() <= tanggal_berakhir.getTime()) {
                pesan += '- Tanggal cuti sudah pernah diajukan \n'

            }
        }
        if (keperluan == '' || alamat == '' || telp == '' || valuePIC == '' || valueAtasan == '') {
            pesan += '- Mohon isi inputan dengan simbol * \n'
        }
        if (totalHariLibur > cutiData[0].saldo - x) {
            pesan += '- Pengajuan melebihi sisa cuti tersedia. Mohon periksa apakah ada pengajuan yang belum disetujui \n'
        }

        // upload section
        if (pesan !== '') {
            Alert.alert('Peringatan', pesan);
        }
        else {
            setIsLoading(true);
            try {
                const res = await axios.post(`${baseurl}/insertCutiDt`, {
                    id_cuti: route.params.id_cuti,
                    no_transaksi: cutiDetail.length !== 0 ? cutiDetail.length : 0,
                    id_transaksi: route.params.id_cuti + "N" + (cutiDetail.length !== 0 ? cutiDetail.length : 0),
                    tanggal_mulai: moment(tanggalDari.toISOString().substring(0, 10)).format('yyyy-MM-DD'),
                    tanggal_berakhir: moment(tanggalSampai.toISOString().substring(0, 10)).format('yyyy-MM-DD'),
                    total_hari: totalHariLibur,
                    tipe_cuti: jenisCuti,
                    alasan: keperluan,
                    alamat_cuti: alamat,
                    approval: 2,
                    pic: valuePIC,
                    atasan: valueAtasan,
                    no_telepon: telp
                });
                Alert.alert('Sukses', 'Berhasil menyimpan pengajuan.', [{
                    text: 'OK', onPress: () => navigation.navigate('Cuti')
                }])
            } catch (error) {
                console.log(error)
            }
            console.log('ontol')
            setIsLoading(false);
        }
    }

    useEffect(() => {
        onGetCutiData();
        onGetCutiDetailLike();
        onGetPic();
        onGetAtasan();
        onGetHoliday();

    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
            <StatusBar backgroundColor={'#fff5f5'} />
            {isLoading &&
                <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: wp('20%'), height: wp('20%'), backgroundColor: '#fff5f5', justifyContent: 'center', alignItems: 'center', opacity: 0.5, borderRadius: wp('2%') }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                </View>
            }
            <View style={{ padding: 15, backgroundColor: '#fff5f5' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 15, backgroundColor: '#fff', padding: 5, borderRadius: wp('1%') }}>
                    <View style={{ backgroundColor: '#edc2c2', padding: 15, borderRadius: wp('1%') }}>
                        <Icon name='rocket1' color={'#a35d5d'} size={wp('6%')} />
                    </View>
                    <View style={{ flexShrink: 1 }}>
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>Form Pengajuan Cuti</Text>
                        <Text style={{ fontSize: wp('3%') }}>Jumlah cuti yang bisa diambil adalah <Text style={{ color: '#edc2c2', fontWeight: 'bold' }}>{cutiData[0]?.saldo}</Text> hari</Text>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 15 }}>
                    <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: wp('1%'), rowGap: 12 }}>
                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Dari</Text>
                            <TextInput
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                editable={false}
                                placeholder='Pilih Tanggal'
                                value={`${moment(tanggalDari.toISOString().substring(0, 10)).format('DD-MM-yyyy')}`}
                            />
                            <TouchableWithoutFeedback onPress={() => onShowModeTanggalDari(tanggalDariShow)}>
                                <Icon name='calendar' size={wp('6%')} style={{ position: 'absolute', right: 7, bottom: 7 }} />
                            </TouchableWithoutFeedback>
                            {
                                tanggalDariShow &&
                                <DateTimePicker
                                    testID='dateTimePicker'
                                    value={tanggalDari}
                                    mode={'date'}
                                    display='default'
                                    onChange={onChangeTanggalDari}
                                    maximumDate={new Date(2200, 12, 31)}
                                    minimumDate={new Date(2005, 1, 1)}
                                />

                            }
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Hingga</Text>
                            <TextInput
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                editable={false}
                                placeholder='Pilih Tanggal'
                                value={`${moment(tanggalSampai.toISOString().substring(0, 10)).format('DD-MM-yyyy')}`}
                            />
                            <TouchableWithoutFeedback onPress={() => onShowModeTanggalSampai(tanggalSampaiShow)}>
                                <Icon name='calendar' size={wp('6%')} style={{ position: 'absolute', right: 7, bottom: 7 }} />
                            </TouchableWithoutFeedback>
                            {
                                tanggalSampaiShow &&
                                <DateTimePicker
                                    testID='dateTimePicker'
                                    value={tanggalSampai}
                                    mode={'date'}
                                    display='default'
                                    onChange={onChangeTanggalSampai}
                                    maximumDate={new Date(2200, 12, 31)}
                                    minimumDate={new Date(2005, 1, 1)}
                                />

                            }
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Total Hari</Text>
                            <TextInput
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                editable={false}
                                value={`${totalHariLibur}`}
                            />
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Keperluan*</Text>
                            <TextInput
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                placeholder='contoh: Keperluan pribadi'
                                value={keperluan}
                                onChangeText={setKeperluan}
                            />
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Alamat*</Text>
                            <TextInput
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                placeholder='contoh: Jl. Bahagia II'
                                value={alamat}
                                onChangeText={setAlamat}
                            />
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>PIC*</Text>
                            <Dropdown
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                placeholderStyle={{ fontSize: wp('3.5%') }}
                                selectedTextStyle={{ fontSize: wp('3.5%') }}
                                inputSearchStyle={{ fontSize: wp('3.5%') }}
                                search
                                data={dataPIC}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih PIC"
                                searchPlaceholder="contoh: Dhani"
                                value={valuePIC}
                                onChange={item => {
                                    setValuePIC(item.value);
                                }}
                                renderItem={renderItem}
                            />
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Atasan*</Text>
                            <Dropdown
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                placeholderStyle={{ fontSize: wp('3.5%') }}
                                selectedTextStyle={{ fontSize: wp('3.5%') }}
                                inputSearchStyle={{ fontSize: wp('3.5%') }}
                                search
                                data={dataAtasan}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih Atasan"
                                searchPlaceholder="contoh: Dhani"
                                value={valueAtasan}
                                onChange={item => {
                                    setValueAtasan(item.value);
                                }}
                                renderItem={renderItemAtasan}
                            />
                        </View>

                        <View style={{ rowGap: 6 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Nomor Telepon*</Text>
                            <TextInput
                                style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                                placeholder='contoh: 081200006789'
                                inputMode='numeric'
                                value={telp}
                                onChangeText={setTelp}
                            />
                        </View>

                        <TouchableOpacity onPress={onSave} style={{ padding: 10, backgroundColor: '#56C58D', justifyContent: 'center', alignItems: 'center', borderRadius: wp('1%') }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Simpan</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default CutiPengajuan

const styles = StyleSheet.create({
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: wp('3.5%'),
        color: '#000',
    }
})