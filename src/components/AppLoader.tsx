import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../animation/motion'
import { LOADER_BG, LOADER_LOGO } from '../lib/brand'

/** Minimum time the loader stays up on first load, to avoid a jarring flash. */
const MIN_VISIBLE_MS = 450
/** Hard cap so the loader never traps the user if an asset stalls (first load). */
const MAX_VISIBLE_MS = 2500
/** How long the loader holds on subsequent page navigations before fading out. */
const NAV_VISIBLE_MS = 550
/** Duration of the (slow, luxurious) fade-out. */
const FADE_OUT_S = 0.85

interface AppLoaderProps {
    /** Changes on every route navigation; re-triggers the loader. */
    routeKey?: string
}

/**
 * Full-screen, luxurious loading screen.
 * - Brand-coloured background, centered simplified logo.
 * - Fade in + gentle scale, a very subtle float and a soft opacity pulse.
 * - Shows on first load (until window load) and again on every page navigation.
 * - Fades out slowly and smoothly. Fully respects prefers-reduced-motion.
 */
export function AppLoader({ routeKey }: AppLoaderProps) {
    const reduce = useReducedMotion()
    const [visible, setVisible] = useState(true)
    const isFirstRoute = useRef(true)

    // Remove the static pre-hydration loader (index.html) now that React owns it.
    useEffect(() => {
        document.getElementById('initial-loader')?.remove()
    }, [])

    // First load: keep the loader up until the window (and critical assets) load.
    useEffect(() => {
        const start = performance.now()
        let finished = false

        const finish = () => {
            if (finished) return
            finished = true
            const elapsed = performance.now() - start
            const wait = Math.max(0, MIN_VISIBLE_MS - elapsed)
            window.setTimeout(() => setVisible(false), wait)
        }

        if (document.readyState === 'complete') {
            finish()
        } else {
            window.addEventListener('load', finish, { once: true })
        }
        const maxTimer = window.setTimeout(finish, MAX_VISIBLE_MS)

        return () => {
            window.removeEventListener('load', finish)
            window.clearTimeout(maxTimer)
        }
    }, [])

    // Subsequent navigations: briefly show the loader again, then fade it out.
    useEffect(() => {
        if (isFirstRoute.current) {
            isFirstRoute.current = false
            return
        }

        setVisible(true)
        const timer = window.setTimeout(() => setVisible(false), NAV_VISIBLE_MS)
        return () => window.clearTimeout(timer)
    }, [routeKey])

    // Prevent scrolling / layout jumps while the loader is up.
    useEffect(() => {
        if (!visible) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [visible])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="app-loader"
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{ backgroundColor: LOADER_BG }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: FADE_OUT_S, ease: EASE_OUT }}
                    role="status"
                    aria-live="polite"
                    aria-label="Loading"
                >
                    <motion.img
                        src={LOADER_LOGO}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="h-12 w-auto select-none md:h-14"
                        style={{ filter: 'brightness(0) invert(1)', willChange: 'transform, opacity' }}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                        animate={
                            reduce
                                ? { opacity: 1 }
                                : { opacity: [0, 1, 0.82, 1], scale: 1, y: [0, -3, 0] }
                        }
                        transition={
                            reduce
                                ? { duration: 0.3 }
                                : {
                                      scale: { duration: 0.6, ease: EASE_OUT },
                                      opacity: {
                                          duration: 2.6,
                                          times: [0, 0.25, 0.6, 1],
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                      },
                                      y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                                  }
                        }
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
