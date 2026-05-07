import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // PREMIUM UI: Dark mode 'class' olarak ayarlandı.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { // PREMIUM UI: Renk tokenları eklendi.
        brand: {
          50: 'hsl(var(--brand-50) / <alpha-value>)',
          500: 'hsl(var(--brand-500) / <alpha-value>)',
          600: 'hsl(var(--brand-600) / <alpha-value>)',
        }
      },
      fontFamily: { // PREMIUM UI: Outfit ve Inter fontları CSS değişkenlerine bağlandı.
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
      borderRadius: { // PREMIUM UI: Özel border radius eklendi.
        '4xl': '2rem',
      },
      animation: { // PREMIUM UI: Framer Motion ile kullanılacak animasyonlar tanımlandı.
        'fade-up': 'fadeUp 0.4s ease both',
        'fade-in': 'fadeIn 0.3s ease both',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: { // PREMIUM UI: Animasyon keyframeleri tanımlandı.
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(20%) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        },
      },
    },
  },
  plugins: [],
};

export default config;
