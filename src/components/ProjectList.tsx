"use client"

import React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { DURATION, EASE_OUT } from "../animation/motion"
import { OptimizedImage } from "./OptimizedImage"

const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

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

const clampSpeed = (baseSpeed?: number): number => {
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
    const reduce = useReducedMotion()
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: reduce ? 0 : 20 },
        visible: { opacity: 1, y: 0, transition: { duration: reduce ? DURATION.fast : DURATION.base, ease: EASE_OUT } },
    }

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
                            className="h-[1.5em] w-[2em] object-cover align-middle inline-block mr-4"
                            style={{ height: '1.5em', width: '2em', verticalAlign: 'middle', maxWidth: 'none', objectFit: 'cover' }}
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
                            className="h-[1.5em] w-[2em] object-cover align-middle inline-block mr-4"
                            style={{ height: '1.5em', width: '2em', verticalAlign: 'middle', maxWidth: 'none', objectFit: 'cover' }}
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
                            className="h-[1.5em] w-[2em] object-cover align-middle inline-block mr-4"
                            style={{ height: '1.5em', width: '2em', verticalAlign: 'middle', maxWidth: 'none', objectFit: 'cover' }}
                        />
                    )}
                    {item.icon && <span className="ml-4">{item.icon}</span>}
                </span>
            ))}
        </>
    )

    return (
        <motion.section
            className="mt-16 flex flex-col"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            {projects.map((item, index) => {
                const duration = clampSpeed(item.speed)
                const isExternal = typeof window !== 'undefined' && isExternalLink(item.link)

                return (
                    <motion.a
                        key={item.id || item.name + index}
                        href={item.link}
                        {...(isExternal && {
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        })}
                        variants={itemVariants}
                        className="block overflow-hidden border-b border-black/10 last:border-b-0 bg-white transition-[background-color,box-shadow] duration-300 hover:bg-black/[0.03] hover:shadow-[0_14px_36px_-24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                        {/* Mobile: Si hay imagen, mostrar imagen fija arriba y marquee abajo. Si no hay imagen, solo marquee como antes */}
                        {item.image ? (
                            <div className="md:hidden">
                                <div className="w-full mt-4 mb-6 pb-4 aspect-[4/3] overflow-hidden">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        sizes="100vw"
                                        zoomOnHover
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    </motion.a>
                )
            })}
        </motion.section>
    )
}

export default ProjectList

