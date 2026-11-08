import { ClubData, NoticeItem, GalleryItem, CommitteeMember, FounderItem, FbPostItem, ApplicationItem } from '../types';
import { readFromIndexedDB, writeToIndexedDB, clearIndexedDB } from './idbStorage';

export const defaultClubData: ClubData = {
  updatedAt: 1, // Baseline initial timestamp
  notices: [
    {
      id: "1",
      title: "Membership Registration Form Submission Deadline!",
      date: "13th Feb (Thursday), 5:00 PM",
      body: "All interested CST students are requested to fill out the joining form and submit it before the deadline.",
      isImportant: true,
      category: "Registration"
    },
    {
      id: "2",
      title: "Web Development & Python Workshop Announcement",
      date: "Upcoming Workshop",
      body: "A free hands-on 4-week programming bootcamp will begin soon for SPI IT Club registered members.",
      isImportant: false,
      category: "Workshop"
    }
  ],
  courses: [
    { id: "c1", title: "Web Development", icon: "fa-globe", desc: "Master modern HTML, CSS, JavaScript, React, and modern frontend frameworks.", duration: "8 Weeks" },
    { id: "c2", title: "App Development", icon: "fa-mobile-screen-button", desc: "Build native and cross-platform mobile apps with practical hands-on projects.", duration: "6 Weeks" },
    { id: "c3", title: "Cyber Security", icon: "fa-user-shield", desc: "Learn essential network defense techniques, ethical hacking, and cybersecurity foundations.", duration: "6 Weeks" },
    { id: "c4", title: "Graphic Design", icon: "fa-palette", desc: "UI/UX principles, vector graphics, Figma, and professional branding design.", duration: "4 Weeks" },
    { id: "c5", title: "Python Programming", icon: "fa-brands fa-python", desc: "Core logic building, data structures, algorithms, and automated scripting.", duration: "6 Weeks" },
    { id: "c6", title: "Java Programming", icon: "fa-brands fa-java", desc: "Object-Oriented Programming (OOP) concepts and enterprise application basics.", duration: "6 Weeks" },
    { id: "c7", title: "Video Editing", icon: "fa-film", desc: "Digital content creation, premiere video rendering, and post-production skills.", duration: "4 Weeks" },
    { id: "c8", title: "Data Science & Python", icon: "fa-chart-pie", desc: "Data analysis, Pandas, NumPy, visualization, and Python-driven machine learning concepts.", duration: "8 Weeks" },
    { id: "c9", title: "Basic Computer & Hardware", icon: "fa-microchip", desc: "PC assembling, operating system setup, BIOS configuration, hardware troubleshooting, and IT essentials.", duration: "4 Weeks" }
  ],
  gallery: [
    {
      id: "1",
      title: "Club Launch Ceremony 2025",
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "Official launching ceremony of SPI IT Club with faculty members and CST department students.",
      date: "15 Feb 2025",
      dateIso: "2025-02-15",
      createdAt: 1739577600000
    },
    {
      id: "2",
      title: "Hands-on Programming Bootcamp",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "Interactive coding workshop held at the computer lab for CST students.",
      date: "10 Feb 2025",
      dateIso: "2025-02-10",
      createdAt: 1739145600000
    },
    {
      id: "3",
      title: "Executive Panel Meeting",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "Strategic planning meeting for upcoming technical competitions and bootcamps.",
      date: "20 Jan 2025",
      dateIso: "2025-01-20",
      createdAt: 1737331200000
    }
  ],
  founders: [
    { id: "101", name: "Founding Team CST", role: "Founder Panel", session: "Established 2025", dept: "CST", icon: "fa-users-gear" },
    { id: "102", name: "Computer Department", role: "Shariatpur Polytechnic Institute", session: "Dept. CST", dept: "CST", icon: "fa-graduation-cap" }
  ],
  committee: [
    { id: "1", name: "Sourov Saha", role: "Website Lead & Executive Member", session: "Session 2021-22", dept: "CST" },
    { id: "2", name: "Executive Member", role: "Club President", session: "Session 2021-22", dept: "CST" },
    { id: "3", name: "Executive Member", role: "General Secretary", session: "Session 2021-22", dept: "CST" }
  ],
  fbPosts: [
    {
      id: "1",
      title: "SPI IT CLUB - Join Us Today!",
      date: "13th Feb, 2025",
      snippet: "Be a part of something extraordinary! Joining the SPI IT Club is simple and affordable. Submit your forms now.",
      link: "https://www.facebook.com/SPIitClub01"
    },
    {
      id: "2",
      title: "Learn, Collaborate, Innovate",
      date: "10th Feb, 2025",
      snippet: "Elevate your tech skills with our upcoming series of peer-to-peer learning tracks.",
      link: "https://www.facebook.com/SPIitClub01"
    }
  ],
  applications: [],
  settings: {
    passcode: "1125",
    clubName: "SPI IT CLUB",
    instituteName: "Shariatpur Polytechnic Institute",
    facebookUrl: "https://www.facebook.com/SPIitClub01",
    department: "Computer Department (Dept. CST)"
  }
};

