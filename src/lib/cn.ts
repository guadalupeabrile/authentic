/**
 * Utility function to merge class names
 * Useful when working with conditional classes and Tailwind CSS
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ')
}

