import React, { useState, useRef } from 'react';
import {
  X, Lock, Unlock, Save, Trash2, Edit3, Image as ImageIcon,
  UploadCloud, CheckCircle2, AlertTriangle, Download, RefreshCw,
  Users, Megaphone, Facebook, FileText, KeyRound, Check, Plus, Star, Layers,
  Eye, EyeOff, Linkedin, Github, Mail, Phone, Globe,
  ArrowUp, ArrowDown, ArrowUpDown, ListOrdered, Sparkles
} from 'lucide-react';
import { ClubData, NoticeItem, GalleryItem, CommitteeMember, FounderItem, FbPostItem, ApplicationItem } from '../types';
import { compressImageFile, uploadImageToServer, uploadMemberPhoto, exportDataAsJson, importDataFromJson, resetToDefaultData, getAdminToken, setAdminToken, clearAdminToken, getAdminHeaders } from '../services/storageService';
import { deleteGalleryPostFromFirestore } from '../services/firebase';
import { verifyPasswordHash } from '../services/authCrypto';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubData: ClubData;
  onUpdateData: (newData: ClubData) => Promise<boolean>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  clubData,
  onUpdateData
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'notices' | 'gallery' | 'committee' | 'posts' | 'applications' | 'settings'>('notices');

  // Status feedback toast
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states - Notices
  const [noticeForm, setNoticeForm] = useState<{ id?: string; title: string; date: string; body: string; isImportant: boolean; category: string }>({
    title: '',
    date: '',
    body: '',
    isImportant: true,
    category: 'General'
  });

  // Form states - Gallery (Multiple Images + Cover Selection)
  const [galleryForm, setGalleryForm] = useState<{
    id?: string;
    title: string;
    desc: string;
    date: string;
    images: string[];
    coverIndex: number;
  }>({
    title: '',
    desc: '',
    date: '',
    images: [],
    coverIndex: 0
  });
  const [urlInput, setUrlInput] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Committee & Founders (Picture, Details, Bio, Social Handles, Serial Order)
  const [memberForm, setMemberForm] = useState<{
    id?: string;
    name: string;
    role: string;
    session: string;
    dept: string;
    type: 'committee' | 'founders';
    icon?: string;
    photoUrl?: string;
    bio: string;
    order?: number;
    socials: {
      facebook: string;
      linkedin: string;
      github: string;
      email: string;
      phone: string;
      whatsapp: string;
      website: string;
    };
  }>({
    name: '',
    role: '',
    session: 'Session 2021-22',
    dept: 'CST',
    type: 'committee',
    photoUrl: '',
    bio: '',
    order: undefined,
    socials: {
      facebook: '',
      linkedin: '',
      github: '',
      email: '',
      phone: '',
      whatsapp: '',
      website: ''
    }
  });
  const [isMemberPhotoCompressing, setIsMemberPhotoCompressing] = useState(false);
  const [memberPhotoUrlInput, setMemberPhotoUrlInput] = useState('');
  const memberPhotoInputRef = useRef<HTMLInputElement>(null);

  // Form states - FB Posts
  const [postForm, setPostForm] = useState<{ id?: string; title: string; date: string; link: string; snippet: string }>({
    title: '',
    date: '',
    link: 'https://www.facebook.com/SPIitClub01',
    snippet: ''
  });

  // Form states - Passcode change
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  // Validate active session token on modal open
  React.useEffect(() => {
    if (isOpen) {
      const token = getAdminToken();
      if (token) {
        fetch('/api/admin/verify-session', {
          headers: getAdminHeaders()
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.valid) {
              setIsAuthenticated(true);
            } else {
              clearAdminToken();
              setIsAuthenticated(false);
            }
          })
          .catch(() => {
            setIsAuthenticated(true);
          });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Login handler with cryptographically secure verification (server-authoritative with Web Crypto fallback for static deployments)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setLoginError('Please enter administrator passcode.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      // 1. Try server-side API endpoint if available (full-stack mode)
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: passcode.trim() })
        });

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success && data.token) {
            setAdminToken(data.token);
            setIsAuthenticated(true);
            setPasscode('');
            setLoginError('');
            triggerToast('Admin Dashboard Unlocked');
            return;
          } else if (res.status === 401 || res.status === 429) {
            setLoginError(data.error || 'Incorrect passcode! Access denied.');
            return;
          }
        }
      } catch {
        // Server endpoint not reachable or network error (e.g., static hosting on Vercel)
      }

      // 2. Cryptographic client-side verification fallback (for static Vercel deployments)
      // Validates against salted SHA-512 hash; plaintext passcode is never exposed
      const isValid = await verifyPasswordHash(passcode.trim());
      if (isValid) {
        const clientToken = 'spi_session_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
        setAdminToken(clientToken);
        setIsAuthenticated(true);
        setPasscode('');
        setLoginError('');
        triggerToast('Admin Dashboard Unlocked');
      } else {
        setLoginError('Incorrect passcode! Access denied.');
      }
    } catch {
      setLoginError('Authentication failed. Please verify your passcode.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAdminHeaders()
      });
    } catch {
      // ignore
    }
    clearAdminToken();
    setIsAuthenticated(false);
    setPasscode('');
    triggerToast('Logged out from Admin Dashboard');
  };

  // --- NOTICE OPERATIONS ---
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) {
      triggerToast('Title and Description are required', 'error');
      return;
    }

    let updatedNotices = [...clubData.notices];
    if (noticeForm.id) {
      // Edit existing
      updatedNotices = updatedNotices.map((n) =>
        n.id === noticeForm.id
          ? {
              ...n,
              title: noticeForm.title.trim(),
              date: noticeForm.date.trim() || 'Recent',
              body: noticeForm.body.trim(),
              isImportant: noticeForm.isImportant,
              category: noticeForm.category
            }
          : n
      );
      triggerToast('Notice updated and permanently saved!');
    } else {
      // Add new
      const newNotice: NoticeItem = {
        id: String(Date.now()),
        title: noticeForm.title.trim(),
        date: noticeForm.date.trim() || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        body: noticeForm.body.trim(),
        isImportant: noticeForm.isImportant,
        category: noticeForm.category
      };
      updatedNotices = [newNotice, ...updatedNotices];
      triggerToast('New notice posted and permanently saved!');
    }

    const ok = await onUpdateData({ ...clubData, notices: updatedNotices });
    if (ok) {
      handleResetNoticeForm();
    } else {
      triggerToast('Notice saved to local storage.', 'success');
      handleResetNoticeForm();
    }
  };

  const handleEditNotice = (notice: NoticeItem) => {
    setNoticeForm({
      id: notice.id,
      title: notice.title,
      date: notice.date,
      body: notice.body,
      isImportant: !!notice.isImportant,
      category: notice.category || 'General'
    });
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    const updated = clubData.notices.filter((n) => n.id !== id);
    await onUpdateData({ ...clubData, notices: updated });
    triggerToast('Notice permanently deleted.');
    if (noticeForm.id === id) handleResetNoticeForm();
  };

  const handleResetNoticeForm = () => {
    setNoticeForm({ title: '', date: '', body: '', isImportant: true, category: 'General' });
  };

  // --- GALLERY OPERATIONS (Multiple Images & Cover Selection) ---
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsCompressing(true);
      const uploadPromises = Array.from(files).map((f) => uploadImageToServer(f));
      const uploadedList = await Promise.all(uploadPromises);
      setGalleryForm((prev) => {
        const nextImages = [...prev.images, ...uploadedList];
        return {
          ...prev,
          images: nextImages,
          coverIndex: prev.images.length === 0 ? 0 : Math.min(prev.coverIndex, nextImages.length - 1)
        };
      });
      triggerToast(`Saved ${uploadedList.length} image(s) permanently! You can choose which one is the Cover.`);
    } catch (err: any) {
      triggerToast(err.message || 'Error processing images', 'error');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setGalleryForm((prev) => {
      const nextImages = [...prev.images, trimmed];
      return {
        ...prev,
        images: nextImages,
        coverIndex: prev.images.length === 0 ? 0 : prev.coverIndex
      };
    });
    setUrlInput('');
    triggerToast('Image URL added to post!');
  };

  const handleSetCover = (index: number) => {
    setGalleryForm((prev) => ({ ...prev, coverIndex: index }));
    triggerToast(`Image #${index + 1} selected as Cover Photo!`);
  };

  const handleRemoveImage = (index: number) => {
    setGalleryForm((prev) => {
      const nextImages = prev.images.filter((_, i) => i !== index);
      let nextCover = prev.coverIndex;
      if (nextCover >= nextImages.length) {
        nextCover = Math.max(0, nextImages.length - 1);
      }
      return {
        ...prev,
        images: nextImages,
        coverIndex: nextCover
      };
    });
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) {
      triggerToast('Post title is required', 'error');
      return;
    }
    if (galleryForm.images.length === 0) {
      triggerToast('Please upload or add at least 1 image to this gallery post', 'error');
      return;
    }

    const coverUrl = galleryForm.images[galleryForm.coverIndex] || galleryForm.images[0];
    const dateFormatted = galleryForm.date.trim() || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    let dateIso = '';
    try {
      const parsed = new Date(dateFormatted);
      if (!isNaN(parsed.getTime())) {
        dateIso = parsed.toISOString().split('T')[0];
      }
    } catch {}

    let updatedGallery = [...clubData.gallery];
    if (galleryForm.id) {
      // Edit
      updatedGallery = updatedGallery.map((g) =>
        g.id === galleryForm.id
          ? {
              ...g,
              title: galleryForm.title.trim(),
              url: coverUrl,
              images: galleryForm.images,
              desc: galleryForm.desc.trim() || 'Club event highlight',
              date: dateFormatted,
              dateIso: dateIso || g.dateIso
            }
          : g
      );
      triggerToast('Gallery post updated and permanently saved!');
    } else {
      // Add
      const newItem: GalleryItem = {
        id: String(Date.now()),
        title: galleryForm.title.trim(),
        url: coverUrl,
        images: galleryForm.images,
        desc: galleryForm.desc.trim() || 'Event photo highlight from SPI IT Club.',
        date: dateFormatted,
        dateIso: dateIso || new Date().toISOString().split('T')[0],
        createdAt: Date.now()
      };
      updatedGallery = [newItem, ...updatedGallery];
      triggerToast(`Gallery post with ${galleryForm.images.length} photo(s) published!`);
    }

    await onUpdateData({ ...clubData, gallery: updatedGallery });
    handleResetGalleryForm();
  };

  const handleEditGallery = (item: GalleryItem) => {
    const images = item.images && item.images.length > 0 ? item.images : (item.url ? [item.url] : []);
    const coverIdx = images.indexOf(item.url);
    setGalleryForm({
      id: item.id,
      title: item.title,
      desc: item.desc,
      date: item.date || '',
      images: images,
      coverIndex: coverIdx >= 0 ? coverIdx : 0
    });
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery post?')) return;
    deleteGalleryPostFromFirestore(id).catch(() => {});
    const updated = clubData.gallery.filter((g) => g.id !== id);
    await onUpdateData({ ...clubData, gallery: updated });
    triggerToast('Post removed permanently.');
    if (galleryForm.id === id) handleResetGalleryForm();
  };

  const handleResetGalleryForm = () => {
    setGalleryForm({ title: '', desc: '', date: '', images: [], coverIndex: 0 });
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- COMMITTEE & FOUNDER OPERATIONS ---
  const handleMemberPhotoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsMemberPhotoCompressing(true);
      // Compress avatar into ultra-compact ~18KB data URI for universal cross-device cloud persistence
      const uploadedUrl = await uploadMemberPhoto(file);
      setMemberForm((prev) => ({ ...prev, photoUrl: uploadedUrl }));
      triggerToast('Member photo optimized and saved permanently across all devices!');
    } catch (err: any) {
      triggerToast(err.message || 'Error processing photo', 'error');
    } finally {
      setIsMemberPhotoCompressing(false);
      if (memberPhotoInputRef.current) memberPhotoInputRef.current.value = '';
    }
  };

  // Designation hierarchy rank calculator for Executive Committee
  const getDesignationRank = (role: string = ''): number => {
    const r = role.toLowerCase().trim();
    // Chief Advisor / Advisor
    if (r.includes('chief advisor') || r.includes('প্রধান উপদেষ্টা')) return 2;
    if (r.includes('advisor') || r.includes('উপদেষ্টা') || r.includes('mentor')) return 5;

    // President / সভাপতি
    if ((r.includes('president') && !r.includes('vice') && !r.includes('assistant') && !r.includes('joint')) ||
        (r.includes('সভাপতি') && !r.includes('সহ') && !r.includes('যুগ্ম'))) return 10;
    
    // Vice President / সহ-সভাপতি
    if (r.includes('vice president') || r.includes('vp') || r.includes('সহ-সভাপতি') || r.includes('সহ সভাপতি')) return 20;

    // General Secretary / GS / সাধারণ সম্পাদক
    if ((r.includes('general secretary') || r.includes('gs') || r.includes('সাধারণ সম্পাদক') || r.includes('সাধারন সম্পাদক')) &&
        !r.includes('joint') && !r.includes('assistant') && !r.includes('যুগ্ম') && !r.includes('সহ')) return 30;

    // Joint / Assistant General Secretary / যুগ্ম-সাধারণ সম্পাদক
    if (r.includes('joint') || r.includes('যুগ্ম') || (r.includes('assistant') && r.includes('secretary')) || r.includes('সহ-সাধারণ')) return 40;

    // Organizing Secretary / সাংগঠনিক সম্পাদক
    if (r.includes('organizing') || r.includes('সাংগঠনিক')) return 50;

    // Treasurer / Finance / অর্থ সম্পাদক
    if (r.includes('treasurer') || r.includes('finance') || r.includes('অর্থ') || r.includes('কোষাধ্যক্ষ') || r.includes('ক্যাশ')) return 60;

    // Office Secretary / দপ্তর সম্পাদক
    if (r.includes('office') || r.includes('দপ্তর') || r.includes('দফতর')) return 70;

    // Publicity & Publication / প্রচার ও প্রকাশনা
    if (r.includes('publicity') || r.includes('publication') || r.includes('প্রচার') || r.includes('প্রকাশনা') || r.includes('media') || r.includes('মিডিয়া')) return 80;

    // Technical / IT Lead / Chief Technical Officer / Workshop Lead
    if (r.includes('technical') || r.includes('technology') || r.includes('it lead') || r.includes('tech lead') || r.includes('cto') || r.includes('programming') || r.includes('workshop') || r.includes('তথ্য প্রযুক্তি')) return 90;

    // Cultural / Event / Sports Lead
    if (r.includes('cultural') || r.includes('event') || r.includes('sports') || r.includes('সাংস্কৃতিক') || r.includes('ক্রীড়া') || r.includes('ইভেন্ট')) return 100;

    // Executive Member / কার্যনির্বাহী সদস্য
    if (r.includes('executive') || r.includes('কার্যনির্বাহী')) return 110;

    // General Member / সাধারণ সদস্য
    if (r.includes('member') || r.includes('সদস্য')) return 120;

    return 130;
  };

  // Founder panel rank calculator
  const getFounderRank = (role: string = ''): number => {
    const r = role.toLowerCase().trim();
    if (r.includes('chief advisor') || r.includes('প্রধান উপদেষ্টা')) return 5;
    if (r.includes('advisor') || r.includes('উপদেষ্টা') || r.includes('mentor')) return 8;
    if (r === 'founder' || (r.includes('founder') && !r.includes('co'))) return 10;
    if (r.includes('co-founder') || r.includes('co founder') || r.includes('সহ-প্রতিষ্ঠাতা')) return 20;
    if (r.includes('executive') || r.includes('কার্যনির্বাহী')) return 40;
    if (r.includes('member') || r.includes('সদস্য')) return 50;
    return 60;
  };

  // Move member up/down in sequence
  const handleMoveMember = async (id: string, type: 'committee' | 'founders', direction: 'up' | 'down') => {
    if (type === 'founders') {
      const list = [...clubData.founders];
      const index = list.findIndex((f) => f.id === id);
      if (index === -1) return;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      const normalized = list.map((item, idx) => ({ ...item, order: idx + 1 }));
      await onUpdateData({ ...clubData, founders: normalized });
      triggerToast(`Moved ${temp.name} to position #${targetIndex + 1}!`);
    } else {
      const list = [...clubData.committee];
      const index = list.findIndex((c) => c.id === id);
      if (index === -1) return;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      const normalized = list.map((item, idx) => ({ ...item, order: idx + 1 }));
      await onUpdateData({ ...clubData, committee: normalized });
      triggerToast(`Moved ${temp.name} to position #${targetIndex + 1}!`);
    }
  };

  // Change serial position directly
  const handleSetMemberPosition = async (id: string, type: 'committee' | 'founders', newPos: number) => {
    if (type === 'founders') {
      const list = [...clubData.founders];
      const index = list.findIndex((f) => f.id === id);
      if (index === -1 || newPos < 1 || newPos > list.length || newPos - 1 === index) return;

      const [item] = list.splice(index, 1);
      list.splice(newPos - 1, 0, item);

      const normalized = list.map((f, idx) => ({ ...f, order: idx + 1 }));
      await onUpdateData({ ...clubData, founders: normalized });
      triggerToast(`Moved ${item.name} to position #${newPos}!`);
    } else {
      const list = [...clubData.committee];
      const index = list.findIndex((c) => c.id === id);
      if (index === -1 || newPos < 1 || newPos > list.length || newPos - 1 === index) return;

      const [item] = list.splice(index, 1);
      list.splice(newPos - 1, 0, item);

      const normalized = list.map((c, idx) => ({ ...c, order: idx + 1 }));
      await onUpdateData({ ...clubData, committee: normalized });
      triggerToast(`Moved ${item.name} to position #${newPos}!`);
    }
  };

  // Auto-sort by standard designation hierarchy
  const handleAutoSortByHierarchy = async (type: 'committee' | 'founders') => {
    if (type === 'founders') {
      const sorted = [...clubData.founders]
        .sort((a, b) => {
          const rankA = getFounderRank(a.role);
          const rankB = getFounderRank(b.role);
          if (rankA !== rankB) return rankA - rankB;
          return a.name.localeCompare(b.name);
        })
        .map((item, idx) => ({ ...item, order: idx + 1 }));

      await onUpdateData({ ...clubData, founders: sorted });
      triggerToast('Founder panel sorted by designation hierarchy!');
    } else {
      const sorted = [...clubData.committee]
        .sort((a, b) => {
          const rankA = getDesignationRank(a.role);
          const rankB = getDesignationRank(b.role);
          if (rankA !== rankB) return rankA - rankB;
          return a.name.localeCompare(b.name);
        })
        .map((item, idx) => ({ ...item, order: idx + 1 }));

      await onUpdateData({ ...clubData, committee: sorted });
      triggerToast('Executive committee sorted by designation hierarchy!');
    }
  };

  // Alphabetical sort
  const handleSortAlphabetical = async (type: 'committee' | 'founders', order: 'asc' | 'desc') => {
    if (type === 'founders') {
      const sorted = [...clubData.founders]
        .sort((a, b) => {
          return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        })
        .map((item, idx) => ({ ...item, order: idx + 1 }));
      await onUpdateData({ ...clubData, founders: sorted });
      triggerToast(`Founders sorted ${order === 'asc' ? 'A to Z' : 'Z to A'}!`);
    } else {
      const sorted = [...clubData.committee]
        .sort((a, b) => {
          return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        })
        .map((item, idx) => ({ ...item, order: idx + 1 }));
      await onUpdateData({ ...clubData, committee: sorted });
      triggerToast(`Committee sorted ${order === 'asc' ? 'A to Z' : 'Z to A'}!`);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      triggerToast('Name and Designation are required', 'error');
      return;
    }

    const photoUrl = memberForm.photoUrl?.trim() || '';
    const bio = memberForm.bio?.trim() || '';
    const socials: Record<string, string> = {};
    if (memberForm.socials.facebook?.trim()) socials.facebook = memberForm.socials.facebook.trim();
    if (memberForm.socials.linkedin?.trim()) socials.linkedin = memberForm.socials.linkedin.trim();
    if (memberForm.socials.github?.trim()) socials.github = memberForm.socials.github.trim();
    if (memberForm.socials.email?.trim()) socials.email = memberForm.socials.email.trim();
    if (memberForm.socials.phone?.trim()) socials.phone = memberForm.socials.phone.trim();
    if (memberForm.socials.whatsapp?.trim()) socials.whatsapp = memberForm.socials.whatsapp.trim();
    if (memberForm.socials.website?.trim()) socials.website = memberForm.socials.website.trim();

    const targetOrder = memberForm.order ? Number(memberForm.order) : undefined;

    if (memberForm.type === 'founders') {
      let updatedFounders = [...clubData.founders];
      if (memberForm.id) {
        updatedFounders = updatedFounders.map((f) =>
          f.id === memberForm.id
            ? {
                ...f,
                name: memberForm.name.trim(),
                role: memberForm.role.trim(),
                session: memberForm.session.trim(),
                dept: memberForm.dept.trim(),
                photoUrl: photoUrl || f.photoUrl || '',
                bio: bio || f.bio || '',
                socials: Object.keys(socials).length > 0 ? socials : (f.socials || {}),
                order: targetOrder ? Number(targetOrder) : (f.order || 1)
              }
            : f
        );
        if (targetOrder && targetOrder >= 1 && targetOrder <= updatedFounders.length) {
          const currentIdx = updatedFounders.findIndex((f) => f.id === memberForm.id);
          if (currentIdx !== -1) {
            const [movedItem] = updatedFounders.splice(currentIdx, 1);
            updatedFounders.splice(targetOrder - 1, 0, movedItem);
          }
        }
        updatedFounders = updatedFounders.map((f, idx) => ({ ...f, order: idx + 1 }));
        triggerToast('Founder updated and saved permanently!');
      } else {
        const newFounder: FounderItem = {
          id: String(Date.now()),
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          session: memberForm.session.trim() || 'Established 2025',
          dept: memberForm.dept.trim() || 'CST',
          icon: 'fa-users-gear',
          photoUrl: photoUrl,
          bio: bio,
          socials: socials,
          order: targetOrder ? Number(targetOrder) : (updatedFounders.length + 1)
        };
        if (targetOrder && targetOrder >= 1 && targetOrder <= updatedFounders.length + 1) {
          updatedFounders.splice(targetOrder - 1, 0, newFounder);
        } else {
          updatedFounders.push(newFounder);
        }
        updatedFounders = updatedFounders.map((f, idx) => ({ ...f, order: idx + 1 }));
        triggerToast('Founder added and saved permanently!');
      }
      await onUpdateData({ ...clubData, founders: updatedFounders });
    } else {
      let updatedCommittee = [...clubData.committee];
      if (memberForm.id) {
        updatedCommittee = updatedCommittee.map((c) =>
          c.id === memberForm.id
            ? {
                ...c,
                name: memberForm.name.trim(),
                role: memberForm.role.trim(),
                session: memberForm.session.trim(),
                dept: memberForm.dept.trim(),
                photoUrl: photoUrl || c.photoUrl || '',
                bio: bio || c.bio || '',
                socials: Object.keys(socials).length > 0 ? socials : (c.socials || {}),
                order: targetOrder ? Number(targetOrder) : (c.order || 1)
              }
            : c
        );
        if (targetOrder && targetOrder >= 1 && targetOrder <= updatedCommittee.length) {
          const currentIdx = updatedCommittee.findIndex((c) => c.id === memberForm.id);
          if (currentIdx !== -1) {
            const [movedItem] = updatedCommittee.splice(currentIdx, 1);
            updatedCommittee.splice(targetOrder - 1, 0, movedItem);
          }
        }
        updatedCommittee = updatedCommittee.map((c, idx) => ({ ...c, order: idx + 1 }));
        triggerToast('Committee member updated and saved permanently!');
      } else {
        const newMember: CommitteeMember = {
          id: String(Date.now()),
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          session: memberForm.session.trim() || 'Session 2021-22',
          dept: memberForm.dept.trim() || 'CST',
          photoUrl: photoUrl,
          bio: bio,
          socials: socials,
          order: targetOrder ? Number(targetOrder) : (updatedCommittee.length + 1)
        };
        if (targetOrder && targetOrder >= 1 && targetOrder <= updatedCommittee.length + 1) {
          updatedCommittee.splice(targetOrder - 1, 0, newMember);
        } else {
          updatedCommittee.push(newMember);
        }
        updatedCommittee = updatedCommittee.map((c, idx) => ({ ...c, order: idx + 1 }));
        triggerToast('Committee member added and saved permanently!');
      }
      await onUpdateData({ ...clubData, committee: updatedCommittee });
    }

    handleResetMemberForm();
  };

  const handleEditMember = (id: string, type: 'committee' | 'founders') => {
    if (type === 'founders') {
      const item = clubData.founders.find((f) => f.id === id);
      if (!item) return;
      const currentIdx = clubData.founders.findIndex((f) => f.id === id);
      setMemberForm({
        id: item.id,
        name: item.name,
        role: item.role,
        session: item.session,
        dept: item.dept || 'CST',
        type: 'founders',
        order: item.order ?? (currentIdx + 1),
        photoUrl: item.photoUrl || '',
        bio: item.bio || '',
        socials: {
          facebook: item.socials?.facebook || '',
          linkedin: item.socials?.linkedin || '',
          github: item.socials?.github || '',
          email: item.socials?.email || '',
          phone: item.socials?.phone || '',
          whatsapp: item.socials?.whatsapp || '',
          website: item.socials?.website || ''
        }
      });
    } else {
      const item = clubData.committee.find((c) => c.id === id);
      if (!item) return;
      const currentIdx = clubData.committee.findIndex((c) => c.id === id);
      setMemberForm({
        id: item.id,
        name: item.name,
        role: item.role,
        session: item.session,
        dept: item.dept || 'CST',
        type: 'committee',
        order: item.order ?? (currentIdx + 1),
        photoUrl: item.photoUrl || '',
        bio: item.bio || '',
        socials: {
          facebook: item.socials?.facebook || '',
          linkedin: item.socials?.linkedin || '',
          github: item.socials?.github || '',
          email: item.socials?.email || '',
          phone: item.socials?.phone || '',
          whatsapp: item.socials?.whatsapp || '',
          website: item.socials?.website || ''
        }
      });
    }
    setMemberPhotoUrlInput('');
  };

  const handleDeleteMember = async (id: string, type: 'committee' | 'founders') => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    if (type === 'founders') {
      const updated = clubData.founders.filter((f) => f.id !== id).map((f, idx) => ({ ...f, order: idx + 1 }));
      await onUpdateData({ ...clubData, founders: updated });
    } else {
      const updated = clubData.committee.filter((c) => c.id !== id).map((c, idx) => ({ ...c, order: idx + 1 }));
      await onUpdateData({ ...clubData, committee: updated });
    }
    triggerToast('Member removed permanently.');
    if (memberForm.id === id) handleResetMemberForm();
  };

  const handleResetMemberForm = () => {
    setMemberForm({
      name: '',
      role: '',
      session: 'Session 2021-22',
      dept: 'CST',
      type: 'committee',
      order: undefined,
      photoUrl: '',
      bio: '',
      socials: {
        facebook: '',
        linkedin: '',
        github: '',
        email: '',
        phone: '',
        whatsapp: '',
        website: ''
      }
    });
    setMemberPhotoUrlInput('');
    if (memberPhotoInputRef.current) memberPhotoInputRef.current.value = '';
  };

  // --- FB POST OPERATIONS ---
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.snippet.trim()) {
      triggerToast('Title and Caption Snippet are required', 'error');
      return;
    }

    let updatedPosts = [...clubData.fbPosts];
    if (postForm.id) {
      updatedPosts = updatedPosts.map((p) =>
        p.id === postForm.id
          ? {
              ...p,
              title: postForm.title.trim(),
              date: postForm.date.trim() || 'Recent',
              link: postForm.link.trim() || 'https://www.facebook.com/SPIitClub01',
              snippet: postForm.snippet.trim()
            }
          : p
      );
      triggerToast('Facebook post showcase updated!');
    } else {
      const newPost: FbPostItem = {
        id: String(Date.now()),
        title: postForm.title.trim(),
        date: postForm.date.trim() || 'Recent',
        link: postForm.link.trim() || 'https://www.facebook.com/SPIitClub01',
        snippet: postForm.snippet.trim()
      };
      updatedPosts = [newPost, ...updatedPosts];
      triggerToast('Facebook post added and permanently saved!');
    }

    await onUpdateData({ ...clubData, fbPosts: updatedPosts });
    handleResetPostForm();
  };

  const handleEditPost = (post: FbPostItem) => {
    setPostForm({
      id: post.id,
      title: post.title,
      date: post.date,
      link: post.link,
      snippet: post.snippet
    });
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const updated = clubData.fbPosts.filter((p) => p.id !== id);
    await onUpdateData({ ...clubData, fbPosts: updated });
    triggerToast('Post showcase removed permanently.');
    if (postForm.id === id) handleResetPostForm();
  };

  const handleResetPostForm = () => {
    setPostForm({
      title: '',
      date: '',
      link: 'https://www.facebook.com/SPIitClub01',
      snippet: ''
    });
  };

  // --- PASSCODE CHANGE ---
  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassInput) {
      triggerToast('Current administrator passcode is required', 'error');
      return;
    }
    if (newPassInput.length < 4) {
      triggerToast('New passcode must be at least 4 characters', 'error');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      triggerToast('New passcodes do not match', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-secret', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          currentPassword: currentPassInput.trim(),
          newPassword: newPassInput.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('Admin passcode updated successfully in secure credentials vault!');
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
      } else {
        triggerToast(data.error || 'Failed to update passcode', 'error');
      }
    } catch {
      triggerToast('Error updating passcode. Check connection.', 'error');
    }
  };

  // --- BACKUP & RESTORE ---
  const handleExportBackup = () => {
    exportDataAsJson(clubData);
    triggerToast('Complete site backup (.json) downloaded!');
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importDataFromJson(file);
      await onUpdateData(imported);
      triggerToast('Data restored successfully from backup file!');
    } catch (err: any) {
      triggerToast(err.message || 'Failed to restore backup', 'error');
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Warning: This will reset all notices, gallery photos, and posts to default initial data. Continue?')) {
      return;
    }
    const fresh = await resetToDefaultData();
    await onUpdateData(fresh);
    triggerToast('Reset to default initial content.');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="neo-box-lg bg-[#FFFDF7] rounded-2xl max-w-3xl w-full p-5 sm:p-8 relative my-6 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="neo-btn absolute top-5 right-5 bg-white text-black p-1.5 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Global Toast Message */}
        {statusMessage && (
          <div
            className={`absolute top-4 left-6 right-16 px-4 py-2.5 rounded-lg text-xs font-black z-10 transition-all border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-[#10B981] text-black'
                : 'bg-[#FF5A5F] text-white'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5]" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* VIEW 1: PASSCODE LOGIN */}
        {!isAuthenticated ? (
          <div className="py-8 my-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FFE600] border-2 border-black text-black rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[4px_4px_0px_#000]">
                <Lock className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-black uppercase">Admin Portal Access</h3>
              <p className="text-xs text-slate-700 font-bold mt-1">
                Enter your administrative passcode to manage website content permanently
              </p>
            </div>

            <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Passcode</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-black absolute left-3 top-3.5 stroke-[2.5]" />
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    autoFocus
                    required
                    placeholder="Enter administrative passcode"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full border-2 border-black rounded-lg pl-9 pr-10 py-2.5 text-sm bg-white font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-black cursor-pointer"
                    title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? (
                      <EyeOff className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
                {loginError && (
                  <p className="text-[#FF5A5F] text-xs font-black mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{loginError}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-600 font-bold mt-2">
                  🔒 Protected administrative area for authorized SPI IT Club executives.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="neo-btn w-full bg-[#FFE600] text-black font-black py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000] disabled:opacity-50"
              >
                <Unlock className="w-4 h-4 stroke-[2.5]" />
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Unlock Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* VIEW 2: LOGGED-IN DASHBOARD */
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-black pb-3 mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-black uppercase flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] border border-black"></span>
                    <span>Content Management Dashboard</span>
                  </h3>
                </div>
                <p className="text-[11px] text-emerald-800 font-bold">
                  ✓ Permanent Persistence Active: Changes auto-saved to disk and cache
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportBackup}
                  className="neo-btn bg-white text-black font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  title="Download complete JSON backup"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Backup</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="neo-btn bg-[#FF5A5F] text-white font-black text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b-2 border-black text-xs font-black gap-1.5 sm:gap-2 overflow-x-auto pb-2 shrink-0">
              <button
                onClick={() => setActiveTab('notices')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'notices'
                    ? 'neo-badge bg-[#FFE600] text-black'
                    : 'bg-white text-black border-2 border-black/30 hover:border-black'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Notices ({clubData.notices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'neo-badge bg-[#FFE600] text-black'
                    : 'bg-white text-black border-2 border-black/30 hover:border-black'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Gallery ({clubData.gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('committee')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'committee'
                    ? 'neo-badge bg-[#FFE600] text-black'
                    : 'bg-white text-black border-2 border-black/30 hover:border-black'
                }`}
              >
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Committee &amp; Founders</span>
              </button>

              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'posts'
                    ? 'neo-badge bg-[#FFE600] text-black'
                    : 'bg-white text-black border-2 border-black/30 hover:border-black'
                }`}
              >
                <Facebook className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>FB Posts ({clubData.fbPosts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'applications'
                    ? 'neo-badge bg-[#FFE600] text-black'
                    : 'bg-white text-black border-2 border-black/30 hover:border-black'
                }`}
              >
                <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Applications ({clubData.applications?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'neo-badge bg-[#FFE600] text-black'
                    : 'bg-white text-black border-2 border-black/30 hover:border-black'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Settings</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">

              {/* TAB 1: NOTICES MANAGEMENT */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  {/* Form */}
                  <form onSubmit={handleSaveNotice} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-[#003366] text-sm">
                        {noticeForm.id ? 'Edit Notice' : 'Publish New Notice'}
                      </h4>
                      {noticeForm.id && (
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                          Editing existing notice
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      <input
                        type="text"
                        required
                        placeholder="Notice Title (e.g. Workshop Announcement)"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Deadline or Date (e.g. 13th Feb, 5:00 PM)"
                          value={noticeForm.date}
                          onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                        <select
                          value={noticeForm.category}
                          onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        >
                          <option value="General">General Notice</option>
                          <option value="Registration">Registration</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Exam">Exam / Academic</option>
                          <option value="Event">Event</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">
                            Notice Description &amp; Details *
                          </label>
                          <span className="text-[11px] text-emerald-700 font-bold">
                            ✓ Line breaks &amp; spaces preserved
                          </span>
                        </div>
                        <textarea
                          required
                          rows={4}
                          placeholder="Detailed notice description and instructions (line breaks, spaces & paragraphs will be preserved on the website)..."
                          value={noticeForm.body}
                          onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="notice-urgent-check"
                          checked={noticeForm.isImportant}
                          onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                        />
                        <label htmlFor="notice-urgent-check" className="text-xs font-bold text-red-600 select-none cursor-pointer">
                          Mark as Urgent Announcement (Highlight in red)
                        </label>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] px-5 py-2 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{noticeForm.id ? 'Save Changes' : 'Post Notice Permanently'}</span>
                        </button>
                        {noticeForm.id && (
                          <button
                            type="button"
                            onClick={handleResetNoticeForm}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* List of existing */}
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2">
                      Active Notices ({clubData.notices.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {clubData.notices.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-xs"
                        >
                          <div className="truncate pr-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-sm truncate">{n.title}</span>
                              {n.isImportant && (
                                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.2 rounded font-black uppercase">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[11px] block mt-0.5">{n.date}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditNotice(n)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(n.id)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GALLERY MANAGEMENT (Multiple Images & Cover Selection) */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Form */}
                  <form onSubmit={handleSaveGallery} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-[#003366] text-sm flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#00A896]" />
                        <span>{galleryForm.id ? 'Edit Gallery Post & Images' : 'Create New Gallery Post (Multi-Photo)'}</span>
                      </h4>
                      {galleryForm.id && (
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                          Editing existing post
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Post Title (e.g. Programming Bootcamp 2025)"
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            type="date"
                            onChange={(e) => {
                              if (e.target.value) {
                                const d = new Date(e.target.value);
                                const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                setGalleryForm({ ...galleryForm, date: formatted });
                              }
                            }}
                            className="border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium shrink-0"
                            title="Pick calendar date"
                          />
                          <input
                            type="text"
                            placeholder="Event Date (e.g. 15 Feb 2025)"
                            value={galleryForm.date}
                            onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">
                            Album Caption / Description
                          </label>
                          <span className="text-[11px] text-emerald-700 font-bold">
                            ✓ Line breaks &amp; spaces preserved
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Post description or event highlights (paragraphs and spacing are preserved)..."
                          value={galleryForm.desc}
                          onChange={(e) => setGalleryForm({ ...galleryForm, desc: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                        ></textarea>
                      </div>

                      {/* Multi-Image Upload Drop Zone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#003366] hover:bg-blue-50/30 rounded-2xl p-4 sm:p-5 text-center cursor-pointer bg-white transition relative group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageFileSelect}
                          className="hidden"
                        />

                        <div className="space-y-1">
                          <div className="w-12 h-12 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6 text-[#00A896]" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            Click to select <span className="text-[#003366] underline">one or multiple images</span> from your device
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Select multiple photos at once • Auto-compressed • Choose cover image below
                          </p>
                        </div>

                        {isCompressing && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                            <div className="text-xs font-bold text-[#003366] flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-[#003366] border-t-transparent rounded-full animate-spin"></span>
                              <span>Optimizing images...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add Image by URL Bar */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Or paste an image URL (https://...)"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                        >
                          + Add URL
                        </button>
                      </div>

                      {/* Attached Images Grid & Cover Selector */}
                      {galleryForm.images.length > 0 && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                              <span>Attached Photos ({galleryForm.images.length})</span>
                            </span>
                            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              ★ Cover is marked with a gold badge
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                            {galleryForm.images.map((imgUrl, idx) => {
                              const isCover = idx === galleryForm.coverIndex;
                              return (
                                <div
                                  key={idx}
                                  className={`relative group rounded-xl overflow-hidden border-2 transition ${
                                    isCover
                                      ? 'border-[#FFE600] ring-2 ring-[#FFE600]/50 shadow-md'
                                      : 'border-slate-200 hover:border-slate-400'
                                  } bg-slate-100 flex flex-col`}
                                >
                                  <div className="h-28 w-full overflow-hidden bg-black flex items-center justify-center">
                                    <img
                                      src={imgUrl}
                                      alt={`Attachment #${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* Cover Photo Badge */}
                                  {isCover ? (
                                    <div className="bg-[#FFE600] text-black text-[10px] font-black px-2 py-1 flex items-center justify-center gap-1 border-t border-black">
                                      <Star className="w-3 h-3 fill-black text-black" />
                                      <span>COVER PHOTO</span>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSetCover(idx)}
                                      className="bg-slate-800/80 hover:bg-[#FFE600] hover:text-black text-white text-[10px] font-bold py-1 px-1 text-center transition cursor-pointer"
                                    >
                                      Set as Cover
                                    </button>
                                  )}

                                  {/* Remove image button */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-md opacity-80 group-hover:opacity-100 transition cursor-pointer shadow"
                                    title="Remove this image"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>

                                  {/* Photo Index indicator */}
                                  <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                                    #{idx + 1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] px-5 py-2.5 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>
                            {galleryForm.id
                              ? 'Save Post Changes'
                              : `Publish Post with ${galleryForm.images.length || 0} Photo(s)`}
                          </span>
                        </button>
                        {galleryForm.id && (
                          <button
                            type="button"
                            onClick={handleResetGalleryForm}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* List of existing photos */}
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2">
                      Existing Gallery Posts ({clubData.gallery.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                      {clubData.gallery.map((g) => {
                        const totalPhotos = g.images && g.images.length > 0 ? g.images.length : 1;
                        return (
                          <div
                            key={g.id}
                            className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs"
                          >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-300">
                              <img
                                src={g.url}
                                alt={g.title}
                                className="w-full h-full object-cover"
                              />
                              {totalPhotos > 1 && (
                                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[#FFE600] text-[9px] font-black text-center py-0.5">
                                  {totalPhotos} photos
                                </span>
                              )}
                            </div>
                            <div className="truncate flex-1">
                              <span className="font-bold text-slate-800 block truncate">{g.title}</span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {g.date || 'Recent'} • {totalPhotos} image{totalPhotos > 1 ? 's' : ''}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">{g.desc}</span>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => handleEditGallery(g)}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold"
                                title="Edit Post"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGallery(g.id)}
                                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-bold"
                                title="Delete Post"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMMITTEE & FOUNDERS */}
              {activeTab === 'committee' && (
                <div className="space-y-6">
                  {/* Form */}
                  <form onSubmit={handleSaveMember} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-[#003366] text-sm mb-3 flex items-center justify-between">
                      <span>{memberForm.id ? 'Edit Member Information' : 'Add Member or Founder'}</span>
                      {memberForm.id && (
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                          Editing existing record
                        </span>
                      )}
                    </h4>

                    <div className="space-y-3.5 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name (e.g. Sourov Saha)"
                            value={memberForm.name}
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation / Role *</label>
                          <input
                            type="text"
                            required
                            placeholder="Designation (e.g. President / Website Lead)"
                            value={memberForm.role}
                            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Session</label>
                          <input
                            type="text"
                            placeholder="Session (e.g. Session 2021-22)"
                            value={memberForm.session}
                            onChange={(e) => setMemberForm({ ...memberForm, session: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                          <input
                            type="text"
                            placeholder="Department (e.g. CST)"
                            value={memberForm.dept}
                            onChange={(e) => setMemberForm({ ...memberForm, dept: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Member Category</label>
                          <select
                            value={memberForm.type}
                            onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value as any })}
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-bold min-h-[44px]"
                          >
                            <option value="committee">Executive Committee</option>
                            <option value="founders">Founder Panel</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700 uppercase">
                              Serial Order
                            </label>
                            <span className="text-[10px] text-amber-700 font-bold">1 = Top</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 1"
                            value={memberForm.order ?? ''}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                order: e.target.value ? parseInt(e.target.value, 10) : undefined
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-bold min-h-[44px]"
                            title="Desired position in the list (1 is top/president)"
                          />
                        </div>
                      </div>

                      {/* Member Picture Upload & Preview */}
                      <div className="border border-slate-200 bg-white rounded-xl p-3.5 space-y-3">
                        <label className="block text-xs font-black text-black uppercase">
                          Member Picture / Profile Photo
                        </label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Photo Preview Container */}
                          <div className="relative w-20 h-20 rounded-xl border-2 border-black overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                            {memberForm.photoUrl ? (
                              <img
                                src={memberForm.photoUrl}
                                alt="Member Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center text-slate-400">
                                <Users className="w-8 h-8 mx-auto" />
                                <span className="text-[9px] font-bold block">No Photo</span>
                              </div>
                            )}
                            {isMemberPhotoCompressing && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                              </div>
                            )}
                          </div>

                          {/* Upload Buttons & Options */}
                          <div className="flex-1 w-full space-y-2">
                            <input
                              ref={memberPhotoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleMemberPhotoFileSelect}
                              className="hidden"
                            />
                            
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => memberPhotoInputRef.current?.click()}
                                className="neo-btn bg-[#FFE600] text-black font-black text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                              >
                                <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                                <span>{memberForm.photoUrl ? 'Change Photo' : 'Upload Picture'}</span>
                              </button>

                              {memberForm.photoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setMemberForm({ ...memberForm, photoUrl: '' })}
                                  className="neo-btn bg-white hover:bg-red-50 text-red-600 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer min-h-[40px]"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>

                            {/* Direct URL input for picture */}
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="Or enter image URL (https://...)"
                                value={memberPhotoUrlInput}
                                onChange={(e) => setMemberPhotoUrlInput(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#003366] focus:outline-none bg-slate-50 font-medium"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (memberPhotoUrlInput.trim()) {
                                    setMemberForm({ ...memberForm, photoUrl: memberPhotoUrlInput.trim() });
                                    setMemberPhotoUrlInput('');
                                    triggerToast('Image URL applied to member!');
                                  }
                                }}
                                className="neo-btn bg-white text-black font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                              >
                                Apply URL
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Member Bio / Intro */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">
                            Bio / Short Intro / Quote (Optional)
                          </label>
                          <span className="text-[11px] text-emerald-700 font-bold">
                            ✓ Line breaks &amp; spaces preserved
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="e.g. Competitive programmer, lead instructor, or personal tech vision..."
                          value={memberForm.bio}
                          onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                        />
                      </div>

                      {/* Social Handles & Contact Links */}
                      <div className="border border-slate-200 bg-white rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-black text-black uppercase flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-[#003366]" />
                            <span>Social Media &amp; Contact Links (Optional)</span>
                          </label>
                          <span className="text-[10px] text-slate-500 font-bold">Buttons appear on member card</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {/* Facebook */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Facebook className="w-3 h-3 text-[#1877F2] fill-current" />
                              <span>Facebook Profile</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://facebook.com/username"
                              value={memberForm.socials.facebook}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, facebook: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#1877F2] focus:outline-none bg-slate-50 font-medium"
                            />
                          </div>

                          {/* LinkedIn */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Linkedin className="w-3 h-3 text-[#0A66C2] fill-current" />
                              <span>LinkedIn Profile</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://linkedin.com/in/username"
                              value={memberForm.socials.linkedin}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, linkedin: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#0A66C2] focus:outline-none bg-slate-50 font-medium"
                            />
                          </div>

                          {/* GitHub */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Github className="w-3 h-3 text-black" />
                              <span>GitHub Profile</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://github.com/username"
                              value={memberForm.socials.github}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, github: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-black focus:outline-none bg-slate-50 font-medium"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#EA4335]" />
                              <span>Email Address</span>
                            </label>
                            <input
                              type="email"
                              placeholder="member@example.com"
                              value={memberForm.socials.email}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, email: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#EA4335] focus:outline-none bg-slate-50 font-medium"
                            />
                          </div>

                          {/* WhatsApp */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <i className="fa-brands fa-whatsapp text-[#25D366] text-sm"></i>
                              <span>WhatsApp Number</span>
                            </label>
                            <input
                              type="text"
                              placeholder="+880 1... or 017..."
                              value={memberForm.socials.whatsapp}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, whatsapp: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#25D366] focus:outline-none bg-slate-50 font-medium"
                              title="Visitors can tap to chat directly with this number"
                            />
                          </div>

                          {/* Phone / Call */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#10B981]" />
                              <span>Phone Number (Call)</span>
                            </label>
                            <input
                              type="tel"
                              placeholder="+880 1..."
                              value={memberForm.socials.phone}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, phone: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#10B981] focus:outline-none bg-slate-50 font-medium"
                            />
                          </div>

                          {/* Website / Portfolio */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                              <Globe className="w-3 h-3 text-[#003366]" />
                              <span>Personal Website</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://mysite.com"
                              value={memberForm.socials.website}
                              onChange={(e) =>
                                setMemberForm({
                                  ...memberForm,
                                  socials: { ...memberForm.socials, website: e.target.value }
                                })
                              }
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#003366] focus:outline-none bg-slate-50 font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="submit"
                          className="neo-btn bg-[#003366] text-[#FFE600] px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                        >
                          <Save className="w-4 h-4 stroke-[2.5]" />
                          <span>{memberForm.id ? 'Save Member Info' : 'Add Member Permanently'}</span>
                        </button>
                        {memberForm.id && (
                          <button
                            type="button"
                            onClick={handleResetMemberForm}
                            className="neo-btn bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer min-h-[44px]"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* Existing Members & Founders */}
                  <div>
                    {/* Executive Committee Header & Sorting Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="neo-badge bg-[#003366] text-[#FFE600] font-mono text-xs px-2 py-0.5 font-black flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5" />
                          <span>Serial Order</span>
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                          Executive Committee ({clubData.committee.length})
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAutoSortByHierarchy('committee')}
                          className="neo-btn bg-[#FFE600] text-black font-black text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
                          title="Auto-sort by designation: President -> Vice President -> General Secretary -> Joint Secretary -> Organizing Secretary..."
                        >
                          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Sort by Designation</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSortAlphabetical('committee', 'asc')}
                          className="neo-btn bg-white hover:bg-slate-100 text-black font-bold text-xs px-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          title="Sort alphabetically A to Z"
                        >
                          <span>A-Z</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSortAlphabetical('committee', 'desc')}
                          className="neo-btn bg-white hover:bg-slate-100 text-black font-bold text-xs px-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          title="Sort reverse Z to A"
                        >
                          <span>Z-A</span>
                        </button>
                      </div>
                    </div>

                    {clubData.committee.length === 0 ? (
                      <div className="text-center py-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl mb-6">
                        <p className="text-slate-500 font-bold text-xs">No committee members added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 mb-8">
                        {clubData.committee.map((m, idx) => (
                          <div
                            key={m.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border-2 border-slate-200 hover:border-black text-xs transition gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* Serial Position Control */}
                              <div className="flex flex-col items-center justify-center shrink-0">
                                <span
                                  className="neo-badge bg-[#FFE600] text-black font-mono font-black text-xs px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000]"
                                  title={`Current Serial Position #${idx + 1}`}
                                >
                                  #{idx + 1}
                                </span>
                                {clubData.committee.length > 1 && (
                                  <select
                                    value={idx + 1}
                                    onChange={(e) => handleSetMemberPosition(m.id, 'committee', Number(e.target.value))}
                                    className="text-[10px] font-bold mt-1 bg-slate-100 border border-slate-300 rounded px-1 py-0.5 cursor-pointer hover:border-black"
                                    title="Quick change position"
                                  >
                                    {clubData.committee.map((_, i) => (
                                      <option key={i + 1} value={i + 1}>
                                        #{i + 1}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>

                              {/* Member Avatar Thumbnail */}
                              <div className="w-12 h-12 rounded-xl border-2 border-black overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
                                {m.photoUrl ? (
                                  <img
                                    src={m.photoUrl}
                                    alt={m.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <i className="fa-solid fa-user-tie text-slate-600 text-lg"></i>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-black text-black text-sm">{m.name}</span>
                                  <span className="neo-badge bg-blue-100 text-[#003366] text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-blue-300">
                                    {m.role}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] mt-1 flex-wrap">
                                  <span className="text-slate-500 font-medium">{m.session} • {m.dept || 'CST'}</span>
                                  {m.photoUrl && <span className="bg-emerald-100 text-emerald-800 font-black px-1 rounded">Photo ✓</span>}
                                  {m.bio && <span className="bg-purple-100 text-purple-800 font-black px-1 rounded">Bio ✓</span>}
                                  {m.socials?.whatsapp && (
                                    <span className="bg-emerald-100 text-emerald-800 font-black px-1 rounded flex items-center gap-0.5">
                                      <i className="fa-brands fa-whatsapp text-xs"></i> WhatsApp ✓
                                    </span>
                                  )}
                                  {m.socials && Object.values(m.socials).some(Boolean) && (
                                    <span className="bg-blue-100 text-blue-800 font-black px-1 rounded">Socials ✓</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Ordering and Action Buttons */}
                            <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveMember(m.id, 'committee', 'up')}
                                className={`neo-btn p-1.5 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center ${
                                  idx === 0
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200 shadow-none'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer'
                                }`}
                                title="Move Up (Rank Higher)"
                              >
                                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === clubData.committee.length - 1}
                                onClick={() => handleMoveMember(m.id, 'committee', 'down')}
                                className={`neo-btn p-1.5 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center ${
                                  idx === clubData.committee.length - 1
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200 shadow-none'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer'
                                }`}
                                title="Move Down (Rank Lower)"
                              >
                                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                              </button>
                              <button
                                onClick={() => handleEditMember(m.id, 'committee')}
                                className="neo-btn p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center cursor-pointer"
                                title="Edit Member"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(m.id, 'committee')}
                                className="neo-btn p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Founder Panel Header & Sorting Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="neo-badge bg-[#FFE600] text-black font-mono text-xs px-2 py-0.5 font-black flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5" />
                          <span>Serial Order</span>
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                          Founder Panel ({clubData.founders.length})
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAutoSortByHierarchy('founders')}
                          className="neo-btn bg-[#FFE600] text-black font-black text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
                          title="Auto-sort founders by role: Founder -> Co-Founder -> Advisor -> Executive Member..."
                        >
                          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Sort by Founder Hierarchy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSortAlphabetical('founders', 'asc')}
                          className="neo-btn bg-white hover:bg-slate-100 text-black font-bold text-xs px-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          title="Sort alphabetically A to Z"
                        >
                          <span>A-Z</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSortAlphabetical('founders', 'desc')}
                          className="neo-btn bg-white hover:bg-slate-100 text-black font-bold text-xs px-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                          title="Sort reverse Z to A"
                        >
                          <span>Z-A</span>
                        </button>
                      </div>
                    </div>

                    {clubData.founders.length === 0 ? (
                      <div className="text-center py-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl">
                        <p className="text-slate-500 font-bold text-xs">No founders added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {clubData.founders.map((f, idx) => (
                          <div
                            key={f.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#FFFBEB] rounded-xl border-2 border-amber-300 hover:border-black text-xs transition gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* Serial Position Control */}
                              <div className="flex flex-col items-center justify-center shrink-0">
                                <span
                                  className="neo-badge bg-[#003366] text-[#FFE600] font-mono font-black text-xs px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000]"
                                  title={`Current Serial Position #${idx + 1}`}
                                >
                                  #{idx + 1}
                                </span>
                                {clubData.founders.length > 1 && (
                                  <select
                                    value={idx + 1}
                                    onChange={(e) => handleSetMemberPosition(f.id, 'founders', Number(e.target.value))}
                                    className="text-[10px] font-bold mt-1 bg-amber-100 border border-amber-400 rounded px-1 py-0.5 cursor-pointer hover:border-black"
                                    title="Quick change position"
                                  >
                                    {clubData.founders.map((_, i) => (
                                      <option key={i + 1} value={i + 1}>
                                        #{i + 1}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>

                              {/* Founder Avatar Thumbnail */}
                              <div className="w-12 h-12 rounded-xl border-2 border-black overflow-hidden bg-[#FFE600] shrink-0 flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
                                {f.photoUrl ? (
                                  <img
                                    src={f.photoUrl}
                                    alt={f.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <i className={`fa-solid ${f.icon || 'fa-users-gear'} text-black text-lg`}></i>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-black text-black text-sm">{f.name}</span>
                                  <span className="neo-badge bg-[#FFE600] text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-black">
                                    {f.role}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] mt-1 flex-wrap">
                                  <span className="text-slate-500 font-medium">{f.session} • {f.dept || 'CST'}</span>
                                  {f.photoUrl && <span className="bg-emerald-100 text-emerald-800 font-black px-1 rounded">Photo ✓</span>}
                                  {f.bio && <span className="bg-purple-100 text-purple-800 font-black px-1 rounded">Bio ✓</span>}
                                  {f.socials?.whatsapp && (
                                    <span className="bg-emerald-100 text-emerald-800 font-black px-1 rounded flex items-center gap-0.5">
                                      <i className="fa-brands fa-whatsapp text-xs"></i> WhatsApp ✓
                                    </span>
                                  )}
                                  {f.socials && Object.values(f.socials).some(Boolean) && (
                                    <span className="bg-blue-100 text-blue-800 font-black px-1 rounded">Socials ✓</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Ordering and Action Buttons */}
                            <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveMember(f.id, 'founders', 'up')}
                                className={`neo-btn p-1.5 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center ${
                                  idx === 0
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200 shadow-none'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer'
                                }`}
                                title="Move Up (Rank Higher)"
                              >
                                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === clubData.founders.length - 1}
                                onClick={() => handleMoveMember(f.id, 'founders', 'down')}
                                className={`neo-btn p-1.5 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center ${
                                  idx === clubData.founders.length - 1
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200 shadow-none'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer'
                                }`}
                                title="Move Down (Rank Lower)"
                              >
                                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                              </button>
                              <button
                                onClick={() => handleEditMember(f.id, 'founders')}
                                className="neo-btn p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center cursor-pointer"
                                title="Edit Founder"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(f.id, 'founders')}
                                className="neo-btn p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold min-w-[34px] min-h-[34px] flex items-center justify-center cursor-pointer"
                                title="Delete Founder"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: FB POSTS */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* Form */}
                  <form onSubmit={handleSavePost} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-[#003366] text-sm mb-3">
                      {postForm.id ? 'Edit Facebook Post' : 'Add Facebook Post Showcase'}
                    </h4>

                    <div className="space-y-3 text-sm">
                      <input
                        type="text"
                        required
                        placeholder="Post Title or Headline"
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Post Date (e.g. 13th Feb, 2025)"
                          value={postForm.date}
                          onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                        <input
                          type="url"
                          placeholder="Facebook Post URL (https://facebook.com/...)"
                          value={postForm.link}
                          onChange={(e) => setPostForm({ ...postForm, link: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">
                            Post Caption / Description *
                          </label>
                          <span className="text-[11px] text-emerald-700 font-bold">
                            ✓ Line breaks &amp; spaces preserved
                          </span>
                        </div>
                        <textarea
                          required
                          rows={4}
                          placeholder="Post caption text / snippet summary (line breaks, spaces, paragraphs will be displayed exactly as typed)..."
                          value={postForm.snippet}
                          onChange={(e) => setPostForm({ ...postForm, snippet: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white font-medium"
                        ></textarea>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] px-5 py-2 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{postForm.id ? 'Save Post Changes' : 'Add FB Post Permanently'}</span>
                        </button>
                        {postForm.id && (
                          <button
                            type="button"
                            onClick={handleResetPostForm}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* List of existing FB Posts */}
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2">
                      Featured Facebook Posts ({clubData.fbPosts.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {clubData.fbPosts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="truncate pr-3">
                            <span className="font-bold text-slate-800 text-sm truncate block">{p.title}</span>
                            <span className="text-slate-400 text-[11px] block">{p.date} • {p.link}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditPost(p)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePost(p.id)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: STUDENT APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-[#003366] text-sm">Submitted Membership Applications</h4>
                      <p className="text-xs text-slate-500">Applications submitted by CST students via website joining form</p>
                    </div>
                    {clubData.applications && clubData.applications.length > 0 && (
                      <button
                        onClick={async () => {
                          if (confirm('Clear all submitted applications?')) {
                            await onUpdateData({ ...clubData, applications: [] });
                            triggerToast('Applications cleared.');
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-bold"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {(!clubData.applications || clubData.applications.length === 0) ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-600 font-bold text-sm">No applications submitted yet.</p>
                      <p className="text-slate-400 text-xs mt-1">When students fill the "Apply for Membership" form, they appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clubData.applications.map((app) => (
                        <div key={app.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div>
                              <span className="font-black text-slate-900 text-sm">{app.name}</span>
                              <span className="ml-2 text-slate-500 font-bold">Roll: {app.roll}</span>
                              {app.reg && <span className="ml-2 text-slate-400 font-normal">Reg: {app.reg}</span>}
                            </div>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                              {app.submittedAt}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                            <div><span className="font-bold text-slate-800">Semester:</span> {app.semester}</div>
                            <div><span className="font-bold text-slate-800">Shift:</span> {app.shift}</div>
                            <div><span className="font-bold text-slate-800">Phone:</span> {app.phone}</div>
                            <div><span className="font-bold text-slate-800">Domain:</span> <span className="text-[#003366] font-bold">{app.interestDomain}</span></div>
                          </div>

                          {app.whyJoin && (
                            <p className="text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                              &ldquo;{app.whyJoin}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Change Passcode */}
                  <form onSubmit={handleChangePasscode} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-[#003366] text-sm mb-1">Change Admin Passcode</h4>
                    <p className="text-xs text-slate-500 mb-4">Set a custom passcode to restrict admin dashboard access</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <input
                        type="password"
                        required
                        placeholder="Current Passcode"
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      />
                      <input
                        type="password"
                        required
                        placeholder="New Passcode (min 4 chars)"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      />
                      <input
                        type="password"
                        required
                        placeholder="Confirm New Passcode"
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] px-5 py-2 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Passcode</span>
                    </button>
                  </form>

                  {/* Backup & Restore Controls */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-extrabold text-[#003366] text-sm">Backup, Export &amp; Restore</h4>
                    <p className="text-xs text-slate-600">
                      Export your whole website database to a single JSON file. You can restore it at any time on any device.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleExportBackup}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Full Data Backup (JSON)</span>
                      </button>

                      <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer">
                        <UploadCloud className="w-4 h-4" />
                        <span>Restore From Backup JSON</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset to Factory Defaults */}
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                    <h4 className="font-extrabold text-red-700 text-sm mb-1">Danger Zone</h4>
                    <p className="text-xs text-red-600 mb-3">
                      Reset all website notices, gallery photos, committee members, and posts back to the original default setup.
                    </p>
                    <button
                      onClick={handleResetToDefault}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset to Original Defaults</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
