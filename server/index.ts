import path from 'node:path'
import { fileURLToPath } from 'node:url'

import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs-extra'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { v4 as uuid } from 'uuid'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const STORAGE_DIR = path.join(ROOT_DIR, 'server', 'storage')
const CONFIG_PATH = path.join(STORAGE_DIR, 'photography.json')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const UPLOADS_ROOT = path.join(PUBLIC_DIR, 'uploads', 'photography')

const PORT = Number(process.env.PORT) || 4000
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) ?? ['http://localhost:5173']

if (!ADMIN_PASSWORD_HASH) {
    console.warn('ADMIN_PASSWORD_HASH is not set. Use env.example to configure your credentials.')
    process.exit(1)
}

type MasonrySection = {
    columns?: {
        mobile?: number
        tablet?: number
        desktop?: number
    }
    gap?: number
    columnImages?: Array<{
        images: string[]
        flex?: number
        marginTop?: number[]
        marginBottom?: number[]
        marginLeft?: number[]
        marginRight?: number[]
        flexPerImage?: number[]
        justifyContent?: string[]
        alignItems?: string[]
    }>
}

type PhotographyCategory = {
    id: string
    title: string
    description: string
    sections: MasonrySection[]
}

type PhotographyConfig = {
    categories: PhotographyCategory[]
    // Rutas de imágenes que se usan específicamente en la página About
    aboutImages?: string[]
    // Imagen destacada que se muestra debajo del texto en About
    aboutBottomImage?: string
}

const app = express()

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true)
                return
            }
            if (CORS_ORIGIN.includes(origin)) {
                callback(null, true)
                return
            }
            callback(new Error('Not allowed by CORS'))
        }
    })
)
app.use(express.json({ limit: '5mb' }))
app.use('/uploads', express.static(path.join(PUBLIC_DIR, 'uploads')))

const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        try {
            await fs.ensureDir(UPLOADS_ROOT)
            cb(null, UPLOADS_ROOT)
        } catch (error) {
            cb(error as Error, '')
        }
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `${Date.now()}-${uuid()}${ext}`
        cb(null, uniqueName)
    }
})

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Solo se permiten archivos de imagen.'))
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
})

function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .toLowerCase() || 'categoria'
}

async function readConfig(): Promise<PhotographyConfig> {
    const exists = await fs.pathExists(CONFIG_PATH)
    if (!exists) {
        const defaultConfig = getDefaultConfig()
        await writeConfig(defaultConfig)
        return defaultConfig
    }
    return fs.readJSON(CONFIG_PATH)
}

