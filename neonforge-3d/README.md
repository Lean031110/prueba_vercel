# NEONFORGE 3D

Estudio 3D cinematográfico que funciona en el navegador. Importa modelos locales, ajusta materiales e iluminación, aplica efectos y graba una animación del visor.

## Funciones
- Visor 3D interactivo con órbita, zoom y encuadre automático.
- Importación local de GLB, GLTF, OBJ, MTL, STL, PLY, FBX, DAE, 3MF y 3DS; los archivos auxiliares de GLTF/OBJ deben seleccionarse junto con el modelo.
- Ajustes de color, rugosidad, metalicidad, iluminación, exposición y fondo.
- Efectos visuales, rotación automática, duración y relación de aspecto.
- Grabación del lienzo con MediaRecorder. WebM suele ser el formato disponible; MP4 solo se ofrece si el navegador lo admite.
- Vista previa de imagen de referencia para flujo futuro de imagen-a-3D.

## Ejecutar
Abre `index.html` en un navegador moderno con WebGL y conexión para cargar los módulos Three.js desde jsDelivr. Para una experiencia más fiable, sirve el archivo mediante cualquier hosting estático HTTPS.

## Privacidad y límites
Los modelos se procesan en el navegador y no se suben a un servidor. Los formatos grandes pueden consumir bastante memoria y el soporte de códecs depende del navegador. La conversión real de una imagen a geometría 3D mediante IA no está habilitada en esta versión: requiere integrar un proveedor externo mediante un backend seguro; no pongas claves secretas en el HTML.

## Publicación
El archivo puede desplegarse como sitio estático en Vercel, GitHub Pages u otro hosting estático.
