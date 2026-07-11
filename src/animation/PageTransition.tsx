import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageVariants, reducedVariants } from './motion'

interface PageTransitionProps {
    children: ReactNode
    className?: string
}

/**
 * Wraps a page with an elegant enter/exit transition (fade + slight lift).
 * Designed to sit inside <AnimatePresence mode="wait">, keyed by route.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
    const reduce = useReducedMotion()

    return (
        <motion.div
            className={className}
            variants={reduce ? reducedVariants : pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    )
}
