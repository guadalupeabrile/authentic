import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads', 'photography')

async function convertToWebP(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            await convertToWebP(fullPath)
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase()
            if (['.jpg', '.jpeg'].includes(ext)) {
                try {
                    const webpPath = fullPath.replace(/\.(jpg|jpeg)$/i, '.webp')

                    // Skip if WebP already exists
                    if (await fs.pathExists(webpPath)) {
                        console.log(`Skipping ${entry.name} - WebP already exists`)
                        continue
                    }

                    console.log(`Converting ${entry.name} to WebP...`)
                    await sharp(fullPath)
                        .webp({ quality: 85 })
                        .toFile(webpPath)

                    console.log(`✓ Converted: ${path.relative(ROOT_DIR, webpPath)}`)

                    // Delete original JPG/JPEG
                    await fs.unlink(fullPath)
                    console.log(`  Deleted original: ${path.relative(ROOT_DIR, fullPath)}`)
                } catch (error) {
                    console.error(`Error converting ${entry.name}:`, error.message)
                }
            }
        }
    }
}

async function main() {
    console.log('Starting WebP conversion...\n')
    await convertToWebP(UPLOADS_DIR)
    console.log('\n✓ Conversion complete!')
}

main().catch(console.error)

