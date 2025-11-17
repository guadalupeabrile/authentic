import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from '../server/app'

// Crear el handler serverless
const handler = serverless(app, {
    binary: ['image/*', 'application/octet-stream']
})

// Handler para Vercel - mapea todas las rutas /api/* a este handler
export default async function (req: VercelRequest, res: VercelResponse) {
    // En Vercel, cuando tienes un archivo en api/index.ts, las rutas /api/* se mapean automáticamente
    // El req.url puede venir sin el prefijo /api, así que lo agregamos si es necesario
    const originalUrl = req.url || ''

    // Si la URL no empieza con /api, agregarlo
    if (originalUrl && !originalUrl.startsWith('/api')) {
        req.url = `/api${originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`}`
    }

    return handler(req, res)
}

