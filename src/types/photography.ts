import type { MasonrySection } from '../components/MasonryGrid'

export interface PhotographyCategory {
    id: string
    title: string
    description: string
    sections: MasonrySection[]
}

export interface PhotographyConfig {
    categories: PhotographyCategory[]
    // Imágenes que se mostrarán en la página About
    aboutImages?: string[]
    // Imagen destacada debajo del texto en About
    aboutBottomImage?: string
}

