import { contactLinks } from '../data/contactInfo'
import { cn } from '../lib/cn'

interface FooterProps {
    className?: string
    darkText?: boolean
}

export function Footer({ className, darkText }: FooterProps) {
    return (
        <footer
            className={cn(
                'w-full relative mt-auto',
                className
            )}
            style={{ backgroundColor: 'transparent', background: 'transparent' }}
        >
            <div
                className={cn(
                    'relative w-full px-[10px] py-4 md:py-6',
                    darkText ? 'bg-white border-t border-black/10' : 'bg-transparent'
                )}
                style={darkText ? {} : {
                    backgroundColor: 'transparent',
                    background: 'transparent',
                    backgroundImage: 'none'
                }}
            >
                <div
                    className={cn(
                        'flex flex-col md:flex-row w-[95%] items-center justify-center md:justify-between gap-3 text-xs sm:text-sm md:text-base lg:text-lg md:gap-4 text-center mx-auto font-bold uppercase tracking-[0.15em]',
                        darkText ? 'text-black' : 'mix-blend-difference text-white'
                    )}
                >
                    {contactLinks.map((link) => (
                        <a
                            key={link.id}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className={cn(
                                "hover:opacity-70 transition-opacity tracking-wider",
                                link.id === 'email' ? 'lowercase' : '',
                                link.id === 'instagram' ? 'normal-case' : ''
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

