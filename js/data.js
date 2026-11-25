/* ======================================================
   CONFIGURACIÓN Y CONTENIDO — edita aquí a medida que avanza el proyecto.
   Este es el ÚNICO archivo que deberías tocar semana a semana.

   Los datos aquí son el FALLBACK local. Si Firestore tiene contenido,
   Firestore tiene prioridad. Para subir estos datos a Firestore por primera
   vez, abre la consola del navegador y ejecuta: seedFirestore()
   ====================================================== */

// Fecha de desbloqueo: 21 feb 2027, 12:00am hora Venezuela (UTC-4) = 04:00 UTC
const TARGET_DATE = new Date("2027-02-21T04:00:00Z");

// Fecha de inicio del crecimiento del lirio: 22 nov 2026, 12:00am hora Venezuela (UTC-4) = 04:00 UTC
// El lirio crece de forma continua entre START_DATE y TARGET_DATE y florece del todo en TARGET_DATE.
const START_DATE = new Date("2026-11-22T04:00:00Z");

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
  { date: "8 sep 2026", title: "¿Que ves en mis ojos?", text: "Veo el reflejo de todo lo que me haces sentir... veo esos ojos que debaten como si fueran dioses griegos y que aun así, cuando me miran a mí, se suavizan. Ahí veo mi lugar favorito." },
  { date: "10 sep 2026", title: "un invitado especial", text: "me invitaste a conocer una parte muy importante de tu vida, tu ministerio" },
  { date: "10 sep 2026", title: "1 hora y media en el terminal", text: "me miraste con una cara de amor al bajar del bus.... JAJAJAJAJAJ" },
  { date: "14 sep 2026", title: "una salida para sentirte mejor", text: "hablaste hasta por los hp codos ese dia JAJAJAAJAJAJJJ. yo no pude soportar escucharte asustada y llorando el dia anterior por culpa del idiota ese." },
  { date: "14 sep 2026", title: "pan de guayaba", text: "fuimos a comer pan de guayaba porque dijiste que te gustaba" },
  { date: "14 sep 2026", title: "un perro muy extraño", text: "al final de la tarde un perro quiso montarte JAJAJJAJJAJAJAJJ fue demasiado gracioso" },
  { date: "14 sep 2026", title: "accidente en vivo", text: "un motociclista se cayo de su moto mientras estabamos en  la plaza" },
  { date: "18 sep 2026", title: "chichis", text: "me encantan tus tetas." },
  { date: "19 sep 2026", title: "mis dos amigas", text: "me encantan tus tetas x2" },
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
  { src: "assets/fotos/s8.jpg", caption: "10-09-26, me invitaste al culto conntigo <3 " },
  { src: "assets/fotos/s9.jpg", caption: "PERO QUE VEN MIS OJOSSSSSSSS, MUACKKKK <3" },
  { src: "assets/fotos/s10.jpg", caption: "20-09-26, me encantas toditaaaaa" },
  { src: "assets/fotos/s11.jpg", caption: " muackk" },
  { src: "assets/fotos/s12.jpg", caption: "2-10-26, mi mujer feliz por cumplir un sueño de sophi pequeña" },
  { src: "assets/fotos/s13.jpg", caption: "04-10-26, antes de ser consumida por el señor de la nocheee " },
  { src: "assets/fotos/s14.jpg", caption: "04-10-26, wazaaaaaaa " },
  { src: "assets/fotos/s15.jpg", caption: "02-10-26, mi niña llorando en el concierto de los biti" },
  { src: "assets/fotos/s16.jpg", caption: "05-10-26, jaskajs nuestros hijos seran preciososssss" },
  { src: "assets/fotos/s17.jpg", caption: "02-10-26, una foto que me encanto mushop" },
  { src: "assets/fotos/s18.jpg", caption: "02-10-26,ella probando unos chocolatesss " },
  { src: "assets/fotos/s19.jpg", caption: "02-10-26, no necesita descripcion " },
  { src: "assets/fotos/s20.jpg", caption: "02-10-26, no necesita descripcion x2 " },

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
  {
    week: 3,
    range: "6 sep – 13 sep, 2026",
    title: "OJOS TUYOS, ADICCION MIA",
    text: `Me preguntaste qué veía en tus ojos
y yo vi dos ventanas abiertas en plena tormenta,
un alma que decidió no cerrar las cortinas
aunque afuera lloviera fuerte.

Te dije que ahí quería quedarme
y tú me respondiste con un incendio disfrazado de voz,
un "te detesto" que en realidad era una hoguera
queriendo abrazarme sin quemarme del todo.

Me llevaste a tu templo,
al único lugar donde tu alma reza sin miedo,
y yo llegué tarde, como llega la lluvia
que promete y se toma su tiempo en caer.

Me esperaste como se espera un milagro:
sin saber si va a llegar, pero sin moverse del sitio,
y cuando bajaste de ese bus
tu cara era mar en calma después de la tormenta.

Me abrazaste y el mundo se quedó quieto,
te volviste sueño, te volviste orilla,
el lugar donde un barco cansado
por fin suelta el ancla.

Dijiste que hay un remolino en tu cabeza.
Yo te dije que no vine a calmar tormentas,
vine a nadar dentro de ellas contigo,
a hacerte compañía en cada vuelta.

Me confesaste que me viste una vez
y algo en ti empezó a caminar hacia mí,
despacio, como quien se acerca a una vela encendida
sin querer apagarla con la prisa.

Ahora persigo contigo los mismos misterios,
evito enseñarte el miedo porque sé que en ti se vuelve lágrima,
y entiendo que estoy construyendo, sin darme cuenta,
un refugio con tu nombre en la entrada.`
  },
  {
    week: 4,
    range: "13 sep – 20 sep, 2026",
    title: "GRAVEDAD",
    text: `Hay astros que no se buscan, se descubren
por la forma en que doblan la luz de los demás.
Tú llegaste así, sin ruido,
y todo lo que yo era empezó a inclinarse hacia ti.

Abriste tu universo como quien abre una ventana
después de un invierno demasiado largo,
soltaste el humo de las noches viejas,
y yo fui el cielo que te recibió sin preguntar por qué.

Me regalaste el mapa de tus primeras estrellas,
esa luz pequeña que todavía viaja desde ti,
y me enseñaste que la noche tiene gramática
y que cada silencio es una nota esperando su turno.

Dos hemisferios distintos se descubrieron
girando hacia el mismo centro:
lo que en ti era océano en mí era costa,
y la marea aprendió el nombre de los dos.

La semana se fue, pero tu gravedad se quedó.
Sigo cayendo, feliz, hacia tu órbita,
sabiendo que hay puertas nuevas en el horizonte
y que las estás tocando con la punta de los dedos.

Si el amor es un eclipse, que sea largo,
que el día aprenda a llamarse noche contigo,
y que tú seas la única ley
que obedezco con gusto hasta el final de mi caída.`
  },
  {
    week: 5,
    range: "20 sep – 27 sep, 2026",
    title: "Crepúsculo de otoño",
    text: `Dicen que los ojos son ventanas,
y tú dejaste la tuya abierta de par en par,
me dejaste entrar sin tocar,
y luego la cerraste por dentro
y me pusiste la llave en la mano.

Hay un sueño que no me cuentas.
Lo guardas como se guarda una brasa en la palma:
te sonrojas hacia adentro, donde el color no se ve,
y yo, que aprendí a leer el calor de lo que callas,
no pregunto, pero lo escucho arder.

Tú, que tienes por costumbre rendirte al dulce,
confiesas que hubo uno que llegó sin pedir permiso
y se sentó, en tiempo récord, primero en tu lista.
Que se avergüence el azúcar.

Mientras el otoño se sienta al piano
y el crepúsculo le tiembla en las teclas,
la fiebre me dibuja un mapa de cuchillos,
y yo te pienso,
y el mapa se vuelve río,
y el río me lleva a ti.

Después la madrugada:
dos faros en cuartos distintos
leyéndose la misma luz,
riendo solos, como locos bendecidos.

Y el jueves tomaste una canción
y no me la dedicaste.
Hiciste algo peor, algo mejor:
la volviste yo.`
  },
  {
    week: 6,
    range: "27 sep – 4 oct, 2026",
    title: "Hilo rojo",
    text: `Anoche el sueño me llevó a una casa
con montañas por paredes
y un horizonte que no pedía permiso.
Había un perro de oro a mis pies,
un oso suave de Berna recién llegado a tu regazo,
y tú, de pronto, sin aviso,
volteaste el rostro y dijiste te amo
como quien deja caer una moneda en un pozo
para ver cuánto tarda el eco en volver.

Todavía me duele despertar.
Hay amaneceres que son una puerta cerrada
con la casa entera adentro.

Tú, por tu parte, me bailabas descalza
en un salón sin techo,
con los pies escribiendo en el suelo
lo que tu boca no se atreve a firmar.

Y de madrugada, tarde ya para el sueño,
me hablaste de un hilo que nace en el meñique
porque el meñique conoce el camino al corazón,
un hilo rojo que se estira, se enreda, se tensa,
pero no se rompe.

Dices que estás en el medio,
ese tramo del puente donde ya no se ve la orilla de atrás
y todavía se imagina la de adelante.
Yo no tengo prisa:
a los puentes hay que cruzarlos despacio
cuando del otro lado espera alguien que lleva tu nombre
y una sonrisa guardada para ti`
  },
  {
    week: 7,
    range: "4 oct – 11 oct, 2026",
    title: "El baile que ya existe",
    text: `Te confieso que no traigo manual.
Traigo un corazón que aprende a gatas,
que a veces duda, a veces tropieza,
que no sabe si dijo la palabra correcta
pero sabe, con una certeza que asusta,
hacia dónde se inclinan todas sus brújulas.

Y tú me dijiste, con esa voz de puerto tranquilo:
yo sostendré tu mano mientras aprendes.
Y entendí que amar no es saber el camino,
es tener a alguien que camine con los ojos abiertos
mientras tú cierras los tuyos para sentir.

Hay un baile que se repite en tu cabeza,
un bucle de violines
donde mis manos ya conocen tu cintura
y tus pasos marcan fuerte el suelo,
como quien firma una promesa con los talones.

Quién sabe si es un ensayo.
Quién sabe si es la memoria de algo que aún no pasó.
Quizás ese baile es el día en que celebremos
una vida entera construida a punta de paciencia,
y el salón sea una cocina,
y los violines sean tu risa,
y el mundo, por una vez,
nos deje bailar sin prisa.

Esta semana todavía respira.
Aún le quedan días para escribirse.
Pero ya sabe cómo termina:
conmigo aprendiendo a amarte
y tú, de la mano, sin soltarme`
  },
  {
    week: 8,
    range: "11 oct – 18 oct, 2026",
    title: "Dueños del tiempo",
    text: `Nací con las manos hechas para cortar.
Todo lo que quise tocar se me deshizo
y aprendí a querer de lejos,
como se quiere una estrella.

Entonces hubo un lunes, un carnet caído,
una mano que lo devolvió.
Un brazo agarrado a la salida de un teatro
por alguien que me llamaba sin decirlo.
Un archivero donde me senté a escucharte
exponer una lección que no oí:
oí tus lentes, que no sabía que existían,
y supe, sin que el reloj se enterara,
que eras mía.

Llegaste a mi laboratorio de sombras
y lo roto empezó a unirse solo.
Dos soledades dejaron de serlo.
Eso, dicen, es la química.

A tu lado el tiempo se dobla:
una hora me dura un año,
un año sin ti, apenas un segundo.
Y un segundo, me dijeron, se mide
siguiendo un átomo dentro de un campo,
y basta otro campo cualquiera para desviarlo.
Yo soy el átomo.
Tú, el único campo que quiero que me tuerza.

En el sueño me tomaste la mano.
Sentiste el anillo,
respiraste hondo, abriste los ojos.
Vivimos mil cosas antes de ese instante.
No me preguntes cuándo:
el sueño no usa calendario.

Sobre la mesa gira un trompo.
Ya no pregunto si cae.
Que bailemos cien años y valga la pena.
Y cuando el pulso de los dos llegue a cero,
el tiempo seguirá su curso
porque ya no tendrá dueño.`
  },
  {
    week: 9,
    range: "18 oct – 25 oct, 2026",
    title: "Ronda de cachalotes",
    text: `Esta semana me abriste cuartos de la casa
que no le enseñas a nadie.
No pregunté qué había dentro.
Me quedé en la puerta, de pie,
como quien cuida algo que respira.

Me contaste de tus muñecas compartidas
y de los días en que jugabas sola.
Yo te conté de los juguetes que me llevaba a la cama
para inventar historias hasta quedarme dormido.
Dos niños hablando desde adultos,
cada uno con su cuarto de juegos a oscuras.

Hay un animal enorme y torpe en el mar
al que le toca defender a los pequeños.
Cuando llega la orca, se juntan en círculo,
las crías al centro, las colas hacia afuera.
Cada aleteo es una pared.
Nada entra.

No sé muchas cosas.
Sé de esa formación.

Querer es necesitar,
y no me da pena decirlo.
Te necesito como el agua al que se ahoga
y te quiero como el que nada,
y es lo mismo.
Te re contra amo.
Pasa lo que pase,
yo hago la ronda.`
  },
  {
    week: 10,
    range: "25 oct – 1 nov, 2026",
    title: "Sin cupo",
    text: `Se cayó el sistema el día de la oferta.
Todas las materias dijeron sin cupo,
un río se desbordó,
las paredes cedieron
y a mí me dio por pensar en ti.

Porque en todo lo que existe hay lista de espera
menos en tu risa, donde siempre sobra un asiento.
Porque el mundo se inscribe tarde y a empujones
y tú me reservaste el puesto
sin que yo lo pidiera.

Dicen que la gente cae por no saber hablar.
Yo caí por oírte.

No te voy a dejar hundir.
Tú no me vas a dejar hundir.
Que se caigan las páginas,
que suba el índice, que el cielo diga lo que quiera.
Llegaré antes de las siete a guardarte el lugar.

Y el poema de los dueños del tiempo
no ha vuelto a salir de mi cabeza.
Cuando no sé qué escribir, pienso en ti
y la hoja se llena sola.
Será que dejé de buscar
y empecé a mirarte.`
  },
  {
    week: 11,
    range: "1 nov – 8 nov, 2026",
    title: "Manicomio de dos",
    text: `Tú, en la fiesta, con tu vaso de agua,
y todos tratando de ponerte un trago en la mano.
Qué manera tan tuya de ser la única sobria
en un salón que giraba.

Yo, en la mía, me emborraché sin querer,
de pensarte.

Aquí no hay cerveza que se compare.
Si vienes, te enseño a tomar despacio,
con refresco, a sorbitos.
Y de lo que no te enseño nada
es de cómo se me caen las palabras
cuando me miras.

Casi no hace falta decirlo:
vemos las mismas materias,
nos sentamos en las mismas horas.
El horario también conspira.

Si quieres, entramos juntos a un manicomio.
Yo ya traigo el diagnóstico:
loco por ti, sin remedio.
Dos locos de amor en un cuarto sin ventanas,
y la puerta cerrada por dentro,
y la llave, que la tengas tú.

Que me enferme de ti, si toca.
Te daría el beso más largo.
No hay fiebre que me quite
el apetito de tus labios.`
  },
  {
    week: 12,
    range: "8 nov – 15 nov, 2026",
    title: "Escala de do mayor",
    text: `Aprendí a subir una escala con las dos manos.
Solo en do mayor, solo hasta ahí,
las teclas blancas, el camino sin sombras.
Todavía no sé qué es un sostenido.
Pero sé que hay un lugar donde empieza todo
y que se llama tu nombre.

Un dictado melódico me salió perfecto.
El oído, dicen, se afina escuchando.
El mío lleva meses escuchando una sola voz.

Tú, mientras tanto, te agarras el collar
cada vez que te quedas quieta.
Tus manos buscan algo que sostener.
Y yo en mitad del pasillo, pensando:
que me use a mí, que soy más fácil de agarrar.

Ensayas hasta el cansancio,
pasos, entradas, la obra, los demás.
Y cuando por fin sales, alguien te compra un chocolate
y respiras.
Qué bueno que existan manos
que sepan cuidarte el aliento.

Y si algún día me quedo media hora
pegado a tus labios,
no cuentes el tiempo:
no es una pausa en el compás,
es la nota más larga de la pieza.

Que digan lo que digan.
Tú sabes quién soy.
Yo sé quién eres.
Y esa es la única música
que necesito aprender de memoria.`
  },
  {
    week: 13,
    range: "15 nov – 22 nov, 2026",
    title: "Pentagrama en blanco",
    text: `Me regalaste un cuaderno
con cinco líneas dibujadas en cada página.
Cinco hilos tendidos,
cinco ramas donde las notas
se posan como pájaros.

Dentro iba una carpeta.
Dijiste que era para empezar.
Yo pensé: qué manera de decirme
que puedo escribir mi vida con tu tinta.

Todo está en blanco todavía.
Un pentagrama sin canción
es un cielo con los pájaros por llegar.
Sé que algún día vendrán.
Sé también quién los llamará.

Tú dices que sigo teniendo la misma emoción de verte.
Es cierto.
Me ha llevado semanas aprender
que no se gasta.
Que cada vez que apareces
mi corazón vuelve al primer compás.

Esta semana no desayunaste más que una manzana
y yo quise arrodillarme y darte el mundo.
Lo único que pude fue observarte.
Es lo que hago mejor.

Y mientras el país se detiene,
el pasaje y el último bus a las siete,
me quedo con la lista de lo importante:
el cuaderno,
la carpeta,
tú.`
  },
];

// --- LIBRO: capítulos, los que quieras ---
window._localBook = [
  // { num: "I", title: "...", paragraphs: ["...", "..."] },
];