import { navigationItems as defaultNavigationItems, type NavigationItem } from '../data/navigation'
import { cn } from '../lib/cn'

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

    return (
        <header
            className={cn('w-full border-b border-black/10 bg-white', className)}
        >
            <div className="relative flex w-full flex-col items-center gap-3 px-4 py-6 sm:flex-row sm:gap-6 sm:px-6">
                <nav className="flex w-full justify-center gap-4 sm:gap-6 md:gap-8">
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
                                    'text-black/80 hover:text-black transition-colors duration-200',
                                    'text-[10px] sm:text-xs md:text-sm lg:text-sm',
                                    'uppercase tracking-[0.1em]',
                                    isActive && 'border-b border-black/80 pb-1'
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


