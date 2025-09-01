import React from 'react';
import {
    FlatList,
    ListRenderItem,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment/min/moment-with-locales';
import {
    AbsenItemRenderProps,
    AbsensiContentProps,
    FilterButtonProps,
    SummaryCardProps,
    TimeDisplayProps,
    WorkingHoursProps,
} from '../types/absensi.types';
import {
    calculateWorkingHours,
    formatDate,
    getStatusStyle,
    getStatusText,
    hasCheckedOut,
} from '../utils/absensi.utils';
import {
    responsiveWidth,
    spacing,
    fontSizes,
    radius,
} from '../../../utils/responsive';
import Skeleton from '../../../components/skeleton';

// Summary Card Component
export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color,
}) => (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
        <View style={styles.summaryCardContent}>
            <Icon name={icon} size={20} color={color} />
            <View style={styles.summaryCardText}>
                <Text style={styles.summaryCardTitle}>{title}</Text>
                <Text style={[styles.summaryCardValue, { color }]}>{value}</Text>
                {subtitle && <Text style={styles.summaryCardSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    </View>
);

// Filter Button Component
export const FilterButton: React.FC<FilterButtonProps> = ({
    filter,
    title,
    isSelected,
    onPress,
}) => (
    <TouchableOpacity
        style={[
            styles.filterButton,
            isSelected && styles.filterButtonActive,
        ]}
        onPress={() => onPress(filter)}
    >
        <Text
            style={[
                styles.filterButtonText,
                isSelected && styles.filterButtonTextActive,
            ]}
        >
            {title}
        </Text>
    </TouchableOpacity>
);

// Time Display Component
export const TimeDisplay: React.FC<TimeDisplayProps> = ({
    time,
    label,
    icon,
    iconColor,
    backgroundColor,
    isActive = true,
}) => (
    <View style={styles.timeRow}>
        <View style={[styles.timeIcon, { backgroundColor }]}>
            <Icon name={icon} size={14} color={iconColor} />
        </View>
        <View>
            <Text style={styles.timeLabel}>{label}</Text>
            <Text style={isActive ? styles.timeValue : styles.timeValueInactive}>
                {time}
            </Text>
        </View>
    </View>
);

// Working Hours Component
export const WorkingHours: React.FC<WorkingHoursProps> = ({
    workingHours,
    hasCheckOut,
}) => (
    <View style={styles.workingHoursSection}>
        <Text style={styles.workingHoursLabel}>Jam Kerja</Text>
        <Text style={styles.workingHoursValue}>
            {hasCheckOut ? workingHours : 'Belum selesai'}
        </Text>
    </View>
);

// Enhanced Attendance Item Renderer
export const AbsensiItem: React.FC<{ item: AbsenItemRenderProps }> = ({ item }) => {
    const workingHours = calculateWorkingHours(item.jam_masuk, item.jam_pulang);
    const statusStyle = getStatusStyle(item.jam_masuk);
    const statusText = getStatusText(item.jam_masuk);
    const isCheckedOut = hasCheckedOut(item.jam_masuk, item.jam_pulang);

    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <View style={styles.dateSection}>
                    <Icon name="calendar" size={16} color="#6DA6BF" />
                    <Text style={styles.dateText}>{formatDate(item.tgl_masuk)}</Text>
                </View>
                <View style={[styles.statusBadge, statusStyle]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>
                        {statusText}
                    </Text>
                </View>
            </View>

            <View style={styles.itemBody}>
                <View style={styles.timeSection}>
                    <TimeDisplay
                        time={item.jam_masuk}
                        label="Masuk"
                        icon="login"
                        iconColor="#4CAF50"
                        backgroundColor="#E8F5E8"
                    />

                    {isCheckedOut ? (
                        <TimeDisplay
                            time={item.jam_pulang}
                            label="Keluar"
                            icon="logout"
                            iconColor="#FF6B6B"
                            backgroundColor="#FFF0F0"
                        />
                    ) : (
                        <TimeDisplay
                            time="--:--:--"
                            label="Belum Checkout"
                            icon="clockcircleo"
                            iconColor="#FF9800"
                            backgroundColor="#FFF3E0"
                            isActive={false}
                        />
                    )}
                </View>

                <WorkingHours workingHours={workingHours} hasCheckOut={isCheckedOut} />
            </View>
        </View>
    );
};

// Empty State Component
export const EmptyState: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
            <Icon name="calendar" size={60} color="#E0E0E0" />
        </View>
        <Text style={styles.emptyTitle}>Belum Ada Data Absensi</Text>
        <Text style={styles.emptySubtitle}>
            Data absensi Anda akan muncul di sini setelah Anda melakukan check-in
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Icon name="reload1" size={16} color="#6DA6BF" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
    </View>
);

// Loading Screen Component
export const LoadingScreen: React.FC = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Cards Skeleton */}
        <View style={styles.summaryContainer}>
            {[1, 2, 3, 4].map((item) => (
                <View
                    key={`summary-skeleton-${item}`}
                    style={[styles.summaryCard, { borderLeftColor: '#E0E0E0' }]}
                >
                    <Skeleton width="100%" height={60} style={{ borderRadius: 8 }} />
                </View>
            ))}
        </View>

        {/* Filter Buttons Skeleton */}
        <View style={styles.filterContainer}>
            {[1, 2, 3].map((item) => (
                <Skeleton
                    key={`filter-skeleton-${item}`}
                    width={80}
                    height={32}
                    style={{ borderRadius: 16 }}
                />
            ))}
        </View>

        {/* List Skeleton */}
        {[1, 2, 3, 4, 5].map((item) => (
            <SkeletonItem key={`skeleton-${item}`} />
        ))}
    </ScrollView>
);

