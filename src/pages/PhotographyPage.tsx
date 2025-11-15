import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { MasonryGrid, type MasonrySection } from '../components/MasonryGrid'
import type { PhotographyCategory, PhotographyConfig } from '../types/photography'
import { getAdminToken, clearAdminToken } from '../lib/auth'
import { slugify } from '../lib/slugify'

const FALLBACK_CATEGORIES: PhotographyCategory[] = [
    {
        id: 'naturaleza',
        title: 'Naturaleza',
        description: 'Exploración visual de paisajes naturales, flora y fauna capturados en su estado más puro.',
        sections: [
            {
                gap: 48,
                columnImages: [
                    {
                        images: ['/img/hero-sliders/1.jpg', '/img/hero-sliders/5.jpg'],
                        flex: 1
                    },
                    {
                        images: ['/img/hero-sliders/2.jpg', '/img/hero-sliders/4.jpg'],
                        flex: 1
                    },
                    {
                        images: ['/img/hero-sliders/3.jpg'],
                        flex: 1
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
                        flex: 1
                    },
                    {
                        images: ['/img/hero-sliders/3.jpg'],
                        flex: 1
                    },
                    {
                        images: ['/img/hero-sliders/4.jpg', '/img/hero-sliders/5.jpg'],
                        flex: 1
                    }
                ]
            }
        ]
    }
]

const createEmptySection = (): MasonrySection => ({
    gap: 48,
    columnImages: [
        {
            images: [],
            flex: 1
        },
        {
            images: [],
            flex: 1
        },
        {
            images: [],
            flex: 1
        }
    ]
})

type ImageEditorState = {
    action: 'add' | 'replace'
    categoryId: string
    sectionIndex: number
    columnIndex: number
    imageIndex?: number
}

function cloneConfig(config: PhotographyConfig): PhotographyConfig {
    return JSON.parse(JSON.stringify(config)) as PhotographyConfig
}

function ensureThreeColumns(config: PhotographyConfig): PhotographyConfig {
    const sanitizeColumn = (column: MasonrySection['columnImages'][number]): MasonrySection['columnImages'][number] => {
        return {
            ...column,
            images: column.images ?? [],
            flex: column.flex ?? 1,
            marginTop: undefined,
            marginBottom: undefined,
            margins: undefined,
            marginLeft: undefined,
            marginRight: undefined
        }
    }

    return {
        categories: config.categories.map(category => ({
            ...category,
            sections: category.sections.map(section => {
                if (section.columnImages) {
                    const columnImages = section.columnImages.map(sanitizeColumn)
                    while (columnImages.length < 3) {
                        columnImages.push({
                            images: [],
                            flex: 1
                        })
                    }
                    return {
                        ...section,
                        columnImages,
                        margins: undefined,
                        marginLeft: undefined,
                        marginRight: undefined
                    }
                }
                return {
                    ...section,
                    margins: undefined,
                    marginLeft: undefined,
                    marginRight: undefined
                }
            })
        }))
    }
}

