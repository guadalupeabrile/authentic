import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from '../server/app'

const handler = serverless(app, {
    binary: ['image/*', 'application/octet-stream']
})

// Catch-all handler para todas las rutas /api/*
export default async function (req: VercelRequest, res: VercelResponse) {
    try {
        // En Vercel, api/[...path].ts captura todas las rutas /api/*
        // req.query.path contiene el path después de /api/
        const path = req.query.path as string | string[] | undefined
        const pathString = Array.isArray(path) ? path.join('/') : path || ''
        
        // Construir la URL completa con /api/
        const fullPath = `/api/${pathString}`
        
        console.log('API Handler - Method:', req.method, 'Path:', pathString, 'Full path:', fullPath)
        
        // Crear request modificado con la URL correcta
        const modifiedReq = {
            ...req,
            url: fullPath,
            path: fullPath,
            originalUrl: fullPath
        } as VercelRequest
        
        return handler(modifiedReq, res)
    } catch (error) {
        console.error('Error in API handler:', error)
        res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' })
    }
}

