import { useState, useEffect } from 'react'
import { cn } from '../lib/cn'
import { OptimizedImage } from './OptimizedImage'

interface ImageSliderProps {
    images: string[]
    className?: string
    interval?: number // tiempo en ms entre transiciones
}

/**
 * Componente de slider de imágenes con transición automática y optimizaciones
 * - Las imágenes se adaptan al tamaño del contenedor (object-cover)
 * - Preload de la siguiente imagen para transiciones suaves
 * - WebP con fallback automático
 * - Priority loading para la primera imagen
 * - Transiciones suaves entre imágenes
 */
export function ImageSlider({ images, className, interval = 5000 }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (images.length <= 1) return

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, interval)

        return () => clearInterval(timer)
    }, [images.length, interval])

    // Preload next image for smooth transitions
    useEffect(() => {
        if (images.length <= 1) return

        const nextIndex = (currentIndex + 1) % images.length
        const nextImage = images[nextIndex]

        if (nextImage) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = nextImage
            document.head.appendChild(link)

            return () => {
                document.head.removeChild(link)
            }
        }
    }, [currentIndex, images])

    if (!images || images.length === 0) {
        return (
            <div className={cn('relative w-full h-full bg-gray-200', className)}>
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No hay imágenes disponibles
                </div>
            </div>
        )
    }

    return (
        <div className={cn('relative w-full h-full overflow-hidden', className)}>
            {images.map((image, index) => {
                const isActive = index === currentIndex
                const isNext = index === (currentIndex + 1) % images.length

                return (
                    <div
                        key={index}
                        className={cn(
                            'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
                            isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        )}
                    >
                        {/* Contenedor con tamaño fijo para que las imágenes se adapten */}
                        <div className="w-full h-full min-h-full">
                            <OptimizedImage
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className={cn(
                                    "w-full h-full object-cover min-h-full",
                                    // Para la primera imagen (slider 1), mostrar un poco más a la izquierda en mobile (75% desde la izquierda)
                                    index === 0
                                        ? "[object-position:75%_center] md:[object-position:center]"
                                        : "object-center"
                                )}
                                priority={index === 0}
                                fetchPriority={index === 0 ? 'high' : isNext ? 'low' : 'auto'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '100%',
                                    objectFit: 'cover',
                                }}
                                sizes="100vw"
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

