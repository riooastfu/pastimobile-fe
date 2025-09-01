import { useCallback, useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import { getDetailCutiUserById } from '../../../api/cuti';
import { CutiHistoryData } from '../types/cuti.types';
import { useLoading } from '../../../hooks/use-loading';

type CutiHistoryRouteProps = RouteProp<RootStackParamList, 'CutiHistory'>;

export const useCutiHistory = () => {
    const route = useRoute<CutiHistoryRouteProps>();
    const { id_cuti } = route.params;
    const { isLoading, showLoading, hideLoading } = useLoading();

    const [detailCuti, setDetailCuti] = useState<CutiHistoryData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isRefreshing) showLoading();
        setError(null);

        try {
            if (!id_cuti) {
                setError('ID cuti tidak ditemukan');
                return;
            }

            const response = await getDetailCutiUserById(id_cuti);
            
            if (response.status === 'success') {
                setDetailCuti([]);
            } else {
                setError('Gagal memuat data riwayat cuti');
            }
        } catch (error) {
            console.error('Error fetching cuti history:', error);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            hideLoading();
            setIsRefreshing(false);
        }
    }, [id_cuti, isRefreshing]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        // State
        isLoading,
        detailCuti,
        error,
        isRefreshing,

        // Actions
        onRefresh,
    };
};