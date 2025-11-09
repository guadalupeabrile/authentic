import { Helmet } from 'react-helmet-async'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

function WebsPage() {
    return (
        <>
            <Helmet>
                <title>Webs | Authentic Web Design</title>
                <meta name="description" content="Explora nuestros proyectos web y soluciones digitales." />
            </Helmet>
            <div className="relative min-h-screen bg-black text-white">
                <div className="fixed top-0 left-0 w-full z-30 px-12 sm:px-16 md:px-36 lg:px-48 pointer-events-auto">
                    <Header activeUrl="/websites" logoSrc="/img/logo_white.png" />
                </div>

                <main className="pt-48 pb-24 px-6 sm:px-12 md:px-24 lg:px-32">
                    <section className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase">Webs</h1>
                        <p className="text-base md:text-lg text-white/80 leading-relaxed">
                            Aquí puedes destacar tus proyectos web, los servicios que ofreces o cualquier información
                            relevante sobre tus soluciones digitales. Personaliza esta sección con contenido y recursos
                            que representen tu trabajo.
                        </p>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    )
}

export default WebsPage


