import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DURATION, EASE_OUT } from './motion'

interface AnimatedButtonProps {
    children: ReactNode
    className?: string
    /** When provided, renders an anchor instead of a button. */
    href?: string
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    target?: string
    rel?: string
    'aria-label'?: string
    disabled?: boolean
}

/**
 * A premium, tactile button/link: subtle scale on hover/tap with smooth
 * colour + shadow transitions and an accessible focus state.
 */
export function AnimatedButton({
    children,
    className,
    href,
    onClick,
    type = 'button',
    target,
    rel,
    disabled,
    ...rest
}: AnimatedButtonProps) {
    const reduce = useReducedMotion()

    const motionProps = reduce
        ? {}
        : {
              whileHover: { scale: 1.03 },
              whileTap: { scale: 0.97 },
              transition: { duration: DURATION.fast, ease: EASE_OUT },
          }

    if (href) {
        return (
            <motion.a
                href={href}
                target={target}
                rel={rel}
                className={className}
                onClick={onClick}
                aria-label={rest['aria-label']}
                {...motionProps}
            >
                {children}
            </motion.a>
        )
    }

    return (
        <motion.button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
            aria-label={rest['aria-label']}
            {...motionProps}
        >
            {children}
        </motion.button>
    )
}
