import { motion } from 'framer-motion'
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

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Webs | Authentic Web Design" />
                <meta property="og:description" content="Explora nuestros proyectos web y soluciones digitales." />
                <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/logo.png`} />
                <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
                <meta property="og:site_name" content="Authentic Web Design" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Webs | Authentic Web Design" />
                <meta name="twitter:description" content="Explora nuestros proyectos web y soluciones digitales." />
                <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/img/logo.png`} />
            </Helmet>
            <div className="relative min-h-screen bg-white text-black">
                <div className="fixed top-0 left-0 w-full z-30 pointer-events-auto">
                    <HeaderSecondary activeUrl="/websites" />
                </div>
                <main className="pt-32 pb-24">
                    <motion.section
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="px-6 mb-24"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="space-y-6">
                                <h1 className="text-2xl md:text-4xl font-light">Our Latest Projects</h1>
                                <p className="text-base text-black/80 leading-relaxed max-w-6xl">
                                    We create digital experiences that stand out. From complex web applications built from scratch with React and TypeScript to agile e-commerce solutions implemented on Shopify or Tiendanube. We blend strategic design with cutting-edge technology to help your brand grow and convert.
                                </p>
                            </div>
                        </motion.div>
                    </motion.section>

                    <div className="pr-[10px] pl-[30px] space-y-16">
                        <WebProjectsList />
                    </div>
                </main>

                <Footer darkText />
            </div>
        </>
    )
}

export default WebsPage


