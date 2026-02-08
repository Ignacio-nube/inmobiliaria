# Inmobiliaria

Aplicación de gestión inmobiliaria desarrollada con React, TypeScript y Vite.

## Tecnologías

- **React 19**
- **Vite 7**
- **Supabase** (Base de datos y autenticación)
- **Google Maps API** (Visualización de propiedades)
- **Tailwind CSS** (Estilos)
- **Zustand** (Gestión de estado)
- **React Router 7** (Enrutamiento)

## Configuración Local

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en `.env.example` y añade tus credenciales:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Despliegue en Vercel

Esta aplicación está preparada para ser desplegada en Vercel.

1. Sube el código a un repositorio de GitHub.
2. Conecta tu cuenta de GitHub en Vercel.
3. Importa el proyecto.
4. En la configuración del proyecto en Vercel, añade las siguientes Variables de Entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
5. Haz clic en **Deploy**.

Vercel detectará automáticamente la configuración de Vite y usará `npm run build` para generar la aplicación. El archivo `vercel.json` incluido asegura que las rutas de React Router funcionen correctamente.
