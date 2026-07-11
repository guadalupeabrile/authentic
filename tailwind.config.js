/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Georgia', 'Times New Roman', 'serif'],
            },
            colors: {
                brand: {
                    // Dominant near-black brand tone (loader / dark surfaces).
                    dark: '#15181a',
                    ink: '#17211c',
                },
            },
            transitionTimingFunction: {
                // Premium easeOut used across the motion system.
                'ease-out-premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
        },
    },
    plugins: [],
}

