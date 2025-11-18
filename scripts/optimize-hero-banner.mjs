import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const HERO_SLIDERS_DIR = path.join(ROOT_DIR, 'public', 'img', 'hero-sliders')

async function optimizeHeroBanner() {
    console.log('Starting hero banner optimization...\n')

    try {
        const files = await fs.readdir(HERO_SLIDERS_DIR)
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png)$/i.test(file)
        )

        if (imageFiles.length === 0) {
            console.log('No image files found in hero-sliders directory')
            return
        }

        for (const file of imageFiles) {
            const inputPath = path.join(HERO_SLIDERS_DIR, file)
            const ext = path.extname(file).toLowerCase()
            const baseName = path.basename(file, ext)
            const webpPath = path.join(HERO_SLIDERS_DIR, `${baseName}.webp`)

            // Skip if WebP already exists
            if (await fs.pathExists(webpPath)) {
                console.log(`Skipping ${file} - WebP already exists`)
                continue
            }

            try {
                console.log(`Converting ${file} to optimized WebP...`)

                // Get image metadata
                const metadata = await sharp(inputPath).metadata()

                // Optimize based on image dimensions
                // For hero banners, we want good quality but optimized file size
                const quality = metadata.width > 2000 ? 85 : 90

                await sharp(inputPath)
                    .webp({
                        quality: quality,
                        effort: 6, // Higher effort = better compression (0-6)
                        smartSubsample: true
                    })
                    .toFile(webpPath)

                // Get file sizes for comparison
                const originalStats = await fs.stat(inputPath)
                const webpStats = await fs.stat(webpPath)
                const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1)

                console.log(`✓ Converted: ${file}`)
                console.log(`  Original: ${(originalStats.size / 1024).toFixed(2)} KB`)
                console.log(`  WebP: ${(webpStats.size / 1024).toFixed(2)} KB`)
                console.log(`  Savings: ${savings}%\n`)

                // Delete original JPG/PNG
                await fs.unlink(inputPath)
                console.log(`  Deleted original: ${file}\n`)
            } catch (error) {
                console.error(`Error converting ${file}:`, error.message)
            }
        }

        console.log('✓ Hero banner optimization complete!')
    } catch (error) {
        console.error('Error during optimization:', error.message)
        process.exit(1)
    }
}

optimizeHeroBanner().catch(console.error)

