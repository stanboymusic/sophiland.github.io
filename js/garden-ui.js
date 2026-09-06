/* ======================================================
   GARDEN-UI.JS — Todo el DOM del jardín de lirios.
   Renderizado, modales, eventos. Sin lógica de Firestore.
   ====================================================== */

import {
  getOrCreateGardenDoc,
  createGarden,
  getLocalRole, getLocalName, setLocalRole,
  canWaterToday, waterGarden,
  canPostToday, postMessage, getMessages,
} from "./garden.js";

// ── Referencias al DOM ──────────────────────────────────
const modal      = () => document.getElementById("garden-modal");
const modalInner = () => document.getElementById("garden-modal-inner");

// ── Punto de entrada: botón "Entrar al jardín" ───────────
export function initGardenButton() {
  const btn = document.getElementById("garden-btn");
  if (!btn) return;
  btn.addEventListener("click", openGarden);
}

async function openGarden() {
  modal().classList.add("active");
  modalInner().innerHTML = `<div class="gdn-loading">
    <div class="gdn-spinner"></div>
    <p>Entrando al jardín…</p>
  </div>`;

  try {
    const gardenDoc = await getOrCreateGardenDoc();
    const role      = getLocalRole();

    if (!gardenDoc) {
      // Primer acceso global: nadie ha creado el jardín todavía
      renderOnboarding(null);
    } else if (!role) {
      // El jardín existe pero este dispositivo no ha elegido rol
      renderOnboarding(gardenDoc);
    } else {
      // Todo configurado → mostrar el jardín
      renderGardenView(gardenDoc, role, getLocalName());
    }
  } catch (err) {
    console.error("Error abriendo jardín:", err);
    modalInner().innerHTML = `<p class="gdn-error">No se pudo conectar con el jardín. Intenta de nuevo.</p>`;
  }
}

// ── Cerrar modal ─────────────────────────────────────────
function closeGarden() {
  modal().classList.remove("active");
}

