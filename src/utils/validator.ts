import { ZodError } from 'zod';
import { ApiResponse } from '../api/types';

export const formatValidationErrors = (error: ZodError): ApiResponse => ({
  status: "fail",
  message: "Data tidak valid",
  error: {
    statusCode: 400,
    errorCode: 'VALIDATION_ERROR',
    details: error.flatten().fieldErrors
  }
});

export const formatValidationErrorsSimple = (error: ZodError): ApiResponse => ({
  status: "fail",
  message: error.issues.map(issue => `• ${issue.message}`).join("\n")
});