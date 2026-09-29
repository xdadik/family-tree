import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Tag,
  MessageCircle,
  X,
  Upload,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyPhoto } from '../../types/family';

export const PhotoGalleryModal: React.FC = () => {
  const {
    isPhotosGalleryOpen,
    setIsPhotosGalleryOpen,
    albums,
    photos,
    members,
    addPhoto,
    addAlbum,
    openMemberProfile,
  } = useFamily();

  const [activeTab, setActiveTab] = useState<'all' | 'albums'>('all');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<FamilyPhoto | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);

  // New photo form state
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoDate, setPhotoDate] = useState('2026-09-15');
  const [photoLocation, setPhotoLocation] = useState('Tashkent, Uzbekistan');
  const [photoAlbumId, setPhotoAlbumId] = useState(albums[0]?.id || '');
  const [taggedMembers, setTaggedMembers] = useState<string[]>([]);

  if (!isPhotosGalleryOpen) return null;

  const filteredPhotos = selectedAlbumId
    ? photos.filter((p) => p.albumId === selectedAlbumId)
    : photos;

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    addPhoto({
      albumId: photoAlbumId || albums[0]?.id || 'alb1',
      url:
        photoUrl.trim() ||
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80',
      title: photoTitle.trim(),
      description: photoDesc.trim() || undefined,
      date: photoDate,
      location: photoLocation.trim() || undefined,
      taggedMemberIds: taggedMembers,
      commentsCount: 0,
    });
    setPhotoUrl('');
    setPhotoTitle('');
    setPhotoDesc('');
    setIsAddPhotoOpen(false);
  };

  const toggleTagMember = (id: string) => {
    setTaggedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedAlbumId) setSelectedAlbumId(null);
                else setIsPhotosGalleryOpen(false);
              }}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {selectedAlbumId
                  ? albums.find((a) => a.id === selectedAlbumId)?.title
                  : 'Family Photos & Memories'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {photos.length} captured moments
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddPhotoOpen(true)}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-md shadow-emerald-600/30"
            aria-label="Add photo"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs: All Photos vs Albums */}
        {!selectedAlbumId && (
          <div className="px-5 pt-3 pb-1 border-b border-slate-800 flex gap-4 text-xs font-bold text-slate-400">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 transition-all relative ${
                activeTab === 'all' ? 'text-emerald-400 font-extrabold' : 'hover:text-slate-200'
              }`}
            >
              All Photos ({photos.length})
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`pb-2 transition-all relative ${
                activeTab === 'albums' ? 'text-emerald-400 font-extrabold' : 'hover:text-slate-200'
              }`}
            >
              Albums ({albums.length})
              {activeTab === 'albums' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          </div>
        )}

        {/* Content */}
        <main className="p-5 flex-1 space-y-4">
          {/* Albums view */}
          {activeTab === 'albums' && !selectedAlbumId && (
            <div className="grid grid-cols-2 gap-3">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                      {album.photoCount} photos
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white truncate">{album.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {album.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photos grid */}
          {(activeTab === 'all' || selectedAlbumId) && (
            <div className="grid grid-cols-2 gap-3">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setViewingPhoto(photo)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-xs font-bold text-white truncate">{photo.title}</span>
                    <span className="text-[10px] text-slate-300">{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Photo Detail Viewer Modal */}
        {viewingPhoto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="relative aspect-video w-full bg-black">
                <img
                  src={viewingPhoto.url}
                  alt={viewingPhoto.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setViewingPhoto(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3 overflow-y-auto">
                <div>
                  <h3 className="text-base font-bold text-white">{viewingPhoto.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {viewingPhoto.date}
                    </span>
                    {viewingPhoto.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        {viewingPhoto.location}
                      </span>
                    )}
                  </div>
                </div>

                {viewingPhoto.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {viewingPhoto.description}
                  </p>
                )}

                {/* People tagged */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    People in this photo ({viewingPhoto.taggedMemberIds.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {viewingPhoto.taggedMemberIds.map((mid) => {
                      const m = members.find((x) => x.id === mid);
                      if (!m) return null;
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setViewingPhoto(null);
                            setIsPhotosGalleryOpen(false);
                            openMemberProfile(m.id);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700 active:scale-95"
                        >
                          <img src={m.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-medium text-white">{m.fullName.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Sheet */}
        {isAddPhotoOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Add Family Photo</h3>
                <button
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Photo URL</label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... (or leave empty for default)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Title *</label>
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Garden Tea with Grandparents"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={photoLocation}
                    onChange={(e) => setPhotoLocation(e.target.value)}
                    placeholder="e.g. Tashkent, Chimgan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tag Relatives</label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {members.map((m) => {
                      const isTagged = taggedMembers.includes(m.id);
                      return (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => toggleTagMember(m.id)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                            isTagged
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {m.fullName.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
                >
                  Upload & Save Photo
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
