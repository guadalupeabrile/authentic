export interface ContactLink {
    id: string
    label: string
    href: string
    external?: boolean
}

export const contactLinks: ContactLink[] = [
    {
        id: 'phone',
        label: '(+598) 99 705 004',
        href: 'tel:+59899705004'
    },
    {
        id: 'email',
        label: 'HOLA@NARCISOESTUDIO.COM',
        href: 'mailto:HOLA@NARCISOESTUDIO.COM'
    },
    {
        id: 'instagram',
        label: 'Instagram',
        href: 'https://instagram.com/narcisoestudio',
        external: true
    }
]


