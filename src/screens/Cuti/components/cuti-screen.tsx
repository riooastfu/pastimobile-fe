import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import DonutChart from '../../../components/donut-chart';
import Skeleton from '../../../components/skeleton';
import { radius, responsiveHeight, responsiveWidth } from '../../../utils/responsive';
import {
    CutiSaldoDisplayProps,
    CutiCardListProps,
    KartuCutiProps,
} from '../types/cuti.types';

// Loading Screen Component
export const CutiLoadingScreen: React.FC = () => (
    <View style={styles.container}>
        {/* Saldo Info Skeleton */}
        <View style={styles.saldoContainer}>
            <View style={styles.saldoContent}>
                <Skeleton
                    width={responsiveHeight(6)}
                    height={responsiveHeight(6)}
                    borderRadius={radius.round}
                />
                <Skeleton width={responsiveWidth(20)} height={responsiveWidth(5)} />
                <View style={styles.legendContainer}>
                    <Skeleton width={responsiveWidth(15)} height={responsiveWidth(5)} />
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { opacity: 0.2 }]} />
                        <Skeleton width={responsiveWidth(15)} height={responsiveWidth(5)} />
                    </View>
                    <View style={styles.legendItem}>
                        <View style={styles.legendDot} />
                        <Skeleton width={responsiveWidth(15)} height={responsiveWidth(5)} />
                    </View>
                </View>
            </View>
            <Skeleton
                width={responsiveHeight(12)}
                height={responsiveHeight(12)}
                borderRadius={radius.round}
            />
        </View>

        {/* Cards Skeleton */}
        <View style={styles.cardsContainer}>
            <View style={styles.cardsWrapper}>
                <Skeleton width={responsiveWidth(20)} height={responsiveWidth(10)} />
                {[1, 2].map((_, i) => (
                    <Skeleton key={i} height={responsiveWidth(15)} />
                ))}
            </View>
        </View>
    </View>
);

// Saldo Display Component
export const CutiSaldoDisplay: React.FC<CutiSaldoDisplayProps> = ({
    saldoInfo,
    isLoading,
}) => {
    if (isLoading) return null;

    return (
        <View style={styles.saldoContainer}>
            <View style={styles.saldoContent}>
                <View style={styles.iconWrapper}>
                    <Icon name="book" size={wp('8%')} color="#715D91" />
                </View>
                <Text style={styles.saldoTitle}>Informasi Saldo</Text>
                <View style={styles.legendContainer}>
                    <Text style={styles.legendText}>
                        Total: {saldoInfo.maxValue}
                    </Text>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { opacity: 0.2 }]} />
                        <Text style={styles.legendText}>
                            Terpakai: {saldoInfo.terpakai}
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={styles.legendDot} />
                        <Text style={styles.legendText}>
                            Sisa: {saldoInfo.percentage}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <DonutChart
                    maxValue={saldoInfo.maxValue}
                    percentage={saldoInfo.percentage}
                />
            </View>
        </View>
    );
};

// Single Card Component
interface CutiCardItemProps {
    item: KartuCutiProps;
    onPress: (id_cuti: string) => void;
}

const CutiCardItem: React.FC<CutiCardItemProps> = ({ item, onPress }) => {
    const isDisabled = item.aktif === true;

    return (
        <TouchableOpacity
            disabled={isDisabled}
            onPress={() => onPress(item.id_cuti)}
            style={[styles.cardItem, isDisabled && styles.cardItemDisabled]}
        >
            <View style={styles.cardIcon}>
                <Icon name="staro" size={wp('5%')} color="#715d91" />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>
                        Kartu Cuti {item.id_cuti.substring(0, 4)}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        Exp. Date {moment(item.tanggal_berakhir).format('MM/YY')}
                    </Text>
                </View>
                <Icon name="right" size={wp('4%')} color="#666" />
            </View>
        </TouchableOpacity>
    );
};

// Card List Component
export const CutiCardList: React.FC<CutiCardListProps> = ({
    kartuCuti,
    onCardPress,
}) => (
    <View style={styles.cardsContainer}>
        <View style={styles.cardsWrapper}>
            <Text style={styles.cardsTitle}>Daftar Kartu Cuti</Text>
            {kartuCuti.map((item, index) => (
                <CutiCardItem
                    key={`${item.id_cuti}-${index}`}
                    item={item}
                    onPress={onCardPress}
                />
            ))}
        </View>
    </View>
);

// Empty State Component
interface EmptyStateProps {
    onRefresh: () => void;
}

export const CutiEmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => (
    <View style={styles.emptyContainer}>
        <Icon name="frowno" size={wp('10%')} color="#ccc" />
        <Text style={styles.emptyText}>Kamu belum punya cuti.</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Icon name="reload1" size={wp('5%')} color="#ddd" />
            <Text style={styles.refreshText}>Tekan untuk memuat ulang</Text>
        </TouchableOpacity>
    </View>
);

// Error State Component
interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export const CutiErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
    <View style={styles.errorContainer}>
        <Icon name="exclamationcircleo" size={wp('10%')} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Icon name="reload1" size={wp('4%')} color="#fff" />
            <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        backgroundColor: '#fafafa',
    },

    // Saldo styles
    saldoContainer: {
        padding: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    saldoContent: {
        flex: 1,
        gap: 10,
    },
    iconWrapper: {
        width: wp('14%'),
        height: wp('14%'),
        backgroundColor: '#F9F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('14%'),
    },
    saldoTitle: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: wp('4%'),
    },
    legendContainer: {
        flexDirection: 'row',
        columnGap: 10,
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
    },
    legendDot: {
        backgroundColor: '#715D91',
        width: wp('1%'),
        height: wp('1%'),
        borderRadius: wp('1%'),
    },
    legendText: {
        color: '#000',
        fontSize: wp('3%'),
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Cards styles
    cardsContainer: {
        padding: 15,
        backgroundColor: '#fff',
    },
    cardsWrapper: {
        backgroundColor: '#f9f5ff',
        padding: 15,
        borderRadius: wp('2%'),
        gap: 10,
    },
    cardsTitle: {
        fontWeight: 'bold',
        color: '#715D91',
        fontSize: wp('4.5%'),
    },
    cardItem: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 15,
        columnGap: 10,
        alignItems: 'center',
        borderRadius: wp('1%'),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    cardItemDisabled: {
        opacity: 0.5,
    },
    cardIcon: {
        padding: 8,
        backgroundColor: '#f9f5ff',
        borderRadius: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: wp('3.5%'),
    },
    cardSubtitle: {
        fontSize: wp('3%'),
        color: '#bbb',
        marginTop: 2,
    },

    // Empty state styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        padding: 50,
    },
    emptyText: {
        fontSize: wp('4%'),
        color: '#666',
        textAlign: 'center',
    },
    refreshButton: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: 20,
    },
    refreshText: {
        fontSize: wp('3%'),
        color: '#ddd',
    },

    // Error state styles
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        padding: 50,
        backgroundColor: '#fafafa',
    },
    errorText: {
        fontSize: wp('4%'),
        color: '#666',
        textAlign: 'center',
        lineHeight: wp('5%'),
    },
    retryButton: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: wp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    retryText: {
        color: '#fff',
        fontSize: wp('3.5%'),
        fontWeight: '500',
    },
});