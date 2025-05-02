import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseurl } from '../../helpers/baseurl';
import moment from 'moment';
import Modal from "react-native-modal";
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface CutiData {
    tanggal_mulai: string;
    tanggal_berakhir: string;
    total_hari: number;
    alasan: string;
    alamat_cuti: string;
    approval: number;
    created_at: string;
    updated_at: string;
    tipe_cuti: string;
}

type CutiHistoryScreenRouteProp = RouteProp<RootStackParamList, 'CutiHistory'>;
const CutiHistory = () => {
    const route = useRoute<CutiHistoryScreenRouteProp>();
    const { id_cuti } = route.params;

    const [refresh, setRefresh] = useState<boolean>(false);
    const [modalData, setModalData] = useState<CutiData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [detailCuti, setDetailCuti] = useState<CutiData[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>();

    const onGetDetailCuti = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get(`${baseurl}/getCutiDt/${id_cuti}`);
            if (res) {
                setDetailCuti(res.data)
            }
            console.log(res.data)
        } catch (error) {
            Alert.alert('Something went wrong');
        }
        setIsLoading(false)
    }

    const pullRefresh = () => {
        setRefresh(true);
        onGetDetailCuti();
        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    }

    useEffect(() => {
        onGetDetailCuti()
    }, [])
    return (
        // <View style={styles.container}>
        //     <ScrollView
        //         contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
        //         showsVerticalScrollIndicator={false}
        //         refreshControl={
        //             <RefreshControl refreshing={refresh} onRefresh={pullRefresh} />
        //         }
        //     >
        //         {detailCuti.map((item, index) => (
        //             <TouchableOpacity
        //                 key={index}
        //                 onPress={() => {
        //                     setIsModalVisible(true);
        //                     setModalData(item);
        //                 }}
        //                 style={styles.card_container}
        //             >
        //                 <View style={{ width: '100%', flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
        //                     {/* <Image source={icoCutiCol} style={{ width: 20, height: 20 }} /> */}

        //                     <Text style={{ fontFamily: 'Urbanist', fontSize: 14, color: '#000' }}>
        //                         {moment(item.tanggal_mulai).format("DD MMMM YYYY")}
        //                     </Text>
        //                 </View>
        //                 <View style={{ flex: 1, width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        //                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 14, color: '#000' }}>
        //                         {item.approval === 0 ? "Pengajuan telah disetujui" :
        //                             item.approval === 1 ? "Telah disetujui atasan" :
        //                                 item.approval === 2 ? "Sedang diajukan" :
        //                                     item.approval === 3 ? "Pengajuan ditolak" : "-"}
        //                     </Text>
        //                     {/* <Image
        //                         style={{ width: 20, height: 20 }}
        //                         source={
        //                             item.approval === 0 ? icoCheck :
        //                                 item.approval === 3 ? icoCross : icoMinus
        //                         }
        //                     /> */}
        //                 </View>
        //             </TouchableOpacity>
        //         ))}
        //     </ScrollView>
        //     {modalData && (
        //         <Modal isVisible style={styles.bottomModal} onBackButtonPress={() => setIsModalVisible(false)} onBackdropPress={() => setIsModalVisible(false)}>
        //             <View style={{ backgroundColor: '#fff', padding: 22, justifyContent: 'center', alignItems: 'center', borderRadius: 15, rowGap: 50 }}>
        //                 <Text style={{ color: '#000', fontFamily: 'Urbanist-Bold', fontSize: 20 }}>Detail Pengajuan</Text>
        //                 <View style={{ flexDirection: 'row', width: '100%' }}>
        //                     <View style={{ marginRight: 25 }}>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>Tipe Cuti</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>Tanggal Cuti</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>Total Hari</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>Keperluan</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>Alamat Cuti</Text>
        //                     </View>
        //                     <View>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>: {modalData.tipe_cuti === "CT" ? "Cuti Tahunan" : null}</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>: {moment(modalData.tanggal_mulai).format('DD/MM/YYYY')} - {moment(modalData.tanggal_berakhir).format('DD/MM/YYYY')}</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>: {modalData.total_hari}</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>: {modalData.alasan}</Text>
        //                         <Text style={{ color: '#000', fontFamily: 'Quicksand' }}>: {modalData.alamat_cuti}</Text>
        //                     </View>
        //                 </View>
        //                 {modalData.approval === 0 && (
        //                     <View style={{ flexDirection: 'row', width: '65%' }}>
        //                         <View style={{ width: '40%' }}>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.created_at).format('DD MMM YYYY')}</Text>
        //                             </View>
        //                             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                                 <View style={{ height: 65 }} />
        //                             </View>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.updated_at).format('DD MMM YYYY')}</Text>
        //                             </View>
        //                         </View>
        //                         <View style={{ width: '20%' }}>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 {/* <Image source={icoCheck} style={{ width: 20, height: 20 }} /> */}
        //                             </View>
        //                             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                                 <View style={{ height: 65, width: 1, backgroundColor: '#000' }} />
        //                             </View>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 {/* <Image source={icoCheck} style={{ width: 20, height: 20 }} /> */}
        //                             </View>
        //                             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                                 <View style={{ height: 65, width: 1, backgroundColor: '#000' }} />
        //                             </View>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 {/* <Image source={icoCheck} style={{ width: 20, height: 20 }} /> */}
        //                             </View>
        //                         </View>
        //                         <View style={{ width: '40%' }}>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>Dibuat</Text>
        //                             </View>
        //                             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                                 <View style={{ height: 65 }} />
        //                             </View>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>Disetujui Atasan</Text>
        //                             </View>
        //                             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                                 <View style={{ height: 65 }} />
        //                             </View>
        //                             <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
        //                                 <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>Dikonfirmasi HRD</Text>
        //                             </View>
        //                         </View>
        //                     </View>
        //                 )}
        //             </View>
        //         </Modal>
        //     )}
        // </View>
        <View style={{ flex: 1, backgroundColor: '#fafafa', paddingTop: 10 }}>
            {isLoading &&
                <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: wp('20%'), height: wp('20%'), backgroundColor: '#fff5f5', justifyContent: 'center', alignItems: 'center', opacity: 0.5, borderRadius: wp('2%') }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                </View>
            }

            {
                detailCuti.length !== 0 ?
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refresh} onRefresh={pullRefresh} />}>
                        {
                            detailCuti.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => { setIsModalVisible(true); setModalData(item) }} style={{ backgroundColor: '#fff', padding: 15, flexDirection: 'row', columnGap: 15, alignItems: 'center' }}>
                                    <View style={{ padding: 15, backgroundColor: '#f5e4ea', borderRadius: wp('50%') }}>
                                        <Icon name='rocket1' size={wp('6%')} color={'#9c4352'} />
                                    </View>
                                    <View style={{ flexDirection: 'row', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={{ fontSize: wp('3%') }}>{item.tanggal_mulai}</Text>
                                            <Text style={{ fontWeight: 'bold', color: '#000' }}>
                                                {item.approval == 0 ? "Pengajuan telah disetujui" :
                                                    item.approval == 1 ? "Telah disetujui atasan" :
                                                        item.approval == 2 ? "Sedang diajukan" :
                                                            item.approval == 3 ? "Pengajuan ditolak" : "-"}
                                            </Text>
                                        </View>
                                        <Icon
                                            name={
                                                item.approval == 0 ? 'checkcircle' :
                                                    item.approval == 1 ? 'minuscircle' :
                                                        item.approval == 2 ? 'minuscircle' :
                                                            item.approval == 3 ? 'closecircle' : 'closecircle'}
                                            size={wp('4%')}

                                            color={
                                                item.approval == 0 ? '#56C58D' :
                                                    item.approval == 1 ? '#d9ce57' :
                                                        item.approval == 2 ? '#d9ce57' :
                                                            item.approval == 3 ? '#9c4352' : '#9c4352'
                                            }
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Belum ada pengajuan cuti</Text>
                    </View>
            }

            {modalData && (
                <Modal isVisible={isModalVisible} style={styles.bottomModal} onBackButtonPress={() => setIsModalVisible(false)} onBackdropPress={() => setIsModalVisible(false)}>
                    <View style={{ backgroundColor: '#fff', padding: 22, justifyContent: 'center', alignItems: 'center', borderTopStartRadius: wp('2%'), borderTopEndRadius: wp('2%'), rowGap: 50 }}>
                        <Text style={{ color: '#000', fontSize: wp('4%'), fontWeight: 'bold' }}>Detail Pengajuan</Text>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ marginRight: 25 }}>
                                <Text style={{ color: '#000' }}>Tipe Cuti</Text>
                                <Text style={{ color: '#000' }}>Tanggal Cuti</Text>
                                <Text style={{ color: '#000' }}>Total Hari</Text>
                                <Text style={{ color: '#000' }}>Keperluan</Text>
                                <Text style={{ color: '#000' }}>Alamat Cuti</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>: {modalData.tipe_cuti === "CT" ? "Cuti Tahunan" : null}</Text>
                                <Text style={{ color: '#000' }}>: {moment(modalData.tanggal_mulai).format('DD/MM/YYYY')} - {moment(modalData.tanggal_berakhir).format('DD/MM/YYYY')}</Text>
                                <Text style={{ color: '#000' }}>: {modalData.total_hari}</Text>
                                <Text style={{ color: '#000' }}>: {modalData.alasan}</Text>
                                <Text style={{ color: '#000' }}>: {modalData.alamat_cuti}</Text>
                            </View>
                        </View>
                        {modalData.approval === 0 ? (
                            <View style={{ flexDirection: 'row', width: '65%' }}>
                                <View style={{ width: '40%' }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.created_at).format('DD MMM YYYY')}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ height: 65 }} />
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.updated_at).format('DD MMM YYYY')}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '20%' }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Icon name='checkcircle' color={'#56C58D'} />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ height: 65, width: 1, backgroundColor: '#000' }} />
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Icon name='checkcircle' color={'#56C58D'} />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ height: 65, width: 1, backgroundColor: '#000' }} />
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Icon name='checkcircle' color={'#56C58D'} />
                                    </View>
                                </View>
                                <View style={{ width: '40%' }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>Dibuat</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ height: 65 }} />
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>Disetujui Atasan</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ height: 65 }} />
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                        <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>Dikonfirmasi HRD</Text>
                                    </View>
                                </View>
                            </View>
                        )
                            : modalData.approval == 1 ?
                                <View style={{ flexDirection: 'row', width: '65%' }}>
                                    <View style={{ width: '40%' }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                            <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.created_at).format('DD MMM YYYY')}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ height: 65 }} />
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                            <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.updated_at).format('DD MMM YYYY')}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '20%' }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                            <Icon name='checkcircle' color={'#56C58D'} />
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ height: 65, width: 1, backgroundColor: '#000' }} />
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                            <Icon name='checkcircle' color={'#56C58D'} />
                                        </View>
                                    </View>
                                    <View style={{ width: '40%' }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                            <Text style={{ color: '#000', fontFamily: 'Urbanist-Bold', fontSize: 14 }}>Diajukan</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ height: 65 }} />
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                            <Text style={{ color: '#000', fontFamily: 'Urbanist-Bold', fontSize: 14 }}>Atasan Menyetujui</Text>
                                        </View>
                                    </View>
                                </View>
                                : modalData.approval == 2 ?
                                    <View style={{ flexDirection: 'row', width: '65%' }}>
                                        <View style={{ width: '40%' }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                                <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.created_at).format('DD MMM YYYY')}</Text>

                                            </View>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>

                                                <Icon name='checkcircle' color={'#56C58D'} />

                                            </View>
                                        </View>
                                        <View style={{ width: '40%' }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                                <Text style={{ color: '#000', fontFamily: 'Urbanist-Bold', fontSize: 14 }}>Diajukan</Text>
                                            </View>
                                        </View>
                                    </View>
                                    : modalData.approval == 3 ?
                                        <View style={{ flexDirection: 'row', width: '65%' }}>
                                            <View style={{ width: '40%' }}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.created_at).format('DD MMM YYYY')}</Text>

                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ height: 65 }} />
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Urbanist', fontSize: 14 }}>{moment(modalData.updated_at).format('DD MMM YYYY')}</Text>

                                                </View>
                                            </View>
                                            <View style={{ width: '20%' }}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>

                                                    <Icon name='checkcircle' color={'#56C58D'} />

                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ height: 65, width: 1, backgroundColor: '#000' }} />
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>

                                                    <Icon name='closecircle' color={'#9c4352'} />

                                                </View>
                                            </View>
                                            <View style={{ width: '40%' }}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Urbanist-Bold', fontSize: 14 }}>Diajukan</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ height: 65 }} />
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: wp('12%') }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Urbanist-Bold', fontSize: 14 }}>Ditolak</Text>
                                                </View>
                                            </View>
                                        </View>
                                        : null
                        }
                    </View>
                </Modal>
            )}
        </View >
    )
}

export default CutiHistory

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff'
    },
    card_container: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    }
})