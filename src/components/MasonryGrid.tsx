import { useState } from 'react'
import { cn } from '../lib/cn'

export interface MasonryColumn {
    images: string[]
    flex?: number // Valor flex para controlar el ancho proporcional de la columna (opcional, por defecto 1)
    margins?: number[] // Array de márgenes verticales (inferior) personalizados para cada imagen (opcional, para compatibilidad)
    marginTop?: number[] // Array de márgenes superiores personalizados para cada imagen (opcional)
    marginBottom?: number[] // Array de márgenes inferiores personalizados para cada imagen (opcional)
    marginLeft?: number[] // Array de márgenes izquierdos personalizados para cada imagen (opcional)
    marginRight?: number[] // Array de márgenes derechos personalizados para cada imagen (opcional)
    flexPerImage?: number[] // Array de valores flex para cada imagen (fila) dentro de la columna (opcional)
    justifyContent?: ('flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly')[] // Alineación horizontal de cada imagen (opcional)
    alignItems?: ('flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline')[] // Alineación vertical de cada imagen (opcional)
}

export interface MasonrySection {
    columns?: {
        mobile?: number
        tablet?: number
        desktop?: number
    }
    gap?: number
    // Opción 1: Especificar imágenes agrupadas por columna (recomendado para control total)
    columnImages?: MasonryColumn[]
    // Opción 2: Especificar todas las imágenes en un array (compatibilidad hacia atrás)
    images?: string[]
    margins?: number[] // Array de márgenes verticales (inferior) personalizados para cada imagen (opcional)
    marginLeft?: number[] // Array de márgenes izquierdos personalizados para cada imagen (opcional)
    marginRight?: number[] // Array de márgenes derechos personalizados para cada imagen (opcional)
    className?: string
}

interface MasonryGridProps {
    sections: MasonrySection[]
    className?: string
    horizontalMargin?: number // Margen horizontal del contenedor
    editable?: boolean
    onAddImage?: (sectionIndex: number, columnIndex: number) => void
    onReplaceImage?: (sectionIndex: number, columnIndex: number, imageIndex: number) => void
    onRemoveImage?: (sectionIndex: number, columnIndex: number, imageIndex: number) => void
}

/**
 * Componente de grid masonry flexible para mostrar imágenes en múltiples secciones
 * - Cada sección puede tener su propio número de columnas
 * - Cada sección puede tener márgenes personalizados por imagen
 * - Mantiene las proporciones originales de las imágenes
 * - Diseño responsivo con diferentes columnas según el tamaño de pantalla
 * - Lazy loading para optimización
 */
