import { cn } from '../lib/cn'

export interface NavigationItem {
    label: string
    url: string
}

interface HeaderProps {
    className?: string
    logoSrc?: string
    navigationItems?: NavigationItem[]
    activeUrl?: string
}

const defaultNavigationItems: NavigationItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Websites', url: '/websites' },
    { label: 'Photography', url: '/photography' },
    { label: 'About', url: '/about' },
]

export function Header({
    className,
    logoSrc = '/logo.png',
    navigationItems = defaultNavigationItems,
    activeUrl
}: HeaderProps) {
    // Determinar el URL activo basado en la URL actual o el prop
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const activePath = activeUrl || currentPath

    return (
        <header className={cn('w-full', className)}>
            <div className="w-full">
                {/* Logo */}
                <div className="w-full">
                    <img
                        src={logoSrc}
                        alt="Authentic Web Design"
                        className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                {/* Navigation Menu */}
                <nav className="flex gap-6 md:gap-8 lg:gap-8 justify-center items-center ">
                    {navigationItems.map((item) => {
                        const isActive =
                            item.url === '/'
                                ? activePath === '/'
                                : activePath.startsWith(item.url)
                        return (
                            <a
                                key={item.url}
                                href={item.url}
                                className={cn(
                                    'text-white/95 hover:text-white transition-colors duration-200',
                                    'text-xs sm:text-sm md:text-base lg:text-lg',
                                    'font-light tracking-[0.15em] uppercase',
                                    'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]',
                                    isActive && 'underline underline-offset-4 decoration-white/90'
                                )}
                            >
                                {item.label}
                            </a>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}

