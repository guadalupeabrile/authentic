import { cn } from '../lib/cn'

interface NavLinkProps {
    href: string
    label: string
    isActive?: boolean
    /** "light" = white text over imagery, "dark" = dark text on light bg. */
    variant?: 'light' | 'dark'
    className?: string
}

/**
 * Navigation link with a smooth, GPU-accelerated underline that grows on hover
 * and stays present for the active page. Fully keyboard accessible.
 */
export function NavLink({ href, label, isActive = false, variant = 'dark', className }: NavLinkProps) {
    const isLight = variant === 'light'

    return (
        <a
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'group relative inline-block pb-1 outline-none transition-colors duration-200',
                'text-[10px] sm:text-xs md:text-sm',
                'uppercase tracking-[0.1em]',
                isLight
                    ? 'text-white/90 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                    : 'text-black/70 hover:text-black',
                className
            )}
        >
            {label}
            <span
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300 ease-out',
                    isLight ? 'bg-white/90' : 'bg-black/80',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'
                )}
            />
        </a>
    )
}
