import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { fadeUpVariants, reducedVariants, staggerContainerVariants, VIEWPORT, type MotionTagName } from './motion'

interface StaggerContainerProps {
    children: ReactNode
    className?: string
    as?: MotionTagName
    /** Reveal on scroll (default) or immediately on mount. */
    trigger?: 'scroll' | 'mount'
}

/**
 * Reveals its children with a natural stagger. Children should be wrapped in
 * <StaggerItem /> (or any motion element using the hidden/visible variants).
 */
export function StaggerContainer({
    children,
    className,
    as = 'div',
    trigger = 'scroll',
}: StaggerContainerProps) {
    const MotionTag = motion[as] as ElementType
    const scrollProps =
        trigger === 'scroll'
            ? { whileInView: 'visible' as const, viewport: VIEWPORT }
            : { animate: 'visible' as const }

    return (
        <MotionTag
            className={className}
            variants={staggerContainerVariants}
            initial="hidden"
            {...scrollProps}
        >
            {children}
        </MotionTag>
    )
}

interface StaggerItemProps {
    children: ReactNode
    className?: string
    as?: MotionTagName
}

/** A single staggered child. Uses fade + lift, respecting reduced motion. */
export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
    const reduce = useReducedMotion()
    const MotionTag = motion[as] as ElementType

    return (
        <MotionTag className={className} variants={reduce ? reducedVariants : fadeUpVariants}>
            {children}
        </MotionTag>
    )
}
