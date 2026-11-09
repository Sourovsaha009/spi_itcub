import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'club_data.json');
const AUTH_FILE = path.join(DATA_DIR, '.admin_auth.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default initial club data (secure: no credentials in public structure)
const defaultData = {
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
      desc: "Official launching event of SPI IT Club with faculty members and CST students.",
      date: "Feb 2025"
    },
    {
      id: "2",
      title: "Hands-on Programming Session",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      desc: "Interactive coding workshop held at the computer lab for CST batch.",
      date: "Feb 2025"
    },
    {
      id: "3",
      title: "Executive Panel Meeting",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      desc: "Strategic planning meeting for upcoming technical competitions and bootcamps.",
      date: "Jan 2025"
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
    clubName: "SPI IT CLUB",
    instituteName: "Shariatpur Polytechnic Institute",
    facebookUrl: "https://www.facebook.com/SPIitClub01",
    department: "Computer Department (Dept. CST)"
  }
};

// Cryptographic Administrator Authentication Storage (Salted SHA-512)
interface AdminAuthRecord {
  salt: string;
  hash: string;
  updatedAt: number;
}

function hashSecret(secret: string, salt: string): string {
  return crypto.pbkdf2Sync(secret, salt, 100000, 64, 'sha512').toString('hex');
}

function ensureAdminAuth() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(AUTH_FILE)) {
    const salt = crypto.randomBytes(16).toString('hex');
    const initialSecret = process.env.ADMIN_INITIAL_SECRET || crypto.randomBytes(24).toString('hex');
    const hash = hashSecret(initialSecret, salt);
    const authRecord: AdminAuthRecord = {
      salt,
      hash,
      updatedAt: Date.now()
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authRecord, null, 2), 'utf-8');
    console.log('[Admin Auth] Initialized salted PBKDF2/SHA-512 credentials store.');
  }
}

function verifyAdminPassword(candidate: string): boolean {
  try {
    ensureAdminAuth();
    const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
    const authRecord: AdminAuthRecord = JSON.parse(raw);
    const candidateHash = hashSecret(candidate, authRecord.salt);
    return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(authRecord.hash, 'hex'));
  } catch (err) {
    console.error('[Admin Auth] Error verifying password:', err);
    return false;
  }
}

function updateAdminPassword(newSecret: string): boolean {
  try {
    ensureAdminAuth();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashSecret(newSecret, salt);
    const authRecord: AdminAuthRecord = {
      salt,
      hash,
      updatedAt: Date.now()
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authRecord, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Admin Auth] Error updating password:', err);
    return false;
  }
}

// Active session token store: token -> expiry timestamp
const activeSessions = new Map<string, number>();
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

// IP-based rate limiting for authentication attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };
  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }
  if (record.count >= MAX_ATTEMPTS) {
    const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, waitSeconds };
  }
  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_WINDOW });
  } else {
    record.count += 1;
  }
}

function clearFailedAttempts(ip: string) {
  loginAttempts.delete(ip);
}

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Administrator session token required.' });
  }
  const token = authHeader.split(' ')[1];
  const expiresAt = activeSessions.get(token);
  if (!expiresAt || expiresAt < Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid. Please re-login.' });
  }
  next();
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readClubData() {
  try {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(content);
    // Explicitly sanitize: never leak credentials in public JSON responses
    if (data.settings && data.settings.passcode) {
      delete data.settings.passcode;
    }
    return data;
  } catch (err) {
    console.error('Error reading club_data.json, returning defaults:', err);
    return defaultData;
  }
}

function writeClubData(data: any) {
  ensureDataFile();
  // Strip passcode if present
  if (data.settings && data.settings.passcode) {
    delete data.settings.passcode;
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Support large uploads (base64 image strings from canvas)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploaded images statically
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Upload and persist image to server disk (Protected: requires admin session)
  app.post('/api/upload-image', requireAdminAuth, (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ success: false, error: 'No image provided' });
      }

      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      let extension = 'jpg';
      let cleanBase64 = imageBase64;

      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        const header = parts[0];
        cleanBase64 = parts[1];
        if (header.includes('png')) extension = 'png';
        else if (header.includes('webp')) extension = 'webp';
        else if (header.includes('gif')) extension = 'gif';
        else if (header.includes('svg')) extension = 'svg';
      }

      const safeFilename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      const buffer = Buffer.from(cleanBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeFilename}`;
      console.log(`[Upload API] Image saved permanently to disk: ${safeFilename} (${(buffer.length / 1024).toFixed(1)} KB) -> ${publicUrl}`);

      res.json({ success: true, url: publicUrl });
    } catch (err: any) {
      console.error('[Upload API] Error saving uploaded image:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Endpoints for permanent persistence
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get full data (Public read)
  app.get('/api/club-data', (req, res) => {
    const data = readClubData();
    res.json(data);
  });

  // Save/update full data or specific slice (Protected: requires admin session)
  app.post('/api/club-data', requireAdminAuth, (req, res) => {
    try {
      const incoming = req.body;
      const current = readClubData();
      const updated = {
        ...current,
        ...incoming,
        notices: incoming.notices !== undefined ? incoming.notices : current.notices,
        gallery: incoming.gallery !== undefined ? incoming.gallery : current.gallery,
        founders: incoming.founders !== undefined ? incoming.founders : current.founders,
        committee: incoming.committee !== undefined ? incoming.committee : current.committee,
        fbPosts: incoming.fbPosts !== undefined ? incoming.fbPosts : current.fbPosts,
        courses: incoming.courses !== undefined ? incoming.courses : current.courses,
        applications: incoming.applications !== undefined ? incoming.applications : (current.applications || []),
        settings: { ...current.settings, ...(incoming.settings || {}) },
        updatedAt: incoming.updatedAt || Date.now()
      };

      writeClubData(updated);
      res.json({ success: true, message: 'Data saved permanently to server storage.', data: updated });
    } catch (err: any) {
      console.error('Error saving club data:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to save data' });
    }
  });

  // Secure Admin Login with Rate Limiting & Salted PBKDF2
  app.post('/api/admin/login', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`
      });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      recordFailedAttempt(ip);
      const remaining = MAX_ATTEMPTS - (loginAttempts.get(ip)?.count || 0);
      return res.status(401).json({
        success: false,
        error: `Incorrect administrator password. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Account locked temporarily.'}`
      });
    }

    // Success: clear failed attempts and issue cryptographically secure session token
    clearFailedAttempts(ip);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_DURATION;
    activeSessions.set(token, expiresAt);

    console.log(`[Admin Auth] Successful administrator login from IP: ${ip}. Token generated.`);
    res.json({
      success: true,
      token,
      expiresAt,
      message: 'Admin Dashboard Unlocked'
    });
  });

  // Verify Active Session
  app.get('/api/admin/verify-session', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }
    const token = authHeader.split(' ')[1];
    const expiresAt = activeSessions.get(token);
    if (!expiresAt || expiresAt < Date.now()) {
      activeSessions.delete(token);
      return res.json({ valid: false });
    }
    res.json({ valid: true, expiresAt });
  });

  // Change Admin Secret (Protected)
  app.post('/api/admin/change-secret', requireAdminAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both current and new passwords are required.' });
    }

    const isValid = verifyAdminPassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    if (newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters.' });
    }

    const updated = updateAdminPassword(newPassword.trim());
    if (updated) {
      res.json({ success: true, message: 'Administrator password updated successfully in secure credentials vault.' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update credentials.' });
    }
  });

  // Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeSessions.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Mount Vite development middlewares or serve static build
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`SPI IT Club server running on port ${port}`);
  });
}

startServer();
