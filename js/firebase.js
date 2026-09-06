/* ======================================================
   FIREBASE — configuración y carga de datos desde Firestore.
   No hace falta tocar este archivo habitualmente.
   ====================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Configuración del proyecto Firebase ──────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC8qRbHMix0b-0UPhTRVzR6eQVOk6VbpIg",
  authDomain: "sophiland-f97d5.firebaseapp.com",
  projectId: "sophiland-f97d5",
  storageBucket: "sophiland-f97d5.firebasestorage.app",
  messagingSenderId: "1097566827701",
  appId: "1:1097566827701:web:e3cc030df4cabe4ac07afc"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Función principal: carga datos de Firestore, o usa los locales de data.js ──
export async function loadContent() {
  try {
    const [diarioSnap, galeriaSnap, poemasSnap, libroSnap] = await Promise.all([
      getDocs(collection(db, "diario")),
      getDocs(collection(db, "galeria")),
      getDocs(collection(db, "poemario")),
      getDocs(collection(db, "libro")),
    ]);

    // Si Firestore tiene datos, los usamos; si no, usamos los locales de data.js
    const fromFirestore = (snap, localFallback) => {
      if (!snap.empty) {
        return snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
      return localFallback;
    };

    return {
      diaryEntries:   fromFirestore(diarioSnap,  window._localDiary   || []),
      galleryPhotos:  fromFirestore(galeriaSnap,  window._localGallery || []),
      poems:          fromFirestore(poemasSnap,   window._localPoems   || []),
      bookChapters:   fromFirestore(libroSnap,    window._localBook    || []),
    };

  } catch (err) {
    console.warn("⚠️  No se pudo conectar con Firestore. Usando datos locales.", err);
    // Fallback: usa los datos que ya estaban en data.js
    return {
      diaryEntries:  window._localDiary   || [],
      galleryPhotos: window._localGallery || [],
      poems:         window._localPoems   || [],
      bookChapters:  window._localBook    || [],
    };
  }
}

// ── Seed: sube los datos locales a Firestore (solo la primera vez) ──
// Ejecuta seedFirestore() desde la consola del navegador si quieres poblar la BD.
export async function seedFirestore() {
  const localDiary   = window._localDiary   || [];
  const localGallery = window._localGallery || [];
  const localPoems   = window._localPoems   || [];
  const localBook    = window._localBook    || [];

  const writeAll = async (colName, items, keyFn) => {
    for (let i = 0; i < items.length; i++) {
      const item = { ...items[i], order: i };
      await setDoc(doc(db, colName, keyFn(item, i)), item);
    }
    console.log(`✅ ${colName}: ${items.length} documentos subidos.`);
  };

  await writeAll("diario",   localDiary,   (e, i) => `entry-${i}`);
  await writeAll("galeria",  localGallery, (e, i) => `photo-${i}`);
  await writeAll("poemario", localPoems,   (e, i) => `poem-${i}`);
  await writeAll("libro",    localBook,    (e, i) => `chapter-${i}`);

  console.log("🎉 Seed completo. Recarga la página para ver los datos de Firestore.");
}

// Exponer seedFirestore en la consola del navegador (solo para Angel)
window.seedFirestore = seedFirestore;
