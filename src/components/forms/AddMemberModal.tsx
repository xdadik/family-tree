import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  Calendar,
  MapPin,
  Heart,
  User,
  Users,
  Sparkles,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, Gender } from '../../types/family';

// Default avatar options for quick selection
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
];

export const AddMemberModal: React.FC = () => {
  const {
    isAddMemberOpen,
    setIsAddMemberOpen,
    editingMember,
    setEditingMember,
    members,
    addMember,
    updateMember,
    openMemberProfile,
  } = useFamily();

  const isEditing = !!editingMember;

  // Form states
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [gender, setGender] = useState<Gender>('female');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [isLiving, setIsLiving] = useState(true);
  const [deathYear, setDeathYear] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>([]);
  const [selectedSpouseId, setSelectedSpouseId] = useState<string>('');
  const [selectedChildrenIds, setSelectedChildrenIds] = useState<string[]>([]);
  const [generation, setGeneration] = useState(3);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Populate on edit
  useEffect(() => {
    if (editingMember) {
      setFullName(editingMember.fullName);
      setRelationship(editingMember.relationLabel);
      setGender(editingMember.gender);
      setBirthDate(editingMember.birthDate || '');
      setBirthPlace(editingMember.birthPlace || '');
      setIsLiving(editingMember.isLiving);
      setDeathYear(editingMember.deathYear ? String(editingMember.deathYear) : '');
      setPhone(editingMember.phone || '');
      setEmail(editingMember.email || '');
      setBio(editingMember.bio || '');
      setNotes(editingMember.notes || '');
      setAvatarUrl(editingMember.avatarUrl);
      setSelectedParentIds(editingMember.parentIds || []);
      setSelectedSpouseId(editingMember.spouseId || '');
      setSelectedChildrenIds(editingMember.childrenIds || []);
      setGeneration(editingMember.generation || 3);
    } else {
      // Defaults for new member
      setFullName('');
      setRelationship('Daughter');
      setGender('female');
      setBirthDate('2018-05-15');
      setBirthPlace('Tashkent, Uzbekistan');
      setIsLiving(true);
      setDeathYear('');
      setPhone('');
      setEmail('');
      setBio('');
      setNotes('Joyful presence in the family.');
      setAvatarUrl(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
      setSelectedParentIds(['m3', 'm4']); // default Rashid & Zarina
      setSelectedSpouseId('');
      setSelectedChildrenIds([]);
      setGeneration(3);
    }
  }, [editingMember, isAddMemberOpen]);

  if (!isAddMemberOpen) return null;

  const handleClose = () => {
    setIsAddMemberOpen(false);
    setEditingMember(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter a full name');
      return;
    }

    const birthYearNum = birthDate ? parseInt(birthDate.slice(0, 4), 10) || 2020 : 2020;

    if (isEditing && editingMember) {
      updateMember(editingMember.id, {
        fullName: fullName.trim(),
        relationLabel: relationship,
        gender,
        birthDate,
        birthYear: birthYearNum,
        birthPlace: birthPlace.trim(),
        isLiving,
        deathYear: !isLiving && deathYear ? parseInt(deathYear, 10) : undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        bio: bio.trim() || undefined,
        notes: notes.trim() || undefined,
        avatarUrl,
        parentIds: selectedParentIds,
        spouseId: selectedSpouseId || undefined,
        childrenIds: selectedChildrenIds,
        generation,
      });
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        handleClose();
      }, 900);
    } else {
      const created = addMember({
        fullName: fullName.trim(),
        relationLabel: relationship,
        gender,
        birthDate,
        birthYear: birthYearNum,
        birthPlace: birthPlace.trim() || 'Tashkent, Uzbekistan',
        isLiving,
        deathYear: !isLiving && deathYear ? parseInt(deathYear, 10) : undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        bio: bio.trim() || undefined,
        notes: notes.trim() || undefined,
        avatarUrl,
        parentIds: selectedParentIds,
        spouseId: selectedSpouseId || undefined,
        childrenIds: selectedChildrenIds,
        generation,
        verified: true,
      });

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        handleClose();
        openMemberProfile(created.id);
      }, 1000);
    }
  };

  // Toggle parent selection
  const toggleParent = (pId: string) => {
    setSelectedParentIds((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  // Toggle child selection
  const toggleChild = (cId: string) => {
    setSelectedChildrenIds((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 flex flex-col overflow-y-auto">
        {/* Top Header matching mockup */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <button
            onClick={handleClose}
            className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-tight">
            {isEditing ? 'Edit Family Member' : 'Add Family Member'}
          </h2>
          <div className="w-8" />
        </div>

        {/* Success Overlay Animation */}
        {showSuccessToast && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white">Family Tree Updated!</h3>
            <p className="text-xs text-slate-400 mt-1">
              {fullName} has been successfully {isEditing ? 'updated' : 'added'}.
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs font-semibold text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Large Circular "Add Photo" Avatar Picker matching mockup */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/60 p-1 flex items-center justify-center bg-slate-900 overflow-hidden shadow-lg shadow-emerald-500/10">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-semibold mt-1">Change</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Profile Photo</span>

            {/* Quick preset selector row */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto max-w-full pb-1">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform ${
                    avatarUrl === preset ? 'border-emerald-400 scale-110' : 'border-slate-700 opacity-60'
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Relationship & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                Relationship <span className="text-rose-400">*</span>
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white outline-none"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Cousin">Cousin</option>
                <option value="Nephew">Nephew</option>
                <option value="Niece">Niece</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white outline-none capitalize"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Date of Birth</label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="e.g. 12 March 2012 or 2012-03-12"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Place of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Place of Birth</label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="e.g. Tashkent, Uzbekistan"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Living / Deceased Toggle */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Living Relative</span>
              <span className="text-[11px] text-slate-400">Toggle off if in blessed memory</span>
            </div>
            <button
              type="button"
              onClick={() => setIsLiving(!isLiving)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isLiving ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isLiving ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {!isLiving && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-bold text-slate-300">Year of Passing</label>
              <input
                type="number"
                value={deathYear}
                onChange={(e) => setDeathYear(e.target.value)}
                placeholder="e.g. 2019"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          )}

          {/* Contact Details (optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998..."
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Relationship Connections */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Family Connections
            </h4>

            {/* Parents Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Who are their parents?</label>
              <div className="grid grid-cols-2 gap-2">
                {members
                  .filter((m) => m.id !== editingMember?.id && m.generation <= 2)
                  .map((m) => {
                    const isSelected = selectedParentIds.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleParent(m.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <img src={m.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate">{m.fullName.split(' ')[0]}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Spouse Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Who is their spouse?</label>
              <select
                value={selectedSpouseId}
                onChange={(e) => setSelectedSpouseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none"
              >
                <option value="">None / Unmarried</option>
                {members
                  .filter((m) => m.id !== editingMember?.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.relationLabel})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Personal Notes & Memories</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any memories, personality traits, or notes..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none resize-none"
            />
          </div>

          {/* Sticky Save Button matching mockup */}
          <div className="sticky bottom-0 left-0 right-0 pt-4 bg-slate-950">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
