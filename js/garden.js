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
    createdAt:      serverTimestamp(),
    totalResources: 0,
    streak:         0,
    growthStage:    0,
    waterCount:     { azuquita: 0, sophia: 0 },
    lastWateredDate: { azuquita: null, sophia: null },
  };
  await setDoc(GARDEN_DOC(), initial);
  return initial;
}

export function canWaterToday(role, gardenDoc) {
  if (!gardenDoc) return false;
  const last = gardenDoc.lastWateredDate?.[role];
  return last !== todayVE();
}

export async function waterGarden(role) {
  const snap = await getDoc(GARDEN_DOC());
  if (!snap.exists()) throw new Error("El jardín no existe todavía.");

  const g      = snap.data();
  const today  = todayVE();
  const other  = role === "azuquita" ? "sophia" : "azuquita";

  if (g.lastWateredDate?.[role] === today) {
    throw new Error("ya_riego"); // señal controlada
  }

  // Semillas de luz: +5 base
  const seedsEarned = 5;

  // Calcular streak: ambos regaron hoy?
  const otherWateredToday = g.lastWateredDate?.[other] === today;
  const newStreak = otherWateredToday ? (g.streak || 0) + 1 : g.streak || 0;

  // WaterCount
  const newWaterCount = {
    ...g.waterCount,
    [role]: (g.waterCount?.[role] || 0) + 1,
  };

  // GrowthStage: sube cada 5 riegos totales (máx 5)
  const totalWaters = (newWaterCount.azuquita || 0) + (newWaterCount.sophia || 0);
  const newGrowthStage = Math.min(5, Math.floor(totalWaters / 5));

  // LastWateredDate
  const newLastWateredDate = {
    ...g.lastWateredDate,
    [role]: today,
  };

  await updateDoc(GARDEN_DOC(), {
    [`waterCount.${role}`]:         newWaterCount[role],
    [`lastWateredDate.${role}`]:    today,
    totalResources:                 (g.totalResources || 0) + seedsEarned,
    streak:                         newStreak,
    growthStage:                    newGrowthStage,
  });

  return {
    seedsEarned,
    newStreak,
    newGrowthStage,
    totalResources: (g.totalResources || 0) + seedsEarned,
    bothWateredToday: otherWateredToday,
  };
}

// ── Firestore: mensajes ─────────────────────────────────
export async function canPostToday(role) {
  const today = todayVE();
  const q     = query(
    collection(db, "mensajes"),
    orderBy("date", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return !snap.docs.some(d => d.data().authorRole === role && d.data().date === today);
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
