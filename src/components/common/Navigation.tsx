import React from 'react';
import { Home, Network, Search, Settings } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { ActiveTab } from '../../types/family';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useFamily();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tree', label: 'Tree', icon: Network },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-slate-900/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 select-none">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-emerald-400' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
