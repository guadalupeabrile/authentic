import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { MasonryGrid, type MasonrySection } from '../components/MasonryGrid'

interface PhotographyCategory {
    title: string
    description: string
    sections: MasonrySection[]
}

function PhotographyPage() {
    // Configuración de categorías de fotografías
    // Cada categoría tiene su título, descripción y configuración de masonry grid
    const categories: PhotographyCategory[] = [
        {
            title: 'Naturaleza',
            description: 'Exploración visual de paisajes naturales, flora y fauna capturados en su estado más puro.',
            sections: [
                {
                    gap: 48,
                    columnImages: [
                        {
                            // Columna 1
                            images: [
                                '/img/hero-sliders/1.jpg',
                                '/img/hero-sliders/3.jpg',
                                '/img/hero-sliders/5.jpg',
                            ],
                            flex: 1,
                            marginTop: [0, 20, 10],
                            marginBottom: [200, 40, 35],
                            flexPerImage: [0.9, 0.8, 1],
                            justifyContent: ['flex-start', 'center', 'flex-end'],
                            alignItems: ['flex-start', 'center', 'flex-end'],
                        },
                        {
                            // Columna 2
                            images: [
                                '/img/hero-sliders/2.jpg',
                                '/img/hero-sliders/4.jpg',
                            ],
                            flex: 1.5,
                            marginTop: [200, 15],
                            marginBottom: [50, 60],
                            flexPerImage: [1, 1],
                            justifyContent: ['center', 'flex-start'],
                            alignItems: ['center', 'flex-start'],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Retratos',
            description: 'Colección de retratos que capturan la esencia y personalidad de cada sujeto.',
            sections: [
                {
                    gap: 48,
                    columnImages: [
                        {
                            images: [
                                '/img/hero-sliders/1.jpg',
                                '/img/hero-sliders/2.jpg',
                            ],
                            flex: 1,
                            marginTop: [0, 30],
                            marginBottom: [40, 50],
                            flexPerImage: [1, 0.9],
                            justifyContent: ['center', 'flex-start'],
                            alignItems: ['center', 'center'],
                        },
                        {
                            images: [
                                '/img/hero-sliders/3.jpg',
                                '/img/hero-sliders/4.jpg',
                                '/img/hero-sliders/5.jpg',
                            ],
                            flex: 1,
                            marginTop: [20, 10, 0],
                            marginBottom: [50, 40, 60],
                            flexPerImage: [0.8, 1, 0.9],
                            justifyContent: ['flex-end', 'center', 'flex-start'],
                            alignItems: ['flex-start', 'center', 'flex-end'],
                        },
                    ],
                },
            ],
        },
        // Puedes agregar más categorías aquí
        // {
        //     title: 'Arquitectura',
        //     description: 'Fotografía arquitectónica que muestra la belleza de estructuras y espacios.',
        //     sections: [...]
        // }
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
                    <div className="space-y-24">
                        {categories.map((category, categoryIndex) => (
                            <section key={categoryIndex} className="space-y-8">
                                <div className="px-6 sm:px-12 md:px-24 lg:px-32">
                                    <div className="max-w-7xl mx-auto space-y-6">
                                        <h1 className="text-3xl md:text-4xl font-light">{category.title}</h1>
                                        <p className="text-base md:text-lg text-black/80 leading-relaxed max-w-4xl">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 w-full">
                                    <MasonryGrid
                                        sections={category.sections}
                                        horizontalMargin={10}
                                    />
                                </div>
                            </section>
                        ))}
                    </div>
                </main>

                <Footer />
            </div>
        </>
    )
}

export default PhotographyPage


