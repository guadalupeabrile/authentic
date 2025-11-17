#!/usr/bin/env node
/**
 * Script para actualizar las rutas en photography.json con URLs de Blob Storage
 */

import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const JSON_PATH = path.join(ROOT_DIR, 'server', 'storage', 'photography.json')

const BLOB_BASE_URL = 'https://lqdxa0zv947obgib.public.blob.vercel-storage.com'

function updateUrls(obj) {
    if (typeof obj === 'string') {
        // Si es una ruta que empieza con /uploads/photography/, reemplazarla
        if (obj.startsWith('/uploads/photography/')) {
            const blobPath = obj.replace('/uploads/photography/', 'photography/')
            return `${BLOB_BASE_URL}/${blobPath}`
        }
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map(updateUrls)
    }

    if (obj && typeof obj === 'object') {
        const updated = {}
        for (const [key, value] of Object.entries(obj)) {
            updated[key] = updateUrls(value)
        }
        return updated
    }

    return obj
}

async function main() {
    console.log('🔄 Actualizando rutas en photography.json...\n')

    const config = await fs.readJSON(JSON_PATH)
    const updated = updateUrls(config)

    await fs.writeJSON(JSON_PATH, updated, { spaces: 2 })

    console.log('✅ photography.json actualizado con URLs de Blob Storage')
    console.log(`   Base URL: ${BLOB_BASE_URL}\n`)
}

main().catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
})

