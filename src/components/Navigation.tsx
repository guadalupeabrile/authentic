import { cn } from '../lib/cn'

interface NavigationProps {
    className?: string
    activeItem?: 'HOME' | 'WORK' | 'STUDIO'
}

const navItems: Array<'HOME' | 'WORK' | 'STUDIO'> = ['HOME', 'WORK', 'STUDIO']

export function Navigation({ className, activeItem = 'HOME' }: NavigationProps) {
    return (
        <nav className={cn('flex gap-6 md:gap-8 lg:gap-10 justify-center items-center mx-[10px]', className)}>
            {navItems.map((item) => (
                <a
                    key={item}
                    href="#"
                    className={cn(
                        'text-white/95 hover:text-white transition-colors duration-200',
                        'text-xs sm:text-sm md:text-sm lg:text-lg',
                        'font-light  uppercase',
                        'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]',
                        activeItem === item && 'underline underline-offset-4 decoration-white/90'
                    )}
                    onClick={(e) => e.preventDefault()}
                >
                    {item}
                </a>
            ))}
        </nav>
    )
}

