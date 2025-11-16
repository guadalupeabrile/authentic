import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from '../server/app'

// Crear el handler serverless
const handler = serverless(app)

// Handler para Vercel - mapea todas las rutas /api/* a este handler
export default async function (req: VercelRequest, res: VercelResponse) {
    // En Vercel, cuando accedes a /api/photography, el path es /photography
    // Necesitamos agregar el prefijo /api de vuelta para que Express lo reconozca
    if (req.url && !req.url.startsWith('/api')) {
        req.url = `/api${req.url}`
    }

    return handler(req, res)
}