// ── ONBOARDING ───────────────────────────────────────────
function renderOnboarding(gardenDoc) {
  const gardenExists = !!gardenDoc;
  const sophiaName   = gardenDoc?.sophiaName || "";

  modalInner().innerHTML = `
    <button class="gdn-close" id="gdn-close-btn" aria-label="Cerrar">&times;</button>

    <div class="gdn-onboard">
      <div class="gdn-lily-small">${lilySmallSVG(0)}</div>
      <p class="eyebrow">Bienvenido/a al jardín</p>
      <h2 class="gdn-title serif">${gardenExists ? gardenDoc.gardenName : "Un jardín para dos"}</h2>
      <p class="gdn-sub">Antes de entrar, dinos quién eres.</p>

      <div class="gdn-role-btns">
        <button class="gdn-role-btn" id="gdn-role-sophia">
          <span class="gdn-role-icon">🌸</span>
          <span class="gdn-role-label">Soy <em>${sophiaName || "la dueña del jardín"}</em></span>
          <span class="gdn-role-hint">Quiero entrar a regar</span>
        </button>
        <button class="gdn-role-btn" id="gdn-role-azuquita">
          <span class="gdn-role-icon">👀</span>
          <span class="gdn-role-label">Soy <em>Azuquita</em></span>
          <span class="gdn-role-hint">Solo quiero mirar</span>
        </button>
      </div>

      ${!gardenExists ? `
        <div class="gdn-garden-name-wrap" id="gdn-garden-name-section" style="display:none">
          <label class="gdn-label" for="gdn-garden-name">Nombre del jardín</label>
          <input class="gdn-input" id="gdn-garden-name" type="text"
            placeholder="Ej: El jardín de los lirios" maxlength="50">
        </div>
      ` : ""}

      <div id="gdn-sophia-name-wrap" class="gdn-sophia-name-wrap" style="display:none">
        <label class="gdn-label" for="gdn-sophia-name">¿Cómo quieres que te llamen en el jardín?</label>
        <input class="gdn-input" id="gdn-sophia-name" type="text"
          placeholder="Tu nombre de jugadora…" maxlength="30">
      </div>

      <div id="gdn-azuquita-msg" style="display:none; color:rgba(246,241,231,0.6); font-size:0.85rem; margin-top:0.5rem">
        ${!gardenExists ? "Sophia todavía no ha plantado nada aquí. Vuelve cuando ella haya creado el jardín." : "Entrarás en modo espectador (solo lectura)."}
      </div>

      <button class="gdn-primary-btn" id="gdn-confirm-btn" disabled>Entrar al jardín →</button>
      <p class="gdn-disclaimer">Esta elección se guarda solo en este dispositivo.</p>
    </div>
  `;

  // Eventos de onboarding
  document.getElementById("gdn-close-btn").addEventListener("click", closeGarden);

  let selectedRole = null;

  function updateConfirmBtn() {
    const btn       = document.getElementById("gdn-confirm-btn");
    if (selectedRole === "azuquita") {
      btn.disabled = !gardenExists; // Si no existe, azuquita no puede entrar a crearlo
    } else {
      const nameInput = document.getElementById("gdn-garden-name");
      const sophiaInput = document.getElementById("gdn-sophia-name");
      const gardenNameOk = gardenExists || (nameInput && nameInput.value.trim().length > 0);
      const sophiaNameOk = (sophiaInput && sophiaInput.value.trim().length > 0) || !!sophiaName;
      btn.disabled = !selectedRole || !gardenNameOk || !sophiaNameOk;
    }
  }

  document.getElementById("gdn-role-azuquita").addEventListener("click", () => {
    selectedRole = "azuquita";
    document.querySelectorAll(".gdn-role-btn").forEach(b => b.classList.remove("selected"));
    document.getElementById("gdn-role-azuquita").classList.add("selected");
    
    document.getElementById("gdn-sophia-name-wrap").style.display = "none";
    if (document.getElementById("gdn-garden-name-section")) {
      document.getElementById("gdn-garden-name-section").style.display = "none";
    }
    document.getElementById("gdn-azuquita-msg").style.display = "block";
    updateConfirmBtn();
  });

  document.getElementById("gdn-role-sophia").addEventListener("click", () => {
    selectedRole = "sophia";
    document.querySelectorAll(".gdn-role-btn").forEach(b => b.classList.remove("selected"));
    document.getElementById("gdn-role-sophia").classList.add("selected");
    
    document.getElementById("gdn-azuquita-msg").style.display = "none";
    if (document.getElementById("gdn-garden-name-section")) {
      document.getElementById("gdn-garden-name-section").style.display = "block";
    }
    const sophiaWrap = document.getElementById("gdn-sophia-name-wrap");
    sophiaWrap.style.display = sophiaName ? "none" : "block";
    updateConfirmBtn();
  });

  document.getElementById("gdn-garden-name")?.addEventListener("input", updateConfirmBtn);
  document.getElementById("gdn-sophia-name")?.addEventListener("input", updateConfirmBtn);

  document.getElementById("gdn-confirm-btn").addEventListener("click", async () => {
    const gardenNameInput = document.getElementById("gdn-garden-name")?.value.trim() || gardenDoc?.gardenName;
    const sophiaInput     = document.getElementById("gdn-sophia-name")?.value.trim() || sophiaName;
    const displayName     = selectedRole === "azuquita" ? "Azuquita" : sophiaInput;

    modalInner().innerHTML = `<div class="gdn-loading"><div class="gdn-spinner"></div><p>Preparando el jardín…</p></div>`;

    try {
      let finalDoc = gardenDoc;
      if (!gardenExists && selectedRole === "sophia") {
        finalDoc = await createGarden({
          gardenName: gardenNameInput,
          sophiaName: sophiaInput,
        });
      }
      setLocalRole(selectedRole, displayName);
      renderGardenView(finalDoc, selectedRole, displayName);
    } catch (err) {
      console.error("Error creando jardín:", err);
      modalInner().innerHTML = `<p class="gdn-error">Algo falló. Intenta de nuevo.</p>`;
    }
  });
}

// ── VISTA PRINCIPAL DEL JARDÍN ───────────────────────────
async function renderGardenView(gardenDoc, role, name) {
  const canWater   = canWaterToday(role, gardenDoc);
  const messages   = await getMessages();
  const canPost    = await canPostToday(role);

  modalInner().innerHTML = `
    <button class="gdn-close" id="gdn-close-btn" aria-label="Cerrar">&times;</button>

    <div class="gdn-view">

      <!-- Encabezado -->
      <div class="gdn-header">
        <p class="eyebrow">El jardín de los lirios</p>
        <h2 class="gdn-title serif">${gardenDoc.gardenName || "Nuestro jardín"}</h2>
        <p class="gdn-greeting">Hola, <em>${name}</em> 🌿</p>
      </div>

      <!-- Lirio con crecimiento -->
      <div class="gdn-lily-stage" id="gdn-lily-wrap">
        ${lilyClusterSVG(gardenDoc.growthStage || 0)}
      </div>

      <!-- Stats -->
      <div class="gdn-stats">
        <div class="gdn-stat">
          <span class="gdn-stat-num">${gardenDoc.growthStage || 0}<span class="gdn-stat-max">/5</span></span>
          <span class="gdn-stat-label">Etapa</span>
        </div>
        <div class="gdn-stat">
          <span class="gdn-stat-num">${gardenDoc.streak || 0}</span>
          <span class="gdn-stat-label">Racha 🔥</span>
        </div>
        <div class="gdn-stat">
          <span class="gdn-stat-num">${gardenDoc.totalResources || 0}</span>
          <span class="gdn-stat-label">Semillas ✨</span>
        </div>
        <div class="gdn-stat">
          <span class="gdn-stat-num">${gardenDoc.waterCount || 0}</span>
          <span class="gdn-stat-label">Riegos</span>
        </div>
      </div>

      <!-- Botón de riego (Solo para Sophia) -->
      ${role === 'sophia' ? `
      <div class="gdn-water-section">
        ${canWater
          ? `<button class="gdn-water-btn" id="gdn-water-btn">
               <span class="gdn-water-icon">💧</span> Regar el jardín
             </button>`
          : `<div class="gdn-already-watered">
               <span>🌙</span>
               <p>Ya regaste hoy.<br><em>Vuelve mañana.</em></p>
             </div>`
        }
      </div>
      ` : ''}

      <!-- Mensaje al jardinero -->
      <div class="gdn-message-section">
        <p class="eyebrow" style="margin-bottom:0.8rem">Libreta del jardinero</p>
        ${role === 'sophia' ? (canPost
          ? `<div class="gdn-msg-compose">
               <textarea class="gdn-textarea" id="gdn-msg-text"
                 placeholder="Deja algo escrito para Azuquita hoy…"
                 maxlength="400" rows="3"></textarea>
               <button class="gdn-msg-send-btn" id="gdn-msg-send">
                 Dejar nota 🌿
               </button>
             </div>`
          : `<p class="gdn-already-msg">Ya dejaste tu nota de hoy. <em>Hasta mañana.</em></p>`
        ) : ""}

        <div class="gdn-msg-list" id="gdn-msg-list">
          ${renderMessages(messages)}
        </div>
      </div>

    </div>
  `;

  // Eventos
  document.getElementById("gdn-close-btn").addEventListener("click", closeGarden);

  if (canWater) {
    document.getElementById("gdn-water-btn").addEventListener("click", async () => {
      const btn = document.getElementById("gdn-water-btn");
      btn.disabled = true;
      btn.textContent = "Regando…";

      try {
        await waterGarden(role);
        // Animación de riego
        playWaterAnimation();

        // Recargar vista con datos actualizados
        const updatedDoc = await getOrCreateGardenDoc();
        setTimeout(() => renderGardenView(updatedDoc, role, name), 900);
      } catch (err) {
        if (err.message === "ya_riego") {
          btn.disabled = true;
          btn.textContent = "Ya regaste hoy 🌙";
        } else {
          console.error(err);
          btn.disabled = false;
          btn.textContent = "💧 Regar el jardín";
        }
      }
    });
  }

  if (canPost) {
    document.getElementById("gdn-msg-send").addEventListener("click", async () => {
      const text = document.getElementById("gdn-msg-text").value.trim();
      if (!text) return;
      const sendBtn = document.getElementById("gdn-msg-send");
      sendBtn.disabled = true;
      sendBtn.textContent = "Guardando…";
      try {
        await postMessage(role, name, text);
        const msgs = await getMessages();
        const composeEl = document.querySelector(".gdn-msg-compose");
        if (composeEl) composeEl.remove();
        document.getElementById("gdn-msg-list").innerHTML = renderMessages(msgs);
        document.getElementById("gdn-msg-list").insertAdjacentHTML("beforebegin",
          `<p class="gdn-already-msg">Nota guardada 🌿 <em>Hasta mañana.</em></p>`);
      } catch (err) {
        console.error(err);
        sendBtn.disabled = false;
        sendBtn.textContent = "Dejar nota 🌿";
      }
    });
  }
}

