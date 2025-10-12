import { Platform } from 'react-native';

const DEV_API_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:4000'
    : 'http://10.0.2.2:4000';

const PROD_API_URL = 'https://api.rutalia.com';

export const API_BASE_URL = (__DEV__ ? DEV_API_URL : PROD_API_URL).replace(/\/$/, '');

export function buildApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
