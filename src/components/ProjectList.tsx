"use client"

import React from "react"
import { OptimizedImage } from "./OptimizedImage"

export interface Project {
    id: string
    name: string
    icon?: string
    image?: string
    speed?: number
    link: string
}

interface ProjectListProps {
    projects: Project[]
    repetitions?: number
}

const DEFAULT_REPETITIONS = 12

// Generar velocidades únicas para cada proyecto si no están definidas
// Velocidad mínima: 90 segundos (más lento = número mayor)
const MIN_SPEED = 90
const MAX_SPEED = 120

const generateUniqueSpeed = (index: number, baseSpeed?: number): number => {
    let speed = baseSpeed || 90
    // Limitar la velocidad mínima para evitar que sean demasiado rápidos
    if (speed < MIN_SPEED) {
        speed = MIN_SPEED
    }
    // También limitar la velocidad máxima
    if (speed > MAX_SPEED) {
        speed = MAX_SPEED
    }
    return speed
}

const ProjectList: React.FC<ProjectListProps> = ({
    projects,
    repetitions = DEFAULT_REPETITIONS
}) => {
    const isExternalLink = (link: string): boolean => {
        try {
            const url = new URL(link, window.location.origin)
            return url.origin !== window.location.origin
        } catch {
            // Si es una ruta relativa, no es externa
            return !link.startsWith('http')
        }
    }

    const renderMarqueeContent = (item: Project, showImage: boolean = true) => (
        <>
            {Array.from({ length: repetitions }).map((_, i) => (
                <span
                    key={`${item.name}-${i}`}
                    className="flex items-center px-6 py-6 whitespace-nowrap"
                >
                    <span className="mr-4">{item.name}</span>
                    {showImage && item.image && (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-[1.5em] w-auto object-contain align-middle inline-block mr-4"
                            style={{ height: '1.5em', verticalAlign: 'middle', maxWidth: 'none' }}
                        />
                    )}
                    {item.icon && <span className="ml-4">{item.icon}</span>}
                </span>
            ))}
            {Array.from({ length: repetitions }).map((_, i) => (
                <span
                    key={`${item.name}-dup-${i}`}
                    className="flex items-center px-6 py-6 whitespace-nowrap"
                >
                    <span className="mr-4">{item.name}</span>
                    {showImage && item.image && (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-[1.5em] w-auto object-contain align-middle inline-block mr-4"
                            style={{ height: '1.5em', verticalAlign: 'middle', maxWidth: 'none' }}
                        />
                    )}
                    {item.icon && <span className="ml-4">{item.icon}</span>}
                </span>
            ))}
            {Array.from({ length: repetitions }).map((_, i) => (
                <span
                    key={`${item.name}-dup2-${i}`}
                    className="flex items-center px-6 py-6 whitespace-nowrap"
                >
                    <span className="mr-4">{item.name}</span>
                    {showImage && item.image && (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-[1.5em] w-auto object-contain align-middle inline-block mr-4"
                            style={{ height: '1.5em', verticalAlign: 'middle', maxWidth: 'none' }}
                        />
                    )}
                    {item.icon && <span className="ml-4">{item.icon}</span>}
                </span>
            ))}
        </>
    )

    return (
        <section className="mt-16 flex flex-col">
            {projects.map((item, index) => {
                const duration = generateUniqueSpeed(index, item.speed)
                const isExternal = typeof window !== 'undefined' && isExternalLink(item.link)

                return (
                    <a
                        key={item.id || item.name + index}
                        href={item.link}
                        {...(isExternal && {
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        })}
                        className="block overflow-hidden border-b border-black/10 last:border-b-0 bg-white transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                        {/* Mobile: Si hay imagen, mostrar imagen fija arriba y marquee abajo. Si no hay imagen, solo marquee como antes */}
                        {item.image ? (
                            <div className="md:hidden">
                                <div className="w-full mt-4 mb-6 pb-4">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-auto object-cover"
                                        sizes="100vw"
                                    />
                                </div>
                                <div className="relative overflow-hidden uppercase tracking-[0.2em] text-lg font-light text-black border-t border-black/10">
                                    <div
                                        className="marquee flex w-max items-center"
                                        style={{ animationDuration: `${duration}s` }}
                                    >
                                        {renderMarqueeContent(item, false)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="md:hidden relative overflow-hidden uppercase tracking-[0.2em] text-lg font-light text-black">
                                <div
                                    className="marquee flex w-max items-center"
                                    style={{ animationDuration: `${duration}s` }}
                                >
                                    {renderMarqueeContent(item, false)}
                                </div>
                            </div>
                        )}

                        {/* Desktop: Marquee infinito con texto e imágenes alternándose */}
                        <div
                            className="hidden md:block relative overflow-hidden uppercase tracking-[0.2em] text-xl sm:text-2xl md:text-4xl font-light text-black"
                            aria-hidden="true"
                        >
                            <div
                                className="marquee flex w-max items-center"
                                style={{ animationDuration: `${duration}s` }}
                            >
                                {renderMarqueeContent(item, true)}
                            </div>
                        </div>
                    </a>
                )
            })}
        </section>
    )
}

export default ProjectList

