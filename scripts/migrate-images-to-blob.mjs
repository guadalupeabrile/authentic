#!/usr/bin/env node
/**
 * Script para migrar imágenes de public/uploads/photography a Vercel Blob Storage
 * Ejecutar: node scripts/migrate-images-to-blob.mjs
 */

import { put } from '@vercel/blob'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads', 'photography')

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN no está configurado')
    console.log('Configura la variable de entorno: export BLOB_READ_WRITE_TOKEN=tu_token')
    process.exit(1)
}

async function migrateImages() {
    console.log('🚀 Iniciando migración de imágenes a Vercel Blob Storage...\n')

    if (!await fs.pathExists(UPLOADS_DIR)) {
        console.error(`❌ No se encontró el directorio: ${UPLOADS_DIR}`)
        process.exit(1)
    }

    const categories = await fs.readdir(UPLOADS_DIR)
    let totalUploaded = 0
    let totalFailed = 0

    for (const category of categories) {
        const categoryPath = path.join(UPLOADS_DIR, category)
        const stat = await fs.stat(categoryPath)

        if (!stat.isDirectory()) continue

        console.log(`📁 Procesando categoría: ${category}`)
        const files = await fs.readdir(categoryPath)

        for (const file of files) {
            const filePath = path.join(categoryPath, file)
            const fileStat = await fs.stat(filePath)

            if (!fileStat.isFile()) continue

            try {
                const blobPath = `photography/${category}/${file}`
                const fileBuffer = await fs.readFile(filePath)

                console.log(`  ⬆️  Subiendo: ${file}...`)
                const blob = await put(blobPath, fileBuffer, {
                    access: 'public',
                    token: BLOB_TOKEN,
                    contentType: getContentType(file)
                })

                console.log(`  ✅ Subido: ${blob.url}`)
                totalUploaded++
            } catch (error) {
                console.error(`  ❌ Error subiendo ${file}:`, error.message)
                totalFailed++
            }
        }
    }

    console.log(`\n✨ Migración completada:`)
    console.log(`   ✅ ${totalUploaded} imágenes subidas`)
    if (totalFailed > 0) {
        console.log(`   ❌ ${totalFailed} imágenes fallaron`)
    }
    console.log(`\n📝 Nota: Actualiza las rutas en photography.json para usar las URLs de Blob Storage`)
}

function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase()
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.avif': 'image/avif'
    }
    return types[ext] || 'image/jpeg'
}

migrateImages().catch(error => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
})

