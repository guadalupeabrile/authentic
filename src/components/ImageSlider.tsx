import { useState, useEffect } from 'react'
import { cn } from '../lib/cn'

interface ImageSliderProps {
    images: string[]
    className?: string
    interval?: number
}

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
        <div
            className={cn('relative w-full h-full overflow-hidden', className)}
            style={{ width: '100%', height: '100%', position: 'relative', minHeight: '100%' }}
        >
            {images.map((image, index) => {
                const isActive = index === currentIndex

                return (
                    <div
                        key={`${image}-${index}`}
                        className={cn(
                            'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
                            isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        )}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        aria-hidden={!isActive}
                    >
                        <img
                            src={image}
                            alt=""
                            className={cn(
                                'w-full h-full object-cover block hero-kenburns',
                                index === 0 ? 'object-[75%_center] md:object-center' : 'object-center',
                                isActive && 'is-active'
                            )}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                position: 'relative',
                            }}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            decoding="async"
                            draggable={false}
                        />
                    </div>
                )
            })}
        </div>
    )
}
