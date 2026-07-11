import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_OUT, OFFSET_Y } from './motion'

interface FadeUpProps {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    /** Upward travel distance in px. */
    y?: number
}

/**
 * Fades + lifts content in on mount. Movement is dropped for reduced motion.
 */
export function FadeUp({
    children,
    className,
    delay = 0,
    duration = DURATION.base,
    y = OFFSET_Y,
}: FadeUpProps) {
    const reduce = useReducedMotion()

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: reduce ? 0 : y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? DURATION.fast : duration, ease: EASE_OUT, delay: reduce ? 0 : delay }}
        >
            {children}
        </motion.div>
    )
}
