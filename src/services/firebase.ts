import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ClubData } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyD9Fij7TzjTtqgEaWd50shlaGAzzaRtwgM",
  authDomain: "spiitclub-41505.firebaseapp.com",
  projectId: "spiitclub-41505",
  storageBucket: "spiitclub-41505.firebasestorage.app",
  messagingSenderId: "263890622647",
  appId: "1:263890622647:web:598366fb182344c1291532",
  measurementId: "G-ZS6696FCWR"
};

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Collection / Document path for the SPI IT Club official state
const CLUB_DOC_REF = doc(db, 'club_content', 'main_data');
const GALLERY_DOC_REF = doc(db, 'club_content', 'gallery_data');

/**
 * Fetch latest club data from Cloud Firestore
 */
export async function loadFromFirestore(): Promise<ClubData | null> {
  try {
    const snap = await getDoc(CLUB_DOC_REF);
    if (!snap.exists()) {
      return null;
    }

    const data = snap.data() as ClubData;

    // Check if gallery was stored separately due to size
    try {
      const gallerySnap = await getDoc(GALLERY_DOC_REF);
      if (gallerySnap.exists()) {
        const galleryPayload = gallerySnap.data();
        if (galleryPayload && Array.isArray(galleryPayload.gallery) && galleryPayload.gallery.length > 0) {
          data.gallery = galleryPayload.gallery;
        }
      }
    } catch {}

    return data;
  } catch (err: any) {
    console.warn('[Firestore] Load error (verify Firestore is created in test mode in Firebase Console):', err?.message || err);
    return null;
  }
}

/**
 * Save club data to Cloud Firestore with safe document size handling (1MB limit protection)
 */
export async function saveToFirestore(data: ClubData): Promise<boolean> {
  try {
    const timestamp = data.updatedAt || Date.now();
    const payload = {
      ...data,
      updatedAt: timestamp
    };

    // Calculate approximate size in bytes
    const str = JSON.stringify(payload);
    const sizeInBytes = new Blob([str]).size;

    if (sizeInBytes < 900000) {
      // Safe to write as a single document
      await setDoc(CLUB_DOC_REF, payload, { merge: true });
      return true;
    } else {
      // Size exceeds or is close to 1MB Firestore limit.
      // Separate the gallery images into GALLERY_DOC_REF to stay safely within limits
      console.info(`[Firestore] Data size ${(sizeInBytes / 1024).toFixed(1)} KB exceeds single doc threshold. Splitting gallery...`);
      
      const mainPayload = {
        ...payload,
        gallery: (payload.gallery || []).map((g) => ({
          ...g,
          // Keep thumbnail / url, trim redundant base64 arrays if needed
          images: (g.images || [g.url]).slice(0, 4)
        }))
      };

      await Promise.all([
        setDoc(CLUB_DOC_REF, mainPayload, { merge: true }),
        setDoc(GALLERY_DOC_REF, { gallery: payload.gallery, updatedAt: timestamp }, { merge: true })
      ]);
      return true;
    }
  } catch (err: any) {
    console.warn('[Firestore] Save error:', err?.message || err);
    return false;
  }
}

/**
 * Real-time listener for live updates across all students and devices
 */
export function subscribeToFirestore(onData: (data: ClubData) => void): () => void {
  try {
    const unsubscribe = onSnapshot(CLUB_DOC_REF, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as ClubData;
        onData(data);
      }
    }, (err) => {
      console.warn('[Firestore] Real-time subscription error:', err?.message || err);
    });
    return unsubscribe;
  } catch (err: any) {
    console.warn('[Firestore] Listener setup failed:', err?.message || err);
    return () => {};
  }
}
