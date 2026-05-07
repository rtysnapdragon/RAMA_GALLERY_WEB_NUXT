import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                display: ['Cormorant Garamond', 'Georgia', 'serif'],
                sans: ['DM Sans', 'system-ui', 'sans-serif'],
                khmer: ['Noto Serif Khmer', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                gold: {
                    50: '#fdf9ed',
                    100: '#f9f0ce',
                    200: '#f1de99',
                    300: '#e8c85a',
                    400: '#dfb02e',
                    500: '#c8951c',
                    600: '#a87316',
                    700: '#865417',
                    800: '#70431a',
                    900: '#60381b',
                },
                ink: {
                    50: '#f5f4f2',
                    100: '#e8e6e0',
                    200: '#d4cfc5',
                    300: '#b8b1a3',
                    400: '#9a917f',
                    500: '#817666',
                    600: '#6e6256',
                    700: '#5b5047',
                    800: '#4e4540',
                    900: '#433b37',
                    950: '#1a1612',
                },
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            animation: {
                'fade-up': 'fadeUp 0.8s ease forwards',
                'fade-in': 'fadeIn 0.6s ease forwards',
                'slide-left': 'slideLeft 0.7s ease forwards',
                'slide-right': 'slideRight 0.7s ease forwards',
                'scale-in': 'scaleIn 0.5s ease forwards',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(32px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideLeft: {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
} satisfies Config