import { Helmet } from 'react-helmet-async'
import { Header } from '../components/Header'
import { ImageSlider } from '../components/ImageSlider'
import { Footer } from '../components/Footer'

function HomePage() {
    // Imágenes de ejemplo - reemplaza con tus propias imágenes
    // Para producción, coloca las imágenes en public/images/ y usa rutas como '/images/nombre-imagen.jpg'
    // Ejemplo: const sliderImages = ['/images/cortina.jpg', '/images/marmol.jpg', '/images/madera.jpg']
    const sliderImages = [
        '/img/hero-sliders/1.webp',
        '/img/hero-sliders/5.webp',
        '/img/hero-sliders/3.webp',
        '/img/hero-sliders/4.webp']

    return (
        <>
            <Helmet>
                <title>Authentic Web Design</title>
                <meta name="description" content="Authentic Web Design - Elegant design studio" />
            </Helmet>
            <div className="relative min-h-screen overflow-x-hidden">
                {/* Sección del slider con altura extendida */}
                <section className="relative w-full min-h-screen md:min-h-[calc(100vh+360px)]">
                    <div className="relative w-full h-screen md:h-[calc(100vh+360px)] z-0">
                        <ImageSlider
                            images={sliderImages}
                            className="w-full h-full"
                            interval={5000}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none z-10" />
                    </div>
                </section>

                <div className="fixed top-[50px] md:top-0 left-0 w-full z-30 px-12 sm:px-16 md:px-36 lg:px-48 pointer-events-auto">
                    <Header activeUrl="/" logoSrc="/img/logo_white.png" />
                </div>

                <Footer className="bottom-[10px]" />
            </div>
        </>
    )
}

export default HomePage

