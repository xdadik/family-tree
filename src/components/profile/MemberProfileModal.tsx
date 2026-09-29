import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  CheckCircle2,
  Camera,
  User,
  Heart,
  Calendar,
  MapPin,
  FileText,
  Edit3,
  Phone,
  Mail,
  Briefcase,
  Share2,
  Trash2,
  Plus,
  Users,
  Image,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { getCalculatedRelationship } from '../../utils/relationshipEngine';

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
    activeProfileTab,
    setActiveProfileTab,
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
  const children = members.filter((m) => member.childrenIds.includes(m.id));
  const siblings = members.filter(
    (m) => m.id !== member.id && m.parentIds.some((pid) => member.parentIds.includes(pid))
  );

  // Tagged photos
  const memberPhotos = photos.filter((p) => p.taggedMemberIds.includes(member.id));
  // Member timeline milestones
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
      `Check out ${member.fullName}'s profile on FamilyTree: Our Family. Our Story.`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 flex flex-col overflow-y-auto">
        {/* Cover Photo Header */}
        <div className="relative h-48 w-full flex-shrink-0 bg-slate-900 overflow-hidden">
          <img
            src={
              member.coverUrl ||
              'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Cover"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-slate-950" />

          {/* Top Actions Nav */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => setSelectedMemberId(null)}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md active:scale-95 transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md active:scale-95 transition-all"
                aria-label="More Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-11 w-48 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1">
                  <button
                    onClick={() => {
                      handleEdit();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      handleShare();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-blue-400" />
                    Share Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Avatar & Header Info matching mockup */}
        <div className="relative px-6 -mt-16 flex flex-col items-center text-center">
          <div className="relative group">
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-950 shadow-2xl ring-2 ring-emerald-500/50"
            />
            {/* Camera badge */}
            <button
              onClick={handleEdit}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-800 border-2 border-slate-950 text-slate-200 hover:text-white shadow-md active:scale-95"
              aria-label="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-0.5">
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-xl font-extrabold text-white tracking-tight">{member.fullName}</h2>
              {member.verified && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs font-semibold text-emerald-400">
              {member.relationLabel} • {member.birthYear}–{member.deathYear ? member.deathYear : ''}
            </p>
          </div>

          {copiedShare && (
            <div className="mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30 animate-pulse">
              Profile link copied to clipboard!
            </div>
          )}
        </div>

        {/* Tabs Bar matching mockup: Overview | Details | Photos | Timeline */}
        <div className="mt-5 px-6 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            {(['overview', 'details', 'photos', 'timeline'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveProfileTab(tab)}
                className={`pb-3 capitalize transition-all relative ${
                  activeProfileTab === tab
                    ? 'text-emerald-400 font-extrabold'
                    : 'hover:text-slate-200'
                }`}
              >
                {tab}
                {activeProfileTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 space-y-4">
          {activeProfileTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              {/* Info Cards matching mockup */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Full Name</span>
                    <span className="text-sm font-bold text-white">{member.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                    <Heart className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Relationship</span>
                    <span className="text-sm font-bold text-white">{member.relationLabel}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Date of Birth</span>
                    <span className="text-sm font-bold text-white">
                      {member.birthDate || `${member.birthYear}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Place of Birth</span>
                    <span className="text-sm font-bold text-white">{member.birthPlace}</span>
                  </div>
                </div>

                {member.notes && (
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Notes</span>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">{member.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Family Connections Section */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Direct Relationships
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {/* Parents */}
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                      Parents ({parents.length})
                    </span>
                    {parents.length > 0 ? (
                      <div className="space-y-1.5">
                        {parents.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => openMemberProfile(p.id)}
                            className="flex items-center gap-2 cursor-pointer hover:text-emerald-300"
                          >
                            <img src={p.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-medium text-white truncate">{p.fullName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">None recorded</span>
                    )}
                  </div>

                  {/* Siblings */}
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block mb-1.5">
                      Siblings ({siblings.length})
                    </span>
                    {siblings.length > 0 ? (
                      <div className="space-y-1.5">
                        {siblings.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => openMemberProfile(s.id)}
                            className="flex items-center gap-2 cursor-pointer hover:text-teal-300"
                          >
                            <img src={s.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-medium text-white truncate">{s.fullName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">None recorded</span>
                    )}
                  </div>

                  {/* Spouse */}
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                      Spouse
                    </span>
                    {spouse ? (
                      <div
                        onClick={() => openMemberProfile(spouse.id)}
                        className="flex items-center gap-2 cursor-pointer hover:text-rose-300"
                      >
                        <img src={spouse.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-medium text-white truncate">{spouse.fullName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">None</span>
                    )}
                  </div>

                  {/* Children */}
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                      Children ({children.length})
                    </span>
                    {children.length > 0 ? (
                      <div className="space-y-1.5">
                        {children.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => openMemberProfile(c.id)}
                            className="flex items-center gap-2 cursor-pointer hover:text-amber-300"
                          >
                            <img src={c.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-medium text-white truncate">{c.fullName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'details' && (
            <div className="space-y-3 animate-fade-in">
              {member.bio && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Life Story & Biography
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{member.bio}</p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Personal Details
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Gender</span>
                    <span className="font-semibold text-white capitalize">{member.gender}</span>
                  </div>
                  {member.profession && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Profession</span>
                      <span className="font-semibold text-white">{member.profession}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Phone</span>
                      <span className="font-semibold text-white">{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Email</span>
                      <span className="font-semibold text-white">{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Status</span>
                    <span className="font-semibold text-emerald-400">
                      {member.isLiving ? 'Living' : `Deceased (${member.deathYear})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'photos' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tagged Photos ({memberPhotos.length})
                </span>
              </div>

              {memberPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {memberPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-800 bg-slate-900"
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
              ) : (
                <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 p-6">
                  <Image className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No tagged photos yet for {member.fullName}</p>
                </div>
              )}
            </div>
          )}

          {activeProfileTab === 'timeline' && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Personal Milestones
              </span>

              <div className="relative pl-5 border-l-2 border-emerald-500/40 space-y-4">
                {memberMilestones.length > 0 ? (
                  memberMilestones.map((m) => (
                    <div key={m.id} className="relative">
                      <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                      <span className="text-[11px] font-mono font-bold text-emerald-400">{m.dateStr}</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                    <span className="text-[11px] font-mono font-bold text-emerald-400">{member.birthDate}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{member.fullName} was born</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Born in {member.birthPlace}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom "Edit Profile" Button matching mockup */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800">
          <button
            onClick={handleEdit}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Delete {member.fullName}?</h3>
                <p className="text-xs text-slate-400">
                  This action removes this family member and their connections from the tree. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 shadow-md shadow-rose-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
