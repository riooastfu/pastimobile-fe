import { API_BASE_URL, MAPS_API_KEY, APP_ENV } from '@env';

export const ENV = {
  API_BASE_URL: API_BASE_URL,
  MAPS_API_KEY: MAPS_API_KEY || '',
  APP_ENV: APP_ENV || 'development',
  IS_DEV: __DEV__,
  IS_PROD: APP_ENV === 'production',
  IS_STAGING: APP_ENV === 'staging',
} as const;

export const validateEnvironment = () => {
  const requiredVars = ['API_BASE_URL'];
  const missing = requiredVars.filter(key => !ENV[key as keyof typeof ENV]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};