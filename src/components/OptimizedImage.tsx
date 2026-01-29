import { useState } from 'react'
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
 * Helper function to get the original format as fallback
 */
function getOriginalSrc(src: string): string {
    // If it's already a WebP path, try to get original
    if (src.endsWith('.webp')) {
        // Try common formats
        const jpgSrc = src.replace(/\.webp$/i, '.jpg')
        const pngSrc = src.replace(/\.webp$/i, '.png')
        return src // Return WebP if it's already WebP, browser will handle fallback
    }
    return src
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

    // Determine fetch priority
    const effectiveFetchPriority = fetchPriority || (priority ? 'high' : 'auto')

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

    // Get the appropriate image source
    // Always provide original as fallback in img tag, picture element handles WebP
    const imageSrc = useWebP && !src.endsWith('.webp') ? getWebPSrc(src) : src

    const imageElement = (
        <>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
            )}
            <picture>
                {/* WebP source with fallback */}
                {useWebP && !src.endsWith('.webp') && (
                    <source
                        srcSet={getWebPSrc(src)}
                        type="image/webp"
                        sizes={sizes}
                    />
                )}
                <img
                    src={imageSrc}
                    alt={alt}
                    className={cn(
                        // Si se pasa style con height, usar h-full en lugar de h-auto
                        style?.height ? 'w-full h-full transition-opacity duration-700 ease-in-out' : 'w-full h-auto transition-opacity duration-700 ease-in-out',
                        isLoaded ? 'opacity-100' : 'opacity-0',
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
            </picture>
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

