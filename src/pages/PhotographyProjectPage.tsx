import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { MasonryGrid, type MasonrySection } from '../components/MasonryGrid'
import type { PhotographyConfig } from '../types/photography'
import photographyData from '../data/photography.json'

// Hook para detectar si estamos en mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768) // md breakpoint
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile
}

// Componente para detectar cuando un elemento alcanza el 50% del viewport
function ScrollSentinel({ onIntersect }: { onIntersect: () => void }) {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const hasTriggered = useRef(false)

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Cuando el elemento está al 50% del viewport (threshold: 0.5)
                    // Usamos rootMargin para trigger cuando el elemento está a 50vh del viewport
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.3 && !hasTriggered.current) {
                        hasTriggered.current = true
                        onIntersect()
                        // Reset después de un delay para permitir cargar más imágenes
                        setTimeout(() => {
                            hasTriggered.current = false
                        }, 1000)
                    }
                })
            },
            {
                threshold: [0, 0.3, 0.5, 1],
                rootMargin: '0px 0px -50% 0px' // Trigger cuando el elemento está al 50% del viewport desde abajo
            }
        )

        observer.observe(sentinel)

        return () => {
            observer.disconnect()
        }
    }, [onIntersect])

    return <div ref={sentinelRef} className="h-1 w-full" />
}

