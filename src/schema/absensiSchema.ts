import z from 'zod';

export const absenCheckInSchema = z.object({
    image: z.object({
        uri: z.string(),
        type: z.literal('image/jpg'),
        name: z.string()
    }),
    pin: z.string(),
    coordinate: z.string()
})

export const absenCheckOutSchema = z.object({
    image: z.object({
        uri: z.string(),
        type: z.literal('image/jpg'),
        name: z.string()
    }),
    pin: z.string(),
    coordinate: z.string()
})