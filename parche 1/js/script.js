/* ======================================================
   LÓGICA — no hace falta tocar este archivo cada semana.
   El contenido vive en data.js.
   ====================================================== */

function pad(n){ return String(n).padStart(2,'0'); }

function updateCountdown(){
  const now = new Date();
  const diff = TARGET_DATE - now;
  if (diff <= 0){
    unlock();
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

  // progreso del lirio (0 a 1) según tiempo transcurrido desde START_DATE
  const total = TARGET_DATE - START_DATE;
  const elapsed = now - START_DATE;
  const progress = Math.min(Math.max(elapsed / total, 0), 1);
  document.querySelectorAll('.petal').forEach((p, i) => {
    const threshold = i / 5;
    const open = progress > threshold;
    const scale = open ? 1 : 0.35;
    const rot = (i - 2) * (open ? 0 : 6);
    p.style.transform = `scale(${scale}) rotate(${rot}deg)`;
    p.style.opacity = open ? (0.95 - i*0.02) : 0.5;
  });
}

function unlock(){
  document.getElementById('lock').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  renderAll();
}

function renderAll(){
  const diarioEl = document.getElementById('diario-list');
  diarioEl.innerHTML = diaryEntries.length ? diaryEntries.map(e => `
    <div class="diary-entry">
      <div class="diary-date">${e.date}</div>
      <h3>${e.title}</h3>
      <p>${e.text}</p>
    </div>`).join('') : `<p class="empty">Aquí van a ir apareciendo los momentos, uno por uno.</p>`;

  const galEl = document.getElementById('gallery-grid');
  galEl.innerHTML = galleryPhotos.length ? galleryPhotos.map((p, i) => `
    <div class="photo-slot${p.src ? ' has-photo' : ''}" ${p.src ? `onclick="openLightbox(${i})"` : ''}>${p.src ? `<img src="${p.src}" alt="${p.caption||''}">` : (p.caption || 'foto pendiente')}</div>`).join('')
    : `<p class="empty">La galería se va a ir llenando con nosotros.</p>`;

  const poemEl = document.getElementById('poemario-list');
  poemEl.innerHTML = poems.map(p => `
    <div class="poem-card">
      <div class="poem-week serif">Semana ${p.week} · ${p.range}</div>
      <h3>${p.title}</h3>
      <div class="poem-text">${p.text}</div>
    </div>`).join('');

  const libroEl = document.getElementById('libro-list');
  libroEl.innerHTML = bookChapters.length ? bookChapters.map(c => `
    <div class="book-chapter">
      <div class="chnum">Capítulo ${c.num}</div>
      <h3>${c.title}</h3>
      ${c.paragraphs.map(par => `<p>${par}</p>`).join('')}
    </div>`).join('') : `<p class="empty">El libro se escribe despacio. Todavía está empezando.</p>`;
}

/* ---------- LIGHTBOX (foto ampliada) ---------- */
function openLightbox(index){
  const p = galleryPhotos[index];
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
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

document.querySelectorAll('nav.mainnav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav.mainnav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('section.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('view-' + btn.dataset.view).classList.add('active');
  });
});

// Botón de vista previa SOLO para revisar mientras se construye. Bórralo del index.html antes de mandarlo.
let previewOn = false;
document.getElementById('devToggle').addEventListener('click', () => {
  previewOn = !previewOn;
  if (previewOn){ unlock(); } else { location.reload(); }
});

updateCountdown();
setInterval(updateCountdown, 1000);
