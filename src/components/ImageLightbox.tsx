import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OptimizedImage } from './OptimizedImage'

interface ImageLightboxProps {
    images: string[]
    currentIndex: number
    isOpen: boolean
    onClose: () => void
    onNavigate: (index: number) => void
}

export function ImageLightbox({ images, currentIndex, isOpen, onClose, onNavigate }: ImageLightboxProps) {
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    // Preload adjacent images for smooth navigation
    useEffect(() => {
        if (!isOpen || images.length === 0) return

        const preloadImages: string[] = []

        // Preload previous image
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
        if (images[prevIndex]) {
            preloadImages.push(images[prevIndex])
        }

        // Preload next image
        const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
        if (images[nextIndex]) {
            preloadImages.push(images[nextIndex])
        }

        // Create preload links
        const links: HTMLLinkElement[] = []
        preloadImages.forEach((src) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = src
            document.head.appendChild(link)
            links.push(link)
        })

        return () => {
            links.forEach((link) => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link)
                }
            })
        }
    }, [currentIndex, isOpen, images])

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1)
        } else {
            onNavigate(images.length - 1) // Loop al final
        }
    }, [currentIndex, images.length, onNavigate])

    const handleNext = useCallback(() => {
        if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1)
        } else {
            onNavigate(0) // Loop al inicio
        }
    }, [currentIndex, images.length, onNavigate])

    // Navegación con teclado
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowLeft') {
                handlePrevious()
            } else if (e.key === 'ArrowRight') {
                handleNext()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose, handlePrevious, handleNext])

    // Manejo de swipe en mobile
    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            handleNext()
        } else if (isRightSwipe) {
            handlePrevious()
        }
    }

    if (!isOpen || images.length === 0) return null

    const currentImage = images[currentIndex]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
                        aria-label="Cerrar"
                    >
                        <svg
                            className="w-8 h-8 md:w-10 md:h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Contador de imágenes */}
                    <div className="absolute top-4 left-4 z-10 text-white text-sm md:text-base">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Imagen */}
                    <motion.div
                        className="relative flex items-center justify-center p-4 md:p-8"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                            <OptimizedImage
                                src={currentImage}
                                alt={`Image ${currentIndex + 1} of ${images.length}`}
                                priority
                                fetchPriority="high"
                                style={{
                                    objectFit: 'contain',
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '90vw',
                                    maxHeight: '90vh',
                                    display: 'block'
                                }}
                                sizes="90vw"
                            />
                        </div>
                    </motion.div>

                    {/* Botón anterior */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handlePrevious()
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2"
                            aria-label="Imagen anterior"
                        >
                            <svg
                                className="w-8 h-8 md:w-12 md:h-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Botón siguiente */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleNext()
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2"
                            aria-label="Imagen siguiente"
                        >
                            <svg
                                className="w-8 h-8 md:w-12 md:h-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