const LOCAL_STORAGE_KEY = 'spi_it_club_data_v3';

// Helper to safely write to localStorage without crashing on quota limits
function safeSetLocalStorage(data: ClubData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage full, relying on IndexedDB & Server Storage:', err);
  }
}

// Helper to synchronously read whatever is in localStorage
export function getInitialSyncCache(): ClubData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.notices)) {
        return parsed;
      }
    }
  } catch {}
  return defaultClubData;
}

import { loadFromFirestore, saveToFirestore } from './firebase';

// Load data from multi-tier stores: Server Disk API -> Cloud Firestore -> IndexedDB -> LocalStorage
export async function loadClubData(): Promise<ClubData> {
  const candidates: { source: string; data: ClubData; time: number }[] = [];

  // 1. Check IndexedDB (Primary persistent browser database, unlimited size)
  try {
    const idbData = await readFromIndexedDB();
    if (idbData && Array.isArray(idbData.notices)) {
      candidates.push({ source: 'idb', data: idbData, time: idbData.updatedAt || 0 });
    }
  } catch (e) {
    console.warn('[Storage] IndexedDB read error:', e);
  }

  // 2. Check LocalStorage fallback
  const lsData = getInitialSyncCache();
  if (lsData && Array.isArray(lsData.notices) && lsData !== defaultClubData) {
    candidates.push({ source: 'ls', data: lsData, time: lsData.updatedAt || 0 });
  }

  // 3. Try to sync with Server Disk API (/api/club-data)
  try {
    const res = await fetch('/api/club-data', { cache: 'no-store' });
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const serverData = await res.json();
      if (serverData && Array.isArray(serverData.notices)) {
        candidates.push({ source: 'server', data: serverData, time: serverData.updatedAt || 0 });
      }
    }
  } catch (err) {
    console.info('[Storage] Server API unreachable:', err);
  }

  // 4. Try to sync with Cloud Firestore (Universal Cloud Database)
  try {
    const cloudData = await loadFromFirestore();
    if (cloudData && Array.isArray(cloudData.notices)) {
      candidates.push({ source: 'cloud', data: cloudData, time: cloudData.updatedAt || 0 });
    }
  } catch (err) {
    console.info('[Storage] Cloud Firestore not reachable yet:', err);
  }

  // Sort candidates by newest timestamp first. If timestamps are close, prioritize the candidate with more complete data (founders + committee + gallery).
  candidates.sort((a, b) => {
    const aScore = ((a.data.founders?.length || 0) * 10) + ((a.data.committee?.length || 0) * 10) + ((a.data.gallery?.length || 0) * 2);
    const bScore = ((b.data.founders?.length || 0) * 10) + ((b.data.committee?.length || 0) * 10) + ((b.data.gallery?.length || 0) * 2);
    
    // If one candidate has significantly higher data completeness (e.g. all founders present), favor it
    if (Math.abs(b.time - a.time) < 60000 && bScore !== aScore) {
      return bScore - aScore;
    }
    if (b.time !== a.time) return b.time - a.time;
    return bScore - aScore;
  });

  const bestData = candidates.length > 0 ? candidates[0].data : defaultClubData;
  const finalResult = ensureDefaults(bestData);

  // Sync the latest winning state to all other stores so everything stays consistent
  writeToIndexedDB(finalResult).catch(() => {});
  safeSetLocalStorage(finalResult);

  // If server disk or cloud firestore are behind, push latest state to them
  if (candidates.length > 0 && candidates[0].source !== 'server') {
    fetch('/api/club-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalResult)
    }).catch(() => {});
  }
  if (candidates.length > 0 && candidates[0].source !== 'cloud') {
    saveToFirestore(finalResult).catch(() => {});
  }

  return finalResult;
}

