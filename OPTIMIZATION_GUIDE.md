# Guía de Optimización de Imágenes

Este documento describe las optimizaciones implementadas para mejorar la velocidad de carga de imágenes.

## 🚀 Optimizaciones Implementadas

### 1. Componente OptimizedImage Mejorado

El componente `OptimizedImage` ahora incluye:

- **Soporte WebP con fallback automático**: Detecta y usa WebP cuando está disponible, con fallback al formato original
- **FetchPriority API**: Prioriza imágenes críticas (above-the-fold) con `fetchpriority="high"`
- **Lazy loading inteligente**: Carga diferida por defecto, excepto para imágenes prioritarias
- **Placeholder con blur**: Muestra un placeholder mientras carga la imagen
- **Soporte para sizes**: Permite especificar tamaños responsivos

### 2. ImageSlider Optimizado

- Usa `OptimizedImage` en lugar de `<img>` directo
- Preload automático de la siguiente imagen en el slider
- Prioridad alta para la primera imagen
- Soporte WebP con fallback

### 3. ImageLightbox Optimizado

- Preload de imágenes adyacentes (anterior y siguiente)
- Usa `OptimizedImage` para mejor rendimiento
- Prioridad alta para la imagen actual

### 4. Scripts de Conversión y Optimización

#### Conversión a WebP

```bash
# Convertir imágenes a WebP (mantiene originales)
npm run convert-to-webp

# Convertir y eliminar originales
npm run convert-to-webp:delete

# Optimizar WebP existentes
npm run optimize-webp

# Convertir y optimizar existentes
npm run optimize-images
```

**Características del script:**
- Soporta JPG, JPEG y PNG
- Calidad adaptativa según tamaño de imagen
- Compresión optimizada con Sharp
- Muestra estadísticas de reducción de tamaño

#### Generación de Imágenes Responsivas

```bash
npm run generate-responsive
```

Genera múltiples tamaños de imágenes para usar con `srcset`:
- xs: 400px (mobile small)
- sm: 640px (mobile large)
- md: 768px (tablet)
- lg: 1024px (desktop small)
- xl: 1280px (desktop medium)
- 2xl: 1920px (desktop large)

## 📋 Mejores Prácticas

### 1. Uso del Componente OptimizedImage

```tsx
import { OptimizedImage } from '../components/OptimizedImage'

// Imagen prioritaria (above-the-fold)
<OptimizedImage
    src="/img/hero.jpg"
    alt="Hero image"
    priority
    fetchPriority="high"
    sizes="100vw"
/>

// Imagen con lazy loading (por defecto)
<OptimizedImage
    src="/uploads/photography/image.jpg"
    alt="Gallery image"
    sizes="(max-width: 768px) 100vw, 33vw"
/>
```

### 2. Formatos de Imagen

- **Usa WebP**: El script convierte automáticamente a WebP
- **Mantén originales**: Durante desarrollo, mantén los originales como backup
- **Optimiza antes de subir**: Comprime imágenes grandes antes de agregarlas al proyecto

### 3. Tamaños de Imagen

- **Hero/Slider**: Máximo 1920px de ancho
- **Galería**: 1200-1600px de ancho
- **Thumbnails**: 400-600px de ancho

### 4. Lazy Loading

- Las imágenes fuera del viewport se cargan automáticamente con lazy loading
- Las primeras 2-3 imágenes de cada sección deben tener `priority={true}`
- Usa `fetchPriority="high"` solo para imágenes críticas

## 🔧 Configuración de Calidad WebP

El script ajusta automáticamente la calidad según el tamaño de la imagen:

- **Imágenes grandes (>5MP)**: 82% de calidad
- **Imágenes medianas (2-5MP)**: 85% de calidad
- **Imágenes pequeñas (<2MP)**: 88% de calidad

Esto optimiza el balance entre calidad visual y tamaño de archivo.

## 📊 Resultados Esperados

Con estas optimizaciones deberías ver:

- **Reducción de tamaño**: 60-80% menos peso con WebP
- **Carga más rápida**: Lazy loading reduce el tiempo inicial de carga
- **Mejor Core Web Vitals**: 
  - LCP (Largest Contentful Paint) mejorado
  - CLS (Cumulative Layout Shift) reducido con placeholders
- **Mejor experiencia móvil**: Imágenes optimizadas para conexiones lentas

## 🚨 Notas Importantes

1. **Backup**: Siempre haz backup antes de usar `--delete-original`
2. **Testing**: Prueba en diferentes navegadores para verificar soporte WebP
3. **CDN**: Considera usar un CDN para servir imágenes estáticas
4. **Cache**: Configura headers de cache apropiados en tu servidor

## 🔍 Verificación

Para verificar que las optimizaciones funcionan:

1. Abre DevTools → Network
2. Filtra por "Img"
3. Verifica que las imágenes se cargan como WebP
4. Revisa los tiempos de carga
5. Usa Lighthouse para medir Core Web Vitals

## 📝 Próximos Pasos (Opcional)

- Implementar blur-up placeholders con imágenes de baja calidad
- Agregar soporte para AVIF (formato aún más eficiente que WebP)
- Implementar service worker para cache de imágenes
- Configurar CDN para servir imágenes estáticas

