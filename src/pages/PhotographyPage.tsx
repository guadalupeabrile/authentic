import { Helmet } from 'react-helmet-async'
import { HeaderSecondary } from '../components/HeaderSecondary'
import { Footer } from '../components/Footer'
import { MasonryGrid, type MasonrySection } from '../components/MasonryGrid'

function PhotographyPage() {
    // Configuración de secciones del masonry grid
    // NUEVO MÉTODO: Especificar imágenes agrupadas por columna con control flex
    // Usa 'flex' para controlar el ancho proporcional de cada columna
    const masonrySections: MasonrySection[] = [
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
                    flex: 1, // Ancho proporcional de la columna: 1 (ocupa 1 parte del espacio disponible)
                    marginTop: [0, 20, 10], // Márgenes superiores para cada imagen: 0px, 20px, 10px
                    marginBottom: [200, 40, 35], // Márgenes inferiores para cada imagen: 200px, 40px, 35px
                    flexPerImage: [1, 0.8, 1], // Ancho proporcional de cada imagen (fila): 1, 0.8, 1
                    justifyContent: ['flex-start', 'center', 'flex-end'], // Alineación horizontal: izquierda, centro, derecha
                    alignItems: ['flex-start', 'center', 'flex-end'], // Alineación vertical: arriba, centro, abajo
                },
                {
                    // Columna 2
                    images: [
                        '/img/hero-sliders/2.jpg',
                        '/img/hero-sliders/4.jpg',
                    ],
                    flex: 1.5, // Ancho proporcional de la columna: 1.5 (ocupa 1.5 partes, más ancha que la columna 1)
                    marginTop: [150, 15], // Márgenes superiores para cada imagen: 10px, 15px
                    marginBottom: [50, 60], // Márgenes inferiores para cada imagen: 50px, 60px
                    flexPerImage: [0.8, 1], // Ancho proporcional de cada imagen (fila): 0.5, 1
                    justifyContent: ['center', 'flex-start'], // Alineación horizontal: derecha, izquierda
                    alignItems: ['center', 'flex-start'], // Alineación vertical: centro, arriba
                },
            ],
        },
        // MÉTODO ANTIGUO (compatibilidad): También puedes usar el método anterior
        // {
        //     images: [
        //         '/img/hero-sliders/1.jpg',
        //         '/img/hero-sliders/2.jpg',
        //     ],
        //     columns: { mobile: 1, tablet: 2, desktop: 2 },
        //     gap: 48,
        //     margins: [30, 50],
        //     marginLeft: [0, 10],
        //     marginRight: [90, 40]
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
                    <section className="space-y-8">
                        <div className="px-6 sm:px-12 md:px-24 lg:px-32">
                            <div className="max-w-7xl mx-auto space-y-6">
                                <h1 className="text-3xl md:text-4xl font-light ">Photography</h1>
                                <p className="text-base md:text-lg text-black/80 leading-relaxed max-w-4xl">
                                    Usa este espacio para mostrar tus galerías fotográficas, detallar tus servicios de producción
                                    o compartir historias visuales destacadas. Puedes incorporar sliders, mosaicos de imágenes u
                                    otros componentes personalizados.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 w-full">
                            <MasonryGrid
                                sections={masonrySections}
                                horizontalMargin={10}
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


