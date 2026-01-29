import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import ProjectList, { type Project } from '../components/ProjectList'
import type { PhotographyConfig } from '../types/photography'
import photographyData from '../data/photography.json'
import { slugify } from '../lib/slugify'

function PhotographyPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const config = photographyData as PhotographyConfig
            const photographyProjects: Project[] = config.categories.map(category => ({
                id: category.id || slugify(category.title),
                name: category.title,
                link: `/photography/${category.id || slugify(category.title)}`,
                speed: 36 // Velocidad por defecto para proyectos de fotografía
            }))
            setProjects(photographyProjects)
        } catch (err) {
            console.error('Error loading photography projects:', err)
        } finally {
            setLoading(false)
        }
    }, [])

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
                <main className="pt-32 pb-24">
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
                                <h1 className="text-2xl md:text-4xl font-light">Photography</h1>
                                <p className="text-base text-black/80 leading-relaxed max-w-6xl">
                                    A collection of visual stories captured through the lens. Each project represents a unique journey, exploring different themes, emotions, and perspectives.
                                </p>
                            </div>
                        </motion.div>
                    </motion.section>

                    {loading && (
                        <div className="px-6 text-center">
                            <p className="text-black/60">Cargando proyectos...</p>
                        </div>
                    )}

                    {!loading && projects.length === 0 && (
                        <div className="px-6 text-center space-y-4">
                            <p className="text-black/60">No hay proyectos disponibles.</p>
                        </div>
                    )}

                    {!loading && projects.length > 0 && (
                        <div className="pr-[10px] pl-[30px] space-y-16">
                            <ProjectList projects={projects} />
                        </div>
                    )}
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default PhotographyPage
