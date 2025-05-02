export interface User {
    namauser: string;
    karyawanid: number;
    nik_kantor: string;
    pin_absen: number;
    nama_karyawan: string;
    id_role: number;
    jabatan: string;
    departemen: string;
    pt: string;
    lokasi: string;
    status: string;
    golongan: string;
}

export interface KaryawanUlangTahun {
    nama_karyawan: string;
    tanggal_lahir: string;
    departemen_desc: string;
}

export type RootStackParamList = {
    AbsensiCamera: { position: { latitude: number, longitude: number, } }
    AbsensiReport: undefined,
    Absensi: undefined

    Cuti: undefined
    CutiMenu: { id_cuti: string }
    CutiHistory: { id_cuti: string }
    CutiPengajuan: { id_cuti: string }

    Aktivitas: undefined
    ActivityTambah: undefined
    ActivityEdit: { id_laporan: string }

    ResetPassword: undefined
}

export const RandomColor = ['#D9E9EC', '#ECD9E1', '#ECECD3', '#D3ECD6'];

export type DropDownType = {
    label: string,
    value: string
}