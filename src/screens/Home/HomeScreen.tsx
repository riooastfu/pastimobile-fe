import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, Text, View } from 'react-native';
import { BG1, BG2, BG3, Palm } from '../../assets/image/image';
import { useIsFocused } from '@react-navigation/native';
import Slider from '../../components/Slider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../providers/AuthProviders';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment/min/moment-with-locales';
import { KaryawanUlangTahun } from '../../types';
import { getKaryawanUlangTahun } from '../../api/home';

interface SliderDataProps {
    title: string
    desc: string
    image: any
}

const HomeScreen: React.FC = () => {
    const { userData } = useAuth()
    const isFocused = useIsFocused();
    const { width } = Dimensions.get('window');
    const ITEM_WIDTH = width * 0.95;
    const ITEM_HEIGHT = ITEM_WIDTH * 0.5;

    const [ulangTahun, setUlangTahun] = useState<KaryawanUlangTahun[]>([]);

    const sliderData: SliderDataProps[] = [
        { title: "Industri Minyak Sawit", desc: "Minyak sawit adalah minyak nabati terbesar yang dibutuhkan oleh penduduk dunia.", image: BG2 },
        { title: "Industri Gula", desc: "Gula adalah satu-satunya sumber energi bagi otak dan sel darah merah yang dibutuhkan oleh manusia.", image: BG1 },
        { title: "Konservasi", desc: "Perusahaan memberikan manfaat bagi masyarakat, memperhatikan dampak lingkungan, guna meraih keuntungan secara ekonomis di dalam langkah operasional perusahaan.", image: BG3 }
    ];

    const data = sliderData.map((item, index) => ({
        key: String(index),
        title: item.title,
        desc: item.desc,
        image: item.image,
    }));

    // const fetchApi = async () => {
    //     try {
    //         const [ulangTahun] = await Promise.all([
    //             getKaryawanUlangTahun(userData.pt)
    //         ]);

    //         if (ulangTahun.status === 'success') {
    //             setUlangTahun(ulangTahun.data);
    //         }
    //     } catch (error) {
    //         console.log('fetchApi Error [HomeScreen]:', error);
    //     }
    // }

    // useEffect(() => {
    //     fetchApi();
    // }, [])

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 15 }}>
                {isFocused && <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="transparent" />}
                <View style={{ paddingHorizontal: 15, backgroundColor: '#53a9cf', height: hp('30%'), flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <View style={{ zIndex: 1, paddingTop: 30 }}>
                        <Text style={{ fontSize: wp('5%'), color: '#fff', fontWeight: 'bold' }}>Halo,</Text>
                        <Text style={{ fontSize: wp('3.5%'), color: '#fff' }}>{userData.nama_karyawan}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Image source={Palm} style={{ resizeMode: 'cover', width: wp('120%'), height: wp('120%'), flex: 1, opacity: 0.1568 }} />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', height: hp('25%'), position: 'relative', marginTop: -70 }}>
                    <Slider
                        data={data}
                        keyExtractor={item => item.key}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        sliderData={sliderData}
                        width={width}
                        autoScroll={true}
                        pagingEnabled
                        indicator
                        indicatorStyles={{ top: -20 }}
                        indicatorColor='#fff'
                        slideInterval={7000}
                        renderItem={({ item, index }) => (
                            <View key={index} style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, overflow: 'hidden', borderRadius: wp('4%'), backgroundColor: '#fff', justifyContent: 'space-between', shadowColor: 'black', shadowOpacity: 1, elevation: 5, }}>
                                    <View style={{ padding: 15 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: wp('4%') }}>{item.title}</Text>
                                        {/* <Text style={{  }}>{item.desc}</Text> */}
                                    </View>
                                    <Image source={item.image} style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, resizeMode: 'cover', position: 'absolute', zIndex: -1, }} />
                                </View>
                            </View>
                        )}
                    />
                </View>

                <View style={{ backgroundColor: '#fff', padding: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('4.5%') }}>Pasifik Agro Sentosa</Text>
                    <Text style={{ textAlign: 'justify' }}>Perusahaan agrobisnis yang memiliki banyak anak perusahaan. Bergerak dibidang perkebunan kelapa sawit, tebu, teh, pabrik penggilingan gula dan industri gula rafinasi.</Text>
                </View>

                <View style={{ backgroundColor: '#fff', padding: 15, rowGap: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ padding: 10, borderRadius: wp('20%'), backgroundColor: '#e3f3fa', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='cake-variant-outline' size={wp('6%')} color={'#0079AE'} />
                        </View>
                    </View>

                    {
                        ulangTahun.length !== 0 ?
                            ulangTahun.map((item, index) => (
                                <View key={index} style={{ padding: 15, backgroundColor: '#e3f3fa', borderRadius: wp('1%') }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: 'bold', color: '#000' }}>{item.nama_karyawan}</Text>
                                        <Text>{moment(item.tanggal_lahir).locale('id').format('MMMM DD')}</Text>
                                    </View>
                                    <Text style={{ fontSize: wp('3%') }}>{item.departemen_desc}</Text>
                                </View>
                            ))
                            :
                            <View style={{ padding: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Tidak ada ulang tahun di minggu ini.</Text>
                            </View>
                    }
                </View>
            </View>
        </ScrollView>
    );
}

export default HomeScreen;
