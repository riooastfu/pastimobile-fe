export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingConfig {
  timeout?: number;
  retryCount?: number;
  showOverlay?: boolean;
  message?: string;
}

