import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import TickerList from '../../components/TickerList'
import { tickerRows } from '../../data/tickerRows'

function PhotographyPage() {
    return (
        <>
            <Helmet>
                <title>Photography | Authentic Web Design</title>
                <meta name="description" content="Descubre nuestras colecciones de fotografía y producciones visuales." />
            </Helmet>
            <div className="relative min-h-screen bg-black text-white">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/photography" logoSrc="/img/logo_white.png" />
                </div>

                <main className="pt-32 pb-24 px-6 sm:px-12 md:px-24 lg:px-32">
                    <section className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase">Photography</h1>
                        <p className="text-base md:text-lg text-white/80 leading-relaxed">
                            Usa este espacio para mostrar tus galerías fotográficas, detallar tus servicios de producción
                            o compartir historias visuales destacadas. Puedes incorporar sliders, mosaicos de imágenes u
                            otros componentes personalizados.
                        </p>
                    </section>
                </main>

                <div className="px-6 sm:px-12 md:px-24 lg:px-32 pb-12">
                    <TickerList rows={tickerRows} />
                </div>

                <Footer />
            </div>
        </>
    )
}

export default PhotographyPage


