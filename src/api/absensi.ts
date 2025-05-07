import z, { date } from 'zod'
import api from "../services/api"
import { absenCheckInSchema, absenCheckOutSchema } from '../schema/absensiSchema';
import moment from 'moment';

export const getAbsensiByPin = async (pin: number) => {
    try {
        const res = await api.get(`/absensi/${pin}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.log("Fetch absensi gagal:", res.data.message || "Unknown error");
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getAbsensiByPin:", error.message || error);
        return { message: "Terjadi kesalahan internal", data: [] }
    }
}

export const getMapRadius = async () => {
    try {
        const res = await api.get(`/absensi/maps/radius`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.log("Fetch radius map gagal:", res.data.message || "Unknown error");
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getMapRadius:", error.message || error);
        return { message: "Terjadi kesalahan internal", data: [] }
    }
}

export const createAbsenMasuk = async (data: z.infer<typeof absenCheckInSchema>) => {
    const validationResult = absenCheckInSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Kesalahan Validasi Zod:", validationResult.error.flatten().fieldErrors);
        return { status: "fail", message: "Inputan tidak valid", errors: validationResult.error.flatten().fieldErrors };
    }

    const validatedData = validationResult.data;

    let formdata = new FormData();
    formdata.append('pin', validatedData.pin);
    formdata.append('coordinate', JSON.stringify(validatedData.coordinate));
    formdata.append('image', validatedData.image);
    formdata.append('scan_date', validatedData.scan_date);

    try {
        const res = await api.post(`/absensi/masuk`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error: any) {
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            console.log("Backend Error Response:", errorData);

            // Return dengan struktur yang konsisten
            return {
                status: errorData.status || 'fail',
                message: errorData.message,
                error: {
                    statusCode: errorData.error?.statusCode || errorData.statusCode,
                    errorCode: errorData.error?.errorCode || errorData.errorCode,

                },
            };
        }
        // Handle network error
        else if (error.request) {
            return {
                status: "fail",
                message: "Tidak dapat terhubung ke server. Periksa koneksi internet anda.",
                error: {
                    statusCode: 500,
                    errorCode: 'NETWORK_ERROR',
                },
            };
        }
        // Handle other errors
        else {
            return {
                status: "fail",
                message: error.message || "Terjadi kesalahan",
                error: {
                    statusCode: 500,
                    errorCode: 'UNKNOWN_ERROR',
                },
            };
        }
    }
}

export const createAbsenKeluar = async (data: z.infer<typeof absenCheckOutSchema>) => {
    const validationResult = absenCheckOutSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Kesalahan Validasi Zod:", validationResult.error.flatten().fieldErrors);
        return { status: "fail", message: "Inputan tidak valid", errors: validationResult.error.flatten().fieldErrors };
    }

    const validatedData = validationResult.data;

    let formdata = new FormData();
    formdata.append('pin', validatedData.pin);
    formdata.append('coordinate', JSON.stringify(validatedData.coordinate));
    formdata.append('image', validatedData.image);
    formdata.append('scan_date', validatedData.scan_date);

    try {
        const res = await api.post(`/absensi/keluar`, formdata, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            return { status: res.data.status, message: res.data.message };
        }
    } catch (error: any) {
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            console.log("Backend Error Response:", errorData);

            // Return dengan struktur yang konsisten
            return {
                status: errorData.status || 'fail',
                message: errorData.message,
                error: {
                    statusCode: errorData.error?.statusCode || errorData.statusCode,
                    errorCode: errorData.error?.errorCode || errorData.errorCode,

                },
            };
        }
        // Handle network error
        else if (error.request) {
            return {
                status: "fail",
                message: "Tidak dapat terhubung ke server. Periksa koneksi internet anda.",
                error: {
                    statusCode: 500,
                    errorCode: 'NETWORK_ERROR',
                },
            };
        }
        // Handle other errors
        else {
            return {
                status: "fail",
                message: error.message || "Terjadi kesalahan",
                error: {
                    statusCode: 500,
                    errorCode: 'UNKNOWN_ERROR',
                },
            };
        }
    }
}