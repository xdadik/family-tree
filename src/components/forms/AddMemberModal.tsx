import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  Calendar,
  MapPin,
  Heart,
  User,
  Users,
  Phone,
  Mail,
  FileText,
  Upload,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, Gender } from '../../types/family';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
];

export const AddMemberModal: React.FC = () => {
  const {
    isAddMemberOpen,
    setIsAddMemberOpen,
    editingMember,
    setEditingMember,
    addMemberPreset,
    setAddMemberPreset,
    members,
    addMember,
    updateMember,
    openMemberProfile,
    isAdmin,
    t,
  } = useFamily();

  const isEditing = !!editingMember;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('O\'g\'il / Son');
  const [gender, setGender] = useState<Gender>('male');
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
  const [generation, setGeneration] = useState(2);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setGeneration(editingMember.generation || 2);
    } else if (addMemberPreset) {
      // Pre-configured from Tree / Profile button
      const target = members.find((m) => m.id === addMemberPreset.targetMemberId);
      setFullName('');
      setBirthDate('');
      setBirthPlace('Toshkent / Buxoro');
      setIsLiving(true);
      setDeathYear('');
      setPhone('');
      setEmail('');
      setBio('');
      setNotes('');
      setAvatarUrl(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);

      if (addMemberPreset.relationType === 'child' && target) {
        setRelationship(target.gender === 'male' ? "O'g'il / Son" : "Farzand / Child");
        setGender('male');
        const parents = [target.id];
        if (target.spouseId && !parents.includes(target.spouseId)) {
          parents.push(target.spouseId);
        }
        setSelectedParentIds(parents);
        setSelectedSpouseId('');
        setSelectedChildrenIds([]);
        setGeneration((target.generation || 1) + 1);
      } else if (addMemberPreset.relationType === 'parent' && target) {
        setRelationship('Ota / Father');
        setGender('male');
        setSelectedParentIds([]);
        setSelectedSpouseId('');
        setSelectedChildrenIds([target.id]);
        setGeneration(Math.max(1, (target.generation || 2) - 1));
      } else if (addMemberPreset.relationType === 'spouse' && target) {
        setRelationship("Turmush o'rtoq / Spouse");
        setGender(target.gender === 'male' ? 'female' : 'male');
        setSelectedParentIds([]);
        setSelectedSpouseId(target.id);
        setSelectedChildrenIds(target.childrenIds || []);
        setGeneration(target.generation || 1);
      }
    } else {
      setFullName('');
      setRelationship(members.length === 0 ? 'Bosh ota / Founder' : 'O\'g\'il / Son');
      setGender('male');
      setBirthDate('1985');
      setBirthPlace('Toshkent / Buxoro');
      setIsLiving(true);
      setDeathYear('');
      setPhone('');
      setEmail('');
      setBio('');
      setNotes('');
      setAvatarUrl(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
      setSelectedParentIds(members.length > 0 ? [members[0].id] : []);
      setSelectedSpouseId('');
      setSelectedChildrenIds([]);
      setGeneration(members.length > 0 ? (members[0].generation || 1) + 1 : 1);
    }
  }, [editingMember, addMemberPreset, isAddMemberOpen, members]);

  if (!isAddMemberOpen) return null;

  const handleClose = () => {
    setIsAddMemberOpen(false);
    setEditingMember(null);
    setAddMemberPreset(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('F.I.SH kiritilishi shart');
      return;
    }

    const birthYearNum = birthDate ? parseInt(birthDate.slice(0, 4), 10) || 1990 : 1990;

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
      }, 700);
    } else {
      const newMember = addMember({
        fullName: fullName.trim(),
        relationLabel: relationship,
        gender,
        birthDate: birthDate || `${birthYearNum}`,
        birthYear: birthYearNum,
        birthPlace: birthPlace.trim() || 'O\'zbekiston',
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

      if (newMember) {
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          handleClose();
          openMemberProfile(newMember.id);
        }, 700);
      }
    }
  };

  const toggleParent = (id: string) => {
    setSelectedParentIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-neutral-950 flex flex-col overflow-y-auto transition-colors">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {isEditing ? t.editProfile : t.addMember}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Overlay */}
        {showSuccessToast && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Sirojovlar Shajarasi Yangilandi</h3>
            <p className="text-xs text-neutral-500 mt-1">
              {fullName} muvaffaqiyatli saqlandi.
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="p-5 space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white">
              {errorMsg}
            </div>
          )}

          {/* Photo Picker with Device Upload */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full border-2 border-neutral-300 dark:border-neutral-700 p-0.5 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 overflow-hidden shadow-sm">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5">Yuklash</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 active:scale-95 transition-all"
            >
              <Upload className="w-3 h-3" />
              <span>Telefondan rasm yuklash</span>
            </button>

            <span className="text-[10px] text-neutral-400">yoki tayyor rasmlardan tanlang:</span>

            <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto max-w-full pb-1">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform ${
                    avatarUrl === preset
                      ? 'border-neutral-950 dark:border-white scale-110'
                      : 'border-neutral-300 dark:border-neutral-700 opacity-60'
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {t.fullName}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masalan: Sirojov Alisher"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-neutral-950 dark:focus:border-white text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none transition-all"
            />
          </div>

          {/* Relationship & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {t.relationship}
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
              >
                <option value="Bosh ota">Bosh ota / Основатель / Founder</option>
                <option value="Ota">Ota / Отец / Father</option>
                <option value="Ona">Ona / Мать / Mother</option>
                <option value="O'g'il">O&apos;g&apos;il / Сын / Son</option>
                <option value="Qiz">Qiz / Дочь / Daughter</option>
                <option value="Aka-uka">Aka / Uka / Брат / Brother</option>
                <option value="Opa-singil">Opa / Singil / Сестра / Sister</option>
                <option value="Turmush o'rtoq">Turmush o&apos;rtoq / Супруг(а) / Spouse</option>
                <option value="Bobo">Bobo / Дедушка / Grandfather</option>
                <option value="Buvi">Buvi / Бабушка / Grandmother</option>
                <option value="Amaki / Tog'a">Amaki / Tog&apos;a / Дядя / Uncle</option>
                <option value="Amma / Xola">Amma / Xola / Тетя / Aunt</option>
                <option value="Jiyan / Qarindosh">Jiyan / Непотизм / Nephew / Niece</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none capitalize"
              >
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>
          </div>

          {/* Generation & Birth Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Avlod (Generation: 1, 2, 3...)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={generation}
                onChange={(e) => setGeneration(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {t.birthDate}
              </label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="1980 yoki 12.05.1980"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Birth Place */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {t.birthPlace}
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="Toshkent, Buxoro, Samarqand..."
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
            />
          </div>

          {/* Living Relative Toggle */}
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">{t.living}</span>
              <span className="text-[11px] text-neutral-500">{t.deceased} bo&apos;lsa o&apos;chiring</span>
            </div>
            <button
              type="button"
              onClick={() => setIsLiving(!isLiving)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isLiving ? 'bg-neutral-950 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  isLiving
                    ? 'translate-x-5 bg-white dark:bg-neutral-950'
                    : 'translate-x-0 bg-white dark:bg-neutral-300'
                }`}
              />
            </button>
          </div>

          {!isLiving && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.deathYear}</label>
              <input
                type="number"
                value={deathYear}
                onChange={(e) => setDeathYear(e.target.value)}
                placeholder="Masalan: 2020"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none"
              />
            </div>
          )}

          {/* Parents Connections */}
          {members.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                {t.whoAreParents}
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {members
                  .filter((m) => m.id !== editingMember?.id)
                  .map((m) => {
                    const isSelected = selectedParentIds.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleParent(m.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                          isSelected
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white font-bold'
                            : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        <img src={m.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{m.fullName}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Spouse selection */}
          {members.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.whoIsSpouse}</label>
              <select
                value={selectedSpouseId}
                onChange={(e) => setSelectedSpouseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
              >
                <option value="">Tanlanmagan / Yo&apos;q</option>
                {members
                  .filter((m) => m.id !== editingMember?.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.relationLabel})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Contact Details (Optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.phone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 ..."
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.notes}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Qarindosh haqida esdaliklar va xotiralar..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 left-0 right-0 pt-3 bg-white dark:bg-neutral-950 transition-colors">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-sm shadow-sm active:scale-95 transition-all"
            >
              {t.saveMember}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
