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
  HOUSE_STAGES, buildNextStage, setHouseName,
  PET_TYPES, adoptPet, setPetName,
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

      <!-- Nuestra casa -->
      ${renderHouseSection(gardenDoc, role)}

      <!-- Nuestro refugio (mascotas) -->
      ${renderPetsSection(gardenDoc, role)}

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

  // Evento para build button
  const buildBtn = document.getElementById("gdn-build-btn");
  if (buildBtn) {
    buildBtn.addEventListener("click", async () => {
      buildBtn.disabled = true;
      buildBtn.textContent = "Construyendo…";
      try {
        const result = await buildNextStage(role);
        const updatedDoc = await getOrCreateGardenDoc();
        if (result.ok) {
          // Si la casa quedó completa y sin nombre, mostrar modal de nombre
          if (result.newHouseStage >= HOUSE_STAGES.length && !updatedDoc.houseName) {
            renderHouseNameModal(updatedDoc, role, name);
          } else {
            renderGardenView(updatedDoc, role, name);
          }
        } else {
          // No alcanzó — refrescar la sección con el mensaje actualizado
          renderGardenView(updatedDoc, role, name);
        }
      } catch (err) {
        console.error(err);
        buildBtn.disabled = false;
        buildBtn.textContent = "Invertir semillas ✨";
      }
    });
  }

  // Evento para nombrar casa
  const nameHouseBtn = document.getElementById("gdn-name-house-btn");
  if (nameHouseBtn) {
    nameHouseBtn.addEventListener("click", () => renderHouseNameModal(gardenDoc, role, name));
  }

  // Eventos de adoptar mascotas
  document.querySelectorAll(".gdn-adopt-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const petKey = btn.dataset.petKey;
      btn.disabled = true;
      btn.textContent = "Adoptando…";
      try {
        const result = await adoptPet(role, petKey);
        const updatedDoc = await getOrCreateGardenDoc();
        renderGardenView(updatedDoc, role, name);
      } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = "Adoptar";
      }
    });
  });

  // Eventos de nombrar mascota (botón inline)
  document.querySelectorAll(".gdn-name-pet-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const petKey   = btn.dataset.petKey;
      const petLabel = btn.dataset.petLabel;
      renderPetNameModal(gardenDoc, role, name, petKey, petLabel);
    });
  });
}

// ── Animación de riego ─────────────────────────────────────
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

// ── Init ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", initGardenButton);

// ── Sección de la casa (render) ────────────────────────
function renderHouseSection(gardenDoc, role) {
  const houseUnlocked = gardenDoc.houseUnlocked || false;
  const houseStage    = gardenDoc.houseStage    || 0;
  const houseName     = gardenDoc.houseName     || null;
  const resources     = gardenDoc.totalResources || 0;

  if (!houseUnlocked) {
    return `
      <div class="gdn-house-section gdn-house-locked">
        <p class="eyebrow" style="margin-bottom:0.6rem">Nuestra casa</p>
        <p class="gdn-house-hint">
          El jardín aún está encontrando su forma.
          Cuando los lirios florezcan del todo, la casa podrá empezar a construirse.
        </p>
      </div>`;
  }

  const isComplete     = houseStage >= HOUSE_STAGES.length;
  const currentLabel   = isComplete
    ? "Casa completa"
    : HOUSE_STAGES[houseStage].label;
  const nextCost       = isComplete ? 0 : HOUSE_STAGES[houseStage].cost;
  const canAfford      = !isComplete && resources >= nextCost;
  const missing        = isComplete ? 0 : nextCost - resources;

  const houseTitle = houseName
    ? `<h3 class="gdn-house-name serif">“${escHtml(houseName)}”</h3>`
    : (role === 'sophia' && isComplete
        ? `<p class="gdn-house-hint" style="color:var(--gold);font-style:italic">No le has puesto nombre todavía — <button class="gdn-inline-btn" id="gdn-name-house-btn">ponerle nombre</button></p>`
        : '');

  const buildBtn = (!isComplete && role === 'sophia') ? `
    <button class="gdn-build-btn" id="gdn-build-btn" ${canAfford ? '' : 'disabled'}>
      ${canAfford
        ? `Invertir semillas ✨ <span class="gdn-build-cost">${nextCost}</span>`
        : `Faltan <span class="gdn-build-cost">${missing}</span> semillas`
      }
    </button>` : '';

  const progressInfo = isComplete
    ? `<p class="gdn-house-stage-label">La casa está completa 🏡</p>`
    : `<p class="gdn-house-stage-label">Siguiente: <em>${currentLabel}</em> &mdash; ${nextCost} semillas</p>`;

  return `
    <div class="gdn-house-section">
      <p class="eyebrow" style="margin-bottom:0.4rem">Nuestra casa</p>
      ${houseTitle}
      <div class="gdn-house-svg-wrap">
        ${houseSVG(houseStage)}
      </div>
      ${progressInfo}
      <div class="gdn-house-progress">
        ${HOUSE_STAGES.map((s, i) => `
          <div class="gdn-house-step ${i < houseStage ? 'done' : i === houseStage ? 'next' : ''}">
            <div class="gdn-house-step-dot"></div>
            <span>${s.label}</span>
          </div>`).join('')}
      </div>
      ${buildBtn}
    </div>`;
}

