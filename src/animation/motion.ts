import type { Transition, Variants } from 'framer-motion'

/** Semantic tags supported by the polymorphic motion wrappers. */
export type MotionTagName =
    | 'div'
    | 'section'
    | 'aside'
    | 'article'
    | 'header'
    | 'footer'
    | 'nav'
    | 'ul'
    | 'ol'
    | 'li'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'p'
    | 'span'

/**
 * Shared motion design tokens.
 * Keeping every duration, easing and offset in one place guarantees a
 * consistent, "invisible" feel across the whole site and avoids duplicated
 * animation code.
 */

// Premium easeOut curve (smooth deceleration, à la Apple / Linear).
export const EASE_OUT: Transition['ease'] = [0.22, 1, 0.36, 1]

export const DURATION = {
    fast: 0.3,
    base: 0.5,
    slow: 0.7,
} as const

/** Vertical offset used for the subtle upward reveal. */
export const OFFSET_Y = 24

/** Default viewport config for scroll reveals: trigger once, slightly early. */
export const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -80px 0px' } as const

/** Base transition applied to most reveals. */
export const baseTransition: Transition = {
    duration: DURATION.base,
    ease: EASE_OUT,
}

export const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: baseTransition },
}

export const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: OFFSET_Y },
    visible: { opacity: 1, y: 0, transition: baseTransition },
}

export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: baseTransition },
}

/**
 * Container that reveals its children with a natural stagger.
 * Children should use `fadeUpVariants` / `cardVariants` (hidden/visible names).
 */
export const staggerContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
}

/**
 * Standard page enter/exit used by <PageTransition />.
 * Intentionally opacity-only: pages contain `position: fixed` headers, and a
 * lingering `transform` on an ancestor would break fixed positioning. The
 * "small upward movement" is applied to inner content (FadeUp / RevealOnScroll).
 */
export const pageVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: DURATION.base, ease: EASE_OUT },
    },
    exit: {
        opacity: 0,
        transition: { duration: DURATION.fast, ease: EASE_OUT },
    },
}

/**
 * Reduced-motion friendly variants: fade only, no movement, quicker.
 * Used when `prefers-reduced-motion: reduce` is active.
 */
export const reducedVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.fast } },
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATION.fast } },
    exit: { opacity: 0, transition: { duration: DURATION.fast } },
}

/** Shared, tactile hover/tap feel for interactive elements. */
export const buttonMotion = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: DURATION.fast, ease: EASE_OUT },
} as const

export const cardHoverMotion = {
    whileHover: { scale: 1.02 },
    transition: { duration: DURATION.fast, ease: EASE_OUT },
} as const
