import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Camera,
  User,
  Heart,
  Calendar,
  MapPin,
  FileText,
  Edit3,
  Share2,
  Trash2,
  Image,
  Lock,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const MemberProfileModal: React.FC = () => {
  const {
    members,
    selectedMemberId,
    setSelectedMemberId,
    setEditingMember,
    setIsAddMemberOpen,
    deleteMember,
    photos,
    timeline,
    openMemberProfile,
    openAddMemberWithRelation,
    activeProfileTab,
    setActiveProfileTab,
    isAdmin,
    t,
  } = useFamily();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!selectedMemberId) return null;

  const member = members.find((m) => m.id === selectedMemberId);
  if (!member) return null;

  // Relatives lookup
  const parents = members.filter((m) => member.parentIds.includes(m.id));
  const spouse = members.find((m) => m.id === member.spouseId);
  const children = members.filter((m) => member.childrenIds && member.childrenIds.includes(m.id));
  const siblings = members.filter(
    (m) => m.id !== member.id && m.parentIds.some((pid) => member.parentIds.includes(pid))
  );

  const memberPhotos = photos.filter((p) => p.taggedMemberIds.includes(member.id));
  const memberMilestones = timeline.filter((t) => t.memberId === member.id);

  const handleEdit = () => {
    setEditingMember(member);
    setIsAddMemberOpen(true);
  };

  const handleDelete = () => {
    deleteMember(member.id);
    setShowDeleteConfirm(false);
    setSelectedMemberId(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Sirojovlar Shajarasi: ${member.fullName}`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto transition-colors">
        {/* Scenic Cover Banner */}
        <div className="relative h-44 w-full flex-shrink-0 bg-neutral-900 overflow-hidden">
          <img
            src={
              member.coverUrl ||
              'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Cover"
            className="w-full h-full object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

          {/* Top Actions Nav */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => setSelectedMemberId(null)}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md active:scale-95 transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md active:scale-95 transition-all"
                aria-label="More Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-11 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-1.5 shadow-xl z-50 space-y-1">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleEdit();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      {t.editProfile}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleShare();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {t.shareProfile}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.deleteMember}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Avatar & Header Info */}
        <div className="relative px-6 -mt-14 flex flex-col items-center text-center">
          <div className="relative group">
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-neutral-950 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-800"
            />
            {isAdmin && (
              <button
                onClick={handleEdit}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-md active:scale-95"
                aria-label="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="mt-3 space-y-0.5">
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{member.fullName}</h2>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {member.relationLabel} <span aria-hidden="true">·</span> {member.birthYear}–{member.deathYear ? member.deathYear : ''}
            </p>
          </div>

          {copiedShare && (
            <div className="mt-2 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-semibold rounded-full border border-neutral-200 dark:border-neutral-700 animate-pulse">
              Nusxalandi!
            </div>
          )}
        </div>

        {/* Tabs Bar: Overview | Details | Photos | Timeline */}
        <div className="mt-4 px-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
            {(['overview', 'details', 'photos', 'timeline'] as const).map((tab) => {
              const label =
                tab === 'overview'
                  ? t.overviewTab
                  : tab === 'details'
                  ? t.detailsTab
                  : tab === 'photos'
                  ? t.photosTab
                  : t.timelineTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveProfileTab(tab)}
                  className={`pb-3 capitalize transition-all relative ${
                    activeProfileTab === tab
                      ? 'text-neutral-950 dark:text-white font-extrabold'
                      : 'hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                >
                  {label}
                  {activeProfileTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 space-y-4">
          {activeProfileTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              {/* Info Cards */}
              <div className="space-y-2">
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block">{t.fullName}</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{member.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block">{t.relationship}</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{member.relationLabel}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block">{t.birthDate}</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {member.birthDate || `${member.birthYear}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block">{t.birthPlace}</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{member.birthPlace}</span>
                  </div>
                </div>

                {member.notes && (
                  <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-neutral-400 block">{t.notes}</span>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">{member.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Family Connections Section */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Qarindoshlik aloqalari
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {/* Parents */}
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                        Ota-onasi ({parents.length})
                      </span>
                      {parents.length > 0 ? (
                        <div className="space-y-1.5">
                          {parents.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => openMemberProfile(p.id)}
                              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <img src={p.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{p.fullName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Kiritilmagan</span>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => openAddMemberWithRelation(member, 'parent')}
                        className="mt-2 text-[10px] font-bold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-2 rounded-lg text-center"
                      >
                        + {t.addParent}
                      </button>
                    )}
                  </div>

                  {/* Siblings */}
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                      Aka-uka / Opa-singillar ({siblings.length})
                    </span>
                    {siblings.length > 0 ? (
                      <div className="space-y-1.5">
                        {siblings.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => openMemberProfile(s.id)}
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <img src={s.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{s.fullName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">Kiritilmagan</span>
                    )}
                  </div>

                  {/* Spouse */}
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                        Turmush o&apos;rtog&apos;i
                      </span>
                      {spouse ? (
                        <div
                          onClick={() => openMemberProfile(spouse.id)}
                          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img src={spouse.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{spouse.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Yo&apos;q</span>
                      )}
                    </div>
                    {isAdmin && !spouse && (
                      <button
                        onClick={() => openAddMemberWithRelation(member, 'spouse')}
                        className="mt-2 text-[10px] font-bold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-2 rounded-lg text-center"
                      >
                        + {t.addSpouse}
                      </button>
                    )}
                  </div>

                  {/* Children */}
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                        Farzandlari ({children.length})
                      </span>
                      {children.length > 0 ? (
                        <div className="space-y-1.5">
                          {children.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => openMemberProfile(c.id)}
                              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <img src={c.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                              <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{c.fullName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Yo&apos;q</span>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => openAddMemberWithRelation(member, 'child')}
                        className="mt-2 text-[10px] font-bold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-2 rounded-lg text-center"
                      >
                        + {t.addChild}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'details' && (
            <div className="space-y-3 animate-fade-in">
              {member.bio && (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Biografiya
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{member.bio}</p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                  {t.detailsTab}
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span>{t.gender}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white capitalize">{member.gender}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center justify-between text-neutral-500">
                      <span>{t.phone}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center justify-between text-neutral-500">
                      <span>{t.email}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-neutral-500">
                    <span>Holati</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {member.isLiving ? t.living : `${t.deceased} (${member.deathYear})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'photos' && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Rasmlar ({memberPhotos.length})
              </span>

              {memberPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {memberPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-2xl overflow-hidden aspect-square border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                        <span className="text-xs font-bold text-white truncate">{photo.title}</span>
                        <span className="text-[10px] text-neutral-300">{photo.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-6">
                  <Image className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">Rasmlar mavjud emas</p>
                </div>
              )}
            </div>
          )}

          {activeProfileTab === 'timeline' && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                {t.timelineTab}
              </span>

              <div className="relative pl-5 border-l border-neutral-300 dark:border-neutral-700 space-y-4">
                {memberMilestones.length > 0 ? (
                  memberMilestones.map((m) => (
                    <div key={m.id} className="relative">
                      <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-950 dark:bg-white ring-4 ring-white dark:ring-neutral-950" />
                      <span className="text-[11px] font-mono font-bold text-neutral-500">{m.dateStr}</span>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{m.title}</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{m.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-950 dark:bg-white ring-4 ring-white dark:ring-neutral-950" />
                    <span className="text-[11px] font-mono font-bold text-neutral-500">{member.birthDate}</span>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{member.fullName}</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{member.birthPlace}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom "Edit Profile" Button (Only for Admin) */}
        {isAdmin && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 transition-colors">
            <button
              onClick={handleEdit}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-sm shadow-sm active:scale-95 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.editProfile}</span>
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{t.confirmDelete}</h3>
                <p className="text-xs text-neutral-500">
                  {member.fullName} shajaradan butunlay o&apos;chiriladi.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
                >
                  {t.deleteMember}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