function ensureThreeColumns(config: PhotographyConfig): PhotographyConfig {
    const sanitizeColumn = (
        column: NonNullable<MasonrySection['columnImages']>[number]
    ): NonNullable<MasonrySection['columnImages']>[number] => {
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
                if (Array.isArray(section.columnImages)) {
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

interface PhotographyProjectPageProps {
    projectId: string
}

function PhotographyProjectPage({ projectId }: PhotographyProjectPageProps) {
    const [config, setConfig] = useState<PhotographyConfig>(ensureThreeColumns({ categories: [] }))
    const [loading, setLoading] = useState(true)
    const isMobile = useIsMobile()
    // Track how many images to show per category
    // Desktop: starts at 6 (2 per column), increases on scroll
    // Mobile: starts at 6, increases on "show more" click
    const [imagesShownPerCategory, setImagesShownPerCategory] = useState<Map<string, number>>(new Map())

    useEffect(() => {
        try {
            const normalized = ensureThreeColumns(photographyData as PhotographyConfig)
            setConfig(normalized)
        } catch (err) {
            console.error('Error loading photography config:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    // Find the category/project by id
    const category = config.categories.find(cat => cat.id === projectId)

    // Función para contar el total de imágenes en una categoría
    // Solo cuenta las imágenes de la primera sección con imágenes (la que realmente se muestra)
    const countImagesInCategory = (category: typeof config.categories[0]): number => {
        // Buscar la primera sección con columnImages
        const firstSectionWithColumns = category.sections.find(section =>
            section.columnImages && section.columnImages.length > 0 &&
            section.columnImages.some(col => col.images.length > 0)
        )

        if (firstSectionWithColumns && firstSectionWithColumns.columnImages) {
            const columns = firstSectionWithColumns.columnImages
            const flattenedImages = flattenColumnImages(columns)
            return flattenedImages.length
        }

        // Fallback: si no hay columnImages, usar el método antiguo
        const firstSection = category.sections.find(section => section.images && section.images.length > 0)
        if (firstSection && firstSection.images) {
            return firstSection.images.length
        }

        return 0
    }

    // Función para aplanar imágenes de todas las columnas en un solo array intercalado
    // Intercala las imágenes: col1[0], col2[0], col3[0], col1[1], col2[1], col3[1], etc.
    const flattenColumnImages = (columns: NonNullable<MasonrySection['columnImages']>): string[] => {
        const flattened: string[] = []
        const lengths = columns.map(col => col.images.length)
        const maxLength = lengths.length > 0 ? Math.max(...lengths) : 0

        for (let i = 0; i < maxLength; i++) {
            for (let colIndex = 0; colIndex < columns.length; colIndex++) {
                if (columns[colIndex]?.images[i]) {
                    flattened.push(columns[colIndex].images[i])
                }
            }
        }

        return flattened
    }

    // Función para reconstruir columnas desde un array aplanado
    const reconstructColumns = (
        flattenedImages: string[],
        originalColumns: NonNullable<MasonrySection['columnImages']>,
        count: number
    ): NonNullable<MasonrySection['columnImages']> => {
        const limitedImages = flattenedImages.slice(0, count)
        const reconstructed: NonNullable<MasonrySection['columnImages']> = []

        // Inicializar columnas vacías
        for (let i = 0; i < originalColumns.length; i++) {
            reconstructed.push({
                ...originalColumns[i],
                images: []
            })
        }

        // Distribuir las imágenes de vuelta a las columnas de forma intercalada
        for (let i = 0; i < limitedImages.length; i++) {
            const colIndex = i % originalColumns.length
            reconstructed[colIndex].images.push(limitedImages[i])
        }

        return reconstructed
    }

    // Función para obtener las secciones limitadas progresivamente
    // Desktop: Muestra 6 imágenes inicialmente (2 por columna), luego más al hacer scroll
    // Mobile: Muestra 6 imágenes en una sola columna, luego más al hacer click en "show more"
    const getLimitedSections = (category: typeof config.categories[0], categoryId: string): MasonrySection[] => {
        const imagesToShow = imagesShownPerCategory.get(categoryId) ?? 6 // Por defecto mostrar 6 imágenes

        // Buscar la primera sección con columnImages
        const firstSectionWithColumns = category.sections.find(section =>
            section.columnImages && section.columnImages.length > 0 &&
            section.columnImages.some(col => col.images.length > 0)
        )

        if (firstSectionWithColumns && firstSectionWithColumns.columnImages) {
            const columns = firstSectionWithColumns.columnImages
            const flattenedImages = flattenColumnImages(columns)
            const totalImages = flattenedImages.length

            // Si todas las imágenes están mostradas, devolver la primera sección completa
            if (imagesToShow >= totalImages) {
                if (isMobile) {
                    return [{
                        ...firstSectionWithColumns,
                        images: flattenedImages, // Todas las imágenes aplanadas
                        columnImages: undefined,
                        columns: {
                            mobile: 1,
                            tablet: 1,
                            desktop: 1
                        }
                    }]
                } else {
                    // Desktop: devolver todas las columnas originales
                    return [firstSectionWithColumns]
                }
            }

            if (isMobile) {
                // Mobile: Mostrar imágenes en una sola columna (aplanadas)
                return [{
                    ...firstSectionWithColumns,
                    images: flattenedImages.slice(0, imagesToShow), // Usar images en lugar de columnImages para mobile
                    columnImages: undefined,
                    columns: {
                        mobile: 1,
                        tablet: 1,
                        desktop: 1
                    }
                }]
            } else {
                // Desktop: Reconstruir las columnas con las imágenes limitadas (2 por columna inicialmente)
                const limitedColumnImages = reconstructColumns(flattenedImages, columns, imagesToShow)

                return [{
                    ...firstSectionWithColumns,
                    columnImages: limitedColumnImages,
                    columns: {
                        mobile: 1,
                        tablet: firstSectionWithColumns.columns?.tablet,
                        desktop: firstSectionWithColumns.columns?.desktop
                    }
                }]
            }
        }

        // Fallback: si no hay columnImages, usar el método antiguo
        const firstSection = category.sections.find(section => section.images && section.images.length > 0)
        if (firstSection && firstSection.images) {
            const totalImages = firstSection.images.length
            if (imagesToShow >= totalImages) {
                // Devolver la sección completa
                return [firstSection]
            }
            return [{
                ...firstSection,
                images: firstSection.images.slice(0, imagesToShow)
            }]
        }

        return []
    }

    // Función para incrementar progresivamente las imágenes mostradas
    // Desktop: Calcula cuántas imágenes más mostrar basándose en el viewport
    // Mobile: Incrementa en 6 imágenes
    const showMoreImages = (categoryId: string, category: typeof config.categories[0]) => {
        const currentShown = imagesShownPerCategory.get(categoryId) ?? 6
        const totalImages = countImagesInCategory(category)

        if (isMobile) {
            // Mobile: Incrementar en 6 imágenes o mostrar todas las restantes
            const nextCount = Math.min(currentShown + 6, totalImages)
            setImagesShownPerCategory(prev => {
                const newMap = new Map(prev)
                newMap.set(categoryId, nextCount)
                return newMap
            })
        } else {
            // Desktop: Calcular cuántas imágenes más mostrar basándose en el viewport
            // Estimamos que cada imagen tiene aproximadamente 400-600px de altura promedio
            // Cargamos suficientes imágenes para llenar aproximadamente 2 viewports más
            const viewportHeight = window.innerHeight
            const estimatedImageHeight = 500 // Altura promedio estimada por imagen
            const imagesPerViewport = Math.ceil(viewportHeight / estimatedImageHeight)
            const imagesToAdd = imagesPerViewport * 2 // Cargar para 2 viewports más

            const nextCount = Math.min(currentShown + imagesToAdd, totalImages)

            setImagesShownPerCategory(prev => {
                const newMap = new Map(prev)
                newMap.set(categoryId, nextCount)
                return newMap
            })
        }
    }

    if (loading) {
        return (
            <>
                <Helmet>
                    <title>Loading... | Authentic Web Design</title>
                </Helmet>
                <div className="relative min-h-screen bg-white text-black">
                    <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                        <HeaderSecondary activeUrl="/photography" />
                    </div>
                    <main className="pt-32 pb-36">
                        <div className="px-6 text-center">
                            <p className="text-black/60">Cargando galería...</p>
                        </div>
                    </main>
                    <Footer darkText />
                </div>
            </>
        )
    }

    if (!category) {
        return (
            <>
                <Helmet>
                    <title>Project Not Found | Authentic Web Design</title>
                </Helmet>
                <div className="relative min-h-screen bg-white text-black">
                    <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                        <HeaderSecondary activeUrl="/photography" />
                    </div>
                    <main className="pt-32 pb-36">
                        <div className="px-6 text-center space-y-4">
                            <p className="text-black/60">Proyecto no encontrado.</p>
                            <a href="/photography" className="text-black underline">Volver a Photography</a>
                        </div>
                    </main>
                    <Footer darkText />
                </div>
            </>
        )
    }

    const categoryId = category.id ?? projectId
    const totalImages = countImagesInCategory(category)
    const imagesShown = imagesShownPerCategory.get(categoryId) ?? 6
    const limitedSections = getLimitedSections(category, categoryId)
    const hasMoreImages = imagesShown < totalImages

    return (
        <>
            <Helmet>
                <title>{category.title} | Authentic Web Design</title>
                <meta name="description" content={category.description} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${category.title} | Authentic Web Studio`} />
                <meta property="og:description" content={category.description} />
                <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/hero-sliders/1.webp`} />
                <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
                <meta property="og:site_name" content="Authentic Web Design" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${category.title} | Authentic Web Studio`} />
                <meta name="twitter:description" content={category.description} />
                <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/hero-sliders/1.webp`} />
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/photography" />
                </div>

                <main className="pt-32 pb-36">
                    <motion.section
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="px-6 mb-24"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="space-y-6">
                                <h1 className="text-2xl md:text-4xl font-light">{category.title}</h1>
                                <p className="text-base text-black/80 leading-relaxed max-w-6xl">{category.description}</p>
                            </div>
                        </motion.div>

                        {limitedSections.length > 0 && (
                            <div className="mt-6 md:mt-12 w-full px-6">
                                <div className="">
                                    <MasonryGrid
                                        sections={limitedSections}
                                        horizontalMargin={0}
                                        editable={false}
                                    />
                                </div>
                                {/* Sentinel element para detectar scroll en desktop */}
                                {!isMobile && hasMoreImages && (
                                    <ScrollSentinel
                                        onIntersect={() => {
                                            // Cuando el sentinel está al 50% del viewport, cargar más imágenes
                                            showMoreImages(categoryId, category)
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Show more button solo en mobile */}
                        {isMobile && hasMoreImages && (
                            <motion.div
                                className="px-6 flex justify-center mb-16 -mt-8 md:mt-0 md:mb-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <button
                                    onClick={() => showMoreImages(categoryId, category)}
                                    className="text-black underline decoration-black/60 hover:decoration-black transition-colors duration-200 text-sm tracking-wide"
                                >
                                    show more
                                </button>
                            </motion.div>
                        )}
                    </motion.section>
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default PhotographyProjectPage

