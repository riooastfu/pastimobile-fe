import z from "zod";
import api from "../services/api";
import { cutiUserSchema } from "../schema/cuti-schema";
import { ApiResponse } from "./types";
import { formatValidationErrorsSimple } from "../utils/validator";

export const getHariLibur = async (): Promise<ApiResponse> => {
    const response = await api.get('/cuti/harilibur');
    return response.data;
}

export const getCutiUserByNik = async (nik: number): Promise<ApiResponse> => {
    const response = await api.get(`/cuti/nik/${nik}`);
    return response.data;
}

export const getCutiUserByIdCuti = async (id_cuti: string): Promise<ApiResponse> => {
    const response = await api.get(`/cuti/id/${id_cuti}`);
    return response.data;
}

export const getDetailCutiUserById = async (id_cuti: string): Promise<ApiResponse> => {
    const response = await api.get(`/cuti/detail/${id_cuti}`);
    return response.data;
}

export const getDetailCutiUserByAtasan = async (atasan: string): Promise<ApiResponse> => {
    const response = await api.get(`/cuti/detail/atasan/${atasan}`);
    return response.data;
}

export const getPic = async ({ nik, departemen, perusahaan }: { nik: number, departemen: string, perusahaan: string }): Promise<ApiResponse> => {
    const response = await api.post(`/cuti/pic`, { nik, departemen, perusahaan });
    return response.data;
}

export const getAtasan = async ({ nik, departemen }: { nik: number, departemen: string }): Promise<ApiResponse> => {
    const response = await api.post(`/cuti/atasan`, { nik, departemen });
    return response.data;
}

export const createCutiUser = async (data: z.infer<typeof cutiUserSchema>): Promise<ApiResponse> => {
    const validationResult = cutiUserSchema.safeParse(data);

    if (!validationResult.success) {
        return formatValidationErrorsSimple(validationResult.error);
    }

    const response = await api.post(`/cuti/detail`, validationResult.data);
    return response.data;
}

export const approveCutiUser = async (id_transaksi: string): Promise<ApiResponse> => {
    const response = await api.patch(`/cuti/detail/atasan/approve/${id_transaksi}`);
    return response.data;
}

export const rejectCutiUser = async (id_transaksi: string): Promise<ApiResponse> => {
    const response = await api.patch(`/cuti/detail/atasan/reject/${id_transaksi}`);
    return response.data;
}