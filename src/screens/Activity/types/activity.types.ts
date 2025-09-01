export interface LaporanKesehatan {
    id_laporan: string;
    tanggal: Date;
    jam_masuk: number;
    jam_pulang: number;
    status_kerja: string;
}

export interface LaporanHarian {
    no_urut: number;
    id_laporan: string;
    nama_karyawan: string;
    uraian_kegiatan: string;
    target_harian: string;
    kategori: string;
    lokasi_kerja: string;
}

export interface DateFilterState {
    date: Date;
    dateValue: string;
    showDatePicker: boolean;
}

export interface ActivityContentProps {
    data: LaporanKesehatan[];
    isRefreshing: boolean;
    onRefresh: () => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
    onEdit: (id: string) => void;
    deleteError?: string | null;
    onDismissDeleteError?: () => void;
}

export interface ActivitySearchHeaderProps {
    dateValue: string;
    onDateChange: (date?: Date) => void;
    onSearch: () => void;
}

export interface ActivityItemProps {
    item: LaporanKesehatan;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export interface ActivityFormData {
    tanggal: Date;
    jamMasuk: Date;
    jamPulang: Date;
    statusKerja: string;
}

export interface ActivityFormValues {
    date: Date;
    jamMasuk: Date;
    jamPulang: Date;
    dateValue: string;
    jamMasukValue: string;
    jamPulangValue: string;
    statusValue: string;
}

export interface ActivityFormState {
    showDatePicker: boolean;
    showJamMasukPicker: boolean;
    showJamPulangPicker: boolean;
}

export interface CreateActivityRequest {
    nik: number;
    nik_kantor: string;
    tanggal: string;
    jam_masuk: string;
    jam_pulang: string;
    status_kerja: string;
    kesehatan_nama: string;
    kesehatan_dept: string;
    kesehatan_jabatan: string;
    kesehatan_pt: string;
}

export interface CreateLaporanHarianRequest {
    id_laporan: string;
    nik: string;
    nik_kantor: string;
    nama_karyawan: string;
    jabatan_karyawan: string;
    dept_karyawan: string;
    uraian_kegiatan: string;
    target_harian: string;
    pt: string;
    kategori: string;
    lokasi_kerja: string;
}

export interface DropDownOption {
    label: string;
    value: string;
}

export const STATUS_WORK_OPTIONS: DropDownOption[] = [
    { label: 'Masuk', value: 'Masuk' },
    { label: 'Izin', value: 'Izin' },
    { label: 'Cuti', value: 'Cuti' },
    { label: 'Sakit', value: 'Sakit' },
    { label: 'Dinas', value: 'Dinas' },
    { label: 'Kerja di Rumah', value: 'Kerja di Rumah' },
    { label: 'Libur', value: 'Libur' },
];

export const KATEGORI_OPTIONS: DropDownOption[] = [
    { label: 'Rutin', value: 'Rutin' },
    { label: 'Projek', value: 'Projek' },
];

export const HASIL_OPTIONS: DropDownOption[] = [
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Berlanjut', value: 'Berlanjut' },
];