export function MasonryGrid({
    sections,
    className,
    horizontalMargin = 10,
    editable = false,
    onAddImage,
    onReplaceImage,
    onRemoveImage
}: MasonryGridProps) {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

    // Manejar la carga de imágenes
    const handleImageLoad = (sectionIndex: number, imageIndex: number | string) => {
        const key = `${sectionIndex}-${imageIndex}`
        setLoadedImages(prev => new Set(prev).add(key))
    }

    // Función para generar márgenes verticales variables si no se proporcionan
    const getMargins = (images: string[], margins?: number[], gap: number = 16): number[] => {
        if (margins && margins.length === images.length) {
            return margins
        }

        // Generar márgenes variables automáticamente
        return images.map((_, index) => {
            const seed = index * 7 + 13
            const variation = (seed % 9) / 10
            const minMargin = gap * 0.6
            const maxMargin = gap * 1.4
            return Math.round(minMargin + (maxMargin - minMargin) * variation)
        })
    }

    // Función para obtener márgenes izquierdos (solo para compatibilidad con método antiguo)
    const getMarginLeft = (images: string[], marginLeft?: number[]): number[] => {
        if (marginLeft && marginLeft.length === images.length) {
            return marginLeft
        }
        return images.map(() => 0)
    }

    // Función para obtener márgenes derechos (solo para compatibilidad con método antiguo)
    const getMarginRight = (images: string[], marginRight?: number[]): number[] => {
        if (marginRight && marginRight.length === images.length) {
            return marginRight
        }
        return images.map(() => 0)
    }

    // Función para obtener márgenes superiores
    const getMarginTop = (images: string[], marginTop?: number[]): number[] => {
        if (marginTop && marginTop.length === images.length) {
            return marginTop
        }
        return images.map(() => 0)
    }

    // Función para obtener márgenes inferiores
    const getMarginBottom = (images: string[], marginBottom?: number[], margins?: number[], gap: number = 16): number[] => {
        if (marginBottom && marginBottom.length === images.length) {
            return marginBottom
        }
        // Si no hay marginBottom pero hay margins (compatibilidad), usar margins
        if (margins && margins.length === images.length) {
            return margins
        }
        // Por defecto, usar el gap como margen inferior
        return images.map(() => gap)
    }

    const renderEditableOverlay = (sectionIndex: number, columnIndex: number, imageIndex: number) => {
        if (!editable) return null
        return (
            <div className="pointer-events-none absolute inset-0 hidden items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white sm:flex sm:opacity-0 sm:transition-opacity sm:hover:opacity-100">
                <button
                    type="button"
                    className="pointer-events-auto rounded bg-white/90 px-2 py-1 text-xs font-semibold text-black hover:bg-white"
                    onClick={() => onReplaceImage?.(sectionIndex, columnIndex, imageIndex)}
                >
                    Cambiar
                </button>
                <button
                    type="button"
                    className="pointer-events-auto rounded bg-red-600/90 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    onClick={() => onRemoveImage?.(sectionIndex, columnIndex, imageIndex)}
                >
                    Eliminar
                </button>
            </div>
        )
    }

    const renderInlineActions = (sectionIndex: number, columnIndex: number, imageIndex: number) => {
        if (!editable) return null
        return (
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-black/70">
                <button
                    type="button"
                    onClick={() => onReplaceImage?.(sectionIndex, columnIndex, imageIndex)}
                    className="rounded border border-black/30 px-2 py-1 hover:border-black hover:text-black"
                >
                    Cambiar
                </button>
                <button
                    type="button"
                    onClick={() => onRemoveImage?.(sectionIndex, columnIndex, imageIndex)}
                    className="rounded border border-red-400 px-2 py-1 text-red-500 hover:border-red-600 hover:text-red-600"
                >
                    Eliminar
                </button>
            </div>
        )
    }

    return (
        <div className={cn('w-full space-y-12', className)} style={{ marginLeft: `${horizontalMargin}px`, marginRight: `${horizontalMargin}px` }}>
            {sections.map((section, sectionIndex) => {
                const mobileColumns = section.columns?.mobile || 1
                const tabletColumns = section.columns?.tablet || 2
                const desktopColumns = section.columns?.desktop || 3
                const gap = section.gap || 16
                const sectionId = `masonry-section-${sectionIndex}`

                // Si se usa columnImages, renderizar con control por columna
                if (section.columnImages && section.columnImages.length > 0) {
                    return (
                        <div key={sectionIndex} className={cn('w-full', section.className)}>
                            <style>{`
                                .${sectionId} {
                                    display: flex;
                                    gap: ${gap}px;
                                    flex-direction: column;
                                }
                                @media (min-width: 640px) {
                                    .${sectionId} {
                                        flex-direction: row;
                                    }
                                }
                                .${sectionId} .masonry-column {
                                    display: flex;
                                    flex-direction: column;
                                }
                                .${sectionId} .masonry-item {
                                    display: flex;
                                    width: 100%;
                                }
                            `}</style>
                            <div className={sectionId}>
                                {section.columnImages.map((column, columnIndex) => {
                                    const flexValue = column.flex !== undefined ? column.flex : 1
                                    const marginTop = getMarginTop(column.images, column.marginTop)
                                    const marginBottom = getMarginBottom(column.images, column.marginBottom, column.margins, gap)
                                    const marginLeft = getMarginLeft(column.images, column.marginLeft)
                                    const marginRight = getMarginRight(column.images, column.marginRight)

                                    // Función para obtener el flex de cada imagen
                                    const getImageFlex = (imageIndex: number): number => {
                                        if (column.flexPerImage && column.flexPerImage.length > imageIndex) {
                                            return column.flexPerImage[imageIndex]
                                        }
                                        return 1 // Por defecto, cada imagen ocupa el 100% del ancho de la columna
                                    }

                                    // Función para obtener justify-content de cada imagen
                                    const getJustifyContent = (imageIndex: number): string => {
                                        if (column.justifyContent && column.justifyContent.length > imageIndex) {
                                            return column.justifyContent[imageIndex]
                                        }
                                        return 'flex-start' // Por defecto
                                    }

                                    // Función para obtener align-items de cada imagen
                                    const getAlignItems = (imageIndex: number): string => {
                                        if (column.alignItems && column.alignItems.length > imageIndex) {
                                            return column.alignItems[imageIndex]
                                        }
                                        return 'flex-start' // Por defecto
                                    }

                                    return (
                                        <div
                                            key={columnIndex}
                                            className="masonry-column"
                                            style={{ flex: flexValue }}
                                        >
                                            {column.images.map((image, imageIndex) => {
                                                const imageKey = `${sectionIndex}-${columnIndex}-${imageIndex}`
                                                const isLoaded = loadedImages.has(imageKey)
                                                const imageFlex = getImageFlex(imageIndex)
                                                const justifyContent = getJustifyContent(imageIndex)
                                                const alignItems = getAlignItems(imageIndex)

                                                // Calcular el ancho basado en el flex (1 = 100%, 0.8 = 80%, etc.)
                                                const widthPercent = column.flexPerImage
                                                    ? `${Math.min(imageFlex, 1) * 100}%`
                                                    : '100%'

                                                return (
                                                    <div
                                                        key={imageIndex}
                                                        className="masonry-item"
                                                        style={{
                                                            marginTop: `${marginTop[imageIndex]}px`,
                                                            marginBottom: `${marginBottom[imageIndex]}px`,
                                                            marginLeft: `${marginLeft[imageIndex]}px`,
                                                            marginRight: `${marginRight[imageIndex]}px`,
                                                            width: '100%',
                                                            justifyContent: justifyContent,
                                                            alignItems: alignItems
                                                        }}
                                                    >
                                                        <div className="relative overflow-hidden" style={{
                                                            width: column.flexPerImage ? widthPercent : '100%',
                                                            maxWidth: '100%'
                                                        }}>
                                                            {!isLoaded && (
                                                                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
                                                            )}
                                                            <img
                                                                src={image}
                                                                alt={`Photography section ${sectionIndex + 1}, column ${columnIndex + 1}, image ${imageIndex + 1}`}
                                                                className={cn(
                                                                    'w-full h-auto transition-opacity duration-300',
                                                                    isLoaded ? 'opacity-100' : 'opacity-0'
                                                                )}
                                                                loading={sectionIndex === 0 && columnIndex === 0 && imageIndex < 2 ? 'eager' : 'lazy'}
                                                                decoding="async"
                                                                onLoad={() => handleImageLoad(sectionIndex, `${columnIndex}-${imageIndex}`)}
                                                                style={{
                                                                    display: 'block',
                                                                    width: '100%',
                                                                    height: 'auto'
                                                                }}
                                                            />
                                                            {renderEditableOverlay(sectionIndex, columnIndex, imageIndex)}
                                                        </div>
                                                        {renderInlineActions(sectionIndex, columnIndex, imageIndex)}
                                                    </div>
                                                )
                                            })}
                                            {editable && onAddImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => onAddImage(sectionIndex, columnIndex)}
                                                    className="mt-4 flex items-center justify-center gap-2 rounded border border-dashed border-black/40 px-3 py-2 text-sm text-black/70 hover:border-black hover:text-black"
                                                >
                                                    <span className="text-lg leading-none">+</span>
                                                    Añadir imagen
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }

                // Compatibilidad hacia atrás: usar método antiguo con CSS columns
                const images = section.images || []
                const margins = getMargins(images, section.margins, gap)
                const marginLeft = getMarginLeft(images, section.marginLeft)
                const marginRight = getMarginRight(images, section.marginRight)

                return (
                    <div key={sectionIndex} className={cn('w-full', section.className)}>
                        <style>{`
                            .${sectionId} {
                                column-count: ${mobileColumns};
                                column-gap: ${gap}px;
                                column-fill: balance;
                            }
                            @media (min-width: 640px) {
                                .${sectionId} {
                                    column-count: ${tabletColumns};
                                }
                            }
                            @media (min-width: 1024px) {
                                .${sectionId} {
                                    column-count: ${desktopColumns};
                                }
                            }
                            .${sectionId} .masonry-item {
                                break-inside: avoid;
                                page-break-inside: avoid;
                            }
                        `}</style>
                        <div className={sectionId}>
                            {images.map((image, imageIndex) => {
                                const imageKey = `${sectionIndex}-${imageIndex}`
                                const isLoaded = loadedImages.has(imageKey)

                                return (
                                    <div
                                        key={imageIndex}
                                        className="masonry-item"
                                        style={{
                                            marginBottom: `${margins[imageIndex]}px`,
                                            paddingLeft: `${marginLeft[imageIndex]}px`,
                                            paddingRight: `${marginRight[imageIndex]}px`
                                        }}
                                    >
                                        <div className="relative w-full overflow-hidden">
                                            {!isLoaded && (
                                                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
                                            )}
                                            <img
                                                src={image}
                                                alt={`Photography section ${sectionIndex + 1}, image ${imageIndex + 1}`}
                                                className={cn(
                                                    'w-full h-auto transition-opacity duration-300',
                                                    isLoaded ? 'opacity-100' : 'opacity-0'
                                                )}
                                                loading={sectionIndex === 0 && imageIndex < 3 ? 'eager' : 'lazy'}
                                                decoding="async"
                                                onLoad={() => handleImageLoad(sectionIndex, imageIndex)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: 'auto'
                                                }}
                                            />
                                            {renderEditableOverlay(sectionIndex, 0, imageIndex)}
                                        </div>
                                        {renderInlineActions(sectionIndex, 0, imageIndex)}
                                    </div>
                                )
                            })}
                        </div>
                        {editable && onAddImage && (
                            <button
                                type="button"
                                onClick={() => onAddImage(sectionIndex, 0)}
                                className="mt-4 flex items-center justify-center gap-2 rounded border border-dashed border-black/40 px-3 py-2 text-sm text-black/70 hover:border-black hover:text-black"
                            >
                                <span className="text-lg leading-none">+</span>
                                Añadir imagen
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

