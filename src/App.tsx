import HomePage from './pages/HomePage'
import WebsPage from './pages/WebsPage'
import PhotographyPage from './pages/PhotographyPage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'

const routes = {
    '/': <HomePage />,
    '/websites': <WebsPage />,
    '/photography': <PhotographyPage />,
    '/about': <AboutPage />,
    '/admin': <AdminPage />
}

function App() {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
    return routes[currentPath] ?? <HomePage />
}

export default App

