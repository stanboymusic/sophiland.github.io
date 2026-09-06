/* ======================================================
   CONFIGURACIÓN Y CONTENIDO — edita aquí a medida que avanza el proyecto.
   Este es el ÚNICO archivo que deberías tocar semana a semana.
   ====================================================== */

// Fecha de desbloqueo: 21 feb 2027, 12:00am hora Venezuela (UTC-4) = 04:00 UTC
const TARGET_DATE = new Date("2027-02-21T04:00:00Z");

// Fecha de inicio del proyecto (para calcular el progreso del lirio)
const START_DATE = new Date("2026-08-27T00:00:00Z");

// --- DIARIO: agrega una entrada por cada momento que quieras guardar ---
const diaryEntries = [
  // { date: "27 ago 2026", title: "...", text: "..." },
];

// --- GALERÍA ---
// Pon las fotos como archivos normales dentro de assets/fotos/ (ej: assets/fotos/playa.jpg)
// y referencia solo el nombre del archivo aquí. Nunca pegues la foto en base64 aquí:
// eso es justo lo que vuelve pesada la página.
const galleryPhotos = [
  // { src: "assets/fotos/playa.jpg", caption: "Nuestra primera salida" },
];

// --- POEMARIO: un poema por semana ---
const poems = [
  {
    week: 1,
    range: "27 ago – 2 sept, 2026",
    title: "Antes del sábado",
    text: `Dicen que el sábado va a ser un día cualquiera,
pero yo ya le cambié el nombre en mi calendario.

Tú debates a los dioses griegos como si los conocieras de verdad,
y a mí me convences de todo, hasta de esperar.

Tienes el pelo hecho de rizos que no piden permiso para existir,
y una manera de mirar que corrige cualquier duda que yo traiga.

Me dijiste lirio, mi flor favorita, sin saber
que ahora cada vez que veo una, pienso que la inventaron pensando en ti.

No sé qué va a pasar el sábado.
Sé que quiero llegar, y quedarme.`
  },
];

// --- LIBRO: capítulos, los que quieras ---
const bookChapters = [
  // { num: "I", title: "...", paragraphs: ["...", "..."] },
];
