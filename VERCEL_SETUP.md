# Configuración de Vercel Blob Storage

Este proyecto está configurado para usar **Vercel Blob Storage** para almacenar imágenes de forma persistente en producción.

## Configuración en Vercel

### 1. Crear un Blob Store en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a la pestaña **Storage**
3. Haz clic en **Create Database** o **Create Store**
4. Selecciona **Blob** como tipo de almacenamiento
5. Dale un nombre (ej: `photography-storage`)
6. Crea el store

### 2. Obtener el Token de Acceso

El token `BLOB_READ_WRITE_TOKEN` se crea automáticamente cuando creas el Blob Store. Para encontrarlo:

**Opción A: Desde el Dashboard del Proyecto**
1. Ve a tu proyecto en Vercel Dashboard
2. Ve a la pestaña **Settings** (no la del store, sino la del proyecto)
3. En el menú lateral, busca **Environment Variables** o **Variables de Entorno**
4. Busca la variable `BLOB_READ_WRITE_TOKEN` - este es el token que necesitas
5. Haz clic en el ícono de "mostrar" para ver el valor y cópialo

**Opción B: Desde la línea de comandos (más fácil)**
1. Instala Vercel CLI si no lo tienes: `npm i -g vercel`
2. En tu proyecto, ejecuta: `vercel env pull`
3. Esto creará/actualizará un archivo `.env.local` con todas las variables de entorno, incluyendo `BLOB_READ_WRITE_TOKEN`

**Nota:** Si no ves la variable `BLOB_READ_WRITE_TOKEN` en las variables de entorno, es posible que necesites:
- Asegurarte de que el Blob Store está vinculado a tu proyecto
- Verificar que estás en el proyecto correcto
- En algunos casos, Vercel puede requerir que agregues manualmente la variable con el token del store

### 3. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a **Settings** → **Environment Variables**
3. Agrega las siguientes variables (haz clic en "Add New" para cada una):

   **a) BLOB_READ_WRITE_TOKEN** (ya lo tienes)
   - Key: `BLOB_READ_WRITE_TOKEN`
   - Value: `vercel_blob_rw_LqDxA0ZV947OBGib_ydxgtK503cqhsD3VIv8r23QZXgis5Q`
   - Environment: Selecciona **Production**, **Preview**, y **Development** (o al menos Production)

   **b) ADMIN_USERNAME**
   - Key: `ADMIN_USERNAME`
   - Value: El nombre de usuario que quieras usar para el admin (ej: `admin`)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **c) ADMIN_PASSWORD_HASH**
   - Key: `ADMIN_PASSWORD_HASH`
   - Value: El hash bcrypt de tu contraseña (ver paso 4 para generarlo)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **d) JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Una cadena aleatoria segura (puedes generar una con: `openssl rand -base64 32`)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

### 4. Generar Hash de Contraseña

Para generar el hash de tu contraseña, puedes usar Node.js:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('tu_contraseña', 10).then(hash => console.log(hash))"
```

O usar un script online de bcrypt.

## Funcionamiento

- **En desarrollo local**: Las imágenes se guardan en `public/uploads/photography/`
- **En Vercel con Blob Storage**: Las imágenes se suben a Vercel Blob Storage y se devuelve una URL pública
- **En Vercel sin Blob Storage**: Las imágenes se guardan temporalmente en `/tmp` (se pierden en cada deployment)

## Notas Importantes

- Las imágenes subidas a Vercel Blob Storage son **públicas** y accesibles mediante URL
- Las URLs de las imágenes se guardan en la configuración JSON
- El almacenamiento en Vercel Blob tiene límites según tu plan de Vercel
- Para proyectos grandes, considera usar un servicio de almacenamiento externo (AWS S3, Cloudinary, etc.)

