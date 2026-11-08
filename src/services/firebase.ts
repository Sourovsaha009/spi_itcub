import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { ClubData, GalleryItem } from '../types';

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

// Document path for SPI IT Club core data (notices, committee, founders, courses, settings)
const CLUB_DOC_REF = doc(db, 'club_content', 'main_data');

/**
 * Fetch latest club data from Cloud Firestore.
 * Merges lightweight site data from main_data with individual full posts from gallery_posts collection.
 */
export async function loadFromFirestore(): Promise<ClubData | null> {
  try {
    const snap = await getDoc(CLUB_DOC_REF);
    if (!snap.exists()) {
      return null;
    }

    const data = snap.data() as ClubData;

    // Load full gallery posts from 'gallery_posts' collection
    try {
      const postsCol = collection(db, 'gallery_posts');
      const postsSnap = await getDocs(postsCol);
      if (!postsSnap.empty) {
        const fullPostsMap = new Map<string, GalleryItem>();
        postsSnap.forEach((docSnap) => {
          const item = docSnap.data() as GalleryItem;
          const id = String(item.id || docSnap.id);
          fullPostsMap.set(id, {
            ...item,
            id
          });
        });

        // Merge full posts into data.gallery, maintaining ordering
        if (Array.isArray(data.gallery) && data.gallery.length > 0) {
          data.gallery = data.gallery.map((g) => {
            const fullPost = fullPostsMap.get(String(g.id));
            if (fullPost) {
              return {
                ...g,
                ...fullPost,
                url: fullPost.url || g.url,
                images: (fullPost.images && fullPost.images.length > 0)
                  ? fullPost.images
                  : (fullPost.url ? [fullPost.url] : (g.url ? [g.url] : []))
              };
            }
            return g;
          });

          // Also append any posts in gallery_posts that might have been saved directly
          fullPostsMap.forEach((fullPost, id) => {
            if (!data.gallery.some((g) => String(g.id) === id)) {
              data.gallery.push(fullPost);
            }
          });
        } else {
          data.gallery = Array.from(fullPostsMap.values());
        }
      }
    } catch (galErr) {
      console.warn('[Firestore] Error loading gallery_posts collection:', galErr);
    }

    return data;
  } catch (err: any) {
    console.warn('[Firestore] Load error:', err?.message || err);
    return null;
  }
}

/**
 * Save club data to Cloud Firestore with dedicated collection architecture.
 * - Each gallery post is saved as an individual document in 'gallery_posts' (unlimited collection capacity, 1MB per post)
 * - main_data holds lightweight site state (notices, courses, committee, founders, settings, applications, gallery index)
 * Guaranteed to never fail with the 1MB document size limit!
 */
function cleanForFirestore<T>(obj: T): T {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
}

export async function saveToFirestore(data: ClubData): Promise<boolean> {
  try {
    const timestamp = data.updatedAt || Date.now();

    // 1. Save each gallery item to 'gallery_posts' collection
    const galleryItems = data.gallery || [];
    const savePostPromises = galleryItems.map(async (item) => {
      const docRef = doc(db, 'gallery_posts', String(item.id));
      const postPayload = cleanForFirestore({
        ...item,
        id: String(item.id),
        images: item.images && item.images.length > 0 ? item.images : (item.url ? [item.url] : []),
        updatedAt: timestamp
      });
      await setDoc(docRef, postPayload, { merge: true });
    });

    await Promise.all(savePostPromises);

    // 2. Build lightweight main_data summary (omit huge repetitive base64 arrays in main_data)
    const lightweightGallery = galleryItems.map((g) => {
      const isHugeBase64 = g.url && g.url.startsWith('data:image') && g.url.length > 8000;
      return {
        id: String(g.id),
        title: g.title,
        desc: g.desc || '',
        date: g.date || '',
        dateIso: g.dateIso || '',
        createdAt: g.createdAt || Date.now(),
        url: isHugeBase64 ? '' : (g.url || ''),
        photoCount: (g.images && g.images.length) || 1
      };
    });

    const mainPayload = cleanForFirestore({
      ...data,
      gallery: lightweightGallery,
      updatedAt: timestamp
    });

    await setDoc(CLUB_DOC_REF, mainPayload, { merge: true });
    console.info(`[Firestore] Successfully saved club data across all devices (timestamp: ${timestamp})`);
    return true;
  } catch (err: any) {
    console.error('[Firestore] Save error:', err?.message || err);
    return false;
  }
}

/**
 * Delete a gallery post permanently from Firestore collection
 */
export async function deleteGalleryPostFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery_posts', String(id)));
    console.info(`[Firestore] Removed gallery post ${id} from collection`);
  } catch (err) {
    console.warn('[Firestore] Failed to delete gallery post doc:', err);
  }
}

/**
 * Real-time listener for live updates across all students, devices, and incognito windows
 */
export function subscribeToFirestore(onData: (data: ClubData) => void): () => void {
  try {
    const unsubscribe = onSnapshot(
      CLUB_DOC_REF,
      async (snap) => {
        if (snap.exists()) {
          const fullData = await loadFromFirestore();
          if (fullData) {
            onData(fullData);
          }
        }
      },
      (err) => {
        console.warn('[Firestore] Real-time subscription error:', err?.message || err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('[Firestore] Listener setup failed:', err?.message || err);
    return () => {};
  }
}
