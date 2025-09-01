import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StatusBar, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { BG1, BG2, BG3, Palm } from '../../assets/image/image';
import { useIsFocused } from '@react-navigation/native';
import Slider from '../../components/slider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../providers/auth-provider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment/min/moment-with-locales';
import { KaryawanUlangTahun } from '../../types';
import { getKaryawanUlangTahun } from '../../api/home';
import Skeleton from '../../components/skeleton';
import { radius, responsiveWidth } from '../../utils/responsive';
import { useLoading } from '../../hooks/use-loading';

interface SliderDataProps {
    title: string
    desc: string
    image: any
}

interface NotificationProps {
    id: string
    title: string
    message: string
    time: string
    isRead: boolean
    type: 'info' | 'warning' | 'success' | 'birthday'
}

const HomeScreen: React.FC = () => {
    const { userData } = useAuth()
    const { isLoading, showLoading, hideLoading } = useLoading();
    const isFocused = useIsFocused();
    const { width } = Dimensions.get('window');
    const ITEM_WIDTH = width * 0.95;
    const ITEM_HEIGHT = ITEM_WIDTH * 0.5;

    const [ulangTahun, setUlangTahun] = useState<KaryawanUlangTahun[]>([]);
    const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationProps[]>([
        {
            id: '1',
            title: 'Selamat Ulang Tahun!',
            message: 'Jangan lupa ucapkan selamat ulang tahun kepada rekan kerja Anda',
            time: '2 jam yang lalu',
            isRead: false,
            type: 'birthday'
        },
        {
            id: '2',
            title: 'Pengumuman Penting',
            message: 'Meeting bulanan akan diadakan besok pagi pukul 09:00',
            time: '5 jam yang lalu',
            isRead: false,
            type: 'info'
        },
        {
            id: '3',
            title: 'Reminder',
            message: 'Jangan lupa untuk mengisi timesheet minggu ini',
            time: '1 hari yang lalu',
            isRead: true,
            type: 'warning'
        }
    ]);

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

    const unreadNotificationsCount = notifications.filter(notif => !notif.isRead).length;

    const onGetKaryawanUlangTahun = async () => {
        showLoading();
        try {
            const ulangTahun = await getKaryawanUlangTahun(userData.pt)

            if (ulangTahun.status === 'success') {
                setUlangTahun([]);
            }
            hideLoading()
        } catch (error: any) {
            // showAlert.error('Gagal memuat data ulang tahun karyawan.');
            hideLoading()
        }
    }

    const handleNotificationPress = () => {
        setShowNotificationModal(true);
    }

    const handleNotificationItemPress = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        );
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'birthday':
                return 'cake-variant-outline';
            case 'warning':
                return 'alert-outline';
            case 'success':
                return 'check-circle-outline';
            default:
                return 'information-outline';
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'birthday':
                return '#ff6b6b';
            case 'warning':
                return '#ffa726';
            case 'success':
                return '#66bb6a';
            default:
                return '#42a5f5';
        }
    }

    const renderNotificationItem = ({ item }: { item: NotificationProps }) => (
        <TouchableOpacity
            style={{
                padding: 15,
                backgroundColor: item.isRead ? '#f5f5f5' : '#e3f3fa',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                flexDirection: 'row',
                alignItems: 'flex-start'
            }}
            onPress={() => handleNotificationItemPress(item.id)}
        >
            <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: getNotificationColor(item.type),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
            }}>
                <MaterialCommunityIcons
                    name={getNotificationIcon(item.type)}
                    size={20}
                    color="#fff"
                />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{
                        fontWeight: item.isRead ? 'normal' : 'bold',
                        fontSize: wp('3.5%'),
                        color: '#000',
                        flex: 1
                    }}>
                        {item.title}
                    </Text>
                    {!item.isRead && (
                        <View style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#0079AE',
                            marginLeft: 8
                        }} />
                    )}
                </View>
                <Text style={{
                    fontSize: wp('3%'),
                    color: '#666',
                    marginTop: 4,
                    lineHeight: wp('4%')
                }}>
                    {item.message}
                </Text>
                <Text style={{
                    fontSize: wp('2.5%'),
                    color: '#999',
                    marginTop: 8
                }}>
                    {item.time}
                </Text>
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        onGetKaryawanUlangTahun()
    }, [])

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#fafafa', rowGap: 15 }}>
                {isFocused && <StatusBar barStyle={'light-content'} translucent={true} backgroundColor="transparent" />}
                <View style={{ paddingHorizontal: 15, backgroundColor: '#53a9cf', height: hp('30%'), flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    {
                        isLoading ?
                            <View style={{ zIndex: 1, paddingTop: 30, rowGap: 8 }}>
                                <Skeleton width={responsiveWidth(12)} height={responsiveWidth(6)} />
                                <Skeleton width={responsiveWidth(50)} height={responsiveWidth(6)} />
                            </View>
                            :
                            <View style={{ zIndex: 1, paddingTop: 30 }}>
                                <Text style={{ fontSize: wp('5%'), color: '#fff', fontWeight: 'bold' }}>Halo,</Text>
                                <Text style={{ fontSize: wp('3.5%'), color: '#fff' }}>{userData.nama_karyawan}</Text>
                            </View>
                    }

                    {/* Notification Icon */}
                    {/* <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 45,
                            right: 15,
                            zIndex: 2,
                            padding: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: wp('6%'),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={handleNotificationPress}
                    >
                        <MaterialCommunityIcons name='bell-outline' size={wp('6%')} color={'#fff'} />
                        {unreadNotificationsCount > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                backgroundColor: '#ff4444',
                                borderRadius: wp('2.5%'),
                                minWidth: wp('5%'),
                                height: wp('5%'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#fff'
                            }}>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: wp('2.5%'),
                                    fontWeight: 'bold'
                                }}>
                                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity> */}

                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Image source={Palm} style={{ resizeMode: 'cover', width: wp('120%'), height: wp('120%'), flex: 1, opacity: 0.1568 }} />
                    </View>
                </View>

                {/* Notification Modal */}
                <Modal
                    visible={showNotificationModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowNotificationModal(false)}
                >
                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                        {/* Modal Header */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                            paddingTop: Platform.OS === 'ios' ? 50 : 15
                        }}>
                            <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: '#000' }}>
                                Notifikasi
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {unreadNotificationsCount > 0 && (
                                    <TouchableOpacity
                                        onPress={markAllAsRead}
                                        style={{ marginRight: 15 }}
                                    >
                                        <Text style={{ color: '#0079AE', fontSize: wp('3.5%') }}>
                                            Tandai Semua
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                                    <MaterialCommunityIcons name='close' size={wp('6%')} color={'#666'} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Notifications List */}
                        {notifications.length > 0 ? (
                            <FlatList
                                data={notifications}
                                renderItem={renderNotificationItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 20
                            }}>
                                <MaterialCommunityIcons name='bell-off-outline' size={wp('15%')} color={'#ccc'} />
                                <Text style={{
                                    fontSize: wp('4%'),
                                    color: '#666',
                                    textAlign: 'center',
                                    marginTop: 15
                                }}>
                                    Tidak ada notifikasi
                                </Text>
                            </View>
                        )}
                    </View>
                </Modal>

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
                        isLoading ?
                            [1, 2, 3].map((_, i) => (
                                <View key={i} style={{ padding: 15, backgroundColor: '#e3f3fa', borderRadius: wp('1%'), rowGap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Skeleton width={responsiveWidth(30)} height={responsiveWidth(6)} />
                                        <Skeleton width={responsiveWidth(15)} height={responsiveWidth(6)} />
                                    </View>
                                    <Skeleton width={responsiveWidth(15)} height={responsiveWidth(6)} />
                                </View>
                            ))
                            :
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
                                <View style={{ padding: 20, borderRadius: wp('2%'), justifyContent: 'center', alignItems: 'center', rowGap: 15 }}>
                                    <TouchableOpacity
                                        onPress={onGetKaryawanUlangTahun}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            padding:12,
                                            borderRadius: radius.xxl,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            columnGap: 8
                                        }}
                                    >
                                        <MaterialCommunityIcons name='refresh' size={wp('4%')} color={'#666'} />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: wp('3.5%'), color: '#666', textAlign: 'center' }}>Tidak ada karyawan berulang tahun di minggu ini</Text>
                                </View>
                    }
                </View>
            </View>
        </ScrollView>
    );
}

export default HomeScreen;