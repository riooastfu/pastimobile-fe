import { z } from 'zod';
export const faceSchema = z.object({
    image: z.object({
        uri: z.string(),
        type: z.literal('image/jpg'),
        name: z.string()
    }),
    pin: z.string(), // kalau dikirim dari form-data, biasanya string
    threshold: z.string(), // threshold untuk verifikasi wajah
})