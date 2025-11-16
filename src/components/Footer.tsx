import { useEffect, useState } from 'react'
import { contactLinks } from '../data/contactInfo'
import { cn } from '../lib/cn'

interface FooterProps {
    className?: string
    darkText?: boolean
}

export function Footer({ className, darkText }: FooterProps) {
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
                <div
                    className={cn(
                        'mb-2 flex w-[95%] items-center justify-between gap-3 text-[10px] sm:text-xs md:text-sm lg:text-base md:gap-4 text-center mx-auto font-light uppercase tracking-[0.15em]',
                        darkText ? 'text-black' : 'mix-blend-difference text-white'
                    )}
                >
                    {contactLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="hover:opacity-70 transition-opacity tracking-wider"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

