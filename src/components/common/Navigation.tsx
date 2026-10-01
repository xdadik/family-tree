import React from 'react';
import { Home, Network, Search, Settings } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { ActiveTab } from '../../types/family';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useFamily();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'tree', label: t.tree, icon: Network },
    { id: 'search', label: t.search, icon: Search },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 px-4 pt-2 select-none transition-colors"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[52px] py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-neutral-950 dark:text-white font-bold'
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-[#33312F] shadow-sm'
                    : 'text-current'
                }`}
                style={isActive ? { background: 'linear-gradient(180deg,#d9bc7a,#C2A772)' } : undefined}
              >
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-105' : ''}`} />
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