function PhotographyPage() {
    const [config, setConfig] = useState<PhotographyConfig>(ensureThreeColumns({ categories: FALLBACK_CATEGORIES }))
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [imageEditor, setImageEditor] = useState<ImageEditorState | null>(null)

    useEffect(() => {
        let isMounted = true

        async function loadPhotography() {
            try {
                const response = await fetch('/api/photography')
                if (!response.ok) {
                    throw new Error('No se pudo obtener la galería')
                }
                const config = ensureThreeColumns((await response.json()) as PhotographyConfig)
                if (isMounted && Array.isArray(config.categories)) {
                    setConfig(config)
                }
            } catch (err) {
                console.error(err)
                if (isMounted) {
                    setError('Mostrando la configuración local por un problema con el servidor.')
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        async function validateAdmin() {
            const token = getAdminToken()
            if (!token) {
                return
            }
            try {
                const response = await fetch('/api/auth/validate', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.ok) {
                    setIsAdmin(true)
                } else {
                    clearAdminToken()
                }
            } catch {
                // ignore
            }
        }

        loadPhotography()
        validateAdmin()

        return () => {
            isMounted = false
        }
    }, [])

    const categories = config.categories

    const content = loading
        ? [
            {
                id: 'loading',
                title: 'Cargando',
                description: 'Preparando la galería…',
                sections: [] as MasonrySection[]
            }
        ]
        : categories

    async function persistConfig(nextConfig: PhotographyConfig) {
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Inicia sesión en /admin para guardar cambios.')
            setEditMode(false)
            setIsAdmin(false)
            return
        }
        setSaving(true)
        setStatusMessage('Guardando cambios...')
        try {
            const normalized = ensureThreeColumns(nextConfig)
            const response = await fetch('/api/photography', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(normalized)
            })
            if (!response.ok) {
                throw new Error('No se pudo guardar la configuración')
            }
            setStatusMessage('Cambios guardados')
            setConfig(normalized)
        } catch (err) {
            console.error(err)
            setStatusMessage('Error al guardar la configuración')
        } finally {
            setSaving(false)
        }
    }

    function openAddImageModal(categoryId: string, sectionIndex: number, columnIndex: number) {
        setImageEditor({ action: 'add', categoryId, sectionIndex, columnIndex })
        setPendingFile(null)
        setStatusMessage(null)
    }

    function openReplaceModal(categoryId: string, sectionIndex: number, columnIndex: number, imageIndex: number) {
        setImageEditor({ action: 'replace', categoryId, sectionIndex, columnIndex, imageIndex })
        setPendingFile(null)
        setStatusMessage(null)
    }

    async function handleUploadSubmit() {
        if (!imageEditor || !pendingFile) {
            return
        }
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
            formData.append('category', imageEditor.categoryId)

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

            const nextConfig = cloneConfig(config)
            const category = nextConfig.categories.find(cat => cat.id === imageEditor.categoryId)
            const column = category?.sections?.[imageEditor.sectionIndex]?.columnImages?.[imageEditor.columnIndex]
            if (!category || !column) {
                throw new Error('No se encontró la columna')
            }
            if (imageEditor.action === 'replace' && imageEditor.imageIndex !== undefined) {
                column.images[imageEditor.imageIndex] = data.path
            } else {
                column.images.push(data.path)
            }
            setConfig(ensureThreeColumns(nextConfig))
            await persistConfig(nextConfig)
            setStatusMessage(imageEditor.action === 'replace' ? 'Imagen actualizada' : 'Imagen agregada')
            setImageEditor(null)
            setPendingFile(null)
        } catch (err) {
            console.error(err)
            setStatusMessage((err as Error).message || 'No se pudo subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    async function handleRemoveImage(categoryId: string, sectionIndex: number, columnIndex: number, imageIndex: number) {
        if (!window.confirm('¿Seguro que quieres eliminar esta imagen?')) {
            return
        }
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }
        try {
            const nextConfig = cloneConfig(config)
            const category = nextConfig.categories.find(cat => cat.id === categoryId)
            const column = category?.sections?.[sectionIndex]?.columnImages?.[columnIndex]
            if (!category || !column) {
                throw new Error('No se encontró la columna')
            }
            column.images.splice(imageIndex, 1)
            setConfig(ensureThreeColumns(nextConfig))
            await persistConfig(nextConfig)
            setStatusMessage('Imagen eliminada')
        } catch (error) {
            console.error(error)
            setStatusMessage('No se pudo eliminar la imagen')
        }
    }

    async function handleMoveImage(categoryId: string, sectionIndex: number, columnIndex: number, imageIndex: number, direction: 'up' | 'down') {
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }
        try {
            const nextConfig = cloneConfig(config)
            const category = nextConfig.categories.find(cat => cat.id === categoryId)
            const column = category?.sections?.[sectionIndex]?.columnImages?.[columnIndex]
            if (!category || !column) {
                throw new Error('No se encontró la columna')
            }
            const targetIndex = direction === 'up' ? imageIndex - 1 : imageIndex + 1
            if (targetIndex < 0 || targetIndex >= column.images.length) {
                return
            }
            ;[column.images[imageIndex], column.images[targetIndex]] = [column.images[targetIndex], column.images[imageIndex]]
            setConfig(ensureThreeColumns(nextConfig))
            await persistConfig(nextConfig)
            setStatusMessage('Imagen reordenada')
        } catch (error) {
            console.error(error)
            setStatusMessage('No se pudo reordenar la imagen')
        }
    }

    async function handleAddGrid(categoryId: string) {
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }
        const nextConfig = cloneConfig(config)
        const category = nextConfig.categories.find(cat => cat.id === categoryId)
        if (!category) {
            setStatusMessage('No se encontró la categoría')
            return
        }
        category.sections.push(createEmptySection())
        setConfig(ensureThreeColumns(nextConfig))
        await persistConfig(nextConfig)
    }

    async function handleAddCategory() {
        const token = getAdminToken()
        if (!token) {
            setStatusMessage('Debes iniciar sesión en /admin primero')
            return
        }
        const title = window.prompt('Título de la nueva sección')
        if (!title) {
            return
        }
        const description = window.prompt('Descripción') ?? ''
        const baseId = slugify(title)
        let uniqueId = baseId
        let suffix = 1
        while (config.categories.some(cat => cat.id === uniqueId)) {
            uniqueId = `${baseId}-${suffix++}`
        }
        const newCategory: PhotographyCategory = {
            id: uniqueId,
            title,
            description,
            sections: [createEmptySection()]
        }
        const nextConfig = cloneConfig(config)
        nextConfig.categories.push(newCategory)
        setConfig(ensureThreeColumns(nextConfig))
        await persistConfig(nextConfig)
    }

    const showEditorControls = isAdmin && !loading

    return (
        <>
            <Helmet>
                <title>Photography | Authentic Web Design</title>
                <meta name="description" content="Descubre nuestras colecciones de fotografía y producciones visuales." />
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/photography" logoSrc="/img/logo.png" />
                </div>

                <main className="pt-32 pb-24">
                    <div className="space-y-24">
                        {content.map((category, categoryIndex) => (
                            <section key={category.id ?? categoryIndex} className="space-y-8">
                                <div className="px-6 sm:px-12 md:px-24 lg:px-32">
                                    <div className="max-w-7xl mx-auto space-y-6">
                                        <h1 className="text-3xl md:text-4xl font-light">{category.title}</h1>
                                        <p className="text-base md:text-lg text-black/80 leading-relaxed max-w-4xl">{category.description}</p>
                                        {error && categoryIndex === 0 && <p className="text-sm text-red-500">{error}</p>}
                                        {showEditorControls && editMode && category.id && (
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddGrid(category.id!)}
                                                    className="rounded border border-black/20 px-3 py-1 text-black/70 hover:border-black hover:text-black"
                                                >
                                                    + Agregar grid
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {category.sections.length > 0 && (
                                    <div className="mt-12 w-full">
                                        <MasonryGrid
                                            sections={category.sections}
                                            horizontalMargin={10}
                                            editable={Boolean(showEditorControls && editMode)}
                                            onAddImage={(sectionIndex, columnIndex) => {
                                                if (!category.id) return
                                                openAddImageModal(category.id, sectionIndex, columnIndex)
                                            }}
                                            onReplaceImage={(sectionIndex, columnIndex, imageIndex) => {
                                                if (!category.id) return
                                                openReplaceModal(category.id, sectionIndex, columnIndex, imageIndex)
                                            }}
                                            onRemoveImage={(sectionIndex, columnIndex, imageIndex) => {
                                                if (!category.id) return
                                                handleRemoveImage(category.id, sectionIndex, columnIndex, imageIndex)
                                            }}
                                            onMoveImage={(sectionIndex, columnIndex, imageIndex, direction) => {
                                                if (!category.id) return
                                                handleMoveImage(category.id, sectionIndex, columnIndex, imageIndex, direction)
                                            }}
                                        />
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </main>

                <Footer />
            </div>
            {showEditorControls && (
                <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => setEditMode(prev => !prev)}
                        className="rounded-full bg-black px-4 py-2 text-white shadow-lg hover:bg-black/80"
                    >
                        {editMode ? 'Salir edición' : 'Editar galería'}
                    </button>
                    {editMode && (
                        <>
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="rounded-full bg-white px-4 py-2 text-black shadow hover:bg-gray-100"
                            >
                                + Nueva sección
                            </button>
                            {statusMessage && <span className="text-xs text-white text-right">{statusMessage}</span>}
                            {saving && <span className="text-xs text-white/70 text-right">Guardando…</span>}
                        </>
                    )}
                </div>
            )}

            {editMode && imageEditor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 text-black">
                        <h3 className="text-xl font-light">
                            {imageEditor.action === 'replace' ? 'Cambiar imagen' : 'Agregar imagen a la columna'}
                        </h3>
                        <p className="mt-2 text-sm text-black/70">
                            {imageEditor.action === 'replace'
                                ? 'Selecciona un nuevo archivo para reemplazar la imagen actual.'
                                : 'Se añadirá al final de la columna seleccionada. Luego podrás reordenar desde el JSON si lo necesitas.'}
                        </p>
                        <div className="mt-4 space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={event => setPendingFile(event.target.files?.[0] ?? null)}
                                className="w-full text-sm"
                            />
                            {pendingFile && <p className="text-xs text-black/60">Archivo: {pendingFile.name}</p>}
                        </div>
                        <div className="mt-6 flex justify-end gap-3 text-sm">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageEditor(null)
                                    setPendingFile(null)
                                }}
                                className="rounded border border-black/20 px-4 py-2"
                                disabled={uploading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleUploadSubmit}
                                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                                disabled={!pendingFile || uploading}
                            >
                                {uploading ? 'Subiendo…' : imageEditor.action === 'replace' ? 'Actualizar' : 'Subir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PhotographyPage


