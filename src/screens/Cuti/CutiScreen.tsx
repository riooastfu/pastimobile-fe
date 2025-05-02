import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import DonutChart from '../../components/DonutChart'
import { useAuth } from '../../providers/AuthProviders'
import axios from 'axios'
import { baseurl } from '../../helpers/baseurl'
import moment from 'moment'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../types'

type KartuCutiProps = {
    id_cuti: string,
    tanggal_berakhir: string,
    saldo: number,
    hak_cuti: number,
}

const CutiScreen = () => {
    const { userData } = useAuth();

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [kartuCuti, setKartuCuti] = useState<KartuCutiProps[]>([]);
    const [maxValue, setMaxValue] = useState<number>(100);
    const [percentage, setPercentage] = useState<number>(50);
    const [terpakai, setTerpakai] = useState<number>(0)

    const onGetKartuCuti = async () => {
        let result: number = 0;
        let total: number = 0;

        try {
            const res = await axios.get(`${baseurl}/getCuti/${userData.karyawanid}`);
            if (res) {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].saldo < 0) {
                        res.data[i].saldo = 0;
                    }
                    result = result + res.data[i].saldo;
                    total = total + res.data[i].hak_cuti;
                }

                if (total == 0) {
                    setMaxValue(100);
                } else {
                    setMaxValue(total);
                }
                setPercentage(result);
                setTerpakai(total - result);
                setKartuCuti(res.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onRefreshIcon = useCallback(async () => {
        setIsRefresh(true);
        try {
            onGetKartuCuti()
        } catch (error) {
            Alert.alert('Something went wrong during refresh!');
        } finally {
            setIsRefresh(false);
        }
    }, []);

    useEffect(() => {
        onGetKartuCuti()
    }, []);

    return (
        <View style={{ flex: 1, rowGap: 10, backgroundColor: '#fafafa' }}>
            {
                kartuCuti.length !== 0 ?
                    <>
                        <View style={{ padding: 15, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ rowGap: 10 }}>
                                <View style={{ width: wp('14%'), height: wp('14%'), backgroundColor: '#F9F5FF', justifyContent: 'center', alignItems: 'center', borderRadius: wp('14%') }}>
                                    <Icon name='book' size={wp('8%')} color={'#715D91'} />
                                </View>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>Informasi Saldo</Text>
                                <View style={{ flexDirection: 'row', columnGap: 10 }}>
                                    <Text style={{ color: '#000', fontSize: wp('3%') }}>Total: {maxValue}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View
                                            style={{
                                                backgroundColor: '#715D91',
                                                width: wp('1%'),
                                                height: wp('1%'),
                                                borderRadius: wp('1%'),
                                                marginTop: -2,
                                                opacity: 0.2,
                                            }}
                                        />
                                        <Text
                                            style={{ color: '#000', fontSize: wp('3%') }}>
                                            Terpakai: {terpakai}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View
                                            style={{
                                                backgroundColor: '#715D91',
                                                width: wp('1%'),
                                                height: wp('1%'),
                                                borderRadius: wp('1%'),
                                                marginTop: -2,
                                            }}
                                        />
                                        <Text
                                            style={{ color: '#000', fontSize: wp('3%') }}>
                                            Sisa: {percentage}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <DonutChart maxValue={maxValue} percentage={percentage} />
                            </View>
                        </View>

                        <View style={{ padding: 15, backgroundColor: '#fff' }}>
                            <View style={{ backgroundColor: '#f9f5ff', padding: 15, borderRadius: wp('2%'), rowGap: 10 }}>
                                {/* <View style={{ width: wp('14%'), height: wp('14%'), borderRadius: wp('14%'), backgroundColor: '#715d91', justifyContent: 'center', alignItems: 'center', marginTop: -45 }}>
                                        <Icon name='creditcard' size={wp('12s%')} color={'#64c486'} style={{ bottom: 10, left: 15, position: 'absolute' }} />
                                        <Icon name='creditcard' size={wp('12s%')} color={'#413454'} style={{ bottom: 5, left: 10, position: 'absolute', zIndex: -1 }} />
                                    </View> */}
                                <Text style={{ fontWeight: 'bold', color: '#715D91', fontSize: wp('4.5%') }}>Daftar Kartu Cuti</Text>

                                {
                                    kartuCuti.map((item, index) => (
                                        <TouchableOpacity onPress={() => navigation.navigate('CutiMenu', { id_cuti: item.id_cuti })} key={index} style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 15, columnGap: 10, alignItems: 'center' }}>
                                            <View style={{ padding: 6, backgroundColor: '#f9f5ff', borderRadius: wp('10%'), justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon name='staro' size={wp('5%')} color={'#715d91'} />
                                            </View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', flexGrow: 1, alignItems: 'center' }}>
                                                <View>
                                                    <Text style={{ fontWeight: 'bold', color: '#000' }}>Kartu Cuti {item.id_cuti.substring(0, 4)}</Text>
                                                    <Text style={{ fontSize: wp('3%'), color: '#bbb' }}>Exp. Date {moment(item.tanggal_berakhir).format('MM/YY')}</Text>
                                                </View>
                                                <Icon name='right' size={wp('4%')} />
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }

                            </View>
                        </View>
                    </>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 10 }}>
                        <Icon name='frowno' size={wp('10%')} />
                        <Text>Anda tidak punya cuti.</Text>
                        <TouchableOpacity onPress={onRefreshIcon} style={{ justifyContent: 'center', alignItems: 'center', rowGap: 5 }}>
                            <Icon name='reload1' size={wp('5%')} color={'#ddd'} />
                            <Text style={{ fontSize: wp('3%'), color: '#ddd' }}>Tekan untuk memuat ulang</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}

export default CutiScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff'
    },
    card_container: {
        width: '95%',
        height: 135,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        // marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    btn: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'lime',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150
    }
});