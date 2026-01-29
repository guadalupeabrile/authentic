# 🔍 Guía: Cómo Verificar Optimizaciones en DevTools

Esta guía te muestra paso a paso cómo verificar que las optimizaciones de imágenes están funcionando correctamente.

## 📋 Pasos para Verificar

### 1. Abrir DevTools

**Chrome/Edge/Brave:**
- Presiona `F12` o `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
- O clic derecho → "Inspeccionar"

**Firefox:**
- Presiona `F12` o `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)

**Safari:**
- Primero activa el menú de desarrollo: Preferencias → Avanzado → "Mostrar menú de desarrollo"
- Luego `Cmd+Option+I`

---

## ✅ Verificación 1: Formato WebP

### Paso 1: Abre la pestaña Network
1. En DevTools, ve a la pestaña **"Network"** (Red)
2. Si no ves las pestañas, haz clic en `>>` para expandir

### Paso 2: Filtra por imágenes
1. Haz clic en el filtro **"Img"** (o escribe `img` en el buscador de filtros)
2. Recarga la página con `Cmd+R` / `Ctrl+R` o el botón de recargar

### Paso 3: Verifica el formato
1. Busca imágenes en la lista (deberías ver las rutas como `/uploads/photography/...`)
2. Haz clic en una imagen para ver sus detalles
3. En la pestaña **"Headers"** o **"Preview"**, verifica:
   - **Content-Type**: Debe decir `image/webp` ✅
   - **URL**: Debe terminar en `.webp` ✅

**Ejemplo de lo que deberías ver:**
```
Name: image-1.webp
Type: webp
Size: 245 KB (vs 1.2 MB original)
Content-Type: image/webp
```

---

## ✅ Verificación 2: Lazy Loading

### Paso 1: Abre la pestaña Elements/Inspector
1. Ve a **"Elements"** (Chrome) o **"Inspector"** (Firefox)
2. Presiona `Cmd+F` / `Ctrl+F` para buscar

### Paso 2: Busca una imagen
1. Busca `loading="lazy"` en el código
2. Deberías ver que las imágenes fuera del viewport tienen `loading="lazy"`

### Paso 3: Verifica en Network
1. Vuelve a la pestaña **Network**
2. Recarga la página
3. **Inicialmente**: Solo deberías ver cargadas las primeras imágenes (las que están visibles)
4. **Haz scroll hacia abajo**: Deberías ver cómo se cargan más imágenes conforme haces scroll

**Indicador visual:**
- Las imágenes con `loading="lazy"` aparecen en Network solo cuando entran al viewport
- Las imágenes con `priority={true}` se cargan inmediatamente

---

## ✅ Verificación 3: FetchPriority

### Paso 1: Abre Elements/Inspector
1. Ve a **"Elements"** o **"Inspector"**
2. Busca una imagen prioritaria (como la primera del slider o hero)

### Paso 2: Inspecciona el elemento
1. Haz clic derecho en la imagen → "Inspeccionar"
2. En el código HTML, busca el atributo `fetchpriority`

**Deberías ver:**
```html
<img fetchpriority="high" ... />  <!-- Para imágenes prioritarias -->
<img fetchpriority="auto" ... />  <!-- Para imágenes normales -->
```

### Paso 3: Verifica en Network
1. En la pestaña **Network**, busca la columna **"Priority"**
2. Si no la ves, haz clic derecho en los encabezados de columna y marca **"Priority"**
3. Las imágenes prioritarias deberían mostrar **"High"** 🔴

---

## ✅ Verificación 4: Preload de Imágenes

### Paso 1: Abre Network
1. Ve a **Network**
2. Filtra por **"Other"** o busca `preload` en el filtro

### Paso 2: Verifica preloads
1. Recarga la página
2. Busca entradas con `rel="preload"` y `as="image"`
3. Deberías ver preloads para:
   - La siguiente imagen del slider (ImageSlider)
   - Las imágenes adyacentes en el lightbox (ImageLightbox)

**Ejemplo:**
```
Name: slider-2.webp
Type: Other
Initiator: preload
```

---

## ✅ Verificación 5: Tamaños y Rendimiento

