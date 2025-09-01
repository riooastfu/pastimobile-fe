export interface ApiResponse<T = any> {
  status: 'success' | 'fail';
  message: string;
  data?: T;
  error?: {
    statusCode: number;
    errorCode: string;
    details?: any;
  };
}

export interface ApiError {
  statusCode: number;
  errorCode: string;
  details?: any;
}