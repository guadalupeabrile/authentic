import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'


function AboutPage() {
    return (
        <>
            <Helmet>
                <title>About | Authentic Web Design</title>
                <meta
                    name="description"
                    content="Conoce la historia, valores y el equipo detrás de Authentic Web Design."
                />
            </Helmet>
            <div className="relative min-h-screen bg-black text-white">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/about" logoSrc="/img/logo_white.png" />
                </div>

                <main className="pt-32 pb-24 px-6 sm:px-12 md:px-24 lg:px-32">
                    <section className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase">About</h1>
                        <p className="text-base md:text-lg text-white/80 leading-relaxed">
                            Comparte la historia de tu estudio, tu filosofía de diseño y presenta a tu equipo. Aprovecha
                            esta sección para generar confianza mostrando testimonios, reconocimientos y la forma en que
                            trabajas con tus clientes.
                        </p>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    )
}

export default AboutPage


