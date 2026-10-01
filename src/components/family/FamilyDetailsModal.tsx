import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  ChevronRight,
  Plus,
  BookOpen,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const FamilyDetailsModal: React.FC = () => {
  const {
    isFamilyDetailsOpen,
    setIsFamilyDetailsOpen,
    members,
    timeline,
    photos,
    notes,
    openMemberProfile,
    setIsAddMemberOpen,
    setIsPhotosGalleryOpen,
    addNote,
    currentUser,
    isAdmin,
    t,
  } = useFamily();

  const [activeTab, setActiveTab] = useState<'members' | 'timeline' | 'photos' | 'notes'>('members');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  if (!isFamilyDetailsOpen) return null;

  const generationsCount = new Set(members.map((m) => m.generation || 1)).size || 1;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    addNote({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      authorName: currentUser?.name || 'Admin',
      category: 'story',
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto transition-colors">
        {/* Cover Header — offline gradient, no demo image */}
        <div className="relative h-40 w-full flex-shrink-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_20%,#71717a,transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/10 text-4xl font-black tracking-widest uppercase select-none">
              {t.appName}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

          {/* Top Nav */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <button
              onClick={() => setIsFamilyDetailsOpen(false)}
              className="min-w-[44px] min-h-[44px] p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md active:scale-95 flex items-center justify-center"
              aria-label={t.close}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white tracking-tight">{t.familyDetails}</h2>
            <div className="w-11" />
          </div>
        </div>

        {/* Family Header Card */}
        <div className="relative px-6 -mt-10">
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                {(t.appName || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{t.ourFamilyTree}</h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {members.length} {t.members} <span aria-hidden="true">·</span> {generationsCount} {t.generations}
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
                aria-label={t.addMember}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 px-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
            {(['members', 'timeline', 'photos', 'notes'] as const).map((tab) => {
              let label = t.overviewTab;
              if (tab === 'members') label = t.members;
              if (tab === 'timeline') label = t.timelineTab;
              if (tab === 'photos') label = t.photosTab;
              if (tab === 'notes') label = t.memories;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 capitalize transition-all relative ${
                    activeTab === tab
                      ? 'text-neutral-950 dark:text-white font-extrabold'
                      : 'hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                >
                  {label}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 space-y-4">
          {activeTab === 'members' && (
            <div className="space-y-2 animate-fade-in">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setIsFamilyDetailsOpen(false);
                    openMemberProfile(m.id);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer group active:scale-[0.99] shadow-sm text-left min-h-[60px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {m.avatarUrl ? (
                      <img
                        src={m.avatarUrl}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold flex items-center justify-center flex-shrink-0">
                        {(m.fullName || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {m.fullName}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {m.relationLabel} <span aria-hidden="true">·</span> {m.birthYear && m.birthYear > 0 ? m.birthYear : '19..'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-3 animate-fade-in">
              {timeline.length === 0 && (
                <p className="text-center text-xs text-neutral-500 py-6">{t.noUpcomingEvents}</p>
              )}
              {timeline.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-neutral-950 dark:text-white font-mono">{entry.dateStr}</span>
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px]">{entry.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{entry.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{entry.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-2.5">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => {
                      setIsFamilyDetailsOpen(false);
                      setIsPhotosGalleryOpen(true);
                    }}
                    className="relative rounded-2xl overflow-hidden aspect-square border border-neutral-200 dark:border-neutral-800 cursor-pointer shadow-sm group"
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex flex-col justify-end text-white">
                      <span className="text-[11px] font-bold truncate">{photo.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3 animate-fade-in">
              {isAdmin && !isAddingNote && (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addMemory}</span>
                </button>
              )}

              {isAddingNote && (
                <form onSubmit={handleSaveNote} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 space-y-2.5 animate-slide-up">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.addMemory}</h4>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Sarlavha..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                  />
                  <textarea
                    rows={2}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Xotira yoki hikoya matni..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="flex-1 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold shadow-sm"
                    >
                      {t.save}
                    </button>
                  </div>
                </form>
              )}

              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{note.authorName}</span>
                    <span>{note.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{note.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
