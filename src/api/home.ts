import api from "../services/api"

export const getKaryawanUlangTahun = async (pt: string) => {
    try {
        const res = await api.get(`/home/birthday/${pt}`);

        if (res.data.status === "success") {
            return { status: res.data.status, message: res.data.message, data: res.data.data }
        } else {
            console.log("Fetch ulang tahun gagal:", res.data.message || "Unknown error");
            return { status: res.data.status, message: res.data.message, data: [] }
        }
    } catch (error: any) {
        console.error("Error getKaryawanUlangTahun:", error.message || error);
        return { message: "Terjadi kesalahan internal", data: [] }
    }
}