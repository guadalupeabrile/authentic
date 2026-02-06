export interface ContactLink {
    id: string
    label: string
    href: string
    external?: boolean
}

export const contactLinks: ContactLink[] = [
    {
        id: 'phone',
        label: '(+61) 493 557 397',
        href: 'tel:+61493557397'
    },
    {
        id: 'email',
        label: 'wonder@authenticwebstudio.com',
        href: 'mailto:wonder@authenticwebstudio.com'
    },
    {
        id: 'instagram',
        label: 'Instagram',
        href: 'https://instagram.com/authenticwebstudio',
        external: true
    }
]


