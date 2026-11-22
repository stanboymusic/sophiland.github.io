/* ======================================================
   LÓGICA — no hace falta tocar este archivo cada semana.
   El contenido vive en data.js (y se sincroniza con Firestore).
   ====================================================== */
import { loadContent } from './firebase.js';

function pad(n){ return String(n).padStart(2,'0'); }

let currentGalleryPhotos = [];
let unlocking = false;

function updateCountdown(){
  const now = new Date();
  const diff = TARGET_DATE - now;
  if (diff <= 0){
    if (!unlocking){
      unlocking = true;
      // Si la página estaba abierta justo en el momento: se ve la flor abierta unos segundos
      const wasLive = (now - TARGET_DATE) < 15000;
      if (wasLive){
        paintLily(1);
        document.querySelector('#lock .eyebrow').textContent = 'Floreció';
        setTimeout(unlock, 6000);
      } else {
        unlock();
      }
    }
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = d;
  document.getElementById('cd-hours').textContent = pad(h);
  document.getElementById('cd-min').textContent = pad(m);
  document.getElementById('cd-sec').textContent = pad(s);

  // progreso del lirio (0 a 1): crece de forma continua desde START_DATE hasta TARGET_DATE
  const total = TARGET_DATE - START_DATE;
  const elapsed = now - START_DATE;
  const progress = Math.min(Math.max(elapsed / total, 0), 1);
  paintLily(progress);
}

// Cada pétalo se abre de forma gradual; el último termina de abrirse justo en progress = 1
function paintLily(progress){
  document.querySelectorAll('.petal').forEach((p, i) => {
    const t = Math.min(Math.max((progress - i * 0.15) / 0.4, 0), 1);
    const scale = 0.35 + 0.65 * t;
    const rot = (i - 2) * 6 * (1 - t);
    p.style.transform = `scale(${scale}) rotate(${rot}deg)`;
    p.style.opacity = 0.5 + (0.95 - i*0.02 - 0.5) * t;
  });
}

async function unlock(){
  document.getElementById('lock').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  // Nav: se inicializa aquí porque el app no existe en el DOM durante lock
  document.querySelectorAll('nav.mainnav button[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('nav.mainnav button[data-view]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('section.view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('view-' + btn.dataset.view).classList.add('active');
    });
  });

  // Mostrar spinner mientras carga
  document.getElementById('app').insertAdjacentHTML('afterbegin',
    '<div id="fb-loading" style="text-align:center;padding:2rem;opacity:.6;">Cargando...</div>');

  const content = await loadContent();
  const loadingEl = document.getElementById('fb-loading');
  if (loadingEl) loadingEl.remove();

  renderAll(content);
}

function renderAll({ galleryPhotos, poems, bookChapters } = {}){
  currentGalleryPhotos = galleryPhotos || [];
  const galEl = document.getElementById('gallery-grid');
  galEl.innerHTML = galleryPhotos.length ? galleryPhotos.map((p, i) => `
    <div class="photo-slot${p.src ? ' has-photo' : ''}" ${p.src ? `onclick="openLightbox(${i})"` : ''}>${p.src ? `<img src="${p.src}" alt="${p.caption||''}">` : (p.caption || 'foto pendiente')}</div>`).join('')
    : `<p class="empty">La galería se va a ir llenando con nosotros.</p>`;

  const poemEl = document.getElementById('poemario-list');
  poemEl.innerHTML = poems.map((p, i) => `
    <div class="poem-card" data-index="${i}">
      <button class="poem-header" aria-expanded="false">
        <span class="poem-week serif">Semana ${p.week} · ${p.range}</span>
        <span class="poem-header-title serif">${p.title}</span>
        <span class="poem-arrow">+</span>
      </button>
      <div class="poem-body">
        <div class="poem-text">${p.text}</div>
      </div>
    </div>`).join('');
  initPoemAccordion();

  const libroEl = document.getElementById('libro-list');
  libroEl.innerHTML = bookChapters.length ? bookChapters.map(c => `
    <div class="book-chapter">
      <div class="chnum">Capítulo ${c.num}</div>
      <h3>${c.title}</h3>
      ${c.paragraphs.map(par => `<p>${par}</p>`).join('')}
    </div>`).join('') : `<p class="empty">El libro se escribe despacio. Todavía está empezando.</p>`;
}

/* ---------- POEMARIO (acordeón por semana) ---------- */
function initPoemAccordion(){
  document.querySelectorAll('#poemario-list .poem-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.poem-card');
      const body = card.querySelector('.poem-body');
      const isOpen = card.classList.contains('open');

      if (isOpen){
        body.style.maxHeight = null;
        card.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------- LIGHTBOX (foto ampliada) ---------- */
function openLightbox(index){
  const p = currentGalleryPhotos[index];
  if (!p || !p.src) return;
  document.getElementById('lightbox-img').src = p.src;
  document.getElementById('lightbox-caption').textContent = p.caption || '';
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


updateCountdown();
setInterval(updateCountdown, 1000);
