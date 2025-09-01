import { useCallback, useEffect, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import moment from 'moment/min/moment-with-locales';
import { useAuth } from '../../../providers/auth-provider';
import { RootStackParamList } from '../../../types';
import {
    deleteLaporanKesehatanById,
    getLaporanKesehatanByNik,
    getLaporanKesehatanByTanggal,
} from '../../../api/aktivitas';
import { DateFilterState, LaporanKesehatan } from '../types/activity.types';

const INITIAL_DATE_FILTER: DateFilterState = {
    date: new Date(),
    dateValue: '',
    showDatePicker: false,
};

export const useActivityScreen = () => {
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [laporanKesehatan, setLaporanKesehatan] = useState<LaporanKesehatan[]>([]);
    const [dateFilter, setDateFilter] = useState<DateFilterState>(INITIAL_DATE_FILTER);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchAllLaporan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getLaporanKesehatanByNik(userData.karyawanid);
            if (res.status === 'success') {
                setLaporanKesehatan(res.data);
            } else {
                setError(res.message || 'Gagal memuat data aktivitas');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Terjadi kesalahan saat memuat data aktivitas');
        } finally {
            setIsLoading(false);
        }
    }, [userData.karyawanid]);

    const fetchLaporanByDate = useCallback(async (selectedDate: Date) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getLaporanKesehatanByTanggal(userData.karyawanid, selectedDate);
            if (res.status === 'success') {
                setLaporanKesehatan(res.data);
            } else {
                setError(res.message || 'Gagal memuat data');
            }
        } catch (error: any) {
            console.error('Fetch by date error:', error);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            setIsLoading(false);
        }
    }, [userData.karyawanid]);

    const onDateFilterChange = useCallback((selectedDate?: Date) => {
        if (selectedDate) {
            const newDateStr = moment(selectedDate).format('YYYY-MM-DD');
            setDateFilter({
                date: selectedDate,
                dateValue: newDateStr,
                showDatePicker: false,
            });
            fetchLaporanByDate(selectedDate);
        } else {
            setDateFilter(INITIAL_DATE_FILTER);
            fetchAllLaporan();
        }
    }, [fetchLaporanByDate, fetchAllLaporan]);

    const onDelete = useCallback(async (id: string) => {
        setIsLoading(true);
        setDeleteError(null);
        try {
            const res = await deleteLaporanKesehatanById(id);
            if (res.status === 'success') {
                setLaporanKesehatan(prev =>
                    prev.filter(item => item.id_laporan !== id)
                );
            } else {
                setDeleteError(res.message || 'Gagal menghapus aktivitas');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setDeleteError('Terjadi kesalahan saat menghapus');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchAllLaporan();
        setDateFilter(INITIAL_DATE_FILTER);
        setIsRefreshing(false);
    }, [fetchAllLaporan]);

    const onAddActivity = useCallback(() => {
        navigation.navigate('ActivityTambah');
    }, [navigation]);

    const onEditActivity = useCallback((id_laporan: string) => {
        navigation.navigate('ActivityEdit', { id_laporan });
    }, [navigation]);

    // Initial data fetch
    useEffect(() => {
        fetchAllLaporan();
    }, [fetchAllLaporan]);

    return {
        isLoading,
        isRefreshing,
        laporanKesehatan,
        dateFilter,
        error,
        deleteError,
        onDateFilterChange,
        onRefresh,
        onDelete,
        onAddActivity,
        onEditActivity,
        clearDeleteError: () => setDeleteError(null),
    };
};