export interface AbsenItemRenderProps {
    pin: string;
    tgl_masuk: string;
    jam_masuk: string;
    jam_pulang: string;
}

export interface AttendanceStats {
    totalDays: number;
    onTimeCount: number;
    lateCount: number;
    onTimePercentage: number;
    totalWorkingHours: string;
    averageWorkingHours: string;
}

export type FilterType = 'all' | 'week' | 'month';

export interface SummaryCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
    color: string;
}

export interface FilterButtonProps {
    filter: FilterType;
    title: string;
    isSelected: boolean;
    onPress: (filter: FilterType) => void;
}

export interface AbsensiContentProps {
    data: AbsenItemRenderProps[];
    stats: AttendanceStats;
    selectedFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export interface TimeDisplayProps {
    time: string;
    label: string;
    icon: string;
    iconColor: string;
    backgroundColor: string;
    isActive?: boolean;
}

export interface WorkingHoursProps {
    workingHours: string;
    hasCheckOut: boolean;
}