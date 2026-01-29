import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads', 'photography')
const IMG_DIR = path.join(ROOT_DIR, 'public', 'img')

// Optimized WebP settings
const WEBP_OPTIONS = {
    quality: 85, // Good balance between quality and file size
    effort: 6, // 0-6, higher = better compression but slower
    smartSubsample: true, // Better quality for photos
    nearLossless: false, // Set to true for near-lossless compression if needed
}

/**
 * Get optimal quality based on image dimensions
 * Larger images can use slightly lower quality without noticeable difference
 */
function getOptimalQuality(width, height) {
    const megapixels = (width * height) / 1000000
    
    if (megapixels > 5) {
        return 82 // Very large images
    } else if (megapixels > 2) {
        return 85 // Large images
    } else {
        return 88 // Smaller images - higher quality
    }
}

async function convertToWebP(dir, options = {}) {
    const { deleteOriginal = false, optimizeExisting = false } = options
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            await convertToWebP(fullPath, options)
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase()
            const supportedFormats = ['.jpg', '.jpeg', '.png']
            
            if (supportedFormats.includes(ext)) {
                try {
                    const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp')

                    // Check if WebP already exists
                    const webpExists = await fs.pathExists(webpPath)
                    
                    if (webpExists && !optimizeExisting) {
                        console.log(`⏭️  Skipping ${entry.name} - WebP already exists`)
                        continue
                    }

                    // Get image metadata to determine optimal quality
                    const metadata = await sharp(fullPath).metadata()
                    const optimalQuality = getOptimalQuality(metadata.width, metadata.height)
                    
                    const webpOptions = {
                        ...WEBP_OPTIONS,
                        quality: optimalQuality
                    }

                    console.log(`🔄 Converting ${entry.name} to WebP (quality: ${optimalQuality})...`)
                    
                    await sharp(fullPath)
                        .webp(webpOptions)
                        .toFile(webpPath)

                    const originalSize = (await fs.stat(fullPath)).size
                    const webpSize = (await fs.stat(webpPath)).size
                    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1)

                    console.log(`✓ Converted: ${path.relative(ROOT_DIR, webpPath)}`)
                    console.log(`  Size: ${(originalSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB (${savings}% reduction)`)

                    // Delete original if requested
                    if (deleteOriginal && !fullPath.endsWith('.webp')) {
                        await fs.unlink(fullPath)
                        console.log(`  🗑️  Deleted original: ${path.relative(ROOT_DIR, fullPath)}`)
                    }
                } catch (error) {
                    console.error(`❌ Error converting ${entry.name}:`, error.message)
                }
            }
        }
    }
}

async function optimizeExistingWebP(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            await optimizeExistingWebP(fullPath)
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp')) {
            try {
                const metadata = await sharp(fullPath).metadata()
                const optimalQuality = getOptimalQuality(metadata.width, metadata.height)
                
                // Only optimize if quality can be improved
                if (optimalQuality < 90) {
                    console.log(`🔄 Optimizing ${entry.name}...`)
                    
                    const tempPath = fullPath + '.tmp'
                    await sharp(fullPath)
                        .webp({
                            ...WEBP_OPTIONS,
                            quality: optimalQuality
                        })
                        .toFile(tempPath)
                    
                    const originalSize = (await fs.stat(fullPath)).size
                    const optimizedSize = (await fs.stat(tempPath)).size
                    
                    if (optimizedSize < originalSize) {
                        await fs.move(tempPath, fullPath, { overwrite: true })
                        const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1)
                        console.log(`✓ Optimized: ${path.relative(ROOT_DIR, fullPath)} (${savings}% reduction)`)
                    } else {
                        await fs.unlink(tempPath)
                        console.log(`⏭️  Skipped ${entry.name} - already optimized`)
                    }
                }
            } catch (error) {
                console.error(`❌ Error optimizing ${entry.name}:`, error.message)
            }
        }
    }
}

async function main() {
    const args = process.argv.slice(2)
    const deleteOriginal = args.includes('--delete-original')
    const optimizeOnly = args.includes('--optimize-only')
    const optimizeExisting = args.includes('--optimize-existing')

    console.log('🚀 Starting WebP conversion and optimization...\n')
    
    if (optimizeOnly) {
        console.log('📦 Optimizing existing WebP files...\n')
        await optimizeExistingWebP(UPLOADS_DIR)
        await optimizeExistingWebP(IMG_DIR)
    } else {
        console.log('🔄 Converting images to WebP...\n')
        await convertToWebP(UPLOADS_DIR, { deleteOriginal, optimizeExisting })
        await convertToWebP(IMG_DIR, { deleteOriginal, optimizeExisting })
        
        if (optimizeExisting) {
            console.log('\n📦 Optimizing existing WebP files...\n')
            await optimizeExistingWebP(UPLOADS_DIR)
            await optimizeExistingWebP(IMG_DIR)
        }
    }
    
    console.log('\n✅ Conversion complete!')
    console.log('\n💡 Tips:')
    console.log('  - Use --delete-original to remove original files after conversion')
    console.log('  - Use --optimize-existing to optimize already converted WebP files')
    console.log('  - Use --optimize-only to only optimize existing WebP files')
}

main().catch(console.error)

