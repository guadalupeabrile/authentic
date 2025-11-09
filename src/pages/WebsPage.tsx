import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import WebProjectsList from '../components/WebProjectsList'

function WebsPage() {
    return (
        <>
            <Helmet>
                <title>Webs | Authentic Web Design</title>
                <meta name="description" content="Explora nuestros proyectos web y soluciones digitales." />
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/websites" logoSrc="/img/logo.png" />
                </div>

                <main className="pt-32 pb-24 px-[10px] space-y-16">
                    <section className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase">Webs</h1>
                        <p className="text-base md:text-lg text-black/80 leading-relaxed">
                            Aquí puedes destacar tus proyectos web, los servicios que ofreces o cualquier información
                            relevante sobre tus soluciones digitales. Personaliza esta sección con contenido y recursos
                            que representen tu trabajo.
                        </p>
                    </section>

                    <WebProjectsList />
                </main>

                <Footer />
            </div>
        </>
    )
}

export default WebsPage


