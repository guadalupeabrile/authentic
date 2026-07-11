import { useEffect, useState } from 'react'

/**
 * Returns whether the page has been scrolled past `threshold` pixels.
 * Uses a passive listener and rAF throttling to stay cheap and smooth.
 */
export function useScrolled(threshold = 8) {
    const [scrolled, setScrolled] = useState(
        typeof window !== 'undefined' ? window.scrollY > threshold : false
    )

    useEffect(() => {
        let frame = 0

        const onScroll = () => {
            if (frame) return
            frame = window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > threshold)
                frame = 0
            })
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()

        return () => {
            window.removeEventListener('scroll', onScroll)
            if (frame) window.cancelAnimationFrame(frame)
        }
    }, [threshold])

    return scrolled
}
