import z from 'zod';
import { faceSchema } from "../schema/face-schema";
import api from '../services/api';
import { ApiResponse } from './types';
import { formatValidationErrors } from '../utils/validator';

export const verifyFace = async (data: z.infer<typeof faceSchema>): Promise<ApiResponse> => {
    const validationResult = faceSchema.safeParse(data);

    if (!validationResult.success) {
        return formatValidationErrors(validationResult.error);
    }

    const validatedData = validationResult.data;

    const formdata = new FormData();
    formdata.append('pin', validatedData.pin);
    formdata.append('image', validatedData.image);
    formdata.append('threshold', validatedData.threshold);

    const response = await api.post(`/face/verify/`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}