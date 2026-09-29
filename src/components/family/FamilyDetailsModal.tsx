import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Edit2,
  Users,
  Clock,
  Image,
  BookOpen,
  ChevronRight,
  Plus,
  Sparkles,
  MapPin,
  Heart,
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
  } = useFamily();

  const [activeTab, setActiveTab] = useState<'members' | 'timeline' | 'photos' | 'notes'>('members');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  if (!isFamilyDetailsOpen) return null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    addNote({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      authorName: 'Mur X',
      category: 'story',
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 flex flex-col overflow-y-auto">
        {/* Cover Photo Header */}
        <div className="relative h-44 w-full flex-shrink-0 bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"
            alt="Family Cover"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-950" />

          {/* Top Nav */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => setIsFamilyDetailsOpen(false)}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white tracking-tight">Family Details</h2>
            <button
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md active:scale-95"
              aria-label="More"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Family Header Card matching mockup */}
        <div className="relative px-6 -mt-12">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80"
                  alt="Family"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Karimov Family</h3>
                <p className="text-xs text-slate-400 font-medium">
                  {members.length} members • 3 generations
                </p>
              </div>
            </div>

            <button
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white active:scale-95"
              aria-label="Edit family"
            >
              <Edit2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Tabs: Members | Timeline | Photos | Notes matching mockup */}
        <div className="mt-4 px-6 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            {(['members', 'timeline', 'photos', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize transition-all relative ${
                  activeTab === tab ? 'text-emerald-400 font-extrabold' : 'hover:text-slate-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 space-y-3 pb-24">
          {activeTab === 'members' && (
            <div className="space-y-2 animate-fade-in">
              {members.map((m) => (
                <div
                  key={m.id}
                  onClick={() => openMemberProfile(m.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer active:scale-[0.99] transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={m.avatarUrl}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 truncate">
                        {m.fullName}
                      </h4>
                      <p className="text-xs text-emerald-400 font-medium">
                        {m.relationLabel} • {m.birthYear}–{m.deathYear || ''}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative pl-6 border-l-2 border-emerald-500/40 space-y-6">
                {timeline.map((entry) => (
                  <div key={entry.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-mono font-bold text-emerald-400">{entry.year}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{entry.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{entry.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Family Gallery ({photos.length})
                </span>
                <button
                  onClick={() => setIsPhotosGalleryOpen(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Open Full Gallery
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setIsPhotosGalleryOpen(true)}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 cursor-pointer group"
                  >
                    <img
                      src={p.url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                      <span className="text-xs font-bold text-white truncate">{p.title}</span>
                      <span className="text-[10px] text-slate-300">{p.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Heritage Lore & Recipes ({notes.length})
                </span>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Story
                </button>
              </div>

              {isAddingNote && (
                <form
                  onSubmit={handleSaveNote}
                  className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-fade-in"
                >
                  <h4 className="text-xs font-bold text-white">Record Family Heritage Note</h4>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Story or recipe title..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 text-xs text-white placeholder-slate-500 outline-none"
                    required
                  />
                  <textarea
                    rows={3}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write the family lore or traditional recipe details..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 text-xs text-white placeholder-slate-500 outline-none resize-none"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-md shadow-emerald-600/30"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{note.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">{note.content}</p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>By {note.authorName}</span>
                      <span>{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom "+ Add Member" Button matching mockup */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800">
          <button
            onClick={() => {
              setIsFamilyDetailsOpen(false);
              setIsAddMemberOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};
