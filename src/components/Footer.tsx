import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { contactLinks } from '../data/contactInfo'
import { DURATION, EASE_OUT } from '../animation/motion'
import { cn } from '../lib/cn'

interface FooterProps {
    className?: string
    darkText?: boolean
}

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// Opacity-only entrance keeps the homepage footer's mix-blend-difference intact
// (a lingering transform would create a stacking context and break blending).
const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export function Footer({ className, darkText }: FooterProps) {
    const reduce = useReducedMotion()
    // Only the solid (dark-text) footer can safely use a transform-based hover.
    const allowHoverLift = Boolean(darkText) && !reduce

    return (
        <footer
            className={cn('w-full relative mt-auto', className)}
            style={{ backgroundColor: 'transparent', background: 'transparent' }}
        >
            <div
                className={cn(
                    'relative w-full px-[10px] py-4 md:py-6',
                    darkText ? 'bg-white border-t border-black/10' : 'bg-transparent'
                )}
                style={darkText ? {} : {
                    backgroundColor: 'transparent',
                    background: 'transparent',
                    backgroundImage: 'none'
                }}
            >
                <motion.div
                    className={cn(
                        'flex flex-col md:flex-row w-[95%] items-center justify-center md:justify-between gap-3 text-xs sm:text-sm md:text-base lg:text-lg md:gap-4 text-center mx-auto font-bold uppercase tracking-[0.15em]',
                        darkText ? 'text-black' : 'mix-blend-difference text-white'
                    )}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    {contactLinks.map((link) => (
                        <motion.a
                            key={link.id}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            variants={itemVariants}
                            whileHover={allowHoverLift ? { y: -2 } : undefined}
                            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                            className={cn(
                                'tracking-wider opacity-100 transition-opacity duration-200 hover:opacity-70',
                                'outline-none focus-visible:opacity-70',
                                link.id === 'email' ? 'lowercase' : '',
                                link.id === 'instagram' ? 'normal-case' : ''
                            )}
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </footer>
    )
}
