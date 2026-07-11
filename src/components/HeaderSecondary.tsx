import { navigationItems as defaultNavigationItems, type NavigationItem } from '../data/navigation'
import { useScrolled } from '../hooks/useScrolled'
import { cn } from '../lib/cn'
import { NavLink } from './NavLink'

interface HeaderSecondaryProps {
    className?: string
    navigationItems?: NavigationItem[]
    activeUrl?: string
}

export function HeaderSecondary({
    className,
    navigationItems = defaultNavigationItems,
    activeUrl
}: HeaderSecondaryProps) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const activePath = activeUrl || currentPath
    const scrolled = useScrolled(8)

    return (
        <header
            className={cn(
                'w-full border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out',
                scrolled
                    ? 'border-black/10 bg-white/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md'
                    : 'border-black/10 bg-white',
                className
            )}
        >
            <div className="relative flex w-full flex-col items-center gap-3 px-4 py-6 sm:flex-row sm:gap-6 sm:px-6">
                <nav className="flex w-full justify-center gap-4 sm:gap-6 md:gap-8">
                    {navigationItems.map((item) => {
                        const isActive =
                            item.url === '/'
                                ? activePath === '/'
                                : activePath.startsWith(item.url)
                        return (
                            <NavLink
                                key={item.url}
                                href={item.url}
                                label={item.label}
                                isActive={isActive}
                                variant="dark"
                            />
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
