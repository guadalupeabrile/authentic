import { useEffect, useState } from 'react'

/**
 * Lightweight client-side routing for this custom (non react-router) app.
 * - Tracks the current pathname.
 * - Intercepts internal link clicks for instant SPA navigation.
 * - Manages scroll restoration manually: new navigations scroll to top,
 *   back/forward restore the previous position.
 */
export function useRoute() {
    const [path, setPath] = useState<string>(
        typeof window !== 'undefined' ? window.location.pathname : '/'
    )

    useEffect(() => {
        if (typeof window === 'undefined') return

        // Take control of scroll restoration for predictable, jump-free nav.
        const previousRestoration = window.history.scrollRestoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }

        const handlePopState = () => {
            setPath(window.location.pathname)
        }

        const handleClick = (e: MouseEvent) => {
            // Respect new-tab / modified clicks and non-primary buttons.
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return
            }

            const link = (e.target as HTMLElement).closest('a')
            if (!link) return

            const url = new URL(link.href, window.location.origin)
            const isInternal = url.origin === window.location.origin
            const opensNewTab = link.target && link.target !== '_self'
            const isDownload = link.hasAttribute('download')

            if (!isInternal || opensNewTab || isDownload) return

            // Let pure hash links / same-URL clicks behave natively.
            if (url.pathname === window.location.pathname && url.hash) return

            e.preventDefault()

            if (url.pathname !== window.location.pathname) {
                window.history.pushState({}, '', url.pathname + url.search + url.hash)
                setPath(url.pathname)
            }
        }

        window.addEventListener('popstate', handlePopState)
        document.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('popstate', handlePopState)
            document.removeEventListener('click', handleClick)
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = previousRestoration
            }
        }
    }, [])

    return path
}
