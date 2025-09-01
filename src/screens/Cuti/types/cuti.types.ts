export interface CutiData {
    id_cuti: string;
    periode: string;
    nik: number;
    tanggal_berlaku: Date;
    tanggal_berakhir: Date;
    hak_cuti: number;
    sisa_hutang: number;
    saldo: number;
    aktif: number;
}

export interface KartuCutiProps {
    id_cuti: string;
    tanggal_berakhir: string;
    saldo: number;
    hak_cuti: number;
    aktif: boolean;
}

export interface CutiFormValues {
    telp: string;
    alamat: string;
    keperluan: string;
    tanggalDari: Date;
    tanggalSampai: Date;
    tanggalDariValue: string;
    tanggalSampaiValue: string;
    valuePIC: number;
    valueAtasan: number;
}

export interface CutiFormState {
    tanggalDariShow: boolean;
    tanggalSampaiShow: boolean;
    totalHariLibur: number;
}

export interface CutiHistoryData {
    tanggal_mulai: string;
    tanggal_berakhir: string;
    total_hari: number;
    alasan: string;
    alamat_cuti: string;
    approval: number;
    created_at: string;
    updated_at: string;
    tipe_cuti: string;
}

export interface CutiSaldoInfo {
    maxValue: number;
    percentage: number;
    terpakai: number;
}

export interface CreateCutiRequest {
    id_cuti: string;
    tanggal_mulai: Date;
    tanggal_berakhir: Date;
    tipe_cuti: string;
    alasan: string;
    alamat_cuti: string;
    pic: number;
    atasan: number;
    no_telepon: string;
}

// Enums for better type safety
export enum ApprovalStatus {
    APPROVED = 0,
    APPROVED_BY_SUPERVISOR = 1,
    PENDING = 2,
    REJECTED = 3,
}

export const ApprovalStatusText = {
    [ApprovalStatus.APPROVED]: 'Pengajuan telah disetujui',
    [ApprovalStatus.APPROVED_BY_SUPERVISOR]: 'Telah disetujui atasan',
    [ApprovalStatus.PENDING]: 'Sedang diajukan',
    [ApprovalStatus.REJECTED]: 'Pengajuan ditolak',
};

export const ApprovalStatusColor = {
    [ApprovalStatus.APPROVED]: '#56C58D',
    [ApprovalStatus.APPROVED_BY_SUPERVISOR]: '#d9ce57',
    [ApprovalStatus.PENDING]: '#d9ce57',
    [ApprovalStatus.REJECTED]: '#9c4352',
};

export const ApprovalStatusIcon = {
    [ApprovalStatus.APPROVED]: 'checkcircle',
    [ApprovalStatus.APPROVED_BY_SUPERVISOR]: 'minuscircle',
    [ApprovalStatus.PENDING]: 'minuscircle',
    [ApprovalStatus.REJECTED]: 'closecircle',
};

// Component Props Types
export interface CutiFormHeaderProps {
    saldo: number;
}

export interface CutiSaldoDisplayProps {
    saldoInfo: CutiSaldoInfo;
    isLoading: boolean;
}

export interface CutiCardListProps {
    kartuCuti: KartuCutiProps[];
    onCardPress: (id_cuti: string) => void;
}

export interface CutiHistoryItemProps {
    item: CutiHistoryData;
    onPress: (item: CutiHistoryData) => void;
}

export interface CutiDetailModalProps {
    isVisible: boolean;
    data: CutiHistoryData | null;
    onClose: () => void;
}

export interface CutiMenuProps {
    id_cuti: string;
    onPengajuanPress: () => void;
    onHistoryPress: () => void;
}