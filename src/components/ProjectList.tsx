"use client"

import React from "react"

export interface Project {
    id: string
    name: string
    icon?: string
    speed?: number
    link: string
}

interface ProjectListProps {
    projects: Project[]
    repetitions?: number
}

const DEFAULT_REPETITIONS = 6

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

    return (
        <section className="mt-16 flex flex-col border-y border-black/40">
            {projects.map((item, index) => {
                const duration = item.speed ?? 36
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
                        <div
                            className="relative flex uppercase tracking-[0.2em] text-xl sm:text-2xl md:text-4xl font-light text-black"
                            aria-hidden="true"
                        >
                            <div
                                className="marquee flex min-w-max items-center"
                                style={{ animationDuration: `${duration}s` }}
                            >
                                {Array.from({ length: repetitions }).map((_, i) => (
                                    <span
                                        key={`${item.name}-${i}`}
                                        className="flex items-center gap-4 px-6 py-6"
                                    >
                                        <span>{item.name}</span>
                                        {item.icon && <span>{item.icon}</span>}
                                    </span>
                                ))}
                            </div>

                            <div
                                className="marquee flex min-w-max items-center"
                                style={{ animationDuration: `${duration}s` }}
                            >
                                {Array.from({ length: repetitions }).map((_, i) => (
                                    <span
                                        key={`${item.name}-dup-${i}`}
                                        className="flex items-center gap-4 px-6 py-6"
                                    >
                                        <span>{item.name}</span>
                                        {item.icon && <span>{item.icon}</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </a>
                )
            })}
        </section>
    )
}

export default ProjectList

