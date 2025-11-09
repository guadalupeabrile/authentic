"use client"

import React from "react"
import { proyecto } from "../data/proyecto"

const REPETICIONES = 6

const WebProjectsList: React.FC = () => {
    return (
        <section className="mt-16 flex flex-col border-y border-black/40">
            {proyecto.map((item, index) => {
                const duracion = item.velocidad ?? 36

                return (
                    <div
                        key={item.nombre + index}
                        className="overflow-hidden border-b border-black/10 last:border-b-0 bg-white"
                    >
                        <div
                            className="relative flex uppercase tracking-[0.2em] text-xl sm:text-2xl md:text-4xl font-light text-black"
                            aria-hidden="true"
                        >
                            <div
                                className="marquee flex min-w-max items-center"
                                style={{ animationDuration: `${duracion}s` }}
                            >
                                {Array.from({ length: REPETICIONES }).map((_, i) => (
                                    <span
                                        key={`${item.nombre}-${i}`}
                                        className="flex items-center gap-4 px-6 py-6"
                                    >
                                        <span>{item.nombre}</span>
                                        {item.icono && <span>{item.icono}</span>}
                                    </span>
                                ))}
                            </div>

                            <div
                                className="marquee flex min-w-max items-center"
                                style={{ animationDuration: `${duracion}s` }}
                            >
                                {Array.from({ length: REPETICIONES }).map((_, i) => (
                                    <span
                                        key={`${item.nombre}-dup-${i}`}
                                        className="flex items-center gap-4 px-6 py-6"
                                    >
                                        <span>{item.nombre}</span>
                                        {item.icono && <span>{item.icono}</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}

            <style jsx>{`
                @keyframes desplazamiento-marquee {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }

                .marquee {
                    animation-name: desplazamiento-marquee;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </section>
    )
}

export default WebProjectsList


