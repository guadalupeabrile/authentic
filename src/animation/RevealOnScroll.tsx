import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { DURATION, EASE_OUT, OFFSET_Y, VIEWPORT, type MotionTagName } from './motion'

interface RevealOnScrollProps {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    y?: number
    /** Render as a different semantic element (e.g. "section", "li"). */
    as?: MotionTagName
}

/**
 * Reveals content once when it scrolls into view: fade + slight translateY.
 * Never blocks the user — it always ends in a fully visible state.
 */
export function RevealOnScroll({
    children,
    className,
    delay = 0,
    duration = DURATION.slow,
    y = OFFSET_Y,
    as = 'div',
}: RevealOnScrollProps) {
    const reduce = useReducedMotion()
    const MotionTag = motion[as] as ElementType

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y: reduce ? 0 : y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: reduce ? DURATION.fast : duration, ease: EASE_OUT, delay: reduce ? 0 : delay }}
        >
            {children}
        </MotionTag>
    )
}
