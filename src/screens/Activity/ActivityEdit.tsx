import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { DropDownType, RootStackParamList } from '../../types'
import { useAuth } from '../../providers/AuthProviders'
import axios from 'axios'
import { baseurl } from '../../helpers/baseurl'
import moment from 'moment'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/AntDesign'
import { Dropdown } from 'react-native-element-dropdown'
import { getlaporanHarianById, getLaporanKesehatanById } from '../../api/aktivitas'
import Skeleton from '../../components/skeleton'
import { radius, responsiveHeight, responsiveWidth } from '../../utils/responsive'

interface LaporanKesehatan {
    id_laporan: string,
    tanggal: Date,
    jam_masuk: Date,
    jam_pulang: Date,
    status_kerja: string
}

interface LaporanHarian {
    no_urut: number,
    id_laporan: string,
    nama_karyawan: string,
    uraian_kegiatan: string,
    target_harian: string,
    kategori: string,
    lokasi_kerja: string
}

const kategoriItems: DropDownType[] = [
    { label: 'Rutin', value: 'Rutin' },
    { label: 'Projek', value: 'Projek' }
]

const hasilItems: DropDownType[] = [
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Berlanjut', value: 'Berlanjut' }
]

type ActivityEditRouteProps = RouteProp<RootStackParamList, 'ActivityEdit'>
const ActivityEdit = () => {
    const route = useRoute<ActivityEditRouteProps>()
    const { userData } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [laporanKesehatan, setLaporanKesehatan] = useState<LaporanKesehatan>();
    const [laporanHarian, setLaporanHarian] = useState<LaporanHarian[]>([]);
    const [lokasiKerja, setLokasiKerja] = useState<string>('');
    const [kategori, setKategori] = useState<string>('');
    const [hasil, setHasil] = useState<string>('');
    const [kegiatan, setKegiatan] = useState<string>('')


    const onGetHeaderAktivitas = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${baseurl}/lapHarianById/${route.params.id_laporan}`);
            if (res.data[0]) {
                setLaporanKesehatan(res.data[0]);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onGetLaporanHarian = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${baseurl}/laporanHarian/${route.params.id_laporan}`);
            if (res.data) {
                setLaporanHarian(res.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onSimpan = async () => {
        setIsLoading(true)
        try {
            const laporan = await axios.get(`${baseurl}/laporanHarian/${route.params.id_laporan}`);
            if (laporan.data.length == 0) {
                const post = await axios.post(`${baseurl}/insertLaporanHarian/${route.params.id_laporan}`,
                    {
                        nik: userData.karyawanid,
                        no_urut: 1,
                        id_laporan: route.params.id_laporan,
                        nik_kantor: userData.nik_kantor,
                        nama_karyawan: userData.nama_karyawan,
                        jabatan_karyawan: userData.jabatan,
                        dept_karyawan: userData.departemen,
                        pt: userData.pt,
                        uraian_kegiatan: kegiatan,
                        target_harian: hasil,
                        kategori: kategori,
                        lokasi_kerja: lokasiKerja,
                    },
                );
                setLokasiKerja('');
                setKategori('');
                setHasil('');
                setKegiatan('');
                onGetLaporanHarian();
                setIsLoading(false);
            }

            const post = await axios.post(`${baseurl}/insertLaporanHarian/${route.params.id_laporan}`,
                {
                    nik: userData.karyawanid,
                    no_urut: laporan.data.length + 1,
                    id_laporan: route.params.id_laporan,
                    nik_kantor: userData.nik_kantor,
                    nama_karyawan: userData.nama_karyawan,
                    jabatan_karyawan: userData.jabatan,
                    dept_karyawan: userData.departemen,
                    pt: userData.pt,
                    uraian_kegiatan: kegiatan,
                    target_harian: hasil,
                    kategori: kategori,
                    lokasi_kerja: lokasiKerja,
                },
            );
            setLokasiKerja('');
            setKategori('');
            setHasil('');
            setKegiatan('');
            onGetLaporanHarian();
            setIsLoading(false);
        } catch (error) {
            Alert.alert('Warning', 'Something went wrong');
        }
    };

    const renderItem = (item: DropDownType) => {
        return (
            <View style={{ padding: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <Text style={{ flex: 1, fontSize: wp('3.5'), color: '#000' }}>{item.label}</Text>
            </View>
        );
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [laporanKesehatan, laporanHarian] = await Promise.all([
                getLaporanKesehatanById(route.params.id_laporan),
                getlaporanHarianById(route.params.id_laporan)
            ])

            if (laporanKesehatan.status === "success" && laporanHarian.status === "success") {
                setLaporanKesehatan(laporanKesehatan.data);
                setLaporanHarian(laporanHarian.data);
                setIsLoading(false);
            } else {
                Alert.alert('Gagal mendapatkan data laporan kesehatan', laporanKesehatan.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Terjadi kesalahan internal. Silakan coba lagi.');
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, rowGap: 15 }}>
                <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 15, paddingBottom: 60 }}>
                    <Text style={{ fontSize: wp('3%'), color: '#ccc' }}>{laporanKesehatan?.id_laporan}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                        <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: '#000' }}>{laporanKesehatan?.status_kerja}</Text>
                        <Icon name='pushpino' color={'#ccc'} size={wp('5%')} style={{ transform: [{ scaleX: -1 }] }} />
                    </View>
                    <View style={{ rowGap: 5 }}>
                        <Text style={{ fontSize: wp('3%'), color: '#ccc' }}>Laporan tanggal</Text>
                        <Text style={{ fontSize: wp('3%'), color: '#000' }}>{moment(laporanKesehatan?.tanggal).format('DD MM YYYY')}</Text>
                    </View>
                </View>

                <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: wp('1%'), borderWidth: wp('0.1%'), marginHorizontal: 15, borderColor: '#ddd', marginTop: -50, rowGap: 10 }}>
                    <View style={{ rowGap: 6 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Lokasi Kerja*</Text>
                        <TextInput
                            style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                            placeholder='contoh: Head Office PAS'
                            value={lokasiKerja}
                            onChangeText={setLokasiKerja}
                        />
                    </View>

                    <View style={{ rowGap: 6 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Kategori*</Text>
                        <Dropdown
                            style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                            placeholderStyle={{ fontSize: wp('3.5%') }}
                            selectedTextStyle={{ fontSize: wp('3.5%') }}
                            data={kategoriItems}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Kategori"
                            value={kategori}
                            onChange={item => {
                                setKategori(item.value);
                            }}
                            renderItem={renderItem}
                        />
                    </View>

                    <View style={{ rowGap: 6 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Hasil*</Text>
                        <Dropdown
                            style={{ height: wp('10%'), borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10 }}
                            placeholderStyle={{ fontSize: wp('3.5%') }}
                            selectedTextStyle={{ fontSize: wp('3.5%') }}
                            data={hasilItems}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Hasil"
                            value={hasil}
                            onChange={item => {
                                setHasil(item.value);
                            }}
                            renderItem={renderItem}
                        />
                    </View>

                    <View style={{ rowGap: 6 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: wp('3.5%') }}>Uraian Kegiatan*</Text>
                        <TextInput
                            style={{ borderWidth: wp('0.1%'), borderRadius: wp('1%'), borderColor: '#ddd', paddingHorizontal: 10, textAlignVertical: 'top', }}
                            multiline={true}
                            numberOfLines={8}
                            placeholder='contoh: Melakukan pendataan'
                            value={kegiatan}
                            onChangeText={setKegiatan}
                        />
                    </View>

                    <TouchableOpacity onPress={onSimpan} style={{ padding: 10, backgroundColor: '#56C58D', alignItems: 'center', justifyContent: 'center', borderRadius: wp('1%') }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Simpan</Text>
                    </TouchableOpacity>
                </View>

                {
                    isLoading ?
                        <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                                <Skeleton width={responsiveWidth(5)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                <Skeleton width={responsiveWidth(20)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                            </View>
                            {
                                [1].map((item, index) => (
                                    <View key={index} style={{ padding: 15, backgroundColor: '#ebf5f0', borderRadius: wp('1%'), rowGap: 15 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                                                <Skeleton width={responsiveHeight(8)} height={responsiveHeight(8)} borderRadius={radius.round} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                                <View>
                                                    <Skeleton width={responsiveWidth(20)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                                    <Skeleton width={responsiveWidth(20)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                                                <Skeleton width={responsiveWidth(15)} height={responsiveWidth(5)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                            </View>
                                        </View>

                                        <Skeleton height={responsiveHeight(6)} style={{ alignSelf: 'center', marginBottom: 12 }} />
                                    </View>
                                ))
                            }
                        </View>
                        :
                        laporanHarian.length !== 0 &&
                        <View style={{ padding: 15, backgroundColor: '#fff', rowGap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                                <Icon name='book' size={wp('5%')} color={'#56C58D'} />
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>Aktivitas Tercatat</Text>
                            </View>
                            {
                                laporanHarian.map((item, index) => (
                                    <View key={index} style={{ padding: 15, backgroundColor: '#ebf5f0', borderRadius: wp('1%'), rowGap: 15 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                                                <View style={{ padding: 10, backgroundColor: '#dff2e8', borderRadius: wp('50%') }}>
                                                    <Icon name={item.kategori == 'Rutin' ? 'hourglass' : 'tool'} size={wp('5%')} color={'#56C58D'} />
                                                </View>
                                                <View>
                                                    <Text style={{ color: '#000', fontWeight: 'bold' }}>{item.kategori}</Text>
                                                    <Text style={{ fontSize: wp('3%') }}>{item.lokasi_kerja}</Text>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                                                <Text style={{ fontSize: wp('3%') }}>{item.target_harian}</Text>
                                                <View style={{ width: wp('2%'), height: wp('2%'), borderRadius: wp('3%'), backgroundColor: item.target_harian == 'Selesai' ? '#56C58D' : 'tomato' }}></View>
                                            </View>
                                        </View>

                                        <View style={{ padding: 15, backgroundColor: '#dff2e8', borderRadius: wp('1%') }}>
                                            <Text>{item.uraian_kegiatan}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default ActivityEdit

const styles = StyleSheet.create({})