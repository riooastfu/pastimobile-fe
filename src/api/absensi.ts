import z from 'zod'
import api from "../services/api"
import { absenCheckInSchema, absenCheckOutSchema } from '../schema/absensi-schema';
import { ApiResponse } from './types';

export const getAbsensiByPin = async (pin: number): Promise<ApiResponse> => {
    const response = await api.get(`/absensi/${pin}`);
    return response.data;
}

export const getMapRadius = async (): Promise<ApiResponse> => {
    const response = await api.get(`/absensi/maps/radius`);
    return response.data;
}

export const createAbsenMasuk = async (data: z.infer<typeof absenCheckInSchema>): Promise<ApiResponse> => {
    // Skip validation in production for performance - validate on UI instead
    const formdata = new FormData();
    formdata.append('pin', data.pin);
    formdata.append('coordinate', JSON.stringify(data.coordinate));
    formdata.append('image', data.image);
    formdata.append('scan_date', data.scan_date);

    const response = await api.post(`/absensi/masuk/`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000, // 30 seconds for attendance with image upload
    });
    return response.data;
}

export const createAbsenKeluar = async (data: z.infer<typeof absenCheckOutSchema>): Promise<ApiResponse> => {
    // Skip validation in production for performance - validate on UI instead
    const formdata = new FormData();
    formdata.append('pin', data.pin);
    formdata.append('coordinate', JSON.stringify(data.coordinate));
    formdata.append('image', data.image);
    formdata.append('scan_date', data.scan_date);

    const response = await api.post(`/absensi/keluar`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000, // 30 seconds for image upload
    });
    return response.data;
}