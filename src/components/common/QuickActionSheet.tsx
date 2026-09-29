import React from 'react';
import {
  X,
  UserPlus,
  Image,
  Calendar,
  BookOpen,
  MapPin,
  Download,
  Upload,
  Info,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const QuickActionSheet: React.FC = () => {
  const {
    isQuickActionsOpen,
    setIsQuickActionsOpen,
    setIsAddMemberOpen,
    setIsPhotosGalleryOpen,
    setIsEventsOpen,
    setIsFamilyDetailsOpen,
    exportDataJson,
    importDataJson,
  } = useFamily();

  if (!isQuickActionsOpen) return null;

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karimov_family_tree_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsQuickActionsOpen(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            const success = importDataJson(content);
            if (success) {
              alert('Family tree imported successfully!');
            } else {
              alert('Failed to parse family tree file.');
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setIsQuickActionsOpen(false);
  };

  const actions = [
    {
      icon: UserPlus,
      title: 'Add Family Member',
      desc: 'Introduce a new relative to the family tree',
      color: 'from-emerald-500 to-teal-500',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsAddMemberOpen(true);
      },
    },
    {
      icon: Image,
      title: 'Family Photos',
      desc: 'Browse albums, tag relatives and store memories',
      color: 'from-blue-500 to-indigo-500',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsPhotosGalleryOpen(true);
      },
    },
    {
      icon: Calendar,
      title: 'Family Events',
      desc: 'Birthdays, reunions, anniversaries and dates',
      color: 'from-amber-500 to-orange-500',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsEventsOpen(true);
      },
    },
    {
      icon: Info,
      title: 'Family Details & Heritage',
      desc: 'View members overview, shared notes and lore',
      color: 'from-purple-500 to-pink-500',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsFamilyDetailsOpen(true);
      },
    },
    {
      icon: BookOpen,
      title: 'Add Memory & Story',
      desc: 'Record a precious story or grandmother recipe',
      color: 'from-rose-500 to-red-500',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsFamilyDetailsOpen(true);
      },
    },
    {
      icon: MapPin,
      title: 'Add Family Homeland',
      desc: 'Pin ancestral birthplace or historical city',
      color: 'from-emerald-600 to-teal-700',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsFamilyDetailsOpen(true);
      },
    },
    {
      icon: Download,
      title: 'Export Family Tree',
      desc: 'Download offline JSON backup archive',
      color: 'from-cyan-500 to-blue-600',
      action: handleExport,
    },
    {
      icon: Upload,
      title: 'Import Family Data',
      desc: 'Restore previously exported family backup',
      color: 'from-slate-600 to-slate-800',
      action: handleImport,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-base font-bold text-white">Family Quick Actions</h3>
          </div>
          <button
            onClick={() => setIsQuickActionsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/80 active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action list */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[70vh]">
          {actions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 text-left transition-all active:scale-[0.99] group"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
