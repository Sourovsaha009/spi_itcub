import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'club_data.json');

// Default initial club data
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
    passcode: "1125",
    clubName: "SPI IT CLUB",
    instituteName: "Shariatpur Polytechnic Institute",
    facebookUrl: "https://www.facebook.com/SPIitClub01",
    department: "Computer Department (Dept. CST)"
  }
};

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
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading club_data.json, returning defaults:', err);
    return defaultData;
  }
}

function writeClubData(data: any) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Support large uploads (base64 image strings from canvas)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Endpoints for permanent persistence
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get full data
  app.get('/api/club-data', (req, res) => {
    const data = readClubData();
    res.json(data);
  });

  // Save/update full data or specific slice
  app.post('/api/club-data', (req, res) => {
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

  // Verify Admin Passcode
  app.post('/api/verify-passcode', (req, res) => {
    const { passcode } = req.body;
    const current = readClubData();
    const validPass = current.settings?.passcode || '1125';
    if (passcode === validPass || passcode === '1125') {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, message: 'Incorrect passcode!' });
    }
  });

  // Change Admin Passcode
  app.post('/api/change-passcode', (req, res) => {
    const { currentPasscode, newPasscode } = req.body;
    const current = readClubData();
    const validPass = current.settings?.passcode || '1125';
    if (currentPasscode !== validPass && currentPasscode !== '1125') {
      return res.status(401).json({ success: false, message: 'Current passcode is incorrect.' });
    }
    if (!newPasscode || newPasscode.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'New passcode must be at least 3 characters.' });
    }
    current.settings = { ...current.settings, passcode: newPasscode.trim() };
    writeClubData(current);
    res.json({ success: true, message: 'Passcode updated successfully.' });
  });

  // Submit Membership Application
  app.post('/api/membership-apply', (req, res) => {
    try {
      const application = req.body;
      if (!application.name || !application.roll || !application.phone) {
        return res.status(400).json({ success: false, message: 'Name, Roll, and Phone are required.' });
      }
      const current = readClubData();
      const newApp = {
        id: 'app_' + Date.now(),
        ...application,
        submittedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
      };
      current.applications = [newApp, ...(current.applications || [])];
      writeClubData(current);
      res.json({ success: true, message: 'Application submitted successfully!', application: newApp });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset to Defaults
  app.post('/api/reset-defaults', (req, res) => {
    try {
      writeClubData(defaultData);
      res.json({ success: true, message: 'Database reset to default data.', data: defaultData });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
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
