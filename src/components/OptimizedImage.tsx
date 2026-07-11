import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
    containerClassName?: string
    sizes?: string
    priority?: boolean
    onLoad?: () => void
    style?: React.CSSProperties
    fetchPriority?: 'high' | 'low' | 'auto'
    /** Subtle zoom on hover (for gallery / card imagery). */
    zoomOnHover?: boolean
}

/** Convert a raster path to its WebP sibling when possible. */
function getWebPSrc(src: string): string {
    if (src.endsWith('.webp')) return src
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
}

/**
 * Performance-focused image:
 * - Prefers WebP with automatic fallback to the original format.
 * - Lazy by default, eager + high priority for above-the-fold images.
 * - Elegant fade-in once decoded, over a low-cost placeholder (no CLS).
 * - Optional, GPU-accelerated hover zoom.
 */
export function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    sizes,
    priority = false,
    onLoad,
    style,
    fetchPriority,
    zoomOnHover = false,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [useWebP, setUseWebP] = useState(true)
    const onLoadRef = useRef(onLoad)
    onLoadRef.current = onLoad

    const effectiveFetchPriority = fetchPriority || (priority ? 'high' : 'auto')
    const imageSrc = useWebP && !src.endsWith('.webp') ? getWebPSrc(src) : src

    const markLoaded = () => {
        setIsLoaded(true)
        onLoadRef.current?.()
    }

    const handleError = () => {
        // WebP failed — fall back to the original format once.
        if (useWebP && !src.endsWith('.webp')) {
            setUseWebP(false)
        }
    }

    // Detect images that are already complete (served from cache) on mount.
    const setImgRef = (img: HTMLImageElement | null) => {
        if (img?.complete && img.naturalWidth > 0) {
            markLoaded()
        }
    }

    useEffect(() => {
        setIsLoaded(false)
    }, [imageSrc])

    const containerStyle = style?.height ? { height: '100%', width: '100%' } : undefined

    return (
        <div
            className={cn('group relative overflow-hidden', containerClassName)}
            style={containerStyle}
        >
            {!isLoaded && (
                <div className="absolute inset-0 z-0 animate-pulse bg-gray-100" aria-hidden="true" />
            )}
            <img
                ref={setImgRef}
                src={imageSrc}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                sizes={sizes}
                fetchPriority={effectiveFetchPriority}
                onLoad={markLoaded}
                onError={handleError}
                style={style}
                className={cn(
                    style?.height ? 'h-full w-full' : 'h-auto w-full',
                    'relative z-10 block transition-[opacity,transform] duration-700 ease-out',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    zoomOnHover && 'group-hover:scale-[1.04]',
                    className
                )}
            />
        </div>
    )
}
