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

    // Función para obtener las secciones limitadas progresivamente
    // En mobile: muestra primero 6 imágenes de la columna 1, luego más de columna 1, luego columna 2, luego columna 3
    const getLimitedSections = (category: typeof categories[0], categoryId: string): MasonrySection[] => {
        const imagesToShow = imagesShownPerCategory.get(categoryId) ?? 6 // Por defecto mostrar 6 imágenes

        // Buscar la primera sección con columnImages
        const firstSectionWithColumns = category.sections.find(section =>
            section.columnImages && section.columnImages.length > 0 &&
            section.columnImages.some(col => col.images.length > 0)
        )

        if (firstSectionWithColumns && firstSectionWithColumns.columnImages) {
            const columns = firstSectionWithColumns.columnImages
            const col1Count = columns[0]?.images.length ?? 0
            const col2Count = columns[1]?.images.length ?? 0
            const col3Count = columns[2]?.images.length ?? 0
            const totalImages = col1Count + col2Count + col3Count

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

            const limitedColumnImages: typeof columns = []

            // Columna 1: mostrar hasta imagesToShow o todas las de col1
            if (imagesToShow > 0 && col1Count > 0) {
                const imagesFromCol1 = Math.min(col1Count, imagesToShow)
                limitedColumnImages.push({
                    ...columns[0],
                    images: columns[0].images.slice(0, imagesFromCol1)
                })
            }

            // Columna 2: solo si ya mostramos todas las de col1
            if (imagesToShow > col1Count && col2Count > 0) {
                const imagesFromCol2 = Math.min(col2Count, imagesToShow - col1Count)
                limitedColumnImages.push({
                    ...columns[1],
                    images: columns[1].images.slice(0, imagesFromCol2)
                })
            }

            // Columna 3: solo si ya mostramos todas las de col1 y col2
            if (imagesToShow > col1Count + col2Count && col3Count > 0) {
                const imagesFromCol3 = Math.min(col3Count, imagesToShow - col1Count - col2Count)
                limitedColumnImages.push({
                    ...columns[2],
                    images: columns[2].images.slice(0, imagesFromCol3)
                })
            }

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
    const showMoreImages = (categoryId: string, category: typeof categories[0]) => {
        const currentShown = imagesShownPerCategory.get(categoryId) ?? 6
        const totalImages = countImagesInCategory(category)

        // Calcular cuántas imágenes más mostrar
        // Primero terminamos la columna 1, luego columna 2, luego columna 3
        const firstSectionWithColumns = category.sections.find(section =>
            section.columnImages && section.columnImages.length > 0 &&
            section.columnImages.some(col => col.images.length > 0)
        )

        if (firstSectionWithColumns && firstSectionWithColumns.columnImages) {
            const columns = firstSectionWithColumns.columnImages
            const col1Count = columns[0]?.images.length ?? 0
            const col2Count = columns[1]?.images.length ?? 0
            const col3Count = columns[2]?.images.length ?? 0

            let nextCount = currentShown

            // Si estamos en la primera columna (menos de 6 o menos del total de col1)
            if (currentShown < col1Count) {
                // Mostrar 6 más o hasta el final de la columna 1
                nextCount = Math.min(currentShown + 6, col1Count)
            }
            // Si terminamos columna 1, empezar con columna 2
            else if (currentShown < col1Count + col2Count) {
                // Mostrar 6 más o hasta el final de la columna 2
                nextCount = Math.min(currentShown + 6, col1Count + col2Count)
            }
            // Si terminamos columna 2, empezar con columna 3
            else if (currentShown < col1Count + col2Count + col3Count) {
                // Mostrar todas las restantes
                nextCount = totalImages
            }
            // Si ya mostramos todo, no hacer nada
            else {
                return
            }

            setImagesShownPerCategory(prev => {
                const newMap = new Map(prev)
                newMap.set(categoryId, nextCount)
                return newMap
            })
        } else {
            // Fallback: incrementar por 6
            const nextCount = Math.min(currentShown + 6, totalImages)
            setImagesShownPerCategory(prev => {
                const newMap = new Map(prev)
                newMap.set(categoryId, nextCount)
                return newMap
            })
        }
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
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/photography" />
                </div>

                <main className="pt-32 pb-24">
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
                                        <div className="mt-12 w-full px-6">
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
                                            className="px-6 flex justify-center"
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
