import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Calendar,
  X,
  Upload,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyPhoto } from '../../types/family';
import { compressImageFile } from '../../utils/image';

export const PhotoGalleryModal: React.FC = () => {
  const {
    isPhotosGalleryOpen,
    setIsPhotosGalleryOpen,
    albums,
    photos,
    members,
    addPhoto,
    openMemberProfile,
    isAdmin,
    setIsLoginModalOpen,
    t,
  } = useFamily();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'albums'>('all');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<FamilyPhoto | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);

  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoDate, setPhotoDate] = useState('2026-09-29');
  const [photoLocation, setPhotoLocation] = useState('Toshkent, O\'zbekiston');
  const [photoAlbumId, setPhotoAlbumId] = useState(albums[0]?.id || '');
  const [taggedMembers, setTaggedMembers] = useState<string[]>([]);

  if (!isPhotosGalleryOpen) return null;

  const filteredPhotos = selectedAlbumId
    ? photos.filter((p) => p.albumId === selectedAlbumId)
    : photos;

  const handleOpenAddPhoto = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsAddPhotoOpen(true);
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1000, 0.72);
      setPhotoUrl(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;

    addPhoto({
      albumId: photoAlbumId || albums[0]?.id || 'alb1',
      url: photoUrl.trim(),
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
    setTaggedMembers([]);
    setIsAddPhotoOpen(false);
  };

  const toggleTagMember = (id: string) => {
    setTaggedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedAlbumId) setSelectedAlbumId(null);
                else setIsPhotosGalleryOpen(false);
              }}
              className="p-2 -ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                {selectedAlbumId
                  ? albums.find((a) => a.id === selectedAlbumId)?.title
                  : t.familyPhotos}
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                {photos.length} xotiralar
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddPhoto}
            className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 active:scale-95 shadow-sm flex items-center gap-1 text-xs font-bold"
            aria-label="Upload photo"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.uploadPhoto}</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedAlbumId(null);
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' && !selectedAlbumId
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {t.all} ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'albums'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Albomlar ({albums.length})
          </button>
        </div>

        {/* Photos Grid */}
        <main className="p-5 flex-1 space-y-4">
          {activeTab === 'albums' && !selectedAlbumId ? (
            albums.length === 0 ? (
              <p className="text-center text-xs text-neutral-500 py-10">{t.noPhotosYet}</p>
            ) : (
            <div className="grid grid-cols-2 gap-3">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 cursor-pointer shadow-sm active:scale-95 transition-all text-left min-h-[120px]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    {album.coverUrl ? (
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-neutral-400">{(album.title || '?').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {album.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      {album.photoCount} · {album.year || new Date().getFullYear()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            )
          ) : filteredPhotos.length === 0 ? (
            <p className="text-center text-xs text-neutral-500 py-10">{t.noPhotosYet}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredPhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setViewingPhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden aspect-square border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm active:scale-95 transition-all text-left"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                    <span className="text-[11px] font-bold truncate">{photo.title}</span>
                    <span className="text-[9px] opacity-80">{photo.date}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>

        {/* Photo Viewer Modal */}
        {viewingPhoto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
            <div className="relative max-w-sm w-full bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl space-y-3">
              <button
                onClick={() => setViewingPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white z-10 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-full aspect-[4/3] bg-black overflow-hidden">
                <img src={viewingPhoto.url} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{viewingPhoto.title}</h3>
                {viewingPhoto.description && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{viewingPhoto.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {viewingPhoto.date}
                  </span>
                  {viewingPhoto.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {viewingPhoto.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Modal */}
        {isAddPhotoOpen && (
          <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl p-5 max-w-md w-full space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.uploadPhoto}</h3>
                <button
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-3.5">
                {/* Upload or enter URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Rasm manbasi
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Telefondan yuklash</span>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDeviceUpload}
                  />

                  {photoUrl && (
                    <div className="relative h-32 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700">
                      <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="yoki rasm URL manzilini kiriting..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.photoTitle}
                  </label>
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="Masalan: Sirojovlar Oila Yig'ilishi"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Sana</label>
                    <input
                      type="date"
                      value={photoDate}
                      onChange={(e) => setPhotoDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Joylashuv</label>
                    <input
                      type="text"
                      value={photoLocation}
                      onChange={(e) => setPhotoLocation(e.target.value)}
                      placeholder="Toshkent..."
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {members.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Rasmda kimlar bor?
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                      {members.map((m) => {
                        const isSelected = taggedMembers.includes(m.id);
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => toggleTagMember(m.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {m.fullName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-xs shadow-sm active:scale-95 transition-all"
                >
                  {t.save}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
