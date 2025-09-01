import { z } from 'zod';

export const laporanHarianSchema = z.object({
    // Definisikan tipe data dan aturan untuk setiap field di req.body
    id_laporan: z.string().min(1, { message: "Id laporan tidak boleh kosong" }), // Pastikan tidak string kosong
    nik: z.number({ required_error: 'NIK dibutuhkan', invalid_type_error: 'NIK harus berupa angka' }).int('NIK harus berupa angka bulat').positive('NIK harus lebih besar dari 0'),
    nik_kantor: z.string().min(1, { message: "NIK Kantor dibutuhkan" }),
    nama_karyawan: z.string().min(1, { message: "Nama Karyawan dibutuhkan" }),
    jabatan_karyawan: z.string().min(1, { message: "Jabatan Karyawan dibutuhkan" }),
    dept_karyawan: z.string().min(1, { message: "Departemen Karyawan dibutuhkan" }),
    uraian_kegiatan: z.string().min(1, "Uraian kegiatan tidak boleh kosong"), // Pastikan tidak string kosong
    target_harian: z.string().min(1, { message: "Target Harian dibutuhkan" }),
    pt: z.string().min(1, { message: "PT dibutuhkan" }),
    kategori: z.string().min(1, { message: "Kategori dibutuhkan" }),
    lokasi_kerja: z.string().min(1, { message: "Lokasi Kerja dibutuhkan" })
}).strict(); // .strict() akan menolak field tambahan yang tidak ada di skema

export const laporanKesehatanSchema = z.object({
    // Definisikan tipe data dan aturan untuk setiap field di req.body
    // Sesuaikan tipe data (string, number, date, boolean) dan aturan (optional, min, max, dll.)
    nik: z.number({ required_error: 'NIK dibutuhkan', invalid_type_error: 'NIK harus berupa angka' }).int('NIK harus berupa angka bulat').positive('NIK harus lebih besar dari 0'),
    nik_kantor: z.string().min(1, { message: "NIK Kantor dibutuhkan" }),
    tanggal: z.string().min(1, { message: "Tanggal dibutuhkan", }),
    jam_masuk: z.string().min(1, { message: "Jam Masuk dibutuhkan", }),
    jam_pulang: z.string().min(1, { message: "Jam Pulang dibutuhkan", }),
    status_kerja: z.string().min(1, { message: "Status Kerja dibutuhkan" }),
    kesehatan_nama: z.string().min(1, { message: "Kesehatan Nama dibutuhkan" }),
    kesehatan_dept: z.string().min(1, { message: "Kesehatan departemen dibutuhkan" }),
    kesehatan_jabatan: z.string().min(1, { message: "Kesehatan Jabatan dibutuhkan" }),
    kesehatan_pt: z.string().min(1, { message: "Kesehatan PT dibutuhkan" }),
}).strict();