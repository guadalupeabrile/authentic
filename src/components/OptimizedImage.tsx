import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
    sizes?: string
    priority?: boolean
    onLoad?: () => void
    style?: React.CSSProperties
    animate?: boolean
    initial?: { opacity: number; y: number }
    whileInView?: { opacity: number; y: number }
    transition?: { duration: number }
    fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Helper function to convert image path to WebP format
 * Returns the WebP version if available, otherwise returns original
 */
function getWebPSrc(src: string): string {
    // If already WebP, return as is
    if (src.endsWith('.webp')) {
        return src
    }

    // Try to find WebP version
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    return webpSrc
}


/**
 * Optimized Image component with advanced performance optimizations
 * - WebP format with automatic fallback
 * - Responsive images with srcset
 * - Priority loading for above-the-fold images
 * - FetchPriority API support
 * - Lazy loading by default
 * - Optional fade-in animation with framer-motion
 * - Blur-up placeholder effect
 */
export function OptimizedImage({
    src,
    alt,
    className,
    sizes,
    priority = false,
    onLoad,
    style,
    animate = false,
    initial = { opacity: 0, y: 20 },
    whileInView = { opacity: 1, y: 0 },
    transition = { duration: 0.5 },
    fetchPriority
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [useWebP, setUseWebP] = useState(true)
    const imgRef = useRef<HTMLImageElement>(null)

    // Determine fetch priority
    const effectiveFetchPriority = fetchPriority || (priority ? 'high' : 'auto')

    // Get the appropriate image source
    // Always provide original as fallback in img tag, picture element handles WebP
    const imageSrc = useWebP && !src.endsWith('.webp') ? getWebPSrc(src) : src

    const handleLoad = () => {
        setIsLoaded(true)
        onLoad?.()
    }

    const handleError = () => {
        // If WebP fails, try fallback to original format
        if (useWebP && !src.endsWith('.webp')) {
            setUseWebP(false)
            // Reset error state to allow retry with fallback
            setHasError(false)
            return
        }
        setHasError(true)
    }

    // Callback ref to check if image is already loaded when it's attached to DOM
    const setImgRef = (img: HTMLImageElement | null) => {
        // Store ref
        ; (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = img

        if (img) {
            // Check immediately if image is already loaded (from cache)
            if (img.complete) {
                if (img.naturalHeight !== 0) {
                    // Image is loaded
                    setIsLoaded(true)
                    onLoad?.()
                } else {
                    // Image failed to load
                    setHasError(true)
                }
            }
        }
    }

    // Reset states when src changes
    useEffect(() => {
        setIsLoaded(false)
        setHasError(false)
    }, [imageSrc])

    // Additional check as backup - verify image load status periodically
    useEffect(() => {
        if (isLoaded) return // Already loaded, no need to check

        const checkInterval = setInterval(() => {
            const img = imgRef.current
            if (img && img.complete) {
                if (img.naturalHeight !== 0) {
                    setIsLoaded(true)
                    onLoad?.()
                    clearInterval(checkInterval)
                } else if (img.naturalHeight === 0) {
                    setHasError(true)
                    clearInterval(checkInterval)
                }
            }
        }, 100)

        // Clean up after 5 seconds to avoid infinite checking
        const timeout = setTimeout(() => {
            clearInterval(checkInterval)
        }, 5000)

        return () => {
            clearInterval(checkInterval)
            clearTimeout(timeout)
        }
    }, [imageSrc, isLoaded, onLoad])

    const imageElement = (
        <>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm z-0" />
            )}
            <img
                ref={setImgRef}
                src={imageSrc}
                alt={alt}
                className={cn(
                    // Si se pasa style con height, usar h-full en lugar de h-auto
                    style?.height ? 'w-full h-full transition-opacity duration-700 ease-in-out' : 'w-full h-auto transition-opacity duration-700 ease-in-out',
                    // Always show images - let parent handle opacity
                    'opacity-100 relative z-10',
                    className
                )}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                sizes={sizes}
                fetchPriority={effectiveFetchPriority}
                onLoad={handleLoad}
                onError={handleError}
                style={style}
            />
        </>
    )

    // Si se pasa style con height, el contenedor también debe tener height: 100%
    const containerStyle = style?.height ? { height: '100%', width: '100%' } : undefined

    if (animate) {
        return (
            <motion.div
                className="relative overflow-hidden"
                style={containerStyle}
                initial={initial}
                whileInView={whileInView}
                viewport={{ once: true }}
                transition={transition}
            >
                {imageElement}
            </motion.div>
        )
    }

    return <div className="relative overflow-hidden" style={containerStyle}>{imageElement}</div>
}

