import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { OptimizedImage } from '../components/OptimizedImage'
import type { PhotographyConfig } from '../types/photography'
import photographyData from '../data/photography.json'

function AboutPage() {
    const [config, setConfig] = useState<PhotographyConfig | null>(null)

    useEffect(() => {
        try {
            setConfig(photographyData as PhotographyConfig)
        } catch (err) {
            console.error('Error loading config:', err)
        }
    }, [])

    const aboutImages = config?.aboutImages ?? []
    const bottomImage = config?.aboutBottomImage ?? null

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
                        <motion.aside
                            className="mt-10 md:mt-0 md:border-r md:border-black/10 flex flex-col h-full"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {aboutImages.length > 0 ? (
                                <div className="group relative w-full h-full min-h-[280px]">
                                    <OptimizedImage
                                        src={aboutImages[0]}
                                        alt="About image"
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                        priority={true}
                                    />
                                </div>
                            ) : (
                                <p className="text-xs text-black/50 max-w-xs">
                                    No hay imágenes configuradas para mostrar aquí.
                                </p>
                            )}
                        </motion.aside>

                        {/* Texto principal (derecha) */}
                        <motion.div
                            className="space-y-6 md:pl-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
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
                        </motion.div>
                    </section>

                    {/* Imagen inferior con mismos márgenes que la sección superior */}
                    {bottomImage && (
                        <motion.section
                            className="mt-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="max-w-6xl mx-auto">
                                <OptimizedImage
                                    src={bottomImage}
                                    alt="About bottom"
                                    className="w-full h-auto object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                                />
                            </div>
                        </motion.section>
                    )}
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default AboutPage
