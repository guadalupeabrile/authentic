import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { OptimizedImage } from '../components/OptimizedImage'
import { RevealOnScroll, StaggerContainer, StaggerItem } from '../animation'
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

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="About | Authentic Web Design" />
                <meta property="og:description" content="Conoce la historia, valores y el equipo detrás de Authentic Web Design." />
                <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/logo.png`} />
                <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
                <meta property="og:site_name" content="Authentic Web Design" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About | Authentic Web Design" />
                <meta name="twitter:description" content="Conoce la historia, valores y el equipo detrás de Authentic Web Design." />
                <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/logo.png`} />
            </Helmet>
            <div className="relative flex flex-col min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/about" />
                </div>

                <main className="flex-1 pt-16 md:pt-32 pb-24 px-6">
                    <section className="max-w-6xl mx-auto md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] md:gap-12 md:items-stretch">
                        {/* Columna de imágenes (izquierda) */}
                        <RevealOnScroll
                            as="aside"
                            className="mt-5 md:mt-0 md:border-r md:border-black/10 flex flex-col h-full"
                            duration={0.5}
                        >
                            {aboutImages.length > 0 ? (
                                <div className="relative w-full h-full min-h-[280px] mb-5 md:mb-0">
                                    <OptimizedImage
                                        src={aboutImages[0]}
                                        alt="About image"
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                        priority={true}
                                        zoomOnHover
                                    />
                                </div>
                            ) : (
                                <p className="text-xs text-black/50 max-w-xs">
                                    No hay imágenes configuradas para mostrar aquí.
                                </p>
                            )}
                        </RevealOnScroll>

                        {/* Texto principal (derecha) */}
                        <StaggerContainer className="space-y-6 md:pl-4" trigger="mount">
                            <StaggerItem as="h1" className="text-2xl md:text-4xl font-light tracking-[0.15em] uppercase">
                                About Authentic
                            </StaggerItem>
                            <StaggerItem as="p" className="max-w-3xl text-sm italic text-black/80 leading-relaxed !mt-1">
                                Still wondering whether the word "authentic" is genuinely authentic.
                            </StaggerItem>
                            <StaggerItem as="p" className="max-w-3xl text-base text-black/80 leading-relaxed md:ml-auto">
                                As a multidisciplinary creator, my work is an exploration of <strong>devenir-con (becoming-with)</strong> the constant dialogue between our inner selves and the human and non-human worlds we inhabit. I translate this flow into functional engineering and intuitive design.
                            </StaggerItem>
                            <StaggerItem as="p" className="max-w-3xl text-base text-black/80 leading-relaxed">
                                Whether building a purposeful website or documenting a visual story through my lens, I focus on the <strong>entanglement of strategy and soul</strong>. I create to help brands express their truest nature.
                            </StaggerItem>
                            <StaggerItem as="p" className="max-w-3xl text-base text-black/80 leading-relaxed">
                                I focus on building functional, aesthetic, and intuitive websites for entrepreneurs, artists, therapists, and businesses that need an online presence with purpose. My approach blends strategy, visual sensitivity, and simple, honest communication.
                            </StaggerItem>
                            <StaggerItem as="p" className="max-w-3xl text-base text-black/80 leading-relaxed">
                                Photography is another core part of my work: I document spaces, nature and visual stories that help brands express who they are.
                            </StaggerItem>
                            <StaggerItem as="p" className="max-w-3xl text-base text-black/80 leading-relaxed">
                                With kindness, Guadalupe.
                            </StaggerItem>
                        </StaggerContainer>
                    </section>

                    {/* Imagen inferior con mismos márgenes que la sección superior */}
                    {bottomImage && (
                        <RevealOnScroll as="section" className="mt-16" duration={0.5}>
                            <div className="max-w-6xl mx-auto">
                                <OptimizedImage
                                    src={bottomImage}
                                    alt="About bottom"
                                    className="w-full h-auto object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                                />
                            </div>
                        </RevealOnScroll>
                    )}
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default AboutPage
