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
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

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

    // Función para limitar las secciones a 6 imágenes inicialmente (2 por columna)
    const getLimitedSections = (category: typeof categories[0], isExpanded: boolean): MasonrySection[] => {
        if (isExpanded) {
            return category.sections
        }

        const imagesPerColumn = 2 // 2 imágenes por columna
        const maxImages = 6 // 2 por columna × 3 columnas

        // Buscar la primera sección con columnImages
        const firstSectionWithColumns = category.sections.find(section =>
            section.columnImages && section.columnImages.length > 0 &&
            section.columnImages.some(col => col.images.length > 0)
        )

        if (firstSectionWithColumns && firstSectionWithColumns.columnImages) {
            // Limitar a 2 imágenes por columna
            const limitedColumnImages = firstSectionWithColumns.columnImages.map((column) => ({
                ...column,
                images: column.images.slice(0, imagesPerColumn)
            }))

            return [{
                ...firstSectionWithColumns,
                columnImages: limitedColumnImages
            }]
        }

        // Fallback: si no hay columnImages, usar el método antiguo
        const firstSection = category.sections[0]
        if (firstSection && firstSection.images) {
            return [{
                ...firstSection,
                images: firstSection.images.slice(0, maxImages)
            }]
        }

        return []
    }

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId)
            } else {
                newSet.add(categoryId)
            }
            return newSet
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
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/photography" logoSrc="/img/logo.png" />
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
                            const isExpanded = expandedCategories.has(categoryId)
                            const totalImages = countImagesInCategory(category)
                            const limitedSections = getLimitedSections(category, isExpanded)
                            const hasMoreImages = totalImages > 6

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
                                        className="px-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: categoryIndex * 0.4 + 0.3 }}
                                    >
                                        <div className="space-y-6">
                                            <h1 className="text-2xl md:text-4xl font-light">{category.title}</h1>
                                            <p className="text-base text-black/80 leading-relaxed max-w-4xl">{category.description}</p>
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

                                    {hasMoreImages && !isExpanded && (
                                        <motion.div
                                            className="px-6 flex justify-center"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: categoryIndex * 0.4 + 0.6 }}
                                        >
                                            <button
                                                onClick={() => toggleCategory(categoryId)}
                                                className="text-black underline decoration-black/60 hover:decoration-black transition-colors duration-200 text-sm tracking-wide"
                                            >
                                                ver más
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
