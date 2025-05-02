import z from 'zod';
import api from "../services/api"
import { laporanHarianSchema, laporanKesehatanSchema } from '../schema/aktivitasSchema';

export const getlaporanHarianById = async (id_laporan: string) => {
    try {
        const res = await api.get(`/aktivitas/harian/${id_laporan}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getlaporanHarianById:", error.message || error);
        return { status: 'fail', message: "Terjadi kesalahan internal", data: [] }
    }
}

export const getLaporanKesehatanByNik = async (karyawanId: number) => {
    try {
        const res = await api.get(`/aktivitas/kesehatan/nik/${karyawanId}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getLaporanKesehatanByNik:", error.message || error);
        return { status: 'fail', message: "Terjadi kesalahan internal", data: [] }
    }
}

export const getLaporanKesehatanById = async (id_laporan: string) => {
    try {
        const res = await api.get(`/aktivitas/kesehatan/id/${id_laporan}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getLaporanKesehatanById:", error.message || error);
        return { status: 'fail', message: "Terjadi kesalahan internal", data: [] }
    }
}

export const getLaporanKesehatanByTanggal = async (karyawanId: number, tanggal: Date) => {
    try {
        const res = await api.post(`/aktivitas/kesehatan/tanggal`, { karyawanId, tanggal });

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getLaporanKesehatanByTanggal:", error.message || error);
        return { status: 'fail', message: "Terjadi kesalahan internal", data: [] }
    }
}

export const createLaporanHarian = async (data: z.infer<typeof laporanHarianSchema>) => {
    const validationResult = laporanHarianSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Kesalahan Validasi Zod:", validationResult.error.flatten().fieldErrors);
        return { status: "fail", message: "Inputan tidak valid", errors: validationResult.error.flatten().fieldErrors };
    }

    const validatedData = validationResult.data;
    try {

        const res = await api.post(`/aktivitas/harian`, { validatedData });

        if (res.data.status === "success") {
            console.log("Laporan berhasil dibuat via API:", res.data.data);
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

export const createLaporanKesehatan = async (data: z.infer<typeof laporanKesehatanSchema>) => {
    const validationResult = laporanKesehatanSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Kesalahan Validasi Zod:", validationResult.error.flatten().fieldErrors);
        return { status: "fail", message: "Inputan tidak valid", errors: validationResult.error.flatten().fieldErrors };
    }

    const validatedData = validationResult.data;
    try {

        const res = await api.post(`/aktivitas/kesehatan`, { validatedData });

        if (res.data.status === "success") {
            console.log("Laporan berhasil dibuat via API:", res.data.data);
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

export const deleteLaporanHarianByNoUrut = async (id_laporan: string, no_urut: number) => {
    try {
        const res = await api.delete(`/aktivitas/harian/no_urut`, {
            data: {
                id_laporan,
                no_urut
            }
        });

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message }
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const deleteLaporanHarianById = async (id_laporan: string) => {
    try {
        const res = await api.delete(`/aktivitas/harian/${id_laporan}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message }
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}

export const deleteLaporanKesehatanById = async (id_laporan: string) => {
    try {
        const res = await api.delete(`/aktivitas/kesehatan/${id_laporan}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message }
        }
    } catch (error) {
        console.error("Terjadi kesalahan internal:", error);
        return { status: "fail", message: "Terjadi kesalahan internal" };
    }
}