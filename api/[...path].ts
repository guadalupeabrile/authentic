import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from '../server/app'

const handler = serverless(app, {
    binary: ['image/*', 'application/octet-stream']
})

// Catch-all handler para todas las rutas /api/*
export default async function (req: VercelRequest, res: VercelResponse) {
    // En Vercel, api/[...path].ts captura todas las rutas /api/*
    // req.query.path contiene el path después de /api/
    const path = req.query.path as string | string[] | undefined
    const pathString = Array.isArray(path) ? path.join('/') : path || ''
    
    // Construir la URL completa con /api/
    const fullPath = `/api/${pathString}`
    
    // Crear request modificado con la URL correcta
    const modifiedReq = {
        ...req,
        url: fullPath,
        path: fullPath
    } as VercelRequest
    
    return handler(modifiedReq, res)
}

