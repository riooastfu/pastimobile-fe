import z from "zod";
import api from "../services/api";
import { cutiUserSchema } from "../schema/cutiSchema";

export const getHariLibur = async () => {
    try {
        const res = await api.get('/cuti/harilibur');
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const getCutiUserByNik = async (nik: string) => {
    try {
        const res = await api.get(`/cuti/${nik}`);
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const getDetailCutiUserById = async (id_cuti: string) => {
    try {
        const res = await api.get(`/cuti/detail/${id_cuti}`);
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        }
        else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const getDetailCutiUserByAtasan = async (atasan: string) => {
    try {
        const res = await api.get(`/cuti/detail/atasan/${atasan}`);
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const createCutiUser = async (data: z.infer<typeof cutiUserSchema>) => {
    const validationResult = cutiUserSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Kesalahan Validasi Zod:", validationResult.error.flatten().fieldErrors);
        return { status: "fail", message: "Inputan tidak valid", errors: validationResult.error.flatten().fieldErrors };
    }

    const validatedData = validationResult.data;

    try {
        const res = await api.post(`/cuti/detail`, validatedData);
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const approveCutiUser = async (id_transaksi: string) => {
    try {
        const res = await api.patch(`/cuti/detail/atasan/approve/${id_transaksi}`);
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const rejectCutiUser = async (id_transaksi: string) => {
    try {
        const res = await api.patch(`/cuti/detail/atasan/reject/${id_transaksi}`);
        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.error("API mengembalikan status gagal:", res.data.message);
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}