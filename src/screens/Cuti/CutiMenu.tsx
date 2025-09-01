import React from 'react';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import {
    MenuContainer,
    MenuRow,
    DecorativeBox,
    PengajuanMenu,
    HistoryMenu,
} from './components/cuti-menu';

type CutiMenuScreenRouteProp = RouteProp<RootStackParamList, 'CutiMenu'>;

const CutiMenu: React.FC = () => {
    const route = useRoute<CutiMenuScreenRouteProp>();
    const { id_cuti } = route.params;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handlePengajuanPress = () => {
        navigation.navigate('CutiPengajuan', { id_cuti });
    };

    const handleHistoryPress = () => {
        navigation.navigate('CutiHistory', { id_cuti });
    };

    return (
        <MenuContainer>
            <MenuRow alignment="right">
                <DecorativeBox backgroundColor="#E1F5FE" />
                <PengajuanMenu onPress={handlePengajuanPress} />
            </MenuRow>

            <MenuRow alignment="left">
                <HistoryMenu onPress={handleHistoryPress} />
                <DecorativeBox backgroundColor="#E8F5E8" />
            </MenuRow>
        </MenuContainer>
    );
};

export default CutiMenu;