// ── Modal para nombrar la casa ────────────────────────
function renderHouseNameModal(gardenDoc, role, name) {
  modalInner().innerHTML = `
    <div class="gdn-onboard" style="text-align:center">
      <div style="font-size:2.8rem; margin-bottom:0.5rem">🏡</div>
      <p class="eyebrow">La casa está lista</p>
      <h2 class="gdn-title serif">Solo falta un nombre</h2>
      <p class="gdn-sub" style="max-width:320px;margin:0 auto">
        Dále un nombre a la casa que construiste con tanto cuidado.
      </p>
      <div class="gdn-garden-name-wrap" style="margin-top:1.5rem">
        <label class="gdn-label" for="gdn-house-name-input">¿Cómo se llamará?</label>
        <input class="gdn-input" id="gdn-house-name-input" type="text"
          placeholder="Ej: La casita de los lirios…" maxlength="50">
      </div>
      <button class="gdn-primary-btn" id="gdn-save-house-name" disabled style="margin-top:1.2rem">
        Guardar nombre
      </button>
    </div>
  `;

  const input   = document.getElementById("gdn-house-name-input");
  const saveBtn = document.getElementById("gdn-save-house-name");

  input.addEventListener("input", () => {
    saveBtn.disabled = input.value.trim().length === 0;
  });

  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando…";
    try {
      await setHouseName(role, input.value.trim());
      const updatedDoc = await getOrCreateGardenDoc();
      renderGardenView(updatedDoc, role, name);
    } catch (err) {
      console.error(err);
      saveBtn.disabled = false;
      saveBtn.textContent = "Guardar nombre";
    }
  });
}

// ── SVG de la casa por etapas ──────────────────────────
function houseSVG(stage) {
  // Paleta usando vars CSS de :root
  const wall   = "var(--night-2)";
  const stroke = "var(--gold)";
  const roof   = "var(--ink)";
  const win    = "var(--sage)";
  const door   = "var(--lily)";

  // stage 0 = solo terreno / brote
  // stage 1 = cimientos
  // stage 2 = paredes
  // stage 3 = techo
  // stage 4 = puertas y ventanas
  // stage 5 = decoración completa

  const ground = `<line x1="20" y1="135" x2="220" y2="135" stroke="${stroke}" stroke-width="1" stroke-dasharray="4 3" opacity="0.3"/>`;

  // Cimientos (etapa 1+)
  const foundation = stage >= 1 ? `
    <rect x="45" y="128" width="150" height="8" rx="1"
      fill="${wall}" stroke="${stroke}" stroke-width="1" opacity="0.8"/>` : '';

  // Paredes (etapa 2+)
  const walls = stage >= 2 ? `
    <rect x="55" y="68" width="130" height="60" rx="2"
      fill="${wall}" stroke="${stroke}" stroke-width="1" opacity="0.9"/>` : '';

  // Techo (etapa 3+)
  const roofEl = stage >= 3 ? `
    <polygon points="45,70 120,28 195,70"
      fill="${roof}" stroke="${stroke}" stroke-width="1"/>
    <polygon points="52,70 120,33 188,70"
      fill="${wall}" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>` : '';

  // Puerta y ventanas (etapa 4+)
  const openings = stage >= 4 ? `
    <rect x="102" y="94" width="36" height="34" rx="2"
      fill="${roof}" stroke="${door}" stroke-width="1"/>
    <rect x="66" y="80" width="22" height="20" rx="2"
      fill="${win}" stroke="${stroke}" stroke-width="0.8" opacity="0.6"/>
    <rect x="152" y="80" width="22" height="20" rx="2"
      fill="${win}" stroke="${stroke}" stroke-width="0.8" opacity="0.6"/>
    <line x1="77" y1="80" x2="77" y2="100" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>
    <line x1="66" y1="90" x2="88" y2="90" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>
    <line x1="163" y1="80" x2="163" y2="100" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>
    <line x1="152" y1="90" x2="174" y2="90" stroke="${stroke}" stroke-width="0.5" opacity="0.4"/>` : '';

  // Decoración final (etapa 5)
  const deco = stage >= 5 ? `
    <circle cx="120" cy="28" r="4" fill="var(--gold)" opacity="0.9"/>
    <path d="M55 100 C 50 95, 45 100, 50 108" stroke="var(--sage)" stroke-width="1" fill="none"/>
    <path d="M185 100 C 190 95, 195 100, 190 108" stroke="var(--sage)" stroke-width="1" fill="none"/>
    <circle cx="51" cy="107" r="3" fill="var(--lily)" opacity="0.7"/>
    <circle cx="189" cy="107" r="3" fill="var(--lily)" opacity="0.7"/>` : '';

  // Brote inicial (solo en etapa 0)
  const sprout = stage === 0 ? `
    <line x1="120" y1="135" x2="120" y2="105" stroke="var(--sage)" stroke-width="2"/>
    <circle cx="120" cy="102" r="5" fill="var(--night-2)" stroke="var(--lily)" stroke-width="1.5"/>` : '';

  return `<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" class="gdn-house-svg">
    ${ground}
    ${sprout}
    ${foundation}
    ${walls}
    ${roofEl}
    ${openings}
    ${deco}
  </svg>`;
}

