import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, RefreshControl, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import Skeleton from '../../../components/skeleton';
import { responsiveWidth } from '../../../utils/responsive';
import { 
    CutiHistoryData, 
    ApprovalStatus, 
    ApprovalStatusText, 
    ApprovalStatusColor, 
    ApprovalStatusIcon 
} from '../types/cuti.types';

// Loading Component
export const CutiHistoryLoading: React.FC = () => (
    <View style={styles.loadingContainer}>
        {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} height={responsiveWidth(20)} />
        ))}
    </View>
);

// Empty State Component
interface EmptyStateProps {
    onRefresh: () => void;
}

export const CutiHistoryEmpty: React.FC<EmptyStateProps> = ({ onRefresh }) => (
    <View style={styles.emptyContainer}>
        <Icon name="frowno" size={wp('10%')} color="#ccc" />
        <Text style={styles.emptyText}>Belum ada pengajuan cuti</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Icon name="reload1" size={wp('4%')} color="#fff" />
            <Text style={styles.refreshText}>Muat Ulang</Text>
        </TouchableOpacity>
    </View>
);

// Error State Component
interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export const CutiHistoryError: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
    <View style={styles.errorContainer}>
        <Icon name="exclamationcircleo" size={wp('10%')} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Icon name="reload1" size={wp('4%')} color="#fff" />
            <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
    </View>
);

// History Item Component
interface HistoryItemProps {
    item: CutiHistoryData;
    onPress: (item: CutiHistoryData) => void;
}

export const CutiHistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
    const approval = item.approval as ApprovalStatus;
    
    return (
        <TouchableOpacity 
            onPress={() => onPress(item)} 
            style={styles.historyItem}
        >
            <View style={styles.iconContainer}>
                <Icon name="rocket1" size={wp('6%')} color="#9c4352" />
            </View>
            <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemDate}>{item.tanggal_mulai}</Text>
                    <Text style={styles.itemStatus}>
                        {ApprovalStatusText[approval] || '-'}
                    </Text>
                </View>
                <Icon
                    name={ApprovalStatusIcon[approval] || 'closecircle'}
                    size={wp('4%')}
                    color={ApprovalStatusColor[approval] || '#9c4352'}
                />
            </View>
        </TouchableOpacity>
    );
};

// History List Component
interface HistoryListProps {
    data: CutiHistoryData[];
    isRefreshing: boolean;
    onRefresh: () => void;
    onItemPress: (item: CutiHistoryData) => void;
}

export const CutiHistoryList: React.FC<HistoryListProps> = ({
    data,
    isRefreshing,
    onRefresh,
    onItemPress,
}) => (
    <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
    >
        {data.map((item, index) => (
            <CutiHistoryItem
                key={index}
                item={item}
                onPress={onItemPress}
            />
        ))}
    </ScrollView>
);

// Detail Modal Component
interface DetailModalProps {
    isVisible: boolean;
    data: CutiHistoryData | null;
    onClose: () => void;
}

export const CutiDetailModal: React.FC<DetailModalProps> = ({
    isVisible,
    data,
    onClose,
}) => {
    if (!data) return null;

    const approval = data.approval as ApprovalStatus;

    return (
        <Modal
            isVisible={isVisible}
            style={styles.bottomModal}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Detail Pengajuan</Text>
                
                <View style={styles.detailContainer}>
                    <View style={styles.detailLabels}>
                        <Text style={styles.detailLabel}>Tipe Cuti</Text>
                        <Text style={styles.detailLabel}>Tanggal Cuti</Text>
                        <Text style={styles.detailLabel}>Total Hari</Text>
                        <Text style={styles.detailLabel}>Keperluan</Text>
                        <Text style={styles.detailLabel}>Alamat Cuti</Text>
                    </View>
                    <View style={styles.detailValues}>
                        <Text style={styles.detailValue}>
                            : {data.tipe_cuti === 'CT' ? 'Cuti Tahunan' : data.tipe_cuti}
                        </Text>
                        <Text style={styles.detailValue}>
                            : {moment(data.tanggal_mulai).format('DD/MM/YYYY')} - {moment(data.tanggal_berakhir).format('DD/MM/YYYY')}
                        </Text>
                        <Text style={styles.detailValue}>: {data.total_hari}</Text>
                        <Text style={styles.detailValue}>: {data.alasan}</Text>
                        <Text style={styles.detailValue}>: {data.alamat_cuti}</Text>
                    </View>
                </View>

                <ApprovalTimeline approval={approval} data={data} />
            </View>
        </Modal>
    );
};

