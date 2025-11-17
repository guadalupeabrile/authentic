import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import type { PhotographyConfig } from '../types/photography'
import { getAdminToken } from '../lib/auth'

function AboutPage() {
    const [config, setConfig] = useState<PhotographyConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [bottomFile, setBottomFile] = useState<File | null>(null)
    const [bottomUploading, setBottomUploading] = useState(false)

    const aboutImages = config?.aboutImages ?? []
    const bottomImage = config?.aboutBottomImage ?? null

    useEffect(() => {
        let isMounted = true

        async function loadConfig() {
            try {
                const response = await fetch('/api/photography')
                if (!response.ok) {
                    throw new Error('No se pudo obtener la configuración')
                }
                const data = (await response.json()) as PhotographyConfig
                if (isMounted) {
                    setConfig(data)
                }
            } catch {
                // si falla, simplemente no mostramos imágenes dinámicas
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        async function validateAdmin() {
            const token = getAdminToken()
            if (!token) return
            try {
                const response = await fetch('/api/auth/validate', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!isMounted) return

                if (response.ok) {
                    setIsAdmin(true)
                } else {
                    // Si el token ya no es válido, marcamos que no es admin,
                    // pero no borramos el token de localStorage automáticamente
                    // para evitar “deslogueos” inesperados en otras pestañas.
                    setIsAdmin(false)
                }
            } catch {
                // ignore
            }
        }

        loadConfig().catch(() => {
            // ignore
        })
        validateAdmin().catch(() => {
            // ignore
        })

        return () => {
            isMounted = false
        }
    }, [])

    async function persistConfig(nextConfig: PhotographyConfig) {
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Inicia sesión en /admin para guardar cambios.')
            setEditMode(false)
            setIsAdmin(false)
            return
        }
        setStatusMessage('Guardando cambios...')
        try {
            const response = await fetch('/api/photography', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(nextConfig)
            })
            if (!response.ok) {
                throw new Error('No se pudo guardar la configuración')
            }
            setConfig(nextConfig)
            setStatusMessage('Cambios guardados')
        } catch (error) {
            console.error(error)
            setStatusMessage('Error al guardar cambios')
        }
    }

    async function handleUploadAboutImage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!pendingFile || !config) return

        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }

        setUploading(true)
        setStatusMessage('Subiendo imagen...')
        try {
            const formData = new FormData()
            formData.append('file', pendingFile)
            formData.append('category', 'about')

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('No se pudo subir la imagen')
            }

            const data = (await response.json()) as { path: string }
            const nextConfig: PhotographyConfig = {
                ...config,
                aboutImages: [...aboutImages, data.path]
            }
            await persistConfig(nextConfig)
            setPendingFile(null)
        } catch (error) {
            console.error(error)
            setStatusMessage('Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    async function handleRemoveAboutImage(index: number) {
        if (!config) return
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }
        const nextImages = aboutImages.filter((_, i) => i !== index)
        const nextConfig: PhotographyConfig = {
            ...config,
            aboutImages: nextImages
        }
        await persistConfig(nextConfig)
    }

    async function handleClearBottomImage() {
        if (!config) return
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }
        const nextConfig: PhotographyConfig = {
            ...config,
            aboutBottomImage: undefined
        }
        await persistConfig(nextConfig)
    }

    async function handleUploadBottomImage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!bottomFile || !config) return

        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }

        setBottomUploading(true)
        setStatusMessage('Subiendo imagen inferior...')
        try {
            const formData = new FormData()
            formData.append('file', bottomFile)
            formData.append('category', 'about-bottom')

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('No se pudo subir la imagen')
            }

            const data = (await response.json()) as { path: string }
            const nextConfig: PhotographyConfig = {
                ...config,
                aboutBottomImage: data.path
            }
            await persistConfig(nextConfig)
            setBottomFile(null)
        } catch (error) {
            console.error(error)
            setStatusMessage('Error al subir la imagen inferior')
        } finally {
            setBottomUploading(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>About | Authentic Web Design</title>
                <meta
                    name="description"
                    content="Conoce la historia, valores y el equipo detrás de Authentic Web Design."
                />
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/about" logoSrc="/img/logo_white.png" />
                </div>

                <main className="pt-32 pb-24 px-6">
                    <section className="max-w-6xl mx-auto md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] md:gap-12 md:items-stretch">
                        {/* Columna de imágenes (izquierda) */}
                        <aside className="mt-10 md:mt-0 md:border-r md:border-black/10 flex flex-col h-full">
                            {aboutImages.length > 0 ? (
                                <div className="group relative w-full h-full min-h-[280px]">
                                    <img
                                        src={aboutImages[0]}
                                        alt="About image"
                                        className="w-full h-full object-cover"
                                    />
                                    {isAdmin && editMode && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAboutImage(0)}
                                            className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition"
                                        >
                                            Quitar
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-black/50 max-w-xs">
                                    Agrega rutas en <strong>aboutImages</strong> desde el panel de Admin (JSON de fotografía) para mostrar
                                    imágenes aquí.
                                </p>
                            )}

                            {isAdmin && editMode && (
                                <form onSubmit={handleUploadAboutImage} className="mt-4 space-y-2 text-xs">
                                    <label className="block">
                                        <span className="uppercase tracking-[0.2em] text-black/60">Nueva imagen</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={event => setPendingFile(event.target.files?.[0] ?? null)}
                                            className="mt-2 w-full text-xs"
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={!pendingFile || uploading}
                                        className="rounded border border-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white disabled:opacity-50"
                                    >
                                        {uploading ? 'Subiendo…' : 'Agregar imagen'}
                                    </button>
                                    {statusMessage && <p className="text-[11px] text-black/60 mt-1">{statusMessage}</p>}
                                </form>
                            )}
                        </aside>

                        {/* Texto principal (derecha) */}
                        <div className="space-y-6 md:pl-4">
                            <h1 className="text-2xl md:text-4xl font-light tracking-[0.15em] uppercase">
                                About Authentic
                            </h1>
                            <p className="max-w-3xl text-sm italic text-black/80 leading-relaxed !mt-1">Still wondering whether the word "authentic" is genuinely authentic.</p>
                            <p className="max-w-3xl text-base text-black/80 leading-relaxed md:ml-auto">
                                I am a multidisciplinary creator who brings together project management, photography, web development, and a personal path rooted in yoga and reiki. I'm passionate about water sports, meditation, and the quiet observation of the natural world we're part of.
                            </p>
                            <p className="max-w-3xl text-base text-black/80 leading-relaxed">
                                I'm at a point where I'm <strong>integrating</strong> both sides of my path: the analytical mind of project management and engineering with the intuitive world of yoga, reiki and meditation. This results in <strong>projects that flow, solve problems, and still have soul</strong>.
                            </p>
                            <p className="max-w-3xl text-base text-black/80 leading-relaxed">
                                I focus on building functional, aesthetic, and intuitive websites for entrepreneurs, artists, therapists, and businesses that need an online presence with purpose. My approach blends strategy, visual sensitivity, and simple, honest communication.
                            </p>
                            <p className="max-w-3xl text-base text-black/80 leading-relaxed">
                                Photography is another core part of my work: I document spaces, nature and visual stories that help brands express who they are.
                            </p>
                            <p className="max-w-3xl text-base text-black/80 leading-relaxed">
                                My goal is to create digital experiences that are honest, useful, and beautiful—while making every client <strong>feel supported, guided, and empowered</strong>.
                            </p>
                            <p className="max-w-3xl text-base text-black/80 leading-relaxed"> With kindness, Guadalupe.</p>
                        </div>
                    </section>

                    {/* Imagen inferior con mismos márgenes que la sección superior */}
                    {bottomImage && (
                        <section className="mt-16">
                            <div className="max-w-6xl mx-auto">
                                <img
                                    src={bottomImage}
                                    alt="About bottom"
                                    className="w-full h-auto object-contain"
                                />
                                {isAdmin && editMode && (
                                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-black/60 mt-3 px-6">
                                        <button
                                            type="button"
                                            onClick={handleClearBottomImage}
                                            className="rounded border border-black/30 px-3 py-1 uppercase tracking-[0.18em] hover:bg-black hover:text-white"
                                        >
                                            Quitar imagen inferior
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {isAdmin && editMode && (
                        <section className="max-w-6xl mx-auto mt-6">
                            <form onSubmit={handleUploadBottomImage} className="max-w-3xl space-y-2 text-xs">
                                <label className="block">
                                    <span className="uppercase tracking-[0.2em] text-black/60">Nueva imagen inferior</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={event => setBottomFile(event.target.files?.[0] ?? null)}
                                        className="mt-2 w-full text-xs"
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={!bottomFile || bottomUploading}
                                    className="rounded border border-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white disabled:opacity-50"
                                >
                                    {bottomUploading ? 'Subiendo…' : bottomImage ? 'Reemplazar imagen inferior' : 'Agregar imagen inferior'}
                                </button>
                            </form>
                        </section>
                    )}
                </main>

                <Footer darkText />

                {isAdmin && !loading && (
                    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => setEditMode(prev => !prev)}
                            className="rounded-full bg-black px-4 py-2 text-xs uppercase tracking-[0.2em] text-white shadow-lg hover:bg-black/80"
                        >
                            {editMode ? 'Salir edición About' : 'Editar imágenes About'}
                        </button>
                        {statusMessage && !editMode && (
                            <span className="text-[11px] text-black/70 bg-white px-2 py-1 rounded shadow">{statusMessage}</span>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default AboutPage


