import React from 'react';
import {
  X,
  UserPlus,
  Image,
  Calendar,
  BookOpen,
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
    isAdmin,
    setIsLoginModalOpen,
    t,
  } = useFamily();

  if (!isQuickActionsOpen) return null;

  const actions = [
    {
      icon: UserPlus,
      title: t.addMember,
      desc: 'Shajaraga yangi oila a\'zosi yoki qarindoshni kiritish',
      action: () => {
        setIsQuickActionsOpen(false);
        if (!isAdmin) {
          setIsLoginModalOpen(true);
        } else {
          setIsAddMemberOpen(true);
        }
      },
    },
    {
      icon: Image,
      title: t.photos,
      desc: 'Oila arxiv rasmlari va qadrdon xotiralar',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsPhotosGalleryOpen(true);
      },
    },
    {
      icon: Calendar,
      title: t.events,
      desc: 'Tug\'ilgan kunlar, yillik sanalar va uchrashuvlar',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsEventsOpen(true);
      },
    },
    {
      icon: Info,
      title: t.familyDetails,
      desc: 'Sulola tarixi, umumiy eslatmalar va ma\'lumotlar',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsFamilyDetailsOpen(true);
      },
    },
    {
      icon: BookOpen,
      title: t.addMemory,
      desc: 'Katta bobolarimiz va oilamiz haqida xotiralar yozish',
      action: () => {
        setIsQuickActionsOpen(false);
        setIsFamilyDetailsOpen(true);
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up transition-colors" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.quickActions}</h3>
            <p className="text-[11px] text-neutral-500">{t.appName}</p>
          </div>
          <button
            onClick={() => setIsQuickActionsOpen(false)}
            className="min-w-[44px] min-h-[44px] p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-4 overflow-y-auto space-y-1.5 flex-1">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.action}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer active:scale-[0.99] transition-all text-left min-h-[56px]"
              >
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{act.title}</h4>
                  <p className="text-[11px] text-neutral-500 truncate">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
