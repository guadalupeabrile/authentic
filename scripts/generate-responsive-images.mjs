import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads', 'photography')

// Define responsive breakpoints (widths in pixels)
const BREAKPOINTS = {
    xs: 400,   // Mobile small
    sm: 640,   // Mobile large
    md: 768,   // Tablet
    lg: 1024,  // Desktop small
    xl: 1280,  // Desktop medium
    '2xl': 1920 // Desktop large
}

/**
 * Generate responsive image sizes for a given image
 */
async function generateResponsiveSizes(imagePath, outputDir) {
    try {
        const metadata = await sharp(imagePath).metadata()
        const originalWidth = metadata.width
        const filename = path.basename(imagePath, path.extname(imagePath))
        const ext = path.extname(imagePath).toLowerCase()
        const isWebP = ext === '.webp'

        // Only generate sizes smaller than original
        const sizesToGenerate = Object.entries(BREAKPOINTS)
            .filter(([_, width]) => width < originalWidth)
            .sort(([_, a], [__, b]) => a - b)

        if (sizesToGenerate.length === 0) {
            console.log(`⏭️  Skipping ${path.basename(imagePath)} - image is smaller than all breakpoints`)
            return
        }

        console.log(`\n📐 Generating responsive sizes for ${path.basename(imagePath)}:`)
        console.log(`   Original: ${originalWidth}x${metadata.height}px`)

        const generatedSizes = []

        for (const [breakpoint, width] of sizesToGenerate) {
            const outputPath = path.join(
                outputDir,
                `${filename}-${breakpoint}${isWebP ? '.webp' : ext}`
            )

            // Skip if already exists
            if (await fs.pathExists(outputPath)) {
                console.log(`   ⏭️  ${breakpoint} (${width}px) - already exists`)
                continue
            }

            // Calculate height maintaining aspect ratio
            const height = Math.round((metadata.height / metadata.width) * width)

            const options = {
                width,
                height,
                fit: 'inside',
                withoutEnlargement: true
            }

            if (isWebP) {
                await sharp(imagePath)
                    .resize(options)
                    .webp({ quality: 85, effort: 6 })
                    .toFile(outputPath)
            } else {
                await sharp(imagePath)
                    .resize(options)
                    .toFile(outputPath)
            }

            const stats = await fs.stat(outputPath)
            const originalSize = (await fs.stat(imagePath)).size
            const newSize = stats.size
            const savings = ((1 - newSize / originalSize) * 100).toFixed(1)

            console.log(`   ✓ ${breakpoint} (${width}x${height}px): ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`)
            generatedSizes.push({ breakpoint, width, path: outputPath })
        }

        return generatedSizes
    } catch (error) {
        console.error(`❌ Error processing ${imagePath}:`, error.message)
        return null
    }
}

/**
 * Process directory recursively
 */
async function processDirectory(dir, outputBaseDir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            // Create corresponding output directory
            const relativePath = path.relative(UPLOADS_DIR, fullPath)
            const outputDir = path.join(outputBaseDir, relativePath)
            await fs.ensureDir(outputDir)

            await processDirectory(fullPath, outputBaseDir)
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase()
            const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp']

            if (supportedFormats.includes(ext)) {
                const relativePath = path.relative(UPLOADS_DIR, dir)
                const outputDir = path.join(outputBaseDir, relativePath)
                await fs.ensureDir(outputDir)

                await generateResponsiveSizes(fullPath, outputDir)
            }
        }
    }
}

async function main() {
    const args = process.argv.slice(2)
    const outputDir = args[0] || path.join(ROOT_DIR, 'public', 'uploads', 'photography-responsive')

    console.log('🚀 Starting responsive image generation...\n')
    console.log(`📁 Source: ${UPLOADS_DIR}`)
    console.log(`📁 Output: ${outputDir}\n`)

    await fs.ensureDir(outputDir)
    await processDirectory(UPLOADS_DIR, outputDir)

    console.log('\n✅ Responsive image generation complete!')
    console.log('\n💡 Usage:')
    console.log('   Use these responsive images with srcset in your components')
    console.log('   Example: <img srcSet="image-sm.webp 640w, image-md.webp 768w" sizes="(max-width: 640px) 100vw, 50vw" />')
}

main().catch(console.error)

