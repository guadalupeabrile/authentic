import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'

interface FooterProps {
    className?: string
}

export function Footer({ className }: FooterProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleVisibility = () => {
            const viewportHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const currentScroll = window.scrollY || window.pageYOffset

            // Mostrar footer cuando el scroll supera el 80% del viewport o cuando está cerca del final
            const shouldShow = currentScroll > viewportHeight * 0.8 ||
                (currentScroll + viewportHeight) >= (documentHeight - 100)

            setIsVisible(shouldShow)
        }

        // Verificar al montar el componente
        handleVisibility()

        // Verificar en cada scroll
        window.addEventListener('scroll', handleVisibility, { passive: true })

        return () => window.removeEventListener('scroll', handleVisibility)
    }, [])

    return (
        <footer
            className={cn(
                'fixed bottom-0 left-0 w-full z-40 bg-transparent',
                'transition-all duration-700 ease-in-out',
                isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none',
                className
            )}
            style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
            <div
                className={cn(
                    'relative w-full bg-transparent px-[10px]',
                    'transform transition-all duration-700 ease-out',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
                )}
                style={{ transitionDelay: '160ms' }}
            >
                <div className="mb-2 flex w-[95%] items-center justify-between gap-3 text-xs sm:text-sm md:text-base lg:text-lg md:gap-4 mix-blend-difference text-white text-center mx-auto font-light uppercase tracking-[0.15em]">
                    <a
                        href="tel:+59899705004"
                        className="hover:opacity-70 transition-opacity"
                    >
                        (+598) 99 705 004
                    </a>
                    <a
                        href="mailto:HOLA@NARCISOESTUDIO.COM"
                        className="hover:opacity-70 transition-opacity uppercase tracking-wider"
                    >
                        HOLA@NARCISOESTUDIO.COM
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-70 transition-opacity uppercase tracking-wider"
                    >
                        Instagram
                    </a>
                </div>
            </div>
        </footer>
    )
}

