import moment from 'moment/min/moment-with-locales';
import { AbsenItemRenderProps } from '../types/absensi.types';

export const calculateWorkingHours = (jamMasuk: string, jamPulang: string): string => {
    if (jamMasuk === jamPulang) return '0h 0m';

    const masuk = moment(jamMasuk, 'HH:mm:ss');
    const pulang = moment(jamPulang, 'HH:mm:ss');

    // Handle next day scenario
    if (pulang.isBefore(masuk)) {
        pulang.add(1, 'day');
    }

    const duration = moment.duration(pulang.diff(masuk));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    return `${hours}h ${minutes}m`;
};

export const calculateWorkingMinutes = (jamMasuk: string, jamPulang: string): number => {
    if (jamMasuk === jamPulang) return 0;

    const masuk = moment(jamMasuk, 'HH:mm:ss');
    const pulang = moment(jamPulang, 'HH:mm:ss');

    if (pulang.isBefore(masuk)) {
        pulang.add(1, 'day');
    }

    return moment.duration(pulang.diff(masuk)).asMinutes();
};

export const getStatusStyle = (jamMasuk: string) => {
    const isOnTime = jamMasuk <= '08:00:59';
    return {
        backgroundColor: isOnTime ? '#E8F5E8' : '#FFF0F0',
        borderColor: isOnTime ? '#4CAF50' : '#FF6B6B',
        color: isOnTime ? '#2E7D32' : '#C62828',
    };
};

export const getStatusText = (jamMasuk: string): string => {
    return jamMasuk <= '08:00:59' ? 'Tepat Waktu' : 'Terlambat';
};

export const sortAbsensiByDate = (data: AbsenItemRenderProps[]): AbsenItemRenderProps[] => {
    return data.sort((a, b) =>
        moment(b.tgl_masuk).valueOf() - moment(a.tgl_masuk).valueOf()
    );
};

export const formatDate = (date: string): string => {
    return moment(date).locale('id').format('dddd, DD MMM YYYY');
};

export const isOnTime = (jamMasuk: string): boolean => {
    return jamMasuk <= '08:00:59';
};

export const hasCheckedOut = (jamMasuk: string, jamPulang: string): boolean => {
    return jamMasuk !== jamPulang;
};