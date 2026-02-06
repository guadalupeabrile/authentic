import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const PUBLIC_IMG_DIR = path.join(ROOT_DIR, 'public', 'img')
const SOURCE_IMAGE = path.join(PUBLIC_IMG_DIR, 'favicon1.png')

// Tamaños requeridos para favicons
const FAVICON_SIZES = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
]

async function generateFavicons() {
    console.log('Generando favicons desde favicon1.png...\n')

    try {
        // Verificar que existe la imagen fuente
        if (!(await fs.pathExists(SOURCE_IMAGE))) {
            console.error('❌ Error: No se encontró favicon1.png en public/img/')
            return
        }

        console.log(`Procesando: ${path.basename(SOURCE_IMAGE)}\n`)

        // Generar cada tamaño de favicon
        for (const { name, size } of FAVICON_SIZES) {
            const outputPath = path.join(PUBLIC_IMG_DIR, name)
            
            await sharp(SOURCE_IMAGE)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 } // Fondo transparente
                })
                .png()
                .toFile(outputPath)

            console.log(`✅ Generado: ${name} (${size}x${size}px)`)
        }

        console.log('\n✨ ¡Todos los favicons han sido generados exitosamente!')
        console.log('\nLos archivos están en: public/img/')

    } catch (error) {
        console.error('❌ Error al generar favicons:', error.message)
        process.exit(1)
    }
}

generateFavicons()

