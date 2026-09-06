/* ======================================================
   CONFIGURACIÓN Y CONTENIDO — edita aquí a medida que avanza el proyecto.
   Este es el ÚNICO archivo que deberías tocar semana a semana.

   Los datos aquí son el FALLBACK local. Si Firestore tiene contenido,
   Firestore tiene prioridad. Para subir estos datos a Firestore por primera
   vez, abre la consola del navegador y ejecuta: seedFirestore()
   ====================================================== */

// Fecha de desbloqueo: 21 feb 2027, 12:00am hora Venezuela (UTC-4) = 04:00 UTC
const TARGET_DATE = new Date("2027-02-21T04:00:00Z");

// Fecha de inicio del proyecto (para calcular el progreso del lirio)
const START_DATE = new Date("2026-08-27T00:00:00Z");

// --- DIARIO: agrega una entrada por cada momento que quieras guardar ---
// (Estos datos se suben a Firestore con seedFirestore())
window._localDiary = [
  { date: "27 jul 2026", title: "¿donde está mi bolso???", text: "estabamos con athonela en el edificio B y yo me lleve tu bolso al 9C porque pensabamos que ibas tras nosotros AJJAJAJJAJAA" },
  { date: "10 ago 2026", title: "sabor a vida", text: "me regalaste un chocolate cuando salimos del acto de encuentros!!! ese dia me abrazaste mucho y se sintió muy bonito" },
  { date: "18 ago 2026", title: "para estudiar o una excusa para hablar?", text: "hicimos llamada para estudiar el parcial de teorias,pero terminamos hablando hasta las 12am de puras tonterias" },
  { date: "19 ago 2026", title: "el credor de los tenores", text: "ese miercoles te escribi que me habia ido horrible en el parcial de fonetica, desde entonces soy el creador de los tenores JJAJAJAJJAJAJAJ" },
  { date: "19 ago 2026", title: "robin hood y la definicion de rizos", text: "hicimos videollamada y me mostraste como te definias los rizos, despues vimos la pelicula de robin hood" },
  { date: "20 ago 2026", title: "Tenedor vibrador", text: "un tenedor que se conecta al tomacorriente, empieza a girar y me enchufo en el ASSSS JAJAJAKAKJAJAKAJ" },
  { date: "20 ago 2026", title: "besos en el alma y un cocosette", text: "dijiste que ibas solo por un nestea y volviste tambien con un cocosette para mi" },
  { date: "24 ago 2026", title: "mandarinas", text: "me dijjiste que odiabas las mandarinas" },
  { date: "27 ago 2026", title: "BELLAKEOOOOO", text: "en la mañana me enviaste un video escuchando reggaeton a full volumen y me compartiste tu playlist en spotify" },
  { date: "29 ago 2026", title: "PRIMERA CITA", text: "hay sonrisas que solo mueven los labios, y hay otras que mueven el aire completo de una habitación. ya tomé una decisión, y usted será mi mujer" },
  { date: "3 sep 2026", title: "salimos al metropolitano", text: "fue un dia muy hermoso, esa pancarta me encantó. " },
  { date: "3 sep 2026", title: "respiradero muy peculiar", text: "tu explicabas seriamente como respirar correctamente para trotar, y yo dije que respiraba por el ano JAJAJAJJKAKAJAKAKAAJ" },

  // { date: "27 ago 2026", title: "...", text: "..." },
];

// --- GALERÍA ---
// Pon las fotos como archivos normales dentro de assets/fotos/ (ej: assets/fotos/playa.jpg)
// y referencia solo el nombre del archivo aquí. Nunca pegues la foto en base64 aquí:
// eso es justo lo que vuelve pesada la página.
window._localGallery = [

  { src: "assets/fotos/s1.jpg", caption: "20-08-26 me mandaste esta foto una mañana sin yo pedirlo" },
  { src: "assets/fotos/s2.jpg", caption: "23-08-26la amooooo" },
  { src: "assets/fotos/s3.jpg", caption: "29-08-26, primera cita" },
  { src: "assets/fotos/s4.jpg", caption: "29-08-26, y la queso" },
  { src: "assets/fotos/s5.jpg", caption: "29-08-26, y la queso x2" },
  { src: "assets/fotos/s6.jpg", caption: "29-08-26, despues del musical <3" },
  { src: "assets/fotos/s7.jpg", caption: "03-09-26, comiendo en el mc donald" },
  // { src: "assets/fotos/playa.jpg", caption: "Nuestra primera salida" },
];

// --- POEMARIO: un poema por semana ---
window._localPoems = [
  {
    week: 1,
    range: "27 ago – 29 ago, 2026",
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
  {
    week: 2,
    range: "29 ago – 5 sep, 2026",
    title: "Semana cero",
    text: `Hay historias que no empiezan con un "había una vez",
empiezan con una pantalla en la oscuridad
donde dos mundos animados peleaban una guerra
mientras la guerra de verdad ocurría entre tu mano y la mía,
esa distancia mínima que de repente dejó de existir.

No fue un beso, fue una frontera cayéndose.
Y del otro lado ya no había territorios separados,
había un mapa nuevo que empezamos a dibujar
sin brújula, solo con la certeza rara
de saber hacia dónde íbamos aunque no lo dijéramos.

Te hablé de decisiones como quien firma algo,
y tú, en lugar de asustarte, me devolviste un espejo:
dijiste que tenía un alma bonita,
y yo pensé que las almas bonitas
no se demuestran con palabras grandes,
se demuestran cuando alguien vuelve.

Y volviste.
Volviste antes de tiempo, adelantando el calendario
como quien no puede esperar a que el reloj se ponga de acuerdo con las ganas.
No hubo mesas lujosas ni luces especiales,
hubo una mesa cualquiera y una comida sencilla
que terminó sabiendo a regalo,
porque el verdadero regalo eras tú decidiendo estar ahí
un día antes de que el año me cambiara de número.

Esta semana no fue una semana,
fue una siembra.
Y yo, que no sé mucho de plantar cosas,
aprendí rápido que hay raíces que agarran
desde el primer riego,
y que hay sonrisas que no se olvidan
aunque uno se pase la vida entera
tratando de dibujarlas de memoria.`
  },
];

// --- LIBRO: capítulos, los que quieras ---
window._localBook = [
  // { num: "I", title: "...", paragraphs: ["...", "..."] },
];