function getDefaultConfig(): PhotographyConfig {
    return {
        categories: [
            {
                id: 'naturaleza',
                title: 'Naturaleza',
                description: 'Exploración visual de paisajes naturales, flora y fauna capturados en su estado más puro.',
                sections: [
                    {
                        gap: 48,
                        columnImages: [
                            {
                                images: ['/img/hero-sliders/1.jpg', '/img/hero-sliders/3.jpg', '/img/hero-sliders/5.jpg'],
                                flex: 1,
                                marginTop: [0, 20, 10],
                                marginBottom: [200, 40, 35],
                                flexPerImage: [0.9, 0.8, 1],
                                justifyContent: ['flex-start', 'center', 'flex-end'],
                                alignItems: ['flex-start', 'center', 'flex-end']
                            },
                            {
                                images: ['/img/hero-sliders/2.jpg', '/img/hero-sliders/4.jpg'],
                                flex: 1.5,
                                marginTop: [200, 15],
                                marginBottom: [50, 60],
                                flexPerImage: [1, 1],
                                justifyContent: ['center', 'flex-start'],
                                alignItems: ['center', 'flex-start']
                            }
                        ]
                    }
                ]
            },
            {
                id: 'retratos',
                title: 'Retratos',
                description: 'Colección de retratos que capturan la esencia y personalidad de cada sujeto.',
                sections: [
                    {
                        gap: 48,
                        columnImages: [
                            {
                                images: ['/img/hero-sliders/1.jpg', '/img/hero-sliders/2.jpg'],
                                flex: 1,
                                marginTop: [0, 30],
                                marginBottom: [40, 50],
                                flexPerImage: [1, 0.9],
                                justifyContent: ['center', 'flex-start'],
                                alignItems: ['center', 'center']
                            },
                            {
                                images: ['/img/hero-sliders/3.jpg', '/img/hero-sliders/4.jpg', '/img/hero-sliders/5.jpg'],
                                flex: 1,
                                marginTop: [20, 10, 0],
                                marginBottom: [50, 40, 60],
                                flexPerImage: [0.8, 1, 0.9],
                                justifyContent: ['flex-end', 'center', 'flex-start'],
                                alignItems: ['flex-start', 'center', 'flex-end']
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

async function writeConfig(config: PhotographyConfig) {
    await fs.ensureDir(STORAGE_DIR)
    await fs.writeJSON(CONFIG_PATH, config, { spaces: 2 })
}

function createToken(username: string) {
    return jwt.sign(
        {
            sub: username
        },
        JWT_SECRET,
        {
            expiresIn: '4h'
        }
    )
}

function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token requerido' })
    }
    const token = authHeader.slice(7)
    try {
        const payload = jwt.verify(token, JWT_SECRET)
            ; (req as express.Request & { user?: unknown }).user = payload
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' })
    }
}

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' })
    }
    const matches = username === ADMIN_USERNAME && (await bcrypt.compare(password, ADMIN_PASSWORD_HASH))
    if (!matches) {
        return res.status(401).json({ message: 'Credenciales inválidas' })
    }
    const token = createToken(username)
    res.json({ token })
})

app.get('/api/auth/validate', authenticateToken, (_req, res) => {
    res.json({ ok: true })
})

app.get('/api/photography', async (_req, res) => {
    try {
        const config = await readConfig()
        res.json(config)
    } catch (error) {
        console.error('Error reading photography config', error)
        res.status(500).json({ message: 'No se pudo obtener la configuración' })
    }
})

app.put('/api/photography', authenticateToken, async (req, res) => {
    try {
        const payload = req.body as PhotographyConfig
        if (!payload || !Array.isArray(payload.categories)) {
            return res.status(400).json({ message: 'Formato inválido de configuración' })
        }
        await writeConfig(payload)
        res.json({ message: 'Configuración actualizada' })
    } catch (error) {
        console.error('Error writing photography config', error)
        res.status(500).json({ message: 'No se pudo guardar la configuración' })
    }
})

app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Archivo requerido' })
    }
    const category = typeof req.body.category === 'string' ? slugify(req.body.category) : 'uncategorized'
    const finalDir = path.join(UPLOADS_ROOT, category)
    await fs.ensureDir(finalDir)
    const finalPath = path.join(finalDir, req.file.filename)

    if (req.file.path !== finalPath) {
        await fs.move(req.file.path, finalPath, { overwrite: true })
    }

    const relativePath = path.join('/uploads', 'photography', category, req.file.filename)
    res.json({
        message: 'Archivo cargado correctamente',
        path: relativePath
    })
})

// Error handler para multer / errores inesperados
app.use((err: unknown, _req: express.Request, res: express.Response) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message })
    }
    if (err instanceof Error) {
        console.error(err)
        return res.status(500).json({ message: err.message })
    }
    return res.status(500).json({ message: 'Error inesperado' })
})

async function bootstrap() {
    await fs.ensureDir(UPLOADS_ROOT)
    await readConfig()

    app.listen(PORT, () => {
        console.log(`Admin server listo en http://localhost:${PORT}`)
    })
}

bootstrap().catch(error => {
    console.error('No se pudo iniciar el servidor', error)
    process.exit(1)
})


