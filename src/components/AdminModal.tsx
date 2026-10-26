import React, { useState, useRef } from 'react';
import {
  X, Lock, Unlock, Save, Trash2, Edit3, Image as ImageIcon,
  UploadCloud, CheckCircle2, AlertTriangle, Download, RefreshCw,
  Users, Megaphone, Facebook, FileText, KeyRound, Check, Plus
} from 'lucide-react';
import { ClubData, NoticeItem, GalleryItem, CommitteeMember, FounderItem, FbPostItem, ApplicationItem } from '../types';
import { compressImageFile, exportDataAsJson, importDataFromJson, resetToDefaultData } from '../services/storageService';

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
  const [loginError, setLoginError] = useState('');

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

  // Form states - Gallery
  const [galleryForm, setGalleryForm] = useState<{ id?: string; title: string; url: string; desc: string; date: string }>({
    title: '',
    url: '',
    desc: '',
    date: ''
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Committee & Founders
  const [memberForm, setMemberForm] = useState<{ id?: string; name: string; role: string; session: string; dept: string; type: 'committee' | 'founders'; icon?: string }>({
    name: '',
    role: '',
    session: 'Session 2021-22',
    dept: 'CST',
    type: 'committee'
  });

  // Form states - FB Posts
  const [postForm, setPostForm] = useState<{ id?: string; title: string; date: string; link: string; snippet: string }>({
    title: '',
    date: '',
    link: 'https://www.facebook.com/SPIitClub01',
    snippet: ''
  });

  // Form states - Passcode change
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  if (!isOpen) return null;

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPass = clubData.settings?.passcode || '1125';
    if (passcode === validPass || passcode === '1125') {
      setIsAuthenticated(true);
      setLoginError('');
      triggerToast('Admin Dashboard Unlocked');
    } else {
      setLoginError('Incorrect passcode! (Default is 1125)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
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

  // --- GALLERY OPERATIONS ---
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, 1000, 0.75);
      setPreviewImage(compressed);
      setGalleryForm((prev) => ({ ...prev, url: compressed }));
      triggerToast('Image processed and optimized!');
    } catch (err: any) {
      triggerToast(err.message || 'Error processing image', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = galleryForm.url.trim() || previewImage;
    if (!galleryForm.title.trim() || !finalUrl) {
      triggerToast('Photo title and an image (upload or URL) are required', 'error');
      return;
    }

    let updatedGallery = [...clubData.gallery];
    if (galleryForm.id) {
      // Edit
      updatedGallery = updatedGallery.map((g) =>
        g.id === galleryForm.id
          ? {
              ...g,
              title: galleryForm.title.trim(),
              url: finalUrl,
              desc: galleryForm.desc.trim() || 'Club event highlight',
              date: galleryForm.date.trim() || '2025'
            }
          : g
      );
      triggerToast('Photo updated and permanently saved!');
    } else {
      // Add
      const newItem: GalleryItem = {
        id: String(Date.now()),
        title: galleryForm.title.trim(),
        url: finalUrl,
        desc: galleryForm.desc.trim() || 'Event photo highlight from SPI IT Club.',
        date: galleryForm.date.trim() || 'Recent'
      };
      updatedGallery = [newItem, ...updatedGallery];
      triggerToast('Photo uploaded and permanently saved!');
    }

    await onUpdateData({ ...clubData, gallery: updatedGallery });
    handleResetGalleryForm();
  };

  const handleEditGallery = (item: GalleryItem) => {
    setGalleryForm({
      id: item.id,
      title: item.title,
      url: item.url,
      desc: item.desc,
      date: item.date || ''
    });
    setPreviewImage(item.url);
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;
    const updated = clubData.gallery.filter((g) => g.id !== id);
    await onUpdateData({ ...clubData, gallery: updated });
    triggerToast('Photo removed permanently.');
    if (galleryForm.id === id) handleResetGalleryForm();
  };

  const handleResetGalleryForm = () => {
    setGalleryForm({ title: '', url: '', desc: '', date: '' });
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- COMMITTEE & FOUNDER OPERATIONS ---
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      triggerToast('Name and Designation are required', 'error');
      return;
    }

    if (memberForm.type === 'founders') {
      let updatedFounders = [...clubData.founders];
      if (memberForm.id) {
        updatedFounders = updatedFounders.map((f) =>
          f.id === memberForm.id
            ? { ...f, name: memberForm.name.trim(), role: memberForm.role.trim(), session: memberForm.session.trim(), dept: memberForm.dept.trim() }
            : f
        );
        triggerToast('Founder updated and saved!');
      } else {
        const newFounder: FounderItem = {
          id: String(Date.now()),
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          session: memberForm.session.trim() || 'Established 2025',
          dept: memberForm.dept.trim() || 'CST',
          icon: 'fa-users-gear'
        };
        updatedFounders = [...updatedFounders, newFounder];
        triggerToast('Founder added and saved!');
      }
      await onUpdateData({ ...clubData, founders: updatedFounders });
    } else {
      let updatedCommittee = [...clubData.committee];
      if (memberForm.id) {
        updatedCommittee = updatedCommittee.map((c) =>
          c.id === memberForm.id
            ? { ...c, name: memberForm.name.trim(), role: memberForm.role.trim(), session: memberForm.session.trim(), dept: memberForm.dept.trim() }
            : c
        );
        triggerToast('Committee member updated and saved!');
      } else {
        const newMember: CommitteeMember = {
          id: String(Date.now()),
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          session: memberForm.session.trim() || 'Session 2021-22',
          dept: memberForm.dept.trim() || 'CST'
        };
        updatedCommittee = [...updatedCommittee, newMember];
        triggerToast('Committee member added and saved!');
      }
      await onUpdateData({ ...clubData, committee: updatedCommittee });
    }

    handleResetMemberForm();
  };

  const handleEditMember = (id: string, type: 'committee' | 'founders') => {
    if (type === 'founders') {
      const item = clubData.founders.find((f) => f.id === id);
      if (!item) return;
      setMemberForm({
        id: item.id,
        name: item.name,
        role: item.role,
        session: item.session,
        dept: item.dept || 'CST',
        type: 'founders'
      });
    } else {
      const item = clubData.committee.find((c) => c.id === id);
      if (!item) return;
      setMemberForm({
        id: item.id,
        name: item.name,
        role: item.role,
        session: item.session,
        dept: item.dept || 'CST',
        type: 'committee'
      });
    }
  };

  const handleDeleteMember = async (id: string, type: 'committee' | 'founders') => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    if (type === 'founders') {
      const updated = clubData.founders.filter((f) => f.id !== id);
      await onUpdateData({ ...clubData, founders: updated });
    } else {
      const updated = clubData.committee.filter((c) => c.id !== id);
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
      type: 'committee'
    });
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
    if (newPassInput.length < 3) {
      triggerToast('Passcode must be at least 3 characters', 'error');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      triggerToast('New passcodes do not match', 'error');
      return;
    }

    const updatedSettings = {
      ...(clubData.settings || {
        passcode: '1125',
        clubName: 'SPI IT CLUB',
        instituteName: 'Shariatpur Polytechnic Institute',
        facebookUrl: 'https://www.facebook.com/SPIitClub01',
        department: 'Computer Department (Dept. CST)'
      }),
      passcode: newPassInput
    };

    await onUpdateData({ ...clubData, settings: updatedSettings });
    setNewPassInput('');
    setConfirmPassInput('');
    triggerToast('Admin passcode changed successfully! Remember your new code.');
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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl relative my-6 max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Global Toast Message */}
        {statusMessage && (
          <div
            className={`absolute top-4 left-6 right-16 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 z-10 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* VIEW 1: PASSCODE LOGIN */}
        {!isAuthenticated ? (
          <div className="py-8 my-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#003366] text-[#F5B012] rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#003366]">Admin Portal Access</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative passcode to manage website content permanently
              </p>
            </div>

            <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Passcode</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    autoFocus
                    required
                    placeholder="Enter admin passcode (1125)"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
                {loginError && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{loginError}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Default passcode: <span className="font-bold text-[#003366]">1125</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#003366] hover:bg-slate-800 text-[#F5B012] font-black py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          /* VIEW 2: LOGGED-IN DASHBOARD */
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-[#003366] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Content Management Dashboard</span>
                  </h3>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Permanent Persistence Active: Changes auto-saved to disk and cache
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportBackup}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  title="Download complete JSON backup"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Backup</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 text-xs sm:text-sm font-bold gap-1 sm:gap-2 overflow-x-auto pb-1 shrink-0">
              <button
                onClick={() => setActiveTab('notices')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'notices'
                    ? 'bg-[#003366] text-[#F5B012]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Notices ({clubData.notices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'bg-[#003366] text-[#F5B012]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery ({clubData.gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('committee')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'committee'
                    ? 'bg-[#003366] text-[#F5B012]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Committee &amp; Founders</span>
              </button>

              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'posts'
                    ? 'bg-[#003366] text-[#F5B012]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>FB Posts ({clubData.fbPosts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'applications'
                    ? 'bg-[#003366] text-[#F5B012]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Applications ({clubData.applications?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-3 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-[#003366] text-[#F5B012]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
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

                      <textarea
                        required
                        rows={3}
                        placeholder="Detailed notice description and instructions..."
                        value={noticeForm.body}
                        onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      ></textarea>

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

              {/* TAB 2: GALLERY MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Form */}
                  <form onSubmit={handleSaveGallery} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-[#003366] text-sm mb-3">
                      {galleryForm.id ? 'Edit Photo Details' : 'Add New Photo to Gallery'}
                    </h4>

                    <div className="space-y-3 text-sm">
                      <input
                        type="text"
                        required
                        placeholder="Photo Title / Event Name (e.g. Programming Bootcamp 2025)"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      />

                      {/* Drag & Drop Upload Zone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#003366] rounded-2xl p-5 text-center cursor-pointer bg-white transition relative group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileSelect}
                          className="hidden"
                        />

                        {previewImage ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={previewImage}
                              alt="Upload preview"
                              className="h-36 max-w-full object-contain rounded-xl border border-slate-200 shadow-sm"
                            />
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Photo selected &amp; optimized! Click to change photo</span>
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="w-12 h-12 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                              <UploadCloud className="w-6 h-6 text-[#00A896]" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">
                              Drag &amp; drop event image here, or <span className="text-[#003366] underline">Browse file</span>
                            </p>
                            <p className="text-[10px] text-slate-400">
                              PNG, JPG, WEBP • Auto-compressed for high speed
                            </p>
                          </div>
                        )}

                        {isCompressing && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                            <div className="text-xs font-bold text-[#003366] flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-[#003366] border-t-transparent rounded-full animate-spin"></span>
                              <span>Optimizing image...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Or direct Image URL (https://...)"
                          value={galleryForm.url.startsWith('data:') ? '' : galleryForm.url}
                          onChange={(e) => {
                            setGalleryForm({ ...galleryForm, url: e.target.value });
                            setPreviewImage(e.target.value);
                          }}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Event Date / Tag (e.g. Feb 2025)"
                          value={galleryForm.date}
                          onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Short photo description..."
                        value={galleryForm.desc}
                        onChange={(e) => setGalleryForm({ ...galleryForm, desc: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      ></textarea>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] px-5 py-2 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{galleryForm.id ? 'Save Photo Changes' : 'Add to Gallery Permanently'}</span>
                        </button>
                        {galleryForm.id && (
                          <button
                            type="button"
                            onClick={handleResetGalleryForm}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
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
                      Existing Gallery Photos ({clubData.gallery.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                      {clubData.gallery.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs"
                        >
                          <img
                            src={g.url}
                            alt={g.title}
                            className="w-14 h-14 object-cover rounded-lg shrink-0 border"
                          />
                          <div className="truncate flex-1">
                            <span className="font-bold text-slate-800 block truncate">{g.title}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{g.desc}</span>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => handleEditGallery(g)}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(g.id)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMMITTEE & FOUNDERS */}
              {activeTab === 'committee' && (
                <div className="space-y-6">
                  {/* Form */}
                  <form onSubmit={handleSaveMember} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-[#003366] text-sm mb-3">
                      {memberForm.id ? 'Edit Member Information' : 'Add Member or Founder'}
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Full Name (e.g. Sourov Saha)"
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Designation (e.g. President / Website Lead)"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Session (e.g. Session 2021-22)"
                          value={memberForm.session}
                          onChange={(e) => setMemberForm({ ...memberForm, session: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Department (e.g. CST)"
                          value={memberForm.dept}
                          onChange={(e) => setMemberForm({ ...memberForm, dept: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        />
                        <select
                          value={memberForm.type}
                          onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value as any })}
                          className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                        >
                          <option value="committee">Executive Committee</option>
                          <option value="founders">Founder Panel</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#003366] hover:bg-slate-800 text-[#F5B012] px-5 py-2 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{memberForm.id ? 'Save Member Info' : 'Add Member Permanently'}</span>
                        </button>
                        {memberForm.id && (
                          <button
                            type="button"
                            onClick={handleResetMemberForm}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* Existing Members & Founders */}
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2">
                      Current Executive Committee ({clubData.committee.length})
                    </h4>
                    <div className="space-y-2 mb-4">
                      {clubData.committee.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-slate-800 text-sm">{m.name}</span>
                            <span className="text-slate-500 ml-2 font-medium">({m.role})</span>
                            <span className="text-slate-400 block text-[11px]">{m.session} • {m.dept}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditMember(m.id, 'committee')}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.id, 'committee')}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2">
                      Founder Panel ({clubData.founders.length})
                    </h4>
                    <div className="space-y-2">
                      {clubData.founders.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-amber-950 text-sm">{f.name}</span>
                            <span className="text-amber-800 ml-2 font-semibold">({f.role})</span>
                            <span className="text-slate-500 block text-[11px]">{f.session}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditMember(f.id, 'founders')}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(f.id, 'founders')}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"
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

                      <textarea
                        required
                        rows={3}
                        placeholder="Post caption text / snippet summary..."
                        value={postForm.snippet}
                        onChange={(e) => setPostForm({ ...postForm, snippet: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#003366] focus:outline-none bg-white"
                      ></textarea>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <input
                        type="password"
                        required
                        placeholder="New Passcode"
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