// Approval Timeline Component
interface ApprovalTimelineProps {
    approval: ApprovalStatus;
    data: CutiHistoryData;
}

const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ approval, data }) => {
    const renderTimelineStep = (
        date: string,
        icon: string,
        color: string,
        label: string,
        showLine: boolean = false
    ) => (
        <>
            <View style={styles.timelineStep}>
                <Text style={styles.timelineDate}>
                    {moment(date).format('DD MMM YYYY')}
                </Text>
            </View>
            <View style={styles.timelineIcon}>
                <Icon name={icon} color={color} size={wp('4%')} />
                {showLine && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineStep}>
                <Text style={styles.timelineLabel}>{label}</Text>
            </View>
        </>
    );

    return (
        <View style={styles.timelineContainer}>
            {approval === ApprovalStatus.APPROVED && (
                <>
                    {renderTimelineStep(data.created_at, 'checkcircle', '#56C58D', 'Dibuat', true)}
                    {renderTimelineStep(data.updated_at, 'checkcircle', '#56C58D', 'Disetujui Atasan', true)}
                    {renderTimelineStep(data.updated_at, 'checkcircle', '#56C58D', 'Dikonfirmasi HRD')}
                </>
            )}
            {approval === ApprovalStatus.APPROVED_BY_SUPERVISOR && (
                <>
                    {renderTimelineStep(data.created_at, 'checkcircle', '#56C58D', 'Diajukan', true)}
                    {renderTimelineStep(data.updated_at, 'checkcircle', '#56C58D', 'Atasan Menyetujui')}
                </>
            )}
            {approval === ApprovalStatus.PENDING && (
                renderTimelineStep(data.created_at, 'checkcircle', '#56C58D', 'Diajukan')
            )}
            {approval === ApprovalStatus.REJECTED && (
                <>
                    {renderTimelineStep(data.created_at, 'checkcircle', '#56C58D', 'Diajukan', true)}
                    {renderTimelineStep(data.updated_at, 'closecircle', '#9c4352', 'Ditolak')}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // Loading styles
    loadingContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        gap: 10,
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
        backgroundColor: '#0079AE',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: wp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    refreshText: {
        color: '#fff',
        fontSize: wp('3.5%'),
        fontWeight: '500',
    },

    // Error state styles
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        padding: 50,
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

    // List styles
    scrollContent: {
        flexGrow: 1,
    },
    historyItem: {
        backgroundColor: '#fff',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        padding: 15,
        backgroundColor: '#f5e4ea',
        borderRadius: wp('50%'),
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemInfo: {
        flex: 1,
    },
    itemDate: {
        fontSize: wp('3%'),
        color: '#666',
    },
    itemStatus: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: wp('3.5%'),
    },

    // Modal styles
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 22,
        borderTopStartRadius: wp('2%'),
        borderTopEndRadius: wp('2%'),
        gap: 20,
    },
    modalTitle: {
        color: '#000',
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    detailLabels: {
        marginRight: 25,
    },
    detailValues: {
        flex: 1,
    },
    detailLabel: {
        color: '#000',
        fontSize: wp('3.5%'),
        marginBottom: 5,
    },
    detailValue: {
        color: '#000',
        fontSize: wp('3.5%'),
        marginBottom: 5,
    },

    // Timeline styles
    timelineContainer: {
        flexDirection: 'row',
        width: '65%',
        alignSelf: 'center',
    },
    timelineStep: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        height: wp('12%'),
    },
    timelineIcon: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        height: wp('12%'),
    },
    timelineLine: {
        height: 65,
        width: 1,
        backgroundColor: '#000',
        marginTop: 5,
    },
    timelineDate: {
        color: '#000',
        fontSize: wp('3%'),
        textAlign: 'center',
    },
    timelineLabel: {
        color: '#000',
        fontSize: wp('3%'),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});