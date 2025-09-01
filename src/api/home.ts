import api from "../services/api";
import { ApiResponse } from "./types";

export const getKaryawanUlangTahun = async (pt: string): Promise<ApiResponse> => {
    const response = await api.get(`/home/birthday/${pt}`);
    return response.data;
}

export const getAppVersion = async (): Promise<ApiResponse> => {
    const response = await api.get(`/home/version/`);
    return response.data;
}