// Skeleton Item Component
const SkeletonItem: React.FC = () => (
    <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
            <View style={styles.dateSection}>
                <Skeleton width={16} height={16} style={{ borderRadius: 8 }} />
                <Skeleton
                    width={responsiveWidth(40)}
                    height={16}
                    style={{ borderRadius: 8 }}
                />
            </View>
            <Skeleton width={80} height={24} style={{ borderRadius: 12 }} />
        </View>
        <View style={styles.itemBody}>
            <View style={styles.timeSection}>
                {[1, 2].map((item) => (
                    <View key={item} style={styles.timeRow}>
                        <Skeleton width={32} height={32} style={{ borderRadius: 16 }} />
                        <View>
                            <Skeleton
                                width={50}
                                height={14}
                                style={{ borderRadius: 7, marginBottom: 4 }}
                            />
                            <Skeleton width={70} height={16} style={{ borderRadius: 8 }} />
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.workingHoursSection}>
                <Skeleton
                    width={60}
                    height={14}
                    style={{ borderRadius: 7, marginBottom: 4 }}
                />
                <Skeleton width={50} height={18} style={{ borderRadius: 9 }} />
            </View>
        </View>
    </View>
);

// Main Content Component
export const AbsensiContent: React.FC<AbsensiContentProps> = ({
    data,
    stats,
    selectedFilter,
    onFilterChange,
    isRefreshing,
    onRefresh,
}) => {
    const renderItem: ListRenderItem<AbsenItemRenderProps> = ({ item }) => (
        <AbsensiItem item={item} />
    );

    return (
        <View style={{ flex: 1 }}>
            {/* Summary Statistics */}
            {data.length > 0 && (
                <View style={styles.summaryContainer}>
                    <SummaryCard
                        title="Total Hari"
                        value={stats.totalDays.toString()}
                        subtitle="hari kerja"
                        icon="calendar"
                        color="#2196F3"
                    />
                    <SummaryCard
                        title="Ketepatan"
                        value={`${stats.onTimePercentage}%`}
                        subtitle={`${stats.onTimeCount} tepat waktu`}
                        icon="checkcircle"
                        color="#4CAF50"
                    />
                    <SummaryCard
                        title="Total Jam Kerja"
                        value={stats.totalWorkingHours}
                        subtitle={`Rata-rata ${stats.averageWorkingHours}`}
                        icon="clockcircle"
                        color="#FF9800"
                    />
                    <SummaryCard
                        title="Terlambat"
                        value={stats.lateCount.toString()}
                        subtitle="kali terlambat"
                        icon="exclamationcircle"
                        color="#FF6B6B"
                    />
                </View>
            )}

            {/* Filter Buttons */}
            {data.length > 0 && (
                <View style={styles.filterContainer}>
                    <FilterButton
                        filter="week"
                        title="Minggu Ini"
                        isSelected={selectedFilter === 'week'}
                        onPress={onFilterChange}
                    />
                    <FilterButton
                        filter="month"
                        title="Bulan Ini"
                        isSelected={selectedFilter === 'month'}
                        onPress={onFilterChange}
                    />
                    <FilterButton
                        filter="all"
                        title="Semua"
                        isSelected={selectedFilter === 'all'}
                        onPress={onFilterChange}
                    />
                </View>
            )}

            {/* Attendance List */}
            {data.length === 0 ? (
                <EmptyState onRefresh={onRefresh} />
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) =>
                        `${item.tgl_masuk}-${item.jam_masuk}-${index}`
                    }
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: spacing.lg,
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing.md,
        gap: spacing.sm,
    },
    summaryCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#fff',
        borderRadius: radius.md,
        padding: spacing.md,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    summaryCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    summaryCardText: {
        flex: 1,
    },
    summaryCardTitle: {
        fontSize: fontSizes.sm,
        color: '#666',
        marginBottom: 2,
    },
    summaryCardValue: {
        fontSize: fontSizes.lg,
        fontWeight: 'bold',
    },
    summaryCardSubtitle: {
        fontSize: fontSizes.xs,
        color: '#999',
        marginTop: 2,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        gap: spacing.sm,
    },
    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterButtonActive: {
        backgroundColor: '#6DA6BF',
        borderColor: '#6DA6BF',
    },
    filterButtonText: {
        fontSize: fontSizes.sm,
        color: '#666',
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    itemContainer: {
        backgroundColor: '#fff',
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: radius.md,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    dateText: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        borderWidth: 1,
    },
    statusText: {
        fontSize: fontSizes.xs,
        fontWeight: '600',
    },
    itemBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    timeSection: {
        flex: 1,
        gap: spacing.md,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    timeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: fontSizes.sm,
        color: '#666',
        marginBottom: 2,
    },
    timeValue: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        color: '#333',
    },
    timeValueInactive: {
        fontSize: fontSizes.md,
        fontWeight: '600',
        color: '#999',
    },
    workingHoursSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    workingHoursLabel: {
        fontSize: fontSizes.sm,
        color: '#666',
        marginBottom: 2,
    },
    workingHoursValue: {
        fontSize: fontSizes.md,
        fontWeight: 'bold',
        color: '#6DA6BF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: fontSizes.lg,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: fontSizes.md,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#fff',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: '#6DA6BF',
        gap: spacing.sm,
    },
    refreshButtonText: {
        fontSize: fontSizes.md,
        color: '#6DA6BF',
        fontWeight: '600',
    },
});