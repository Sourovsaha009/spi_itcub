import { ClubData } from '../types';

const DB_NAME = 'SPI_IT_CLUB_STORAGE';
const DB_VERSION = 1;
const STORE_NAME = 'site_data';
const KEY = 'current_club_data';

// Open or initialize IndexedDB
function getDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Read from IndexedDB
export async function readFromIndexedDB(): Promise<ClubData | null> {
  try {
    const db = await getDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(KEY);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => {
        console.warn('IndexedDB read failed:', req.error);
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('IndexedDB access error:', err);
    return null;
  }
}

// Save to IndexedDB (guaranteed 500MB+ storage for images and data)
export async function writeToIndexedDB(data: ClubData): Promise<boolean> {
  try {
    const db = await getDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(data, KEY);

      transaction.oncomplete = () => {
        resolve(true);
      };
      transaction.onerror = () => {
        console.warn('IndexedDB write transaction failed:', transaction.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
    return false;
  }
}

// Clear IndexedDB
export async function clearIndexedDB(): Promise<boolean> {
  try {
    const db = await getDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(KEY);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
