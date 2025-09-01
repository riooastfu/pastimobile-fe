import { useCallback, useEffect, useState, useMemo } from 'react';
import { Alert } from 'react-native';
import moment from 'moment/min/moment-with-locales';
import { getAbsensiByPin } from '../../../api/absensi';
import { useAuth } from '../../../providers/auth-provider';
import { AbsenItemRenderProps, AbsensiContentProps, AttendanceStats, FilterType } from '../types/absensi.types';
import { calculateWorkingMinutes, sortAbsensiByDate } from '../utils/absensi.utils';
import { showAlert } from '../../../utils/alert-helper';

export const useAbsensiReport = () => {
    const { userData } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [absensi, setAbsensi] = useState<AbsenItemRenderProps[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('month');

    // Calculate attendance statistics with memoization
    const attendanceStats = useMemo((): AttendanceStats => {
        if (absensi.length === 0) {
            return {
                totalDays: 0,
                onTimeCount: 0,
                lateCount: 0,
                onTimePercentage: 0,
                totalWorkingHours: '0h 0m',
                averageWorkingHours: '0h 0m',
            };
        }

        const onTimeCount = absensi.filter(item => item.jam_masuk <= '08:00:59').length;
        const lateCount = absensi.length - onTimeCount;
        const onTimePercentage = Math.round((onTimeCount / absensi.length) * 100);

        const totalMinutes = absensi.reduce((total, item) => {
            return total + calculateWorkingMinutes(item.jam_masuk, item.jam_pulang);
        }, 0);

        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = Math.floor(totalMinutes % 60);
        const totalWorkingHours = `${totalHours}h ${remainingMinutes}m`;

        const averageMinutes = totalMinutes / absensi.length;
        const avgHours = Math.floor(averageMinutes / 60);
        const avgRemainingMinutes = Math.floor(averageMinutes % 60);
        const averageWorkingHours = `${avgHours}h ${avgRemainingMinutes}m`;

        return {
            totalDays: absensi.length,
            onTimeCount,
            lateCount,
            onTimePercentage,
            totalWorkingHours,
            averageWorkingHours,
        };
    }, [absensi]);

    // Filter data based on selected filter
    const filteredData = useMemo(() => {
        if (selectedFilter === 'all') return absensi;

        const now = moment();
        return absensi.filter(item => {
            const itemDate = moment(item.tgl_masuk);
            if (selectedFilter === 'week') {
                return itemDate.isSame(now, 'week');
            } else if (selectedFilter === 'month') {
                return itemDate.isSame(now, 'month');
            }
            return true;
        });
    }, [absensi, selectedFilter]);

    const fetchData = useCallback(async () => {
        if (!isRefresh) setIsLoading(true);

        try {
            const absensiResponse = await getAbsensiByPin(userData.pin_absen);

            if (absensiResponse.status === 'success') {
                const sortedData = sortAbsensiByDate(absensiResponse.data);
                setAbsensi(sortedData);
            } else {
                showAlert.error('Gagal memuat data absensi.');
                setAbsensi([]);
            }
        } catch (error: any) {
            showAlert.error('Terjadi kesalahan saat memuat data absensi.');
            setAbsensi([]);
        } finally {
            setIsLoading(false);
            setIsRefresh(false);
        }
    }, [userData.pin_absen, isRefresh]);

    const onRefresh = useCallback(async () => {
        setIsRefresh(true);
        await fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        isLoading,
        isRefresh,
        absensi,
        filteredData,
        attendanceStats,
        selectedFilter,
        setSelectedFilter,
        onRefresh,
    };
};