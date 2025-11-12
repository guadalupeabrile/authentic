import { useState } from 'react'
import { cn } from '../lib/cn'

interface MasonryGridProps {
    images: string[]
    columns?: {
        mobile?: number
        tablet?: number
        desktop?: number
    }
    gap?: number
    className?: string
}

/**
 * Componente de grid masonry para mostrar imágenes en un diseño no uniforme
 * - Mantiene las proporciones originales de las imágenes
 * - Diseño responsivo con diferentes columnas según el tamaño de pantalla
 * - Lazy loading para optimización
 */
export function MasonryGrid({
    images,
    columns = { mobile: 1, tablet: 2, desktop: 3 },
    gap = 16,
    className
}: MasonryGridProps) {
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

    // Manejar la carga de imágenes
    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set(prev).add(index))
    }

    const mobileColumns = columns.mobile || 1
    const tabletColumns = columns.tablet || 2
    const desktopColumns = columns.desktop || 3

    return (
        <>
            <style>{`
                .masonry-grid {
                    column-count: ${mobileColumns};
                    column-gap: ${gap}px;
                    column-fill: balance;
                }
                @media (min-width: 640px) {
                    .masonry-grid {
                        column-count: ${tabletColumns};
                    }
                }
                @media (min-width: 1024px) {
                    .masonry-grid {
                        column-count: ${desktopColumns};
                    }
                }
                .masonry-item {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    margin-bottom: ${gap}px;
                }
            `}</style>
            <div className={cn('w-full masonry-grid mx-[10px]', className)}>
                {images.map((image, index) => (
                    <div key={index} className="masonry-item">
                        <div className="relative w-full overflow-hidden">
                            {!loadedImages.has(index) && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
                            )}
                            <img
                                src={image}
                                alt={`Photography ${index + 1}`}
                                className={cn(
                                    'w-full h-auto transition-opacity duration-300',
                                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                                )}
                                loading={index < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                onLoad={() => handleImageLoad(index)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

