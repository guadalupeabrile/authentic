import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_OUT, OFFSET_Y, VIEWPORT } from './motion'

interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    delay?: number
    /** Upward travel distance in px. */
    y?: number
}

/**
 * A semantic <section> that fades + lifts into view once on scroll.
 * Convenience wrapper for page sections that should reveal as a single block.
 */
export function AnimatedSection({ children, className, delay = 0, y = OFFSET_Y }: AnimatedSectionProps) {
    const reduce = useReducedMotion()

    return (
        <motion.section
            className={className}
            initial={{ opacity: 0, y: reduce ? 0 : y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: reduce ? DURATION.fast : DURATION.slow, ease: EASE_OUT, delay: reduce ? 0 : delay }}
        >
            {children}
        </motion.section>
    )
}
