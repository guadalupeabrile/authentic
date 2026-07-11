import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Long-term-cacheable vendor chunks, split by library.
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'motion-vendor': ['framer-motion'],
                    'helmet-vendor': ['react-helmet-async'],
                },
            },
        },
        // Slightly higher warning limit; motion-vendor is legitimately sizeable.
        chunkSizeWarningLimit: 700,
    },
})
