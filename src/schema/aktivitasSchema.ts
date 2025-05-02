import z from 'zod';

export const laporanHarianSchema = z.object({
    // Definisikan tipe data dan aturan untuk setiap field di req.body
    id_laporan: z.string().min(1, { message: "Id laporan tidak boleh kosong" }), // Pastikan tidak string kosong
    nik: z.string().min(1, { message: "NIK dibutuhkan" }),
    nik_kantor: z.string().min(1, { message: "NIK Kantor dibutuhkan" }),
    nama_karyawan: z.string().min(1, { message: "Nama Karyawan dibutuhkan" }),
    jabatan_karyawan: z.string().min(1, { message: "Jabatan Karyawan dibutuhkan" }),
    dept_karyawan: z.string().min(1, { message: "Departemen Karyawan dibutuhkan" }),
    uraian_kegiatan: z.string().min(1, "Uraian kegiatan tidak boleh kosong"), // Pastikan tidak string kosong
    target_harian: z.string().min(1, { message: "Target Harian dibutuhkan" }),
    pt: z.string().min(1, { message: "PT dibutuhkan" }),
    kategori: z.string().min(1, { message: "Kategori dibutuhkan" }),
    lokasi_kerja: z.string().min(1, { message: "Lokasi Kerja dibutuhkan" }),
    atasan_langsung: z.string().min(1, { message: "Atasan Langsung dibutuhkan" }),
}).strict(); // .strict() akan menolak field tambahan yang tidak ada di skema

export const laporanKesehatanSchema = z.object({
    // Definisikan tipe data dan aturan untuk setiap field di req.body
    // Sesuaikan tipe data (string, number, date, boolean) dan aturan (optional, min, max, dll.)
    nik: z.string().min(1, { message: "NIK dibutuhkan" }),
    nik_kantor: z.string().min(1, { message: "NIK Kantor dibutuhkan" }),
    tanggal: z.string({ message: 'Tanggal dibutuhkan', invalid_type_error: 'Tanggal harus berupa string' }).date('Format tanggal tidak valid (YYYY-MM-DD)'),
    jam_masuk: z.string({ required_error: 'Jam masuk dibutuhkan', invalid_type_error: 'Jam masuk harus berupa string' }).time('Format jam masuk tidak valid (hh:mm:ss)'),
    jam_pulang: z.string({ required_error: 'Jam pulang dibutuhkan', invalid_type_error: 'Jam pulang harus berupa string' }).time('Format jam pulang tidak valid (hh:mm:ss)'),
    status_kerja: z.string().min(1, { message: "Status Kerja dibutuhkan" }),
    kesehatan_tanggal: z.string({ message: 'Kesehatan Tanggal dibutuhkan', invalid_type_error: 'Kesehatan Tanggal harus berupa string' }).date('Format tanggal tidak valid (YYYY-MM-DD)'),
    kesehatan_nama: z.string().min(1, { message: "Kesehatan Nama dibutuhkan" }),
    kesehatan_dept: z.string().min(1, { message: "Kesehatan departemen dibutuhkan" }),
    kesehatan_jabatan: z.string().min(1, { message: "Kesehatan Jabatan dibutuhkan" }),
    kesehatan_pt: z.string().min(1, { message: "Kesehatan PT dibutuhkan" }),
    kesehatan_suhu: z.number().min(1, { message: "Kesehatan Suhu dibutuhkan" }),
    kesehatan_keluarga: z.string().min(1, { message: "Kesehatan Keluarga dibutuhkan" }),
    kesehatan_kontak: z.string().min(1, { message: "Kesehatan Kontak dibutuhkan" }),
    kesehatan_resiko: z.string().min(1, { message: "Kesehatan Resiko dibutuhkan" }),
    kesehatan_pagi: z.string().min(1, { message: "Kesehatan Pagi dibutuhkan" }),
    kesehatan_malam: z.string().min(1, { message: "Kesehatan Malam dibutuhkan" }),
    kesehatan_berobat: z.string().min(1, { message: "Kesehatan Berobat dibutuhkan" }),
}).strict();