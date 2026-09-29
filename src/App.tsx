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
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { LoginModal } from './components/auth/LoginModal';
import { LanguageModal } from './components/common/LanguageModal';
import { SupportModal } from './components/common/SupportModal';

const MainAppContent: React.FC = () => {
  const { activeTab, theme } = useFamily();

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'dark bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'
      } flex justify-center selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 transition-colors duration-200`}
    >
      {/* Mobile Device Container matching modern mobile-first standard */}
      <div
        className={`w-full max-w-md min-h-screen relative flex flex-col ${
          theme === 'dark'
            ? 'bg-neutral-950 border-neutral-800/80 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        } border-x shadow-2xl overflow-x-hidden transition-colors duration-200`}
      >
        {/* Main Tab Screens */}
        <div className="flex-1 w-full relative">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'tree' && <FamilyTreeScreen />}
          {activeTab === 'search' && <SearchScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </div>

        {/* Persistent Bottom Navigation (exactly 4 sections: Home, Tree, Search, Settings) */}
        <Navigation />

        {/* Dynamic Modals & Sheets */}
        <MemberProfileModal />
        <AddMemberModal />
        <FamilyDetailsModal />
        <PhotoGalleryModal />
        <EventsModal />
        <NotificationCenterModal />
        <QuickActionSheet />
        <OnboardingScreen />
        <LoginModal />
        <LanguageModal />
        <SupportModal />
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
