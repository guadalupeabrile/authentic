import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_OUT } from './motion'

interface FadeInProps {
    children: ReactNode
    className?: string
    /** Delay before the animation starts, in seconds. */
    delay?: number
    duration?: number
}

/**
 * Fades content in on mount. Opacity only — safe for reduced motion.
 */
export function FadeIn({ children, className, delay = 0, duration = DURATION.base }: FadeInProps) {
    const reduce = useReducedMotion()

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? DURATION.fast : duration, ease: EASE_OUT, delay: reduce ? 0 : delay }}
        >
            {children}
        </motion.div>
    )
}