### Paso 1: Abre Network
1. En **Network**, filtra por **"Img"**
2. Recarga la página

### Paso 2: Revisa las estadísticas
1. En la parte inferior de Network, verás un resumen:
   - **Total requests**: Número de imágenes cargadas
   - **Total size**: Tamaño total transferido
   - **Finish time**: Tiempo total de carga

### Paso 3: Compara tamaños
1. Haz clic en una imagen WebP
2. Compara el **Size** con el tamaño original (si lo conoces)
3. Deberías ver una reducción del 60-80%

**Ejemplo:**
```
Original: 1.2 MB (JPG)
WebP: 245 KB
Reducción: ~80% ✅
```

---

## ✅ Verificación 6: Lighthouse (Análisis Completo)

### Paso 1: Abre Lighthouse
1. En DevTools, ve a la pestaña **"Lighthouse"**
2. Marca las categorías que quieras analizar (recomiendo todas)
3. Selecciona **"Desktop"** o **"Mobile"**
4. Haz clic en **"Generate report"**

### Paso 2: Revisa las métricas
Busca estas métricas clave:

**Performance:**
- **LCP (Largest Contentful Paint)**: Debería ser < 2.5s ✅
- **CLS (Cumulative Layout Shift)**: Debería ser < 0.1 ✅
- **FCP (First Contentful Paint)**: Debería ser < 1.8s ✅

**Oportunidades:**
- Lighthouse puede sugerir optimizaciones adicionales
- Revisa la sección "Serve images in next-gen formats" - debería estar resuelta ✅

---

## ✅ Verificación 7: Verificar en Código Fuente

### Paso 1: Abre Elements
1. Ve a **Elements** / **Inspector**
2. Busca un componente que use `OptimizedImage`

### Paso 2: Verifica el HTML generado
Deberías ver algo como:

```html
<picture>
  <source srcset="/uploads/photography/image.webp" type="image/webp" sizes="...">
  <img 
    src="/uploads/photography/image.webp" 
    alt="..." 
    loading="lazy"
    decoding="async"
    fetchpriority="auto"
    sizes="(max-width: 768px) 100vw, 33vw"
  />
</picture>
```

---

## 🎯 Checklist Rápido

Marca cada verificación cuando la completes:

- [ ] Las imágenes se cargan como WebP (Content-Type: image/webp)
- [ ] Las imágenes fuera del viewport tienen `loading="lazy"`
- [ ] Las imágenes prioritarias tienen `fetchPriority="high"`
- [ ] Se ven preloads en Network para imágenes siguientes
- [ ] Los tamaños de archivo están reducidos (60-80% menos)
- [ ] Lighthouse muestra buenas métricas de Performance
- [ ] El HTML generado usa `<picture>` con `<source>` para WebP

---

## 🐛 Solución de Problemas

### Si no ves WebP:
1. Verifica que ejecutaste `npm run convert-to-webp`
2. Verifica que los archivos `.webp` existen en `public/uploads/`
3. Limpia la caché del navegador (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Si no ves lazy loading:
1. Verifica que las imágenes tienen `loading="lazy"` en el HTML
2. Asegúrate de que no todas las imágenes tienen `priority={true}`

### Si Lighthouse muestra problemas:
1. Revisa la sección "Opportunities" en Lighthouse
2. Verifica que las imágenes están optimizadas
3. Considera usar el script `generate-responsive` para múltiples tamaños

---

## 📊 Herramientas Adicionales

### Chrome DevTools Extensions:
- **Web Vitals**: Muestra métricas en tiempo real
- **Lighthouse CI**: Para análisis automatizado

### Online Tools:
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/

---

## 💡 Tips Pro

1. **Usa Network Throttling**: En Network, puedes simular conexiones lentas para ver cómo se comportan las imágenes
2. **Screenshot en Network**: Haz clic derecho en una imagen → "Capture screenshot" para ver cómo se ve mientras carga
3. **Waterfall View**: En Network, cambia a vista "Waterfall" para ver el orden y timing de carga
4. **Coverage Tab**: Ve a "Coverage" para ver qué recursos se están usando realmente

---

¡Con estas verificaciones podrás confirmar que todas las optimizaciones están funcionando correctamente! 🚀

