REGALO SOPHIA — guía rápida

ESTRUCTURA
  index.html        -> estructura de la página (casi nunca se toca)
  css/style.css      -> diseño (casi nunca se toca)
  js/script.js        -> lógica del countdown, el lirio y la navegación (casi nunca se toca)
  js/data.js          -> AQUÍ se agrega contenido cada semana (poemas, diario, fotos, libro)
  assets/fotos/       -> aquí van las fotos como archivos normales (.jpg, .png)

CÓMO AGREGAR UNA FOTO
  1. Copia la foto dentro de assets/fotos/, por ejemplo: assets/fotos/playa.jpg
  2. En js/data.js, dentro de galleryPhotos, agrega una línea:
     { src: "assets/fotos/playa.jpg", caption: "Nuestra primera salida" },

CÓMO AGREGAR UN POEMA NUEVO
  En js/data.js, dentro de poems, copia el bloque del poema 1 y cambia semana, rango, título y texto.

CÓMO PROBAR MIENTRAS CONSTRUYES
  Abre index.html en el navegador y haz clic en el botoncito "vista previa" (abajo a la derecha).
  Antes de mandárselo a Sophia: bórralo del index.html (busca el div con id="devToggle" y el bloque
  final del script.js que lo controla).

CÓMO ENTREGARLO AL FINAL
  Sube toda esta carpeta a GitHub Pages o Netlify (gratis) y le mandas el link.
