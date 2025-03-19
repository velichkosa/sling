import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // порт для разработки
        open: true, // Открыть браузер автоматически при запуске
    },
    build: {
        outDir: 'build', // папка сборки
    },
    resolve: {
        alias: {
            '@': '/src', // Псевдоним для удобного импорта
        },
    },
})
