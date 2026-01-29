import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import WebsPage from './pages/WebsPage'
import PhotographyPage from './pages/PhotographyPage'
import PhotographyProjectPage from './pages/PhotographyProjectPage'
import AboutPage from './pages/AboutPage'

const routes: Record<string, JSX.Element> = {
    '/': <HomePage />,
    '/websites': <WebsPage />,
    '/photography': <PhotographyPage />,
    '/about': <AboutPage />
}

function App() {
    const [currentPath, setCurrentPath] = useState<string>(
        typeof window !== 'undefined' ? window.location.pathname : '/'
    )

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname)
        }

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', handleLocationChange)

        // Intercept link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const link = target.closest('a')
            if (link && link.href.startsWith(window.location.origin)) {
                e.preventDefault()
                const url = new URL(link.href)
                window.history.pushState({}, '', url.pathname)
                setCurrentPath(url.pathname)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('popstate', handleLocationChange)
            document.removeEventListener('click', handleClick)
        }
    }, [])

    // Check for dynamic routes
    const photographyProjectMatch = currentPath.match(/^\/photography\/(.+)$/)
    if (photographyProjectMatch) {
        const projectId = photographyProjectMatch[1]
        return <PhotographyProjectPage projectId={projectId} />
    }

    // Check static routes
    return routes[currentPath] ?? <HomePage />
}

export default App

