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

const MainAppContent: React.FC = () => {
  const { activeTab, theme } = useFamily();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex justify-center selection:bg-emerald-500 selection:text-white`}>
      {/* Mobile Device Container matching modern mobile-first standard */}
      <div className="w-full max-w-md min-h-screen relative flex flex-col bg-slate-950 border-x border-slate-800/80 shadow-2xl overflow-x-hidden">
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
