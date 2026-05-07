/**
 * Uygulama Konfigürasyonu
 * @package AI Teacher App
 */

export const APP_CONFIG = {
  name: 'AI Destekli İngilizce Öğretmeni',
  version: '1.0.0',
  environment: import.meta.env.MODE || 'development',
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '',
    timeout: 10000,
  },
  ui: {
    themeColor: '#0f172a',
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
