import { ApiResponse } from '../api/types';

export const handleApiError = (error: any): ApiResponse => {
  if (error.response?.data) {
    const errorData = error.response.data;
    return {
      status: errorData.status || 'fail',
      message: errorData.message,
      error: {
        statusCode: errorData.error?.statusCode || errorData.statusCode,
        errorCode: errorData.error?.errorCode || errorData.errorCode,
      },
    };
  }
  
  if (error.request) {
    return {
      status: "fail",
      message: "Tidak dapat terhubung ke server. Periksa koneksi internet anda.",
      error: {
        statusCode: 500,
        errorCode: 'NETWORK_ERROR',
      },
    };
  }
  
  return {
    status: "fail",
    message: error.message || "Terjadi kesalahan",
    error: {
      statusCode: 500,
      errorCode: 'UNKNOWN_ERROR',
    },
  };
};