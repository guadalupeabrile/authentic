import type { VercelRequest, VercelResponse } from '@vercel/node'
import serverless from 'serverless-http'
import app from '../server/app'

// Crear el handler serverless una sola vez
const handler = serverless(app, {
    binary: ['image/*', 'application/octet-stream']
})

// Catch-all handler para todas las rutas /api/*
export default async function (req: VercelRequest, res: VercelResponse) {
    try {
        console.log('=== API Handler Called ===')
        console.log('Method:', req.method)
        console.log('URL:', req.url)
        console.log('Query:', req.query)

        // En Vercel, api/[...path].ts captura todas las rutas /api/*
        // req.query.path contiene el path después de /api/
        const path = req.query.path as string | string[] | undefined
        const pathString = Array.isArray(path) ? path.join('/') : path || ''

        // Construir la URL completa con /api/
        const fullPath = `/api/${pathString}`

        console.log('Path string:', pathString)
        console.log('Full path:', fullPath)
        
        // Crear request modificado con la URL correcta
        const modifiedReq = {
            ...req,
            url: fullPath,
            path: fullPath,
            originalUrl: fullPath
        } as VercelRequest
        
        console.log('Calling serverless handler...')
        return handler(modifiedReq, res)
    } catch (error) {
        console.error('=== ERROR in API handler ===')
        console.error('Error type:', error?.constructor?.name)
        console.error('Error message:', error instanceof Error ? error.message : String(error))
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')

        if (!res.headersSent) {
            res.status(500).json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
            })
        }
    }
}

