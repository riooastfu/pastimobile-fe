import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RandomColor, RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

type CutiMenuScreenRouteProp = RouteProp<RootStackParamList, 'CutiMenu'>;
const CutiMenu = () => {
    const route = useRoute<CutiMenuScreenRouteProp>();
    const { id_cuti } = route.params;

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{ alignSelf: 'flex-end', ...styles.box_container }}>
                    <View style={{ alignSelf: 'flex-end', backgroundColor: RandomColor[(Math.floor(Math.random() * RandomColor.length))], ...styles.small_box }}></View>
                    <TouchableOpacity onPress={() => { navigation.navigate('CutiPengajuan', { id_cuti: route.params.id_cuti }) }} style={{ backgroundColor: RandomColor[(Math.floor(Math.random() * RandomColor.length))], ...styles.large_box }}>
                        <View style={{ padding: 15, borderRadius: wp('50%'), backgroundColor: RandomColor[(Math.floor(Math.random() * RandomColor.length))] }}>
                            <Icon name='filetext1' size={wp('8%')} />
                        </View>
                        <Text style={{ fontSize: wp('4%'), ...styles.text }}>Pengajuan</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignSelf: 'flex-start', ...styles.box_container }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('CutiHistory', { id_cuti: route.params.id_cuti }) }} style={{ backgroundColor: RandomColor[(Math.floor(Math.random() * RandomColor.length))], ...styles.large_box }}>
                        <View style={{ padding: 15, borderRadius: wp('50%'), backgroundColor: RandomColor[(Math.floor(Math.random() * RandomColor.length))] }}>
                            <MaterialIcon name='clipboard-clock-outline' size={wp('8%')} />
                        </View>
                        <Text style={{ fontSize: wp('4%'), ...styles.text }}>Riwayat {"\n"}Pengambilan</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: RandomColor[(Math.floor(Math.random() * RandomColor.length))], ...styles.small_box }}></View>
                </View>
            </View>
        </View>
    )
}

export default CutiMenu

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },

    content: {
        width: '100%', height: '70%', justifyContent: 'center', alignItems: 'center', rowGap: 8
    },

    box_container: {
        width: '87.367%', flexDirection: 'row', columnGap: 8, justifyContent: 'center'
    },

    small_box: {
        width: 75, height: 75, borderRadius: 15, shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5,
    },
    large_box: {
        width: wp('40%'),
        height: wp('40%'),
        borderRadius: 15,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    }
})