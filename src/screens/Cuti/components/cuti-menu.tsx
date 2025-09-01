import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Menu Item Component
interface MenuItemProps {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    backgroundColor?: string;
    iconBackgroundColor?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    title,
    icon,
    onPress,
    backgroundColor = '#E3F2FD',
    iconBackgroundColor = '#2196F3',
}) => (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, { backgroundColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
            {icon}
        </View>
        <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
);

// Decorative Box Component
interface DecorativeBoxProps {
    backgroundColor?: string;
    size?: 'small' | 'large';
}

export const DecorativeBox: React.FC<DecorativeBoxProps> = ({
    backgroundColor = '#F5F5F5',
    size = 'small',
}) => (
    <View
        style={[
            size === 'small' ? styles.smallBox : styles.largeBox,
            { backgroundColor },
        ]}
    />
);

// Menu Container Component
interface MenuContainerProps {
    children: React.ReactNode;
}

export const MenuContainer: React.FC<MenuContainerProps> = ({ children }) => (
    <View style={styles.container}>
        <View style={styles.content}>
            {children}
        </View>
    </View>
);

// Menu Row Component
interface MenuRowProps {
    children: React.ReactNode;
    alignment: 'left' | 'right';
}

export const MenuRow: React.FC<MenuRowProps> = ({ children, alignment }) => (
    <View style={[
        styles.rowContainer,
        alignment === 'left' ? styles.leftContainer : styles.rightContainer
    ]}>
        {children}
    </View>
);

// Predefined Menu Items
interface PengajuanMenuProps {
    onPress: () => void;
}

export const PengajuanMenu: React.FC<PengajuanMenuProps> = ({ onPress }) => (
    <MenuItem
        title="Pengajuan"
        icon={<Icon name="filetext1" size={wp('8%')} color="#fff" />}
        onPress={onPress}
        backgroundColor="#4FC3F7"
        iconBackgroundColor="#0288D1"
    />
);

interface HistoryMenuProps {
    onPress: () => void;
}

export const HistoryMenu: React.FC<HistoryMenuProps> = ({ onPress }) => (
    <MenuItem
        title={`Riwayat\nPengambilan`}
        icon={<MaterialIcon name="clipboard-clock-outline" size={wp('8%')} color="#fff" />}
        onPress={onPress}
        backgroundColor="#C8E6C9"
        iconBackgroundColor="#388E3C"
    />
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    content: {
        width: '100%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    rowContainer: {
        width: '87%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rightContainer: {
        justifyContent: 'flex-end',
    },
    leftContainer: {
        justifyContent: 'flex-start',
    },
    menuItem: {
        width: wp('40%'),
        height: wp('40%'),
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    iconContainer: {
        padding: 15,
        borderRadius: wp('50%'),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    menuText: {
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        fontSize: wp('3.5%'),
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    smallBox: {
        width: 75,
        height: 75,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    largeBox: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
});