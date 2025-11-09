import { useState, useEffect } from 'react'
import { cn } from '../lib/cn'

interface ImageSliderProps {
    images: string[]
    className?: string
    interval?: number // tiempo en ms entre transiciones
}

/**
 * Componente de slider de imágenes con transición automática
 * - Las imágenes se adaptan al tamaño del contenedor (object-cover)
 * - Lazy loading para optimización
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
            {images.map((image, index) => (
                <div
                    key={index}
                    className={cn(
                        'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    )}
                >
                    {/* Contenedor con tamaño fijo para que las imágenes se adapten */}
                    <div className="w-full h-full min-h-full">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover object-center min-h-full"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            // Asegura que las imágenes se adapten al contenedor sin depender de su tamaño real
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

