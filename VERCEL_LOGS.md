# Cómo ver los logs en Vercel

## Método 1: Desde el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Selecciona tu proyecto **authentic**
3. En la barra superior, haz clic en **"Deployments"**
4. Haz clic en el **deployment más reciente** (el último)
5. En la parte superior del deployment, verás varias pestañas:
   - **"Overview"** - Vista general
   - **"Build Logs"** - Logs del build
   - **"Function Logs"** o **"Runtime Logs"** - **ESTOS SON LOS QUE NECESITAS** ⭐
6. Haz clic en **"Function Logs"** o **"Runtime Logs"**
7. Verás una lista de funciones. Busca `api/[...path]` o `api/photography`
8. Haz clic en la función para ver sus logs
9. **Recarga la página `/photography`** en tu sitio para generar nuevos logs

## Método 2: Desde el proyecto directamente

1. Ve a tu proyecto en Vercel Dashboard
2. En el menú lateral izquierdo, busca **"Logs"** o **"Functions"**
3. Haz clic ahí
4. Verás todos los logs en tiempo real

## Qué buscar en los logs

Cuando recargues `/photography`, deberías ver mensajes como:

```
=== API Handler Called ===
Method: GET
URL: /api/photography
Path string: photography
Full path: /api/photography
Calling serverless handler...
=== /api/photography endpoint called ===
CONFIG_PATH: /var/task/server/storage/photography.json
ROOT_DIR: /var/task
IS_VERCEL: true
Config read successfully
Categories count: 3
Returning config with 3 categories
```

Si hay un error, verás:

```
=== ERROR in API handler ===
Error type: ...
Error message: ...
Error stack: ...
```

## Si no ves logs

1. Asegúrate de que el deployment más reciente esté activo
2. Recarga la página `/photography` después de abrir los logs
3. Espera unos segundos - los logs pueden tardar en aparecer
4. Verifica que estás viendo "Runtime Logs" o "Function Logs", no "Build Logs"

## Alternativa: Ver logs en tiempo real con Vercel CLI

Si tienes Vercel CLI instalado:

```bash
npm i -g vercel
vercel login
vercel logs --follow
```

Esto mostrará los logs en tiempo real en tu terminal.

