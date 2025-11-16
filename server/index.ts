import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import app from './app'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const UPLOADS_ROOT = path.join(PUBLIC_DIR, 'uploads', 'photography')
const STORAGE_DIR = path.join(ROOT_DIR, 'server', 'storage')
const CONFIG_PATH = path.join(STORAGE_DIR, 'photography.json')

const PORT = Number(process.env.PORT) || 4000
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

if (!ADMIN_PASSWORD_HASH) {
    console.warn('ADMIN_PASSWORD_HASH is not set. Use env.example to configure your credentials.')
    process.exit(1)
}

async function bootstrap() {
    await fs.ensureDir(UPLOADS_ROOT)
    const exists = await fs.pathExists(CONFIG_PATH)
    if (!exists) {
        // El servidor creará la configuración por defecto en la primera petición
        console.log('Configuración de fotografía no encontrada, se creará por defecto en la primera petición')
    }

    app.listen(PORT, () => {
        console.log(`Admin server listo en http://localhost:${PORT}`)
    })
}

bootstrap().catch(error => {
    console.error('No se pudo iniciar el servidor', error)
    process.exit(1)
})


