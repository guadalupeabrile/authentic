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
                        {content.map((category, categoryIndex) => (
                            <motion.section
                                key={category.id ?? categoryIndex}
                                className="space-y-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="px-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <div className="space-y-6">
                                        <h1 className="text-2xl md:text-4xl font-light">{category.title}</h1>
                                        <p className="text-base text-black/80 leading-relaxed max-w-4xl">{category.description}</p>
                                    </div>
                                </motion.div>

                                {category.sections.length > 0 && (
                                    <div className="mt-12 w-full px-6">
                                        <div className="">
                                            <MasonryGrid
                                                sections={category.sections}
                                                horizontalMargin={0}
                                                editable={false}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        ))}
                    </div>
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default PhotographyPage