function ensureDefaults(data: ClubData): ClubData {
  if (!data) return defaultClubData;
  const existingCourseTitles = new Set((data.courses || []).map(c => c.title.toLowerCase().trim()));
  const missingCourses = defaultClubData.courses.filter(c => !existingCourseTitles.has(c.title.toLowerCase().trim()));
  
  if (missingCourses.length > 0) {
    return {
      ...data,
      courses: [...(data.courses || []), ...missingCourses]
    };
  }
  return data;
}

// Save data to all stores: Server Disk API + Cloud Firestore + IndexedDB + LocalStorage
export async function persistClubData(newData: ClubData): Promise<boolean> {
  const stampedData: ClubData = {
    ...newData,
    updatedAt: Date.now()
  };

  // Clean undefined properties so all serialization layers (Firestore, IDB, JSON) succeed
  const cleanData: ClubData = JSON.parse(JSON.stringify(stampedData));

  // 1. Write to IndexedDB immediately (unlimited storage in browser)
  const idbPromise = writeToIndexedDB(cleanData);

  // 2. Write to LocalStorage (fast reload cache)
  safeSetLocalStorage(cleanData);

  // 3. Write to Server Disk API (/api/club-data) - Await to guarantee permanent file write
  let serverOk = false;
  try {
    const res = await fetch('/api/club-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData)
    });
    if (res.ok) {
      serverOk = true;
    }
  } catch (err) {
    console.warn('[Storage] Server disk save error:', err);
  }

  // 4. Write to Cloud Firestore (universal cloud database across all devices and incognito)
  const cloudOk = await saveToFirestore(cleanData);
  const idbOk = await idbPromise;

  // Dispatch global window event so any open component/tab updates immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('spi_club_data_changed', { detail: cleanData }));
  }

  return serverOk || cloudOk || idbOk;
}

// Compress and optimize member photo for universal cross-device persistence (stored as ultra-compact ~15-20KB data URI)
export async function uploadMemberPhoto(file: File): Promise<string> {
  // Compress to 360px and 0.68 quality (crisp avatar, ~18KB, self-contained and universally cloud-synced)
  const base64 = await compressImageFile(file, 360, 0.68);
  return base64;
}

// Upload image directly to server disk for permanent, lightweight URL storage
export async function uploadImageToServer(file: File): Promise<string> {
  // Compress to reasonable dimensions and quality (under 250KB)
  const base64 = await compressImageFile(file, 900, 0.75);

  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, filename: file.name })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return data.url; // e.g. "/uploads/img_1739....jpg"
      }
    }
  } catch (err) {
    console.warn('[Upload] Failed to save image to server disk, falling back to base64:', err);
  }

  // Fallback to compressed base64 if server upload endpoint fails
  return base64;
}

// Reset data to defaults
export async function resetToDefaultData(): Promise<ClubData> {
  const resetData: ClubData = {
    ...defaultClubData,
    updatedAt: Date.now()
  };

  await writeToIndexedDB(resetData);
  safeSetLocalStorage(resetData);

  try {
    await fetch('/api/reset-defaults', { method: 'POST' });
  } catch {}

  return resetData;
}

// Compress image to Base64 using HTML5 Canvas to keep file sizes small and prevent memory issues
export function compressImageFile(file: File, maxDimension = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Export backup JSON file
export function exportDataAsJson(data: ClubData) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spi_it_club_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import backup JSON file
export function importDataFromJson(file: File): Promise<ClubData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.notices || !Array.isArray(parsed.notices)) {
          throw new Error('Invalid SPI IT Club backup JSON file format.');
        }
        parsed.updatedAt = Date.now();
        resolve(parsed as ClubData);
      } catch (err: any) {
        reject(new Error('Failed to parse JSON file: ' + err.message));
      }
    };
    reader.readAsText(file);
  });
}
