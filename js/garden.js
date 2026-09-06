/* ======================================================
   GARDEN.JS — Lógica pura del jardín de lirios.
   Sin DOM. Solo Firestore y reglas de negocio.
   ====================================================== */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, getDocs,
  serverTimestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Reutilizar la app Firebase ya inicializada (o inicializar si no existe) ──
const existingApps = getApps();
const app = existingApps.find(a => a.name === "[DEFAULT]") ||
  existingApps[0] ||
  initializeApp({
    apiKey: "AIzaSyC8qRbHMix0b-0UPhTRVzR6eQVOk6VbpIg",
    authDomain: "sophiland-f97d5.firebaseapp.com",
    projectId: "sophiland-f97d5",
    storageBucket: "sophiland-f97d5.firebasestorage.app",
    messagingSenderId: "1097566827701",
    appId: "1:1097566827701:web:e3cc030df4cabe4ac07afc"
  });

const db = getFirestore(app);

// ── Zona horaria Venezuela (UTC-4) ──────────────────────
function todayVE() {
  const now = new Date();
  // Offset Venezuela: UTC-4
  const ve = new Date(now.getTime() - 4 * 60 * 60 * 1000);
  const y  = ve.getUTCFullYear();
  const m  = String(ve.getUTCMonth() + 1).padStart(2, "0");
  const d  = String(ve.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ── localStorage helpers ─────────────────────────────────
const LS_ROLE    = "sophiland_role";
const LS_NAME    = "sophiland_name";

export function getLocalRole() {
  return localStorage.getItem(LS_ROLE); // "azuquita" | "sophia" | null
}

export function getLocalName() {
  return localStorage.getItem(LS_NAME); // display name
}

export function setLocalRole(role, name) {
  localStorage.setItem(LS_ROLE, role);
  localStorage.setItem(LS_NAME, name);
}

// ── Firestore: jardín ────────────────────────────────────
const GARDEN_DOC = () => doc(db, "jardin", "main");

export async function getOrCreateGardenDoc() {
  const snap = await getDoc(GARDEN_DOC());
  if (snap.exists()) return snap.data();
  return null; // no existe todavía → onboarding pendiente
}

export async function createGarden({ gardenName, sophiaName }) {
  const initial = {
    gardenName,
    sophiaName,
    createdAt:       serverTimestamp(),
    totalResources:  0,
    streak:          0,
    growthStage:     0,
    waterCount:      0,
    lastWateredDate: null,
    // Casa
    houseUnlocked:   false,
    houseStage:      0,
    houseName:       null,
  };
  await setDoc(GARDEN_DOC(), initial);
  return initial;
}

export function canWaterToday(role, gardenDoc) {
  if (!gardenDoc) return false;
  if (role !== "sophia") return false; // Azuquita no riega
  const last = gardenDoc.lastWateredDate;
  return last !== todayVE();
}

export async function waterGarden(role) {
  if (role !== "sophia") throw new Error("Solo Sophia puede regar.");

  const snap = await getDoc(GARDEN_DOC());
  if (!snap.exists()) throw new Error("El jardín no existe todavía.");

  const g      = snap.data();
  const today  = todayVE();

  if (g.lastWateredDate === today) {
    throw new Error("ya_riego"); // señal controlada
  }

  // Semillas de luz: +5 base
  const seedsEarned = 5;

  // Calcular streak: días consecutivos
  let newStreak = 1;
  if (g.lastWateredDate) {
    const lastDate = new Date(g.lastWateredDate + "T00:00:00Z");
    const currDate = new Date(today + "T00:00:00Z");
    const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = (g.streak || 0) + 1;
    }
  }

  // WaterCount
  const newWaterCount = (g.waterCount || 0) + 1;

  // GrowthStage: sube cada 5 riegos totales (máx 5)
  const newGrowthStage = Math.min(5, Math.floor(newWaterCount / 5));

  // Verificar si el jardín quedó en etapa 5 para desbloquear la casa
  const shouldUnlockHouse = newGrowthStage >= 5 && !(g.houseUnlocked);

  await updateDoc(GARDEN_DOC(), {
    waterCount:                     newWaterCount,
    lastWateredDate:                today,
    totalResources:                 (g.totalResources || 0) + seedsEarned,
    streak:                         newStreak,
    growthStage:                    newGrowthStage,
    ...(shouldUnlockHouse ? { houseUnlocked: true } : {}),
  });

  return {
    seedsEarned,
    newStreak,
    newGrowthStage,
    totalResources: (g.totalResources || 0) + seedsEarned,
  };
}

// ── Firestore: mensajes ─────────────────────────────────
export async function canPostToday(role) {
  if (role !== "sophia") return false;
  const today = todayVE();
  const q     = query(
    collection(db, "mensajes"),
    orderBy("date", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return !snap.docs.some(d => d.data().date === today);
}

export async function postMessage(role, authorName, text) {
  const today = todayVE();
  await addDoc(collection(db, "mensajes"), {
    authorRole: role,
    authorName,
    date:       today,
    text:       text.trim().slice(0, 400),
    createdAt:  serverTimestamp(),
  });
}

export async function getMessages() {
  const q    = query(collection(db, "mensajes"), orderBy("createdAt", "desc"), limit(60));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Firestore: construcción de la casa ─────────────────
export const HOUSE_STAGES = [
  { key: "cimientos",        label: "Cimientos",            cost: 30 },
  { key: "paredes",          label: "Paredes",               cost: 40 },
  { key: "techo",            label: "Techo",                 cost: 50 },
  { key: "puertasVentanas",  label: "Puertas y ventanas",   cost: 40 },
  { key: "decoracion",       label: "Toques finales",        cost: 40 },
];

/**
 * Construye la siguiente etapa de la casa.
 * Retorna { ok: true, newHouseStage, totalResources } si tuvo éxito.
 * Retorna { ok: false, missing } si no hay suficientes semillas.
 */
export async function buildNextStage(role) {
  if (role !== "sophia") throw new Error("Solo Sophia puede construir.");

  const snap = await getDoc(GARDEN_DOC());
  if (!snap.exists()) throw new Error("El jardín no existe todavía.");

  const g = snap.data();
  const currentStage = g.houseStage || 0;

  if (currentStage >= HOUSE_STAGES.length) {
    return { ok: false, complete: true };
  }

  const nextStep = HOUSE_STAGES[currentStage];
  const resources = g.totalResources || 0;

  if (resources < nextStep.cost) {
    return { ok: false, missing: nextStep.cost - resources };
  }

  const newHouseStage = currentStage + 1;
  const newResources  = resources - nextStep.cost;

  await updateDoc(GARDEN_DOC(), {
    houseStage:     newHouseStage,
    totalResources: newResources,
  });

  return { ok: true, newHouseStage, totalResources: newResources };
}

export async function setHouseName(role, name) {
  if (role !== "sophia") throw new Error("Solo Sophia puede nombrar la casa.");
  await updateDoc(GARDEN_DOC(), { houseName: name.trim().slice(0, 50) });
}
