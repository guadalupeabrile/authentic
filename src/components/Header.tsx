import { navigationItems as defaultNavigationItems, type NavigationItem } from '../data/navigation'
import { cn } from '../lib/cn'

interface HeaderProps {
    className?: string
    logoSrc?: string
    navigationItems?: NavigationItem[]
    activeUrl?: string
}

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
                        className="w-full md:w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 scale-110 md:scale-100"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                {/* Navigation Menu */}
                <nav className="flex gap-3 md:gap-4 lg:gap-5 justify-center items-center mx-[5px]">
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
                                    'text-[10px] sm:text-xs md:text-sm lg:text-sm',
                                    'font-light tracking-[0.1em] uppercase',
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
