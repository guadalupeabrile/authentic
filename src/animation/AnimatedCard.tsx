import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_OUT, VIEWPORT } from './motion'

interface AnimatedCardProps {
    children: ReactNode
    className?: string
    delay?: number
    /** Enable the subtle hover lift + scale. */
    interactive?: boolean
}

/**
 * Card wrapper with a consistent entrance (fade + lift on scroll) and an
 * optional subtle, GPU-accelerated hover (scale + soft shadow).
 */
export function AnimatedCard({ children, className, delay = 0, interactive = true }: AnimatedCardProps) {
    const reduce = useReducedMotion()

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: reduce ? DURATION.fast : DURATION.base, ease: EASE_OUT, delay: reduce ? 0 : delay }}
            {...(interactive && !reduce
                ? {
                      whileHover: { scale: 1.02, boxShadow: '0 18px 40px -18px rgba(0,0,0,0.28)' },
                      whileTap: { scale: 0.99 },
                  }
                : {})}
            style={{ willChange: 'transform' }}
        >
            {children}
        </motion.div>
    )
}
