import { useEffect, useState } from 'react'
import type { PhotographyConfig } from '../types/photography'
import { clearAdminToken, getAdminToken, setAdminToken } from '../lib/auth'

function AdminPage() {
    const [token, setToken] = useState<string>(() => getAdminToken() || '')
    const [loginForm, setLoginForm] = useState({ username: '' })
    const [configText, setConfigText] = useState<string>('')
    const [configError, setConfigError] = useState<string | null>(null)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [uploadCategory, setUploadCategory] = useState('')
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadResult, setUploadResult] = useState<string | null>(null)
    const [loadingConfig, setLoadingConfig] = useState(true)
    const [parsedConfig, setParsedConfig] = useState<PhotographyConfig | null>(null)
    const [aboutImageInput, setAboutImageInput] = useState('')

    const isAuthenticated = Boolean(token)

    useEffect(() => {
        fetchConfig().catch(() => {
            setStatusMessage('No se pudo cargar la configuración inicial')
            setConfigText('')
        })
    }, [])

    useEffect(() => {
        if (!uploadCategory && configText) {
            try {
                const parsed = JSON.parse(configText) as PhotographyConfig
                const firstCategory = parsed.categories?.[0]?.id ?? ''
                setUploadCategory(firstCategory)
            } catch {
                // ignore
            }
        }
    }, [configText, uploadCategory])

    useEffect(() => {
        if (!configText) {
            setParsedConfig(null)
            setConfigError(null)
            return
        }
        try {
            const parsed = JSON.parse(configText) as PhotographyConfig
            setParsedConfig(parsed)
            setConfigError(null)
        } catch (error) {
            setParsedConfig(null)
            setConfigError((error as Error).message)
        }
    }, [configText])

    async function fetchConfig() {
        setLoadingConfig(true)
        setStatusMessage(null)
        try {
            const response = await fetch('/api/photography')
            if (!response.ok) {
                throw new Error('No se pudo cargar la configuración')
            }
            const data = (await response.json()) as PhotographyConfig
            setConfigText(JSON.stringify(data, null, 2))
        } finally {
            setLoadingConfig(false)
        }
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setStatusMessage(null)
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: loginForm.username })
        })
        if (!response.ok) {
            setStatusMessage('Credenciales inválidas')
            return
        }
        const data = (await response.json()) as { token: string }
        setAdminToken(data.token)
        setToken(data.token)
        setStatusMessage('Sesion iniciada')
    }

    function handleLogout() {
        clearAdminToken()
        setToken('')
    }

    async function handleSaveConfig() {
        if (!parsedConfig) {
            setStatusMessage('No se puede guardar: JSON inválido')
            return
        }
        const response = await fetch('/api/photography', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(parsedConfig)
        })
        if (!response.ok) {
            setStatusMessage('No se pudo guardar la configuración')
            return
        }
        setStatusMessage('Configuración guardada')
    }

    function updateConfig(updater: (current: PhotographyConfig) => PhotographyConfig) {
        setParsedConfig(prev => {
            if (!prev) return prev
            const next = updater(prev)
            setConfigText(JSON.stringify(next, null, 2))
            return next
        })
    }

    async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!uploadFile) {
            setUploadResult('Selecciona un archivo')
            return
        }
        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('category', uploadCategory || 'uncategorized')

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        if (!response.ok) {
            setUploadResult('Error al subir la imagen')
            return
        }
        const data = (await response.json()) as { path: string }
        setUploadResult(`Lista para usar: ${data.path}`)
        setUploadFile(null)
            ; (event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement).value = ''
        await fetchConfig()
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-8 border border-white/20 rounded-lg bg-white/5">
                    <h1 className="text-2xl font-light">Panel de Administración</h1>
                    <label className="block">
                        <span className="text-sm uppercase tracking-wide">Usuario</span>
                        <input
                            type="text"
                            value={loginForm.username}
                            onChange={event => setLoginForm(prev => ({ ...prev, username: event.target.value }))}
                            className="mt-2 w-full bg-black/40 border border-white/20 rounded px-3 py-2"
                        />
                    </label>
                    <button type="submit" className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition">
                        Ingresar
                    </button>
                    {statusMessage && <p className="text-sm text-red-300">{statusMessage}</p>}
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-8">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="uppercase text-xs text-white/60 tracking-[0.4em]">Admin panel</p>
                    <h1 className="text-3xl font-light">Fotografía & Layout</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={fetchConfig}
                        className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition"
                    >
                        Refrescar
                    </button>
                    <button type="button" onClick={handleLogout} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-light">Configuración JSON</h2>
                        {statusMessage && <span className="text-sm text-emerald-300">{statusMessage}</span>}
                    </div>
                    <textarea
                        value={configText}
                        onChange={event => setConfigText(event.target.value)}
                        className="w-full h-[520px] bg-black/40 border border-white/20 rounded-md p-4 font-mono text-sm"
                        spellCheck={false}
                    />
                    {loadingConfig && <p className="text-sm text-white/60">Cargando configuración...</p>}
                    {configError && <p className="text-sm text-red-400">Error: {configError}</p>}
                    <button
                        type="button"
                        onClick={handleSaveConfig}
                        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition disabled:opacity-50"
                        disabled={!parsedConfig}
                    >
                        Guardar configuración
                    </button>
                    <p className="text-xs text-white/50 leading-relaxed">
                        Puedes editar la estructura completa (categorías, secciones, columnas) manteniendo el formato del MasonryGrid. Guarda para aplicar
                        los cambios y publícalos inmediatamente en el sitio.
                    </p>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-3 border border-white/15 rounded-lg p-4 bg-white/5">
                        <h2 className="text-lg font-light">Subir nueva imagen</h2>
                        <form className="space-y-4" onSubmit={handleUpload}>
                            <label className="block">
                                <span className="text-xs uppercase tracking-widest text-white/60">Categoría destino</span>
                                <input
                                    type="text"
                                    value={uploadCategory}
                                    onChange={event => setUploadCategory(event.target.value)}
                                    className="mt-1 w-full bg-black/40 border border-white/20 rounded px-3 py-2"
                                    placeholder="naturaleza"
                                />
                            </label>
                            <label className="block">
                                <span className="text-xs uppercase tracking-widest text-white/60">Archivo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={event => {
                                        const file = event.target.files?.[0]
                                        setUploadFile(file ?? null)
                                    }}
                                    className="mt-1 w-full text-sm"
                                />
                            </label>
                            <button type="submit" className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition">
                                Subir imagen
                            </button>
                        </form>
                        {uploadResult && <p className="text-xs text-emerald-300">{uploadResult}</p>}
                        <p className="text-xs text-white/60">Copia la ruta devuelta y úsala en tus layouts o en About.</p>
                    </div>

                    <div className="space-y-3 border border-white/15 rounded-lg p-4 bg-white/5">
                        <h2 className="text-lg font-light">Imágenes de About</h2>
                        <p className="text-xs text-white/60">
                            Administra las imágenes que aparecen en la columna derecha de la página About.
                        </p>
                        <form
                            className="space-y-3"
                            onSubmit={event => {
                                event.preventDefault()
                                if (!aboutImageInput.trim() || !parsedConfig) return
                                const value = aboutImageInput.trim()
                                updateConfig(current => ({
                                    ...current,
                                    aboutImages: [...(current.aboutImages ?? []), value]
                                }))
                                setAboutImageInput('')
                            }}
                        >
                            <label className="block">
                                <span className="text-xs uppercase tracking-widest text-white/60">Nueva ruta de imagen</span>
                                <input
                                    type="text"
                                    value={aboutImageInput}
                                    onChange={event => setAboutImageInput(event.target.value)}
                                    className="mt-1 w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-xs"
                                    placeholder="/uploads/photography/..."
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
                                disabled={!aboutImageInput.trim() || !parsedConfig}
                            >
                                Agregar a About
                            </button>
                        </form>
                        <div className="space-y-2 max-h-64 overflow-auto border-t border-white/10 pt-3">
                            {(parsedConfig?.aboutImages ?? []).length === 0 ? (
                                <p className="text-xs text-white/50">Todavía no hay imágenes configuradas para About.</p>
                            ) : (
                                (parsedConfig?.aboutImages ?? []).map((image, index) => (
                                    <div
                                        key={image + index}
                                        className="flex items-center justify-between gap-2 text-xs bg-black/40 border border-white/15 rounded px-2 py-1"
                                    >
                                        <span className="truncate" title={image}>
                                            {image}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {parsedConfig?.aboutBottomImage === image && (
                                                <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-200">
                                                    Inferior
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                className="text-xs text-white/80 hover:text-white"
                                                onClick={() => {
                                                    if (!parsedConfig) return
                                                    updateConfig(current => ({
                                                        ...current,
                                                        aboutBottomImage: image
                                                    }))
                                                }}
                                            >
                                                Usar abajo
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-300 hover:text-red-200"
                                                onClick={() => {
                                                    if (!parsedConfig) return
                                                    updateConfig(current => ({
                                                        ...current,
                                                        aboutImages: (current.aboutImages ?? []).filter((_, i) => i !== index),
                                                        aboutBottomImage:
                                                            current.aboutBottomImage === image ? undefined : current.aboutBottomImage
                                                    }))
                                                }}
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 border border-white/15 rounded-lg p-4 bg-white/5">
                        <h2 className="text-lg font-light">Referencia rápida</h2>
                        <ul className="space-y-2 text-xs text-white/70">
                            <li>- Usa IDs únicos por categoría para mantener orden.</li>
                            <li>- gap controla la separación vertical; flex y flexPerImage manejan proporciones.</li>
                            <li>- Puedes mezclar imágenes existentes en /img con nuevas de /uploads.</li>
                            <li>- Recuerda publicar cambios pegando nuevas rutas en el JSON y guardando.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AdminPage


