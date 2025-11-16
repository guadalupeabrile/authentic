import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from '../server/app'

// Crear el handler serverless
const handler = serverless(app, {
    binary: ['image/*', 'application/octet-stream']
})

// Handler para Vercel - mapea todas las rutas /api/* a este handler
export default async function (req: VercelRequest, res: VercelResponse) {
    // En Vercel, cuando accedes a /api/photography desde el frontend,
    // el req.url puede venir como /photography o /api/photography dependiendo de la configuración
    // Asegurémonos de que siempre tenga el prefijo /api
    const originalUrl = req.url || ''

    // Si la URL no empieza con /api, agregarlo
    if (!originalUrl.startsWith('/api')) {
        req.url = `/api${originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`}`
    }

    return handler(req, res)
}

