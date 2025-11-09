import { useState, useEffect } from 'react'

/**
 * Hook para detectar cuando el usuario hace scroll
 * Útil para efectos de fade-in/fade-out
 */
export function useScroll() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setScrollY(currentScrollY)
            setIsScrolled(currentScrollY > 50)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return { isScrolled, scrollY }
}

