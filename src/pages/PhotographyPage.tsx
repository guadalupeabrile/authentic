import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { MasonryGrid } from '../components/MasonryGrid'

function PhotographyPage() {
    // Imágenes de ejemplo - reemplaza con tus propias imágenes de fotografía
    // Para producción, coloca las imágenes en public/img/photography/ y usa rutas como '/img/photography/nombre-imagen.jpg'
    const photographyImages = [
        '/img/hero-sliders/1.jpg',
        '/img/hero-sliders/2.jpg',
        '/img/hero-sliders/3.jpg',
        '/img/hero-sliders/4.jpg',
        '/img/hero-sliders/5.jpg',
        '/img/hero-sliders/1.jpg',
        '/img/hero-sliders/2.jpg',
        '/img/hero-sliders/3.jpg',
        '/img/hero-sliders/4.jpg',
        '/img/hero-sliders/5.jpg',
        '/img/hero-sliders/1.jpg',
        '/img/hero-sliders/2.jpg',
    ]

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
                    <section className="space-y-8">
                        <div className="px-6 sm:px-12 md:px-24 lg:px-32">
                            <div className="max-w-7xl mx-auto space-y-6">
                                <h1 className="text-3xl md:text-5xl font-light ">Photography</h1>
                                <p className="text-base md:text-lg text-black/80 leading-relaxed max-w-4xl">
                                    Usa este espacio para mostrar tus galerías fotográficas, detallar tus servicios de producción
                                    o compartir historias visuales destacadas. Puedes incorporar sliders, mosaicos de imágenes u
                                    otros componentes personalizados.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 w-full">
                            <MasonryGrid
                                images={photographyImages}
                                columns={{ mobile: 1, tablet: 2, desktop: 2 }}
                                gap={48}
                            />
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    )
}

export default PhotographyPage


