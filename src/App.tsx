import React from 'react';
import { FamilyProvider, useFamily } from './context/FamilyContext';
import { HomeScreen } from './components/home/HomeScreen';
import { FamilyTreeScreen } from './components/tree/FamilyTreeScreen';
import { SearchScreen } from './components/search/SearchScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { Navigation } from './components/common/Navigation';
import { MemberProfileModal } from './components/profile/MemberProfileModal';
import { AddMemberModal } from './components/forms/AddMemberModal';
import { FamilyDetailsModal } from './components/family/FamilyDetailsModal';
import { PhotoGalleryModal } from './components/photos/PhotoGalleryModal';
import { EventsModal } from './components/events/EventsModal';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { QuickActionSheet } from './components/common/QuickActionSheet';
import { LoginModal } from './components/auth/LoginModal';
import { LanguageModal } from './components/common/LanguageModal';
import { SupportModal } from './components/common/SupportModal';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { ToastStack } from './components/common/Toast';

const MainAppContent: React.FC = () => {
  const { activeTab, theme, currentUser, booting } = useFamily();

  if (booting) {
    return (
      <div className="min-h-screen bg-[#EAE6DF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-8 text-center">
          <img src="/logo.jpg" alt="Shajara" className="w-36 h-36 rounded-[2rem] object-cover shadow-2xl" />
          <div>
            <h1 className="font-display text-3xl text-[#33312F]">Shajara</h1>
            <p className="font-display italic text-sm text-[#6f6a61] mt-1">Hamma ildiz bitta daraxtdan o‘sib chiqqan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'} flex justify-center transition-colors`}>
      <div className={`relative flex min-h-screen w-full max-w-md flex-col overflow-x-hidden border-x shadow-2xl ${theme === 'dark' ? 'border-neutral-800/80 bg-neutral-950 text-white' : 'border-neutral-200 bg-white text-neutral-900'}`}>
        {!currentUser ? (
          <LoginModal />
        ) : (
          <>
            <div className="relative w-full flex-1">
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'tree' && <FamilyTreeScreen />}
              {activeTab === 'search' && <SearchScreen />}
              {activeTab === 'settings' && <SettingsScreen />}
            </div>
            <Navigation />
          </>
        )}

        <MemberProfileModal />
        <AddMemberModal />
        <FamilyDetailsModal />
        <PhotoGalleryModal />
        <EventsModal />
        <NotificationCenterModal />
        <QuickActionSheet />
        <LanguageModal />
        <SupportModal />
        <OnboardingScreen />
        {currentUser && <LoginModal />}
        <ToastStack />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FamilyProvider>
      <MainAppContent />
    </FamilyProvider>
  );
}
