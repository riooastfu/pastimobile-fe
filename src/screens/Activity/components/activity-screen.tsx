import React, { useState, useEffect } from 'react';
import {
    FlatList,
    ListRenderItem,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment/min/moment-with-locales';
import {
    ActivityContentProps,
    ActivityItemProps,
    ActivitySearchHeaderProps,
    LaporanKesehatan,
} from '../types/activity.types';
import Skeleton from '../../../components/skeleton';
import { responsiveHeight } from '../../../utils/responsive';

// Search Header Component
export const ActivitySearchHeader: React.FC<ActivitySearchHeaderProps> = ({
    dateValue,
    onDateChange,
    onSearch,
}) => {
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            onDateChange(selectedDate);
        } else {
            onDateChange(undefined);
        }
    };

    return (
        <View style={{ padding: 15, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 15, position: 'relative' }}>
                <TouchableOpacity onPress={onSearch} style={{ padding: 5 }}>
                    <Icon name="search1" size={wp('6%')} color="#666" />
                </TouchableOpacity>

                <TextInput
                    style={{
                        flex: 1,
                        height: wp('10%'),
                        borderWidth: wp('0.1%'),
                        borderRadius: wp('1%'),
                        borderColor: '#ddd',
                        paddingHorizontal: 10,
                        paddingRight: wp('12%'),
                    }}
                    editable={false}
                    placeholder="Cari berdasarkan tanggal"
                    value={dateValue}
                />

                <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
                    <View style={{ position: 'absolute', right: 7, bottom: 7, padding: 5 }}>
                        <Icon name="calendar" size={wp('6%')} color="#666" />
                    </View>
                </TouchableWithoutFeedback>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date(2200, 12, 31)}
                        minimumDate={new Date(2005, 1, 1)}
                    />
                )}
            </View>
        </View>
    );
};

// Activity Item Component
export const ActivityItem: React.FC<ActivityItemProps> = ({ item, onEdit, onDelete }) => (
    <View
        style={{
            padding: 15,
            borderWidth: wp('0.1%'),
            marginBottom: 10,
            borderColor: '#ddd',
            flexDirection: 'row',
            columnGap: 15,
            borderRadius: wp('1%'),
            backgroundColor: '#fff',
        }}
    >
        <TouchableOpacity
            onPress={() => onEdit(item.id_laporan)}
            style={{ flex: 1, flexDirection: 'row', columnGap: 15 }}
        >
            <View
                style={{
                    borderWidth: wp('0.1%'),
                    borderColor: '#ddd',
                    borderRadius: wp('2%'),
                    overflow: 'hidden',
                    minWidth: wp('20%'),
                }}
            >
                <View
                    style={{
                        backgroundColor: '#0079AE',
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: wp('3%') }}>
                        {moment(item.tanggal).locale('id').format('MMM')}
                    </Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 5 }}>
                    <Text style={{ fontSize: wp('2.5%'), color: '#666' }}>
                        {moment(item.tanggal).locale('id').format('ddd')}
                    </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('5%'), color: '#333' }}>
                        {moment(item.tanggal).format('DD')}
                    </Text>
                    <Text style={{ fontSize: wp('2.5%'), color: '#666' }}>
                        {moment(item.tanggal).format('yyyy')}
                    </Text>
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: wp('4%'), color: '#333', marginBottom: 4 }}>
                    {item.status_kerja}
                </Text>
                <Text style={{ fontSize: wp('3%'), color: '#666' }}>
                    {item.jam_masuk} - {item.jam_pulang}
                </Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id_laporan)}>
            <Icon name="delete" size={wp('5%')} color="#FF6B6B" />
        </TouchableOpacity>
    </View>
);

// Add Button
export const AddActivityButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            marginBottom: 15,
            padding: 8,
            borderRadius: wp('1%'),
        }}
    >
        <Icon name="pluscircle" size={wp('4%')} color="#56C58D" />
        <Text style={{ color: '#56C58D', fontWeight: '600' }}>Aktivitas</Text>
    </TouchableOpacity>
);

// Empty State
export const EmptyState: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50, gap: 15 }}>
        <Icon name="frowno" size={wp('10%')} color="#ccc" />
        <Text style={{ fontSize: wp('4%'), color: '#666', textAlign: 'center' }}>
            Belum ada Aktivitas.
        </Text>
        <TouchableOpacity
            onPress={onRefresh}
            style={{
                backgroundColor: '#0079AE',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: wp('2%'),
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
            }}
        >
            <Icon name="reload1" size={wp('4%')} color="#fff" />
            <Text style={{ color: '#fff', fontSize: wp('3.5%'), fontWeight: '500' }}>Muat Ulang</Text>
        </TouchableOpacity>
    </View>
);

// Error State
export const ActivityErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15, padding: 50 }}>
        <Icon name="exclamationcircleo" size={wp('10%')} color="#ff6b6b" />
        <Text style={{ fontSize: wp('4%'), color: '#666', textAlign: 'center', lineHeight: wp('5%') }}>
            {error}
        </Text>
        <TouchableOpacity
            onPress={onRetry}
            style={{
                backgroundColor: '#ff6b6b',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: wp('2%'),
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
            }}
        >
            <Icon name="reload1" size={wp('4%')} color="#fff" />
            <Text style={{ color: '#fff', fontSize: wp('3.5%'), fontWeight: '500' }}>Coba Lagi</Text>
        </TouchableOpacity>
    </View>
);

// Error Banner
export const ActivityErrorBanner: React.FC<{ error: string; onDismiss: () => void }> = ({ error, onDismiss }) => (
    <View
        style={{
            backgroundColor: '#fee',
            padding: 12,
            marginBottom: 15,
            borderRadius: wp('1%'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderLeftWidth: 4,
            borderLeftColor: '#ff6b6b',
        }}
    >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="exclamationcircleo" size={wp('4%')} color="#ff6b6b" />
            <Text style={{ flex: 1, color: '#d32f2f', fontSize: wp('3.2%'), lineHeight: wp('4.2%') }}>{error}</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} style={{ padding: 4 }}>
            <Icon name="close" size={wp('4%')} color="#ff6b6b" />
        </TouchableOpacity>
    </View>
);

// Loading Screen
export const LoadingScreen: React.FC = () => (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15, gap: 15 }}>
        {[1, 2, 3, 4, 5].map((_, i) => (
            <Skeleton key={i} height={responsiveHeight(10)} style={{ alignSelf: 'center' }} />
        ))}
    </View>
);

// Main Content
export const ActivityContent: React.FC<ActivityContentProps> = ({ data, isRefreshing, onRefresh, onDelete, onAdd, onEdit, deleteError, onDismissDeleteError, }) => {
    const [showError, setShowError] = useState(true);

    useEffect(() => {
        setShowError(true);
    }, [deleteError]);

    const renderItem: ListRenderItem<LaporanKesehatan> = ({ item }) => (
        <ActivityItem item={item} onEdit={onEdit} onDelete={onDelete} />
    );

    const handleDismissError = () => {
        setShowError(false);
        onDismissDeleteError?.();
    };

    return (
        <View style={{ flex: 1 }}>
            <AddActivityButton onPress={onAdd} />

            {deleteError && showError && (
                <ActivityErrorBanner error={deleteError} onDismiss={handleDismissError} />
            )}

            {data.length === 0 ? (
                <EmptyState onRefresh={onRefresh} />
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_laporan}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            )}
        </View>
    );
};
