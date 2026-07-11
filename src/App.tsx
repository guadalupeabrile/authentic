import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './animation'
import { AppLoader } from './components/AppLoader'
import { useRoute } from './hooks/useRoute'

// Code splitting: every page is its own lazily-loaded chunk.
const HomePage = lazy(() => import('./pages/HomePage'))
const WebsPage = lazy(() => import('./pages/WebsPage'))
const PhotographyPage = lazy(() => import('./pages/PhotographyPage'))
const PhotographyProjectPage = lazy(() => import('./pages/PhotographyProjectPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

/** Reserves viewport height while a route chunk loads, preventing layout shift. */
function RouteFallback() {
    return <div className="min-h-screen" aria-hidden="true" />
}

function resolveRoute(path: string) {
    const projectMatch = path.match(/^\/photography\/(.+)$/)
    if (projectMatch) {
        return <PhotographyProjectPage projectId={projectMatch[1]} />
    }

    switch (path) {
        case '/websites':
            return <WebsPage />
        case '/photography':
            return <PhotographyPage />
        case '/about':
            return <AboutPage />
        case '/':
        default:
            return <HomePage />
    }
}

function App() {
    const path = useRoute()

    return (
        <>
            <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                <PageTransition key={path}>
                    <Suspense fallback={<RouteFallback />}>{resolveRoute(path)}</Suspense>
                </PageTransition>
            </AnimatePresence>
            <AppLoader routeKey={path} />
        </>
    )
}

export default App
