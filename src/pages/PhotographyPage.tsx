import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { MasonryGrid, type MasonrySection } from '../components/MasonryGrid'
import type { PhotographyConfig } from '../types/photography'
import photographyData from '../data/photography.json'

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

function PhotographyPage() {
    const [config, setConfig] = useState<PhotographyConfig>(ensureThreeColumns({ categories: [] }))
    const [loading, setLoading] = useState(true)
    // Track how many images to show per category (starts at 6, increases progressively)
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

    const categories = config.categories

    // Función para contar el total de imágenes en una categoría
    const countImagesInCategory = (category: typeof categories[0]): number => {
        return category.sections.reduce((total, section) => {
            if (section.columnImages) {
                return total + section.columnImages.reduce((colTotal, col) => colTotal + col.images.length, 0)
            }
            if (section.images) {
                return total + section.images.length
            }
            return total
        }, 0)
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
    // Muestra las imágenes intercaladas entre columnas, sin importar de qué columna provengan
    const getLimitedSections = (category: typeof categories[0], categoryId: string): MasonrySection[] => {
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

            // Si todas las imágenes están mostradas, devolver solo las secciones con imágenes
            if (imagesToShow >= totalImages) {
                // Filtrar secciones vacías para evitar espacios extra
                return category.sections.filter(section => {
                    if (section.columnImages) {
                        return section.columnImages.some(col => col.images.length > 0)
                    }
                    if (section.images) {
                        return section.images.length > 0
                    }
                    return false
                })
            }

            // Reconstruir las columnas con las imágenes limitadas
            const limitedColumnImages = reconstructColumns(flattenedImages, columns, imagesToShow)

            return [{
                ...firstSectionWithColumns,
                columnImages: limitedColumnImages,
                columns: {
                    mobile: 1, // En mobile, mostrar solo 1 columna
                    tablet: firstSectionWithColumns.columns?.tablet,
                    desktop: firstSectionWithColumns.columns?.desktop
                }
            }]
        }

        // Fallback: si no hay columnImages, usar el método antiguo
        const firstSection = category.sections[0]
        if (firstSection && firstSection.images) {
            const totalImages = firstSection.images.length
            if (imagesToShow >= totalImages) {
                // Filtrar secciones vacías para evitar espacios extra
                return category.sections.filter(section => {
                    if (section.images) {
                        return section.images.length > 0
                    }
                    return false
                })
            }
            return [{
                ...firstSection,
                images: firstSection.images.slice(0, imagesToShow)
            }]
        }

        return []
    }

    // Función para incrementar progresivamente las imágenes mostradas
    // Simplemente incrementa en 6 imágenes (o las que resten) sin importar de qué columna provengan
    const showMoreImages = (categoryId: string, category: typeof categories[0]) => {
        const currentShown = imagesShownPerCategory.get(categoryId) ?? 6
        const totalImages = countImagesInCategory(category)

        // Incrementar en 6 imágenes o mostrar todas las restantes
        const nextCount = Math.min(currentShown + 6, totalImages)

        setImagesShownPerCategory(prev => {
            const newMap = new Map(prev)
            newMap.set(categoryId, nextCount)
            return newMap
        })
    }

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

    return (
        <>
            <Helmet>
                <title>Photography | Authentic Web Design</title>
                <meta name="description" content="Descubre nuestras colecciones de fotografía y producciones visuales." />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Photography | Authentic Web Studio" />
                <meta property="og:description" content="Descubre nuestras colecciones de fotografía y producciones visuales." />
                <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/hero-sliders/1.webp`} />
                <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
                <meta property="og:site_name" content="Authentic Web Design" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Photography | Authentic Web Studio" />
                <meta name="twitter:description" content="Descubre nuestras colecciones de fotografía y producciones visuales." />
                <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/hero-sliders/1.webp`} />
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/photography" />
                </div>

                <main className="pt-32 pb-36">
                    {loading && (
                        <div className="px-6 text-center">
                            <p className="text-black/60">Cargando galería...</p>
                        </div>
                    )}
                    {!loading && content.length === 0 && (
                        <div className="px-6 text-center space-y-4">
                            <p className="text-black/60">No hay categorías disponibles.</p>
                        </div>
                    )}
                    <div className="space-y-24">
                        {content.map((category, categoryIndex) => {
                            const categoryId = category.id ?? `category-${categoryIndex}`
                            const totalImages = countImagesInCategory(category)
                            const imagesShown = imagesShownPerCategory.get(categoryId) ?? 6
                            const limitedSections = getLimitedSections(category, categoryId)
                            const hasMoreImages = imagesShown < totalImages

                            return (
                                <motion.section
                                    key={categoryId}
                                    className="space-y-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: categoryIndex * 0.4 }}
                                >
                                    <motion.div
                                        className="px-6 mb-24"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: categoryIndex * 0.4 + 0.3 }}
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
                                        </div>
                                    )}

                                    {hasMoreImages && (
                                        <motion.div
                                            className="px-6 flex justify-center mb-16 -mt-8 md:mt-0 md:mb-8"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: categoryIndex * 0.4 + 0.6 }}
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
                            )
                        })}
                    </div>
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default PhotographyPage
