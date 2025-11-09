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
            <div className="relative flex w-full flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:gap-6 sm:px-6">
                <div className="shrink-0 self-center sm:ml-[10px] sm:self-auto">
                    <a
                        href="/"
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                    >
                        <img
                            src={logoSrc}
                            alt="Authentic Web Design"
                            className="h-10 w-auto object-contain"
                            loading="eager"
                            decoding="async"
                        />
                    </a>
                </div>

                <nav className="flex w-full justify-center gap-4 sm:absolute sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:gap-6 md:gap-8">
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
            </div>
        </header>
    )
}


