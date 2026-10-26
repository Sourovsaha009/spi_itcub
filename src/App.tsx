import React, { useState, useEffect } from 'react';
import { ClubData, GalleryItem, ApplicationItem } from './types';
import { defaultClubData, loadClubData, persistClubData, getInitialSyncCache } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NoticeBoard } from './components/NoticeBoard';
import { CoursesSection } from './components/CoursesSection';
import { GallerySection } from './components/GallerySection';
import { FoundersSection } from './components/FoundersSection';
import { CommitteeSection } from './components/CommitteeSection';
import { FacebookSection } from './components/FacebookSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { MembershipModal } from './components/MembershipModal';
import { LightboxModal } from './components/LightboxModal';

export default function App() {
  // Synchronous cache hydration on page refresh: zero flash of default content
  const [clubData, setClubData] = useState<ClubData>(getInitialSyncCache);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    async function initData() {
      try {
        const loaded = await loadClubData();
        if (loaded) {
          setClubData(loaded);
        }
      } catch (err) {
        console.warn('Failed to load dynamic club data, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();

    // Listen to changes across tabs or windows
    const handleStorageUpdate = (e: any) => {
      if (e.detail) {
        setClubData(e.detail);
      }
    };
    window.addEventListener('spi_club_data_changed', handleStorageUpdate);
    return () => {
      window.removeEventListener('spi_club_data_changed', handleStorageUpdate);
    };
  }, []);

  // Update data handler - updates React state AND permanently saves
  const handleUpdateData = async (newData: ClubData): Promise<boolean> => {
    setClubData(newData);
    const success = await persistClubData(newData);
    return success;
  };

  // Membership application submission handler
  const handleMembershipSubmit = async (app: Omit<ApplicationItem, 'id' | 'submittedAt'>): Promise<boolean> => {
    const newApplication: ApplicationItem = {
      ...app,
      id: 'app_' + Date.now(),
      submittedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedData: ClubData = {
      ...clubData,
      applications: [newApplication, ...(clubData.applications || [])]
    };

    const success = await handleUpdateData(updatedData);
    return success;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-slate-800 antialiased selection:bg-[#F5B012]/30 selection:text-[#003366]">
      {/* Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenJoin={() => setIsJoinOpen(true)}
      />

      {/* Hero Header */}
      <Hero
        onOpenJoin={() => setIsJoinOpen(true)}
        facebookUrl={clubData.settings?.facebookUrl || "https://www.facebook.com/SPIitClub01"}
      />

      {/* Notice Board Section */}
      <NoticeBoard
        notices={clubData.notices}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-grow space-y-6 sm:space-y-10 pb-16">
        
        {/* Section 1: Courses & Tracks */}
        <CoursesSection
          courses={clubData.courses}
          onOpenJoin={() => setIsJoinOpen(true)}
        />

        {/* Section 2: Photo Gallery */}
        <GallerySection
          gallery={clubData.gallery}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Section 3: Founder Panel */}
        <FoundersSection
          founders={clubData.founders}
        />

        {/* Section 4: Current Executive Committee */}
        <CommitteeSection
          committee={clubData.committee}
        />

        {/* Section 5: Official Facebook Updates Showcase */}
        <FacebookSection
          posts={clubData.fbPosts}
          facebookUrl={clubData.settings?.facebookUrl || "https://www.facebook.com/SPIitClub01"}
        />
      </main>

      {/* Footer */}
      <Footer
        facebookUrl={clubData.settings?.facebookUrl || "https://www.facebook.com/SPIitClub01"}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        clubData={clubData}
        onUpdateData={handleUpdateData}
      />

      {/* Student Membership Registration Modal */}
      <MembershipModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSubmit={handleMembershipSubmit}
      />

      {/* Lightbox Photo Preview Modal */}
      <LightboxModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
