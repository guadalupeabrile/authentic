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
                <title>Authentic Web Studio | Professional Web Design & Photography</title>
                <meta name="description" content="Professional web design and photography studio. We create modern websites and capture authentic moments. Responsive web design, frontend development, and artistic photography in Australia." />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Authentic Web Studio | Professional Web Design & Photography" />
                <meta property="og:description" content="Professional web design and photography studio. We create modern websites and capture authentic moments. Responsive web design, frontend development, and artistic photography." />
                <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/og-image.jpg`} />
                <meta property="og:image:secure_url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/og-image.jpg`} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="Authentic Web Studio - Professional Web Design & Photography" />
                <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
                <meta property="og:site_name" content="Authentic Web Studio" />
                <meta property="og:locale" content="en_AU" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Authentic Web Studio | Professional Web Design & Photography" />
                <meta name="twitter:description" content="Professional web design and photography studio. We create modern websites and capture authentic moments." />
                <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/og-image.jpg`} />
                <meta name="twitter:image:alt" content="Authentic Web Studio - Professional Web Design & Photography" />
                <meta name="twitter:site" content="@authenticwebstudio" />
                <meta name="twitter:creator" content="@authenticwebstudio" />
            </Helmet>
            <div className="relative flex flex-col min-h-screen overflow-x-hidden">
                <div className="fixed top-[50px] md:top-0 left-0 w-full z-30 px-12 sm:px-16 md:px-36 lg:px-48 pointer-events-auto">
                    <Header activeUrl="/" logoSrc="/img/logo_white.png" />
                </div>

                {/* Sección del slider con altura extendida para cubrir viewport + espacio para scroll del footer */}
                <section className="relative w-full flex-1 min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-140px)]">
                    <div className="relative w-full h-full min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-140px)] z-0">
                        <ImageSlider
                            images={sliderImages}
                            className="w-full h-full"
                            interval={5000}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none z-10" />
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}

export default HomePage

