import { navigationItems as defaultNavigationItems, type NavigationItem } from '../data/navigation'
import { cn } from '../lib/cn'

interface HeaderSecondaryProps {
    className?: string
    logoSrc?: string
    navigationItems?: NavigationItem[]
    activeUrl?: string
}

export function HeaderSecondary({
    className,
    logoSrc = '/logo.png',
    navigationItems = defaultNavigationItems,
    activeUrl
}: HeaderSecondaryProps) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const activePath = activeUrl || currentPath

    return (
        <header
            className={cn(
                'w-full border-b border-white/10 bg-black/60 backdrop-blur',
                className
            )}
        >
            <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6">
                <a
                    href="/"
                    className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                    <img
                        src={logoSrc}
                        alt="Authentic Web Design"
                        className="h-10 w-auto object-contain"
                        loading="eager"
                        decoding="async"
                    />
                </a>

                <nav className="flex flex-1 justify-center gap-4 sm:gap-6 md:gap-8">
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
                                    'text-white/90 hover:text-white transition-colors duration-200',
                                    'text-xs sm:text-sm md:text-base',
                                    'uppercase tracking-[0.18em]',
                                    isActive && 'border-b border-white/80 pb-1'
                                )}
                            >
                                {item.label}
                            </a>
                        )
                    })}
                </nav>

                <div aria-hidden className="hidden flex-1 sm:flex" />
            </div>
        </header>
    )
}


