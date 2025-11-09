# Guía para Ver Valores CSS en el Proyecto

## 1. En el Navegador (DevTools)

### Abrir DevTools:
- **Mac**: `Cmd + Option + I` o `F12`
- **Windows/Linux**: `F12` o `Ctrl + Shift + I`
- **Clic derecho** en cualquier elemento → "Inspeccionar elemento"

### Paneles útiles:
- **Elements/Inspector**: Ver el HTML y los estilos aplicados
- **Styles**: Ver todas las reglas CSS y sus valores
- **Computed**: Ver los valores finales calculados (muy útil)

### Ejemplo práctico:
1. Abre `http://localhost:5173` (tu app corriendo)
2. Haz clic derecho en el logo "NARCISO"
3. Selecciona "Inspeccionar"
4. En el panel Styles verás:
   - Las clases de Tailwind compiladas
   - Los valores exactos (ej: `font-size: 14rem`)

## 2. En el Código

### Archivos CSS personalizados:
📁 `src/index.css` - Estilos base y personalizados

### Clases Tailwind (ver valores en código):

#### En componentes:
- `src/components/Header.tsx` - Logo NARCISO
- `src/components/Navigation.tsx` - Menú de navegación
- `src/components/ImageSlider.tsx` - Slider de imágenes
- `src/components/Footer.tsx` - Footer
- `src/pages/HomePage.tsx` - Página principal

### Valores comunes usados en el proyecto:

```css
/* Logo */
text-[clamp(3.5rem,16vw,13rem)]  /* Tamaño responsivo del logo */
font-serif                        /* Fuente serif */
leading-[0.85]                    /* Interlineado */

/* Espaciado */
px-4 sm:px-6 md:px-8 lg:px-12    /* Padding horizontal responsivo */
py-12 md:py-16 lg:py-20          /* Padding vertical responsivo */

/* Colores */
text-black                        /* #000000 */
text-white                        /* #ffffff */
bg-white                          /* #ffffff */
text-white/95                     /* Blanco con 95% opacidad */

/* Efectos */
opacity-100                       /* Opacidad 100% */
transition-opacity duration-1000  /* Transición de opacidad */
drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]  /* Sombra personalizada */

/* Layout */
min-h-[100vh]                    /* Altura mínima de viewport */
w-full                            /* Ancho 100% */
h-full                            /* Altura 100% */
```

## 3. Ver Estilos Compilados de Tailwind

Cuando ejecutas `npm run dev`, Tailwind compila las clases y las puedes ver en DevTools.

### Para ver todos los valores de Tailwind:
- Abre DevTools → Network
- Busca el archivo CSS generado
- O simplemente inspecciona cualquier elemento

## 4. Extensiones Útiles (VS Code)

Si usas VS Code, estas extensiones ayudan:
- **Tailwind CSS IntelliSense**: Muestra valores al hacer hover
- **CSS Peek**: Ver definiciones de clases

## 5. Valores Específicos del Proyecto NARCISO

### Logo:
- **Tamaño**: `clamp(3.5rem, 16vw, 13rem)` (responsive)
- **Fuente**: `Georgia, 'Times New Roman', serif`
- **Color "NA"**: `#000000` (negro)
- **Color "RCISO"**: `#ffffff` (blanco)

### Galería:
- **Altura mínima**: `100vh` + `300px`
- **Transición**: `1000ms` (1 segundo)

### Footer:
- **Padding**: `py-12 md:py-16 lg:py-20`
- **Fade-in**: `opacity-0` → `opacity-100` con `translate-y`

## Tips Rápidos

1. **Siempre usa DevTools** para debugging visual
2. **Tailwind IntelliSense** muestra valores al escribir clases
3. **Computed tab** muestra valores finales (muy importante)
4. **Hover** sobre propiedades en DevTools para ver sus valores exactos

