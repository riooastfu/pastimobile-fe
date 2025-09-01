import api from "../services/api";
import { ApiResponse } from "./types";

export const createLogUserLogin = async (namauser: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/login/log', { namauser });
    return response.data;
};