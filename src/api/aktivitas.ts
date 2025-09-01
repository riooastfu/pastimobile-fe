import z from 'zod';
import api from "../services/api";
import { laporanHarianSchema, laporanKesehatanSchema } from '../schema/aktivitas-schema';
import { ApiResponse } from './types';

export const getlaporanHarianById = async (id_laporan: string): Promise<ApiResponse> => {
    const response = await api.get(`/aktivitas/harian/${id_laporan}`);
    return response.data;
}

export const getLaporanKesehatanByNik = async (karyawanId: number): Promise<ApiResponse> => {
    const response = await api.get(`/aktivitas/kesehatan/nik/${karyawanId}`);
    return response.data;
}

export const getLaporanKesehatanById = async (id_laporan: string): Promise<ApiResponse> => {
    const response = await api.get(`/aktivitas/kesehatan/id/${id_laporan}`);
    return response.data;
}

export const getLaporanKesehatanByTanggal = async (nik: number, tanggal: Date): Promise<ApiResponse> => {
    const response = await api.post(`/aktivitas/kesehatan/tanggal`, { nik, tanggal });
    return response.data;
}

export const createLaporanHarian = async (data: z.infer<typeof laporanHarianSchema>): Promise<ApiResponse> => {
    const response = await api.post(`/aktivitas/harian`, data);
    return response.data;
}

export const createLaporanKesehatan = async (data: z.infer<typeof laporanKesehatanSchema>): Promise<ApiResponse> => {
    const response = await api.post(`/aktivitas/kesehatan`, data);
    return response.data;
}

export const deleteLaporanHarianByNoUrut = async (id_laporan: string, no_urut: number): Promise<ApiResponse> => {
    const response = await api.delete(`/aktivitas/harian/no_urut`, {
        data: { id_laporan, no_urut }
    });
    return response.data;
}

export const deleteLaporanHarianById = async (id_laporan: string): Promise<ApiResponse> => {
    const response = await api.delete(`/aktivitas/harian/${id_laporan}`);
    return response.data;
}

export const deleteLaporanKesehatanById = async (id_laporan: string): Promise<ApiResponse> => {
    const response = await api.delete(`/aktivitas/kesehatan/${id_laporan}`);
    return response.data;
}