// ── Sección de mascotas (render) ───────────────────────
function renderPetsSection(gardenDoc, role) {
  const houseStage = gardenDoc.houseStage || 0;

  // Solo visible si la casa está completa
  if (houseStage < HOUSE_STAGES.length) return '';

  const pets      = gardenDoc.pets || {};
  const resources = gardenDoc.totalResources || 0;

  const cards = PET_TYPES.map(pet => {
    const petData  = pets[pet.key] || { adopted: false, name: null };
    const adopted  = petData.adopted;
    const petName  = petData.name || null;

    let actionHTML = '';
    if (adopted) {
      // Tiene nombre → mostrarlo; sin nombre y es sophia → botón inline
      const nameTag = petName
        ? `<span class="gdn-pet-name">${escHtml(petName)}</span>`
        : (role === 'sophia'
            ? `<button class="gdn-inline-btn gdn-name-pet-btn"
                 data-pet-key="${pet.key}" data-pet-label="${pet.label}">
                 ponerle nombre
               </button>`
            : `<span class="gdn-pet-nameless">sin nombre aún</span>`);
      actionHTML = `
        <div class="gdn-pet-adopted-badge">adoptado ✓</div>
        ${nameTag}`;
    } else if (role === 'sophia') {
      const canAfford = resources >= pet.cost;
      const missing   = pet.cost - resources;
      actionHTML = `
        <button class="gdn-adopt-btn" data-pet-key="${pet.key}"
          ${canAfford ? '' : 'disabled'}>
          ${canAfford
            ? `Adoptar <span class="gdn-build-cost">${pet.cost}</span> ✨`
            : `Faltan <span class="gdn-build-cost">${missing}</span> semillas`}
        </button>`;
    } else {
      // Azuquita, no adoptada
      actionHTML = `<span class="gdn-pet-pending">no adoptado todavía</span>`;
    }

    return `
      <div class="gdn-pet-card ${adopted ? 'adopted' : ''}">
        <div class="gdn-pet-emoji">${pet.emoji}</div>
        <p class="gdn-pet-label">${pet.label}</p>
        <div class="gdn-pet-action">${actionHTML}</div>
      </div>`;
  }).join('');

  return `
    <div class="gdn-pets-section">
      <p class="eyebrow" style="margin-bottom:0.8rem">Nuestro refugio</p>
      <p class="gdn-house-hint" style="margin-bottom:1.2rem">
        Un lugar para los que llegarán a vivir con nosotros.
      </p>
      <div class="gdn-pet-grid">
        ${cards}
      </div>
    </div>`;
}

// ── Modal para nombrar una mascota ─────────────────────
function renderPetNameModal(gardenDoc, role, name, petKey, petLabel) {
  modalInner().innerHTML = `
    <div class="gdn-onboard" style="text-align:center">
      <div style="font-size:2.6rem; margin-bottom:0.5rem">
        ${PET_TYPES.find(p => p.key === petKey)?.emoji || '🐾'}
      </div>
      <p class="eyebrow">${escHtml(petLabel)}</p>
      <h2 class="gdn-title serif">¿Cómo se llamará?</h2>
      <p class="gdn-sub" style="max-width:300px;margin:0 auto">
        El nombre que le pongas quedará en el refugio para siempre.
      </p>
      <div class="gdn-garden-name-wrap" style="margin-top:1.5rem">
        <label class="gdn-label" for="gdn-pet-name-input">Nombre</label>
        <input class="gdn-input" id="gdn-pet-name-input" type="text"
          placeholder="Ej: Canela, Mochi, Luna…" maxlength="30">
      </div>
      <div style="display:flex; gap:0.8rem; justify-content:center; margin-top:1.2rem">
        <button class="gdn-primary-btn" id="gdn-save-pet-name" disabled>
          Guardar nombre
        </button>
        <button class="gdn-msg-send-btn" id="gdn-skip-pet-name">
          Dejarlo sin nombre
        </button>
      </div>
    </div>
  `;

  const input   = document.getElementById("gdn-pet-name-input");
  const saveBtn = document.getElementById("gdn-save-pet-name");
  const skipBtn = document.getElementById("gdn-skip-pet-name");

  input.addEventListener("input", () => {
    saveBtn.disabled = input.value.trim().length === 0;
  });

  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando…";
    try {
      await setPetName(role, petKey, input.value.trim());
      const updatedDoc = await getOrCreateGardenDoc();
      renderGardenView(updatedDoc, role, name);
    } catch (err) {
      console.error(err);
      saveBtn.disabled = false;
      saveBtn.textContent = "Guardar nombre";
    }
  });

  skipBtn.addEventListener("click", async () => {
    const updatedDoc = await getOrCreateGardenDoc();
    renderGardenView(updatedDoc, role, name);
  });
}

