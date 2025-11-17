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
}

/**
 * Optimized Image component that mimics Next.js Image behavior
 * - Supports sizes prop for responsive images
 * - Priority prop for above-the-fold images (eager loading)
 * - Default lazy loading for performance
 * - Optional fade-in animation with framer-motion
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
    transition = { duration: 0.5 }
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const handleLoad = () => {
        setIsLoaded(true)
        onLoad?.()
    }

    const handleError = () => {
        setHasError(true)
    }

    const imageElement = (
        <>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
            )}
            <img
                src={src}
                alt={alt}
                className={cn(
                    'w-full h-auto transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    className
                )}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                sizes={sizes}
                onLoad={handleLoad}
                onError={handleError}
                style={style}
            />
        </>
    )

    if (animate) {
        return (
            <motion.div
                className="relative overflow-hidden"
                initial={initial}
                whileInView={whileInView}
                viewport={{ once: true }}
                transition={transition}
            >
                {imageElement}
            </motion.div>
        )
    }

    return <div className="relative overflow-hidden">{imageElement}</div>
}

