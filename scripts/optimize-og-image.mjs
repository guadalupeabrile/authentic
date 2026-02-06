import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const PUBLIC_IMG_DIR = path.join(ROOT_DIR, 'public', 'img')

// Tamaño estándar para imágenes Open Graph
const OG_WIDTH = 1200
const OG_HEIGHT = 630

async function optimizeOGImage() {
    console.log('Optimizing OG Image for social media...\n')

    try {
        // Buscar la imagen fuente (puede estar en diferentes ubicaciones)
        const possibleSources = [
            path.join(PUBLIC_IMG_DIR, 'og-image-source.jpg'),
            path.join(PUBLIC_IMG_DIR, 'og-image-source.png'),
            path.join(PUBLIC_IMG_DIR, 'og-image-source.jpeg'),
            path.join(ROOT_DIR, 'og-image-source.jpg'),
            path.join(ROOT_DIR, 'og-image-source.png'),
            path.join(ROOT_DIR, 'og-image-source.jpeg')
        ]

        let sourceImage = null
        for (const source of possibleSources) {
            if (await fs.pathExists(source)) {
                sourceImage = source
                break
            }
        }

        if (!sourceImage) {
            console.log('⚠️  No se encontró la imagen fuente.')
            console.log('Por favor, coloca tu imagen en una de estas ubicaciones:')
            console.log('  - public/img/og-image-source.jpg')
            console.log('  - public/img/og-image-source.png')
            console.log('  - og-image-source.jpg (raíz del proyecto)')
            console.log('\nLa imagen será redimensionada a 1200x630px y optimizada.')
            return
        }

        const outputPath = path.join(PUBLIC_IMG_DIR, 'og-image.jpg')
        const outputPathWebp = path.join(PUBLIC_IMG_DIR, 'og-image.webp')

        console.log(`Procesando: ${path.basename(sourceImage)}`)
        console.log(`Tamaño objetivo: ${OG_WIDTH}x${OG_HEIGHT}px\n`)

        // Obtener metadata de la imagen original
        const metadata = await sharp(sourceImage).metadata()
        console.log(`Tamaño original: ${metadata.width}x${metadata.height}px`)

        // Crear imagen JPG optimizada (formato más compatible para OG)
        await sharp(sourceImage)
            .resize(OG_WIDTH, OG_HEIGHT, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({
                quality: 85,
                mozjpeg: true,
                progressive: true
            })
            .toFile(outputPath)

        // Crear versión WebP (más ligera, para uso futuro)
        await sharp(sourceImage)
            .resize(OG_WIDTH, OG_HEIGHT, {
                fit: 'cover',
                position: 'center'
            })
            .webp({
                quality: 85,
                effort: 6
            })
            .toFile(outputPathWebp)

        const jpgStats = await fs.stat(outputPath)
        const webpStats = await fs.stat(outputPathWebp)

        console.log(`\n✓ Imagen OG optimizada creada:`)
        console.log(`  JPG: ${outputPath}`)
        console.log(`  Tamaño: ${(jpgStats.size / 1024).toFixed(2)} KB`)
        console.log(`  WebP: ${outputPathWebp}`)
        console.log(`  Tamaño: ${(webpStats.size / 1024).toFixed(2)} KB`)
        console.log(`\n✓ Optimización completa!`)
        console.log(`\nRecuerda actualizar las URLs en index.html:`)
        console.log(`  - Reemplaza "URL_DE_MI_WEB" con tu dominio real`)
        console.log(`  - Reemplaza "@TU_USUARIO_TWITTER" con tu usuario de Twitter`)

    } catch (error) {
        console.error('Error durante la optimización:', error.message)
        process.exit(1)
    }
}

optimizeOGImage().catch(console.error)

