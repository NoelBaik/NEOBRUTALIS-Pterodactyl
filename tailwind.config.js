const colors = require('tailwindcss/colors');

const gray = {
    50: 'var(--text-main)',
    100: 'var(--text-main)',
    200: 'var(--text-main)',
    300: 'var(--text-muted)',
    400: 'var(--text-muted)',
    500: 'var(--text-muted)',
    600: 'var(--text-muted)',
    700: 'var(--text-main)',
    800: 'var(--text-main)',
    900: 'var(--text-main)',
};

const neutral = gray;

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
        './resources/views/**/*.blade.php',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                header: ['"Archivo Black"', '"Space Grotesk"', 'sans-serif'],
                sans: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                black: '#000000',
                white: '#FFFFFF',
                primary: {
                    DEFAULT: '#FF6B00',
                    hover: '#FF8A33',
                    dark: '#D95A00',
                    light: '#FFF4E8',
                    50: '#FFF4E8',
                    100: '#FFE4CC',
                    200: '#FFC299',
                    300: '#FFA066',
                    400: '#FF8A33',
                    500: '#FF6B00',
                    600: '#D95A00',
                    700: '#B34A00',
                    800: '#8C3A00',
                    900: '#662A00',
                },
                brutal: {
                    bg: 'var(--bg-main)',
                    card: 'var(--bg-secondary)',
                    text: 'var(--text-main)',
                    border: 'var(--border-color)',
                    orange: '#FF6B00',
                    orangeHover: '#FF8A33',
                    orangeActive: '#D95A00',
                    cream: '#FFF4E8',
                    success: '#22C55E',
                    danger: '#EF4444',
                    warning: '#FACC15',
                },
                gray: gray,
                neutral: gray,
                cyan: colors.orange,
            },
            boxShadow: {
                none: 'none',
                brutal: 'var(--shadow-brutal)',
                'brutal-sm': 'var(--shadow-brutal-sm)',
                'brutal-lg': 'var(--shadow-brutal-lg)',
                'brutal-hover': 'var(--shadow-brutal-hover)',
                md: 'var(--shadow-brutal)',
                lg: 'var(--shadow-brutal-lg)',
                xl: 'var(--shadow-brutal-lg)',
            },
            borderWidth: {
                DEFAULT: '3px',
                0: '0px',
                2: '2px',
                3: '3px',
                4: '4px',
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
            borderRadius: {
                none: '0px',
                sm: '2px',
                DEFAULT: '4px',
                md: '4px',
                lg: '6px',
                xl: '6px',
                '2xl': '6px',
                full: '4px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
};
