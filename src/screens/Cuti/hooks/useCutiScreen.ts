import { useCallback, useEffect, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../../providers/auth-provider';
import { RootStackParamList } from '../../../types';
import { getCutiUserByNik } from '../../../api/cuti';
import { KartuCutiProps, CutiSaldoInfo } from '../types/cuti.types';
import { useLoading } from '../../../hooks/use-loading';

export const useCutiScreen = () => {
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { isLoading, showLoading, hideLoading } = useLoading();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [kartuCuti, setKartuCuti] = useState<KartuCutiProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saldoInfo, setSaldoInfo] = useState<CutiSaldoInfo>({
        maxValue: 100,
        percentage: 50,
        terpakai: 0,
    });

    const calculateSaldoInfo = useCallback((cutiData: any[]) => {
        let totalSaldo = 0;
        let totalHakCuti = 0;

        // Filter only inactive cards (aktif === false) for calculation
        const activeData = cutiData.filter(item => item.aktif === false);

        for (const item of activeData) {
            // Ensure saldo is not negative
            const saldo = item.saldo < 0 ? 0 : item.saldo;
            totalSaldo += saldo;
            totalHakCuti += item.hak_cuti;
        }

        const terpakai = totalHakCuti - totalSaldo;

        return {
            maxValue: totalHakCuti === 0 ? 0 : totalHakCuti,
            percentage: totalSaldo,
            terpakai,
        };
    }, []);

    const fetchKartuCuti = useCallback(async () => {
        if (!isRefreshing) showLoading();
        setError(null);

        try {
            const response = await getCutiUserByNik(userData.karyawanid);

            if (response.status === 'success') {
                const cutiData = response.data;
                setKartuCuti(cutiData);

                // Calculate saldo information
                const saldoCalculation = calculateSaldoInfo(cutiData);
                setSaldoInfo(saldoCalculation);

                console.log('Cuti data loaded:', {
                    total: saldoCalculation.maxValue,
                    sisa: saldoCalculation.percentage,
                    terpakai: saldoCalculation.terpakai,
                });
            } else {
                console.error('Failed to fetch cuti data:', response.message);
                setError('Gagal memuat data cuti');
                setKartuCuti([]);
                setSaldoInfo({ maxValue: 0, percentage: 0, terpakai: 0 });
            }
        } catch (error) {
            console.error('Error fetching kartu cuti:', error);
            setError('Terjadi kesalahan saat memuat data cuti');
            setKartuCuti([]);
            setSaldoInfo({ maxValue: 0, percentage: 0, terpakai: 0 });
        } finally {
            hideLoading();
            setIsRefreshing(false);
        }
    }, [userData.karyawanid, calculateSaldoInfo, isRefreshing]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchKartuCuti();
    }, [fetchKartuCuti]);

    const onCardPress = useCallback((id_cuti: string) => {
        navigation.navigate('CutiMenu', { id_cuti });
    }, [navigation]);

    // Check if user has any cuti cards
    const hasValidCuti = kartuCuti.length > 0;

    // Check if there are any active (non-expired) cards
    const hasActiveCuti = kartuCuti.some(item => !item.aktif);

    // Initialize data
    useEffect(() => {
        fetchKartuCuti();
    }, [fetchKartuCuti]);

    return {
        // State
        isLoading,
        isRefreshing,
        kartuCuti,
        saldoInfo,
        hasValidCuti,
        hasActiveCuti,
        error,

        // Actions
        onRefresh,
        onCardPress,

        // Utils
        calculateSaldoInfo,
    };
};