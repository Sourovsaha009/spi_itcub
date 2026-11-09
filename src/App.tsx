import React, { useState, useEffect } from 'react';
import { ClubData, GalleryItem, ApplicationItem, CommitteeMember, FounderItem } from './types';
import { defaultClubData, loadClubData, persistClubData, getInitialSyncCache } from './services/storageService';
import { subscribeToFirestore } from './services/firebase';
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
import { MemberConnectModal } from './components/MemberConnectModal';

export default function App() {
  // Synchronous cache hydration on page refresh: zero flash of default content
  const [clubData, setClubData] = useState<ClubData>(getInitialSyncCache);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [selectedConnectMember, setSelectedConnectMember] = useState<CommitteeMember | FounderItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data on mount & listen to secret #admin1 hash
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

    // Check for #adminsrv1 URL hash trigger
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#adminsrv1' || hash === '#admin1' || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Listen to changes across tabs or windows
    const handleStorageUpdate = (e: any) => {
      if (e.detail) {
        setClubData(e.detail);
      }
    };
    window.addEventListener('spi_club_data_changed', handleStorageUpdate);

    // Live cloud listener: real-time updates when any admin updates data
    const unsubscribeCloud = subscribeToFirestore((cloudData) => {
      if (cloudData && Array.isArray(cloudData.notices)) {
        setClubData((prev) => {
          const currentTimestamp = prev?.updatedAt || 0;
          const cloudTimestamp = cloudData.updatedAt || 0;
          const cloudFounders = cloudData.founders?.length || 0;
          const prevFounders = prev?.founders?.length || 0;
          
          // Apply cloud snapshot if it is newer, equal, or has more/updated founder records
          if (cloudTimestamp >= currentTimestamp || cloudFounders > prevFounders) {
            return cloudData;
          }
          if (cloudData.gallery && prev?.gallery) {
            const cloudPhotos = cloudData.gallery.reduce((sum, g) => sum + (g.images?.length || (g.url ? 1 : 0)), 0);
            const prevPhotos = prev.gallery.reduce((sum, g) => sum + (g.images?.length || (g.url ? 1 : 0)), 0);
            if (cloudPhotos > prevPhotos) {
              return cloudData;
            }
          }
          return prev;
        });
      }
    });

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('spi_club_data_changed', handleStorageUpdate);
      unsubscribeCloud();
    };
  }, []);

  // Update data handler - updates React state AND permanently saves
  const handleUpdateData = async (newData: ClubData): Promise<boolean> => {
    const stampedData: ClubData = {
      ...newData,
      updatedAt: Date.now()
    };
    setClubData(stampedData);
    const success = await persistClubData(stampedData);
    return success;
  };

  // Close Admin Modal and clean up hash cleanly
  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const hash = window.location.hash.toLowerCase();
    if (hash === '#adminsrv1' || hash === '#admin1' || hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
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
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-black antialiased selection:bg-[#FFE600] selection:text-black font-sans">
      {/* Navigation (Public Admin button removed, accessed via #admin1) */}
      <Navbar
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
      />

      {/* Main Content Body */}
      <main className="flex-grow space-y-6 sm:space-y-10 pb-16">
        
        {/* Section 1: Courses & Tracks */}
        <CoursesSection
          courses={clubData.courses}
          onOpenJoin={() => setIsJoinOpen(true)}
        />

        {/* Section 2: Photo Gallery (Multi-photo albums with cover image support) */}
        <GallerySection
          gallery={clubData.gallery}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />

        {/* Section 3: Founder Panel */}
        <FoundersSection
          founders={clubData.founders}
          onSelectMember={(founder) => setSelectedConnectMember(founder)}
        />

        {/* Section 4: Current Executive Committee */}
        <CommitteeSection
          committee={clubData.committee}
          onSelectMember={(member) => setSelectedConnectMember(member)}
        />

        {/* Section 5: Official Facebook Updates Showcase */}
        <FacebookSection
          posts={clubData.fbPosts}
          facebookUrl={clubData.settings?.facebookUrl || "https://www.facebook.com/SPIitClub01"}
        />
      </main>

      {/* Footer (with discrete #admin1 link) */}
      <Footer
        facebookUrl={clubData.settings?.facebookUrl || "https://www.facebook.com/SPIitClub01"}
      />

      {/* Admin Panel Modal (Opened via #admin1) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        clubData={clubData}
        onUpdateData={handleUpdateData}
      />

      {/* Student Membership Registration Modal */}
      <MembershipModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSubmit={handleMembershipSubmit}
      />

      {/* Lightbox Multi-Photo Album Preview Modal */}
      <LightboxModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Member Direct Connect & Social Channels Modal */}
      <MemberConnectModal
        member={selectedConnectMember}
        onClose={() => setSelectedConnectMember(null)}
      />
    </div>
  );
}
