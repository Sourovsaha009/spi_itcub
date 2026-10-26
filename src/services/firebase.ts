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

/**
 * Fetch latest club data from Cloud Firestore
 */
export async function loadFromFirestore(): Promise<ClubData | null> {
  try {
    const snap = await getDoc(CLUB_DOC_REF);
    if (snap.exists()) {
      const data = snap.data() as ClubData;
      return data;
    }
    return null;
  } catch (err: any) {
    console.warn('Firestore load error (check if Firestore Database is created in console):', err);
    return null;
  }
}

/**
 * Save club data to Cloud Firestore (Real-time Cloud Database)
 */
export async function saveToFirestore(data: ClubData): Promise<boolean> {
  try {
    await setDoc(CLUB_DOC_REF, {
      ...data,
      updatedAt: Date.now()
    }, { merge: true });
    return true;
  } catch (err: any) {
    console.warn('Firestore save error (make sure Firestore Database is created in test mode):', err);
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
      console.warn('Firestore real-time subscription error:', err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore listener setup failed:', err);
    return () => {};
  }
}
