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
      <div className="min-h-screen bg-[#faf6ee] dark:bg-[#1c1917] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#1c1917] dark:bg-[#faf6ee] flex items-center justify-center">
            <span className="font-display text-2xl text-[#faf6ee] dark:text-[#1c1917]">S</span>
          </div>
          <span className="font-mono2 text-[11px] tracking-[0.2em] text-[#9a3412] dark:text-[#e8b26a]">SIROJOVLAR</span>
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