// ── Animación de riego ───────────────────────────────────
function playWaterAnimation() {
  const wrap = document.getElementById("gdn-lily-wrap");
  if (!wrap) return;
  wrap.classList.add("gdn-watered");
  setTimeout(() => wrap.classList.remove("gdn-watered"), 900);
}

// ── Renderizar mensajes ─────────────────────────────────
function renderMessages(messages) {
  if (!messages.length) {
    return `<p class="gdn-no-msgs">El jardín todavía espera su primera nota.</p>`;
  }
  return messages.map(m => `
    <div class="gdn-msg-item">
      <div class="gdn-msg-meta">
        <span class="gdn-msg-author">${escHtml(m.authorName)}</span>
        <span class="gdn-msg-date">${m.date || ""}</span>
      </div>
      <p class="gdn-msg-text">${escHtml(m.text)}</p>
    </div>
  `).join("");
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── SVG del lirio pequeño (icono onboarding) ────────────
function lilySmallSVG(stage) {
  // stage 0-5: apertura de pétalos progresiva
  const openCount = stage; // cuántos pétalos abiertos
  const petals = [0,1,2,3,4].map(i => {
    const open  = i < openCount;
    const scale = open ? 1 : 0.4;
    const rot   = (i - 2) * (open ? 0 : 8);
    return `<path class="gdn-petal"
      d="M60 95 C 36 84, 33 42, 60 24 C 87 42, 84 84, 60 95 Z"
      fill="var(--night-2)" stroke="var(--lily)" stroke-width="1"
      style="transform-origin:60px 95px; transform:scale(${scale}) rotate(${rot}deg);
             opacity:${open ? 0.95 : 0.45}; transition:transform 0.8s ease, opacity 0.8s ease;"/>`;
  }).join("");

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="gdn-lily-svg-sm">
    <line x1="60" y1="95" x2="60" y2="120" stroke="var(--sage)" stroke-width="2"/>
    <path d="M60 118 C 52 112, 48 106, 50 100" stroke="var(--sage)" stroke-width="1.5" fill="none"/>
    ${petals}
    <circle cx="60" cy="88" r="3.5" fill="var(--gold)"/>
  </svg>`;
}

// ── SVG del jardín completo (clúster de lirios) ─────────
function lilyClusterSVG(stage) {
  // stage 0-5: más lirios aparecen y pétalos se abren
  const configs = [
    // [x, y, scale, minStage, petalOpenThreshold]
    [140, 110, 1.0, 0, 0],    // lirio central — siempre visible
    [90,  120, 0.75, 1, 1],   // lirio izquierda
    [190, 120, 0.75, 1, 1],   // lirio derecha
    [65,  130, 0.55, 2, 2],   // pequeño izq
    [215, 130, 0.55, 2, 2],   // pequeño der
    [140,  95, 0.45, 3, 3],   // brote trasero
  ];

  const lilies = configs.map(([cx, cy, sc, minStage, petThresh]) => {
    if (stage < minStage) return "";
    const open = stage >= petThresh + 1;
    return singleLily(cx, cy, sc, open ? Math.min(5, stage - petThresh) : 0);
  }).join("");

  const w = 280, h = 160;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" class="gdn-cluster-svg">
    ${lilies}
  </svg>`;
}

function singleLily(cx, cy, scale, openPetals) {
  const stemH = 38 * scale;
  const pY    = cy - stemH;
  const petDefs = [
    `M${cx} ${pY} C ${cx-24*scale} ${pY-8*scale}, ${cx-26*scale} ${pY-50*scale}, ${cx} ${pY-70*scale} C ${cx+26*scale} ${pY-50*scale}, ${cx+24*scale} ${pY-8*scale}, ${cx} ${pY} Z`,
    `M${cx} ${pY} C ${cx-26*scale} ${pY-6*scale}, ${cx-48*scale} ${pY-28*scale}, ${cx-28*scale} ${pY-56*scale} C ${cx} ${pY-46*scale}, ${cx+8*scale} ${pY-18*scale}, ${cx} ${pY} Z`,
    `M${cx} ${pY} C ${cx+26*scale} ${pY-6*scale}, ${cx+48*scale} ${pY-28*scale}, ${cx+28*scale} ${pY-56*scale} C ${cx} ${pY-46*scale}, ${cx-8*scale} ${pY-18*scale}, ${cx} ${pY} Z`,
    `M${cx} ${pY} C ${cx-22*scale} ${pY+4*scale}, ${cx-40*scale} ${pY-14*scale}, ${cx-22*scale} ${pY-42*scale} C ${cx} ${pY-34*scale}, ${cx+6*scale} ${pY-12*scale}, ${cx} ${pY} Z`,
    `M${cx} ${pY} C ${cx+22*scale} ${pY+4*scale}, ${cx+40*scale} ${pY-14*scale}, ${cx+22*scale} ${pY-42*scale} C ${cx} ${pY-34*scale}, ${cx-6*scale} ${pY-12*scale}, ${cx} ${pY} Z`,
  ];

  const petals = petDefs.map((d, i) => {
    const open  = i < openPetals;
    const sc    = open ? 1 : 0.3;
    const rot   = (i - 2) * (open ? 0 : 10);
    return `<path d="${d}" fill="var(--night-2)" stroke="var(--lily)" stroke-width="${0.8*scale}"
      style="transform-origin:${cx}px ${pY}px; transform:scale(${sc}) rotate(${rot}deg);
             opacity:${open ? 0.95 : 0.3}; transition:transform 1s ease, opacity 1s ease;"/>`;
  }).join("");

  return `
    <line x1="${cx}" y1="${pY}" x2="${cx}" y2="${cy}" stroke="var(--sage)" stroke-width="${1.5*scale}"/>
    <path d="M${cx} ${cy-stemH*0.4} C ${cx-10*scale} ${cy-stemH*0.3}, ${cx-14*scale} ${cy-stemH*0.1}, ${cx-10*scale} ${cy}"
      stroke="var(--sage)" stroke-width="${scale}" fill="none"/>
    ${petals}
    <circle cx="${cx}" cy="${pY+6*scale}" r="${3*scale}" fill="var(--gold)"/>
  `;
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", initGardenButton);
