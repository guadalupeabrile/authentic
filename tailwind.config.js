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
        },
    },
    plugins: [],
}

