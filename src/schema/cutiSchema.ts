import z from "zod";

export const cutiUserSchema = z
    .object({
        id_cuti: z.string({ required_error: "ID Cuti dibutuhkan" }).min(1),
        tanggal_mulai: z.coerce.date({
            required_error: "Tanggal mulai dibutuhkan",
            invalid_type_error: "Format tanggal mulai tidak valid.",
        }),
        tanggal_berakhir: z.coerce.date({
            required_error: "Tanggal berakhir dibutuhkan",
            invalid_type_error: "Format tanggal berakhir tidak valid.",
        }),
        total_hari: z
            .number({ required_error: "Total hari dibutuhkan" })
            .min(1, "Total hari minimal 1"),
        tipe_cuti: z
            .string({ required_error: "Tipe cuti dibutuhkan" })
            .min(1, "Tipe cuti tidak boleh kosong"),
        alasan: z
            .string({ required_error: "Alasan cuti dibutuhkan" })
            .min(1, "Alasan cuti tidak boleh kosong"),
        alamat_cuti: z
            .string({ required_error: "Alamat cuti dibutuhkan" })
            .min(1, "Alamat cuti tidak boleh kosong"),
        approval: z
            .number({ required_error: "Approval dibutuhkan" })
            .min(1, "Approval tidak boleh kosong"),
        pic: z
            .string({ required_error: "PIC dibutuhkan" })
            .min(1, "PIC tidak boleh kosong"),
        atasan: z
            .string({ required_error: "Atasan dibutuhkan" })
            .min(1, "Atasan tidak boleh kosong"),
        no_telepon: z.string().optional(),
    })
    .strict();