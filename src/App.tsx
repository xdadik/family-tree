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

const MainAppContent: React.FC = () => {
  const { activeTab, theme, currentUser } = useFamily();

  if (!currentUser) {
    return <LoginModal />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-900'} flex justify-center transition-colors`}>
      <div className={`relative flex min-h-screen w-full max-w-md flex-col overflow-x-hidden border-x shadow-2xl ${theme === 'dark' ? 'border-neutral-800/80 bg-neutral-950 text-white' : 'border-neutral-200 bg-white text-neutral-900'}`}>
        <div className="relative w-full flex-1">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'tree' && <FamilyTreeScreen />}
          {activeTab === 'search' && <SearchScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </div>

        <Navigation />
        <MemberProfileModal />
        <AddMemberModal />
        <FamilyDetailsModal />
        <PhotoGalleryModal />
        <EventsModal />
        <NotificationCenterModal />
        <QuickActionSheet />
        <LanguageModal />
        <SupportModal />
        <LoginModal />
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
