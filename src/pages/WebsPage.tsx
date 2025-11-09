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

                <main className="pt-32 pb-24 pr-[10px] pl-[30px] space-y-16">


                    <WebProjectsList />
                </main>

                <Footer />
            </div>
        </>
    )
}

export default WebsPage


