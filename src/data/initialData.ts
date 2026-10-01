import {
  FamilyMember,
  FamilyAlbum,
  FamilyPhoto,
  FamilyEvent,
  TimelineEntry,
  FamilyNote,
  FamilyActivity,
  FamilyNotification,
  CurrentUser,
} from '../types/family';

/**
 * Local-only owner credential for the first run.
 * Login: admin / admin
 */
export const ADMIN_USER: CurrentUser = {
  id: 'u_owner',
  username: 'admin',
  name: 'Dadajon X',
  email: 'admin@family.local',
  avatarUrl: '',
  role: 'owner',
  familyMemberId: 'dadajon',
};

interface MemberOpts {
  notes?: string;
  bio?: string;
  profession?: string;
  birthPlace?: string;
  currentResidence?: string;
  isLivingOverride?: boolean;
  phone?: string;
}

const createMember = (
  id: string,
  fullName: string,
  gender: FamilyMember['gender'],
  relationLabel: string,
  birthYear: number,
  deathYear?: number,
  opts: MemberOpts = {},
): FamilyMember => {
  const isLiving = opts.isLivingOverride ?? !deathYear;
  return {
    id,
    fullName,
    gender,
    relationLabel,
    birthDate: birthYear === 0 ? '19..' : `${birthYear}`,
    birthYear,
    deathDate: deathYear ? `${deathYear}` : undefined,
    deathYear,
    isLiving,
    birthPlace: opts.birthPlace ?? '',
    currentResidence: opts.currentResidence,
    avatarUrl: '',
    phone: opts.phone,
    bio: opts.bio,
    notes: opts.notes,
    profession: opts.profession,
    generation: 1,
    parentIds: [],
    childrenIds: [],
  };
};

const ORIGIN = 'Qizilkarvon, Nayman qishlog‘i, Sayitabot';

const familyMembers: FamilyMember[] = [
  // ── 1-avlod: Asoschilar ──
  createMember('tursun', 'Mirzayev Tursun', 'male', 'Ota · Tursunovlar asoschisi', 1910, 1984, {
    birthPlace: ORIGIN,
    profession: 'Rais (urush paytida rais bo‘lgan)',
    bio: 'Urush paytida rais bo‘lgan. 9 ta farzandi bor: 5 ta o‘g‘il va 4 ta qiz. 1 ta qizini o‘qitgan.',
    notes: 'Urush paytida rais bo‘lgan. 9 ta farzandning otasi (5 o‘g‘il, 4 qiz). Qizlaridan 1 tasini o‘qitgan.',
  }),
  createMember('izzat', 'Tog‘ayeva Izzat', 'female', 'Ona · Tursunovlar asoschisi', 1920, 1978, {
    birthPlace: ORIGIN,
    profession: 'Uy bekasi',
    bio: '9 farzandning onasi. Tursunovlar sulolasining asoschisi.',
    notes: '9 farzandning onasi (Tursunovlar asoschisi).',
  }),

  // ── 2-avlod: 9 farzand ──
  createMember('soadat', 'Tursunova Soadat', 'female', 'Eng katta opa', 1938, 1984, {
    birthPlace: ORIGIN,
    profession: 'Uy bekasi',
    bio: 'Eng katta opa. Uy bekasi. 6 farzandi bor: 3 o‘g‘il, 3 qiz.',
    notes: 'Eng katta opa. Uy bekasi. Farzandlari: Faxridin, Muzaffar, Juraqol, Muhabbat, Shaxri, Bodom.',
  }),
  createMember('rahmat', 'Tursunov Rahmat', 'male', 'Aka', 1939, undefined, {
    birthPlace: ORIGIN,
    profession: 'Toshkent politexnika institutida o‘qigan',
    bio: 'Toshkentda politexnika institutida o‘qigan. Sentyabr oyida vafot etgan.',
    notes: 'Toshkentda politennikada (politexnika) o‘qigan. Sentyabrda vafot etgan. 6 farzandi bor.',
    isLivingOverride: false,
  }),
  createMember('sadin', 'Tursunov Sadin', 'male', 'Aka', 1940, 2008, {
    birthPlace: ORIGIN,
    profession: 'Harbiy dengizchi · Qizil diplom sohibi',
    bio: '4 yil Kubada harbiy kemada xizmat qilgan. Ingliz tilida suhbat (beseda) topshirib universitetga kirgan, qizil diplom bilan bitirgan. Juda aqlli bo‘lgan. 11 ta farzandi bor.',
    notes: '4 yil Kubada xizmat qilgan (harbiy kemada). Ingliz tilida savol-javob (beseda) bilan imtihondan o‘tgan. Qizil diplom. 11 ta bola: 5 o‘g‘il, 6 qiz.',
  }),
  createMember('musallam', 'Tursunova Musallam', 'female', 'Opa', 0, 1998, {
    birthPlace: ORIGIN,
    profession: 'Uy bekasi',
    bio: 'Uy bekasi bo‘lgan. 5 ta farzandi bor.',
    notes: 'Tug‘ilgan yili taxminan 19.. Uy bekasi bo‘lgan. 5 farzandi bor: Rosil, Bog‘dagul, Rumiya, Dilnoza, O‘ral.',
  }),
  createMember('abdurashid', 'Mirzayev Abdurashid', 'male', 'Aka', 1943, undefined, {
    birthPlace: ORIGIN,
    profession: 'Matematika o‘qituvchisi (SamGI)',
    bio: 'Matematika o‘qituvchisi bo‘lgan, SamGIni tugatgan. 7 ta o‘g‘il va 1 ta qizi bor.',
    notes: 'Tug‘ilgan yili taxminan 1943. Matematik o‘qituvchi, SamGIni tugatgan. 8 farzand: 7 o‘g‘il, 1 qiz.',
  }),
  createMember('roziya', 'Mirzayeva Roziya', 'female', 'Opa', 1947, 2024, {
    birthPlace: ORIGIN,
    profession: 'Uy bekasi · Eng katta oila',
    bio: '8 ta farzandi: 4 o‘g‘il va 4 qiz. 20 ta nevara va 10 ta chevara. Eng katta oila.',
    notes: '8 farzand (4 o‘g‘il, 4 qiz). 20 ta nevara, 10 ta chevara. Eng katta oila.',
  }),
  createMember('abduhamid', 'Tursunov Abduhamid (Abduakim)', 'male', 'Aka', 1949, 2000, {
    birthPlace: ORIGIN,
    profession: 'Boshqaruvchi (zamnachalnik) · Chernobil',
    bio: 'SamGIda o‘qigan. Zamnachalnik (boshqaruvchi) bo‘lgan. Chernobilda bo‘lgan. 4 ta o‘g‘il va 2 ta qizi bor.',
    notes: 'SamGI/LIda o‘qigan. Zamnachalnik (boshqaruvchi). Chernobilda bo‘lgan. 6 farzand.',
  }),
  createMember('abdushukur', 'Tursunov Abdushukur', 'male', 'Aka', 1951, undefined, {
    birthPlace: ORIGIN,
    profession: '',
    bio: '3 ta qiz va 4 ta o‘g‘ilning otasi. Jami 7 farzand.',
    notes: '1951-yilda tug‘ilgan. 7 farzand: 4 o‘g‘il (Saloh, Shahob, Xusnidin, Xoliyor) va 3 qiz (Surayyo, Yulduz, Gulasal).',
  }),
  createMember('gulbahor', 'Tursunova Gulbahor', 'female', 'Singil (kenja)', 1957, undefined, {
    birthPlace: ORIGIN,
    profession: 'Maktabgacha ta’lim · Xatirchi zavvedishi',
    bio: 'Maktabgacha ta’lim yo‘nalishida o‘qigan. Xatirchida zavvedishi (boshqaruvchi) bo‘lgan. 2025-yil Hajga borgan. 2 ta qizi bor.',
    notes: 'Maktabgacha ta’lim maktabida o‘qigan. Xatirchida zavvedishi (boshqaruvchi). 2025-yil Hajga borgan. Qizlari: Shaxnoza, Gulnora.',
  }),

  // ── 3-avlod: Soadat (6) ──
  createMember('faxridin', 'Faxridin', 'male', 'Soadatning o‘g‘li', 0, undefined, { notes: 'Tursunova Soadatning o‘g‘li.' }),
  createMember('muzaffar', 'Muzaffar', 'male', 'Soadatning o‘g‘li', 0, undefined, { notes: 'Tursunova Soadatning o‘g‘li.' }),
  createMember('juraqol', 'Juraqol', 'male', 'Soadatning o‘g‘li', 0, undefined, { notes: 'Tursunova Soadatning o‘g‘li.' }),
  createMember('muhabbat', 'Muhabbat', 'female', 'Soadatning qizi', 0, undefined, { notes: 'Tursunova Soadatning qizi.' }),
  createMember('shaxri', 'Shaxri', 'female', 'Soadatning qizi', 0, undefined, { notes: 'Tursunova Soadatning qizi.' }),
  createMember('bodom', 'Bodom', 'female', 'Soadatning qizi', 0, undefined, { notes: 'Tursunova Soadatning qizi.' }),

  // ── 3-avlod: Rahmat (6) ──
  createMember('muqaddas', 'Muqaddas', 'female', 'Rahmatning qizi', 0, undefined, { notes: 'Tursunov Rahmatning qizi.' }),
  createMember('dilorom', 'Dilorom', 'female', 'Rahmatning qizi', 0, undefined, { notes: 'Tursunov Rahmatning qizi.' }),
  createMember('dilfuza', 'Dilfuza', 'female', 'Rahmatning qizi', 0, undefined, { notes: 'Tursunov Rahmatning qizi.' }),
  createMember('shuxrat', 'Shuxrat', 'male', 'Rahmatning o‘g‘li', 0, undefined, { notes: 'Tursunov Rahmatning o‘g‘li.' }),
  createMember('shavkat', 'Shavkat', 'male', 'Rahmatning o‘g‘li', 0, undefined, { notes: 'Tursunov Rahmatning o‘g‘li.' }),
  createMember('begzod', 'Begzod', 'male', 'Rahmatning o‘g‘li', 0, undefined, { notes: 'Tursunov Rahmatning o‘g‘li.' }),

  // ── 3-avlod: Sadin (11) ──
  createMember('gopur', 'Gopur', 'male', 'Sadin o‘g‘li', 0, undefined, { notes: 'Tursunov Sadin o‘g‘li.' }),
  createMember('rahim', 'Rahim', 'male', 'Sadin o‘g‘li', 0, undefined, { notes: 'Tursunov Sadin o‘g‘li.' }),
  createMember('dilshod', 'Dilshod', 'male', 'Sadin o‘g‘li', 0, undefined, { notes: 'Tursunov Sadin o‘g‘li.' }),
  createMember('alisher', 'Alisher', 'male', 'Sadin o‘g‘li', 0, undefined, { notes: 'Tursunov Sadin o‘g‘li.' }),
  createMember('sherzod', 'Sherzod', 'male', 'Sadin o‘g‘li', 0, undefined, { notes: 'Tursunov Sadin o‘g‘li.' }),
  createMember('rano', 'Rano', 'female', 'Sadin qizi', 0, undefined, { notes: 'Tursunov Sadin qizi.' }),
  createMember('sabohat', 'Sabohat', 'female', 'Sadin qizi', 0, undefined, { notes: 'Tursunov Sadin qizi.' }),
  createMember('malohat', 'Malohat', 'female', 'Sadin qizi', 0, undefined, { notes: 'Tursunov Sadin qizi.' }),
  createMember('malika', 'Malika', 'female', 'Sadin qizi', 0, undefined, { notes: 'Tursunov Sadin qizi.' }),
  createMember('marifat', 'Ma’rifat', 'female', 'Sadin qizi', 0, undefined, { notes: 'Tursunov Sadin qizi.' }),
  createMember('gulchihra', 'Gulchihra', 'female', 'Sadin qizi', 0, undefined, { notes: 'Tursunov Sadin qizi.' }),

  // ── 3-avlod: Musallam (5) ──
  createMember('rosil', 'Rosil', 'male', 'Musallamning o‘g‘li', 0, undefined, { notes: 'Tursunova Musallamning o‘g‘li.' }),
  createMember('bogdagul', 'Bog‘dagul', 'female', 'Musallamning qizi', 0, undefined, { notes: 'Tursunova Musallamning qizi.' }),
  createMember('rumiya', 'Rumiya', 'female', 'Musallamning qizi', 0, undefined, { notes: 'Tursunova Musallamning qizi.' }),
  createMember('dilnoza', 'Dilnoza', 'female', 'Musallamning qizi (Xolbekning turmush o‘rtog‘i)', 0, undefined, {
    notes: 'Tursunova Musallamning qizi. Roziyaning o‘g‘li Xolbek bilan oila qurgan.',
  }),
  createMember('oral', 'O‘ral', 'male', 'Musallamning o‘g‘li', 0, undefined, { notes: 'Tursunova Musallamning o‘g‘li.' }),

  // ── 3-avlod: Abdurashid (8) ──
  createMember('sohiba', 'Sohiba', 'female', 'Abdurashidning qizi', 0, undefined, { notes: 'Mirzayev Abdurashidning qizi (yagona qiz).' }),
  createMember('asqar', 'Asqar', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),
  createMember('ahror', 'Ahror', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),
  createMember('azam', 'Azam', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),
  createMember('mahsud', 'Mahsud', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),
  createMember('napas', 'Napas', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),
  createMember('elbek', 'Elbek', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),
  createMember('isom', 'Isom', 'male', 'Abdurashidning o‘g‘li', 0, undefined, { notes: 'Mirzayev Abdurashidning o‘g‘li.' }),

  // ── 3-avlod: Roziya (8) ──
  createMember('ilhom', 'Ilhom', 'male', 'Roziyaning o‘g‘li', 0, undefined, { notes: 'Mirzayeva Roziyaning o‘g‘li.' }),
  createMember('xolbek', 'Xolbek', 'male', 'Roziyaning o‘g‘li (Dilnozaning turmush o‘rtog‘i)', 0, undefined, {
    notes: 'Mirzayeva Roziyaning o‘g‘li. Musallamning qizi Dilnoza bilan oila qurgan.',
  }),
  createMember('zohid', 'Zohid', 'male', 'Roziyaning o‘g‘li', 0, undefined, { notes: 'Mirzayeva Roziyaning o‘g‘li.' }),
  createMember('shamsidin', 'Shamsidin', 'male', 'Roziyaning o‘g‘li', 0, undefined, { notes: 'Mirzayeva Roziyaning o‘g‘li.' }),
  createMember('mohira', 'Mohira', 'female', 'Roziyaning qizi', 0, undefined, { notes: 'Mirzayeva Roziyaning qizi.' }),
  createMember('maqsuda', 'Maqsuda', 'female', 'Roziyaning qizi', 0, undefined, { notes: 'Mirzayeva Roziyaning qizi.' }),
  createMember('shuhida', 'Shuhida', 'female', 'Roziyaning qizi', 0, undefined, { notes: 'Mirzayeva Roziyaning qizi.' }),
  createMember('sadoqat', 'Sadoqat', 'female', 'Roziyaning qizi', 0, undefined, { notes: 'Mirzayeva Roziyaning qizi.' }),

  // ── 3-avlod: Abduhamid (6) ──
  createMember('akmal', 'Akmal', 'male', 'Abduhamidning o‘g‘li', 0, undefined, { notes: 'Tursunov Abduhamidning o‘g‘li.' }),
  createMember('akbar', 'Akbar', 'male', 'Abduhamidning o‘g‘li', 0, undefined, { notes: 'Tursunov Abduhamidning o‘g‘li.' }),
  createMember('akrom', 'Akrom', 'male', 'Abduhamidning o‘g‘li', 0, undefined, { notes: 'Tursunov Abduhamidning o‘g‘li.' }),
  createMember('otabek', 'Otabek', 'male', 'Abduhamidning o‘g‘li', 0, undefined, { notes: 'Tursunov Abduhamidning o‘g‘li.' }),
  createMember('gulnoza', 'Gulnoza', 'female', 'Abduhamidning qizi', 0, undefined, { notes: 'Tursunov Abduhamidning qizi.' }),
  createMember('feruza', 'Feruza', 'female', 'Abduhamidning qizi', 0, undefined, { notes: 'Tursunov Abduhamidning qizi.' }),

  // ── 3-avlod: Abdushukur (7) ──
  createMember('saloh', 'Saloh', 'male', 'Abdushukurning o‘g‘li', 0, undefined, { notes: 'Tursunov Abdushukurning o‘g‘li.' }),
  createMember('shahob', 'Shahob', 'male', 'Abdushukurning o‘g‘li', 0, undefined, { notes: 'Tursunov Abdushukurning o‘g‘li.' }),
  createMember('xusnidin', 'Xusnidin', 'male', 'Abdushukurning o‘g‘li', 0, undefined, { notes: 'Tursunov Abdushukurning o‘g‘li.' }),
  createMember('xoliyor', 'Xoliyor', 'male', 'Abdushukurning o‘g‘li', 0, undefined, { notes: 'Tursunov Abdushukurning o‘g‘li.' }),
  createMember('surayyo', 'Surayyo', 'female', 'Abdushukurning qizi', 0, undefined, { notes: 'Tursunov Abdushukurning qizi.' }),
  createMember('yulduz', 'Yulduz', 'female', 'Abdushukurning qizi', 0, undefined, { notes: 'Tursunov Abdushukurning qizi.' }),
  createMember('gulasal', 'Gulasal', 'female', 'Abdushukurning qizi', 0, undefined, { notes: 'Tursunov Abdushukurning qizi.' }),

  // ── 3-avlod: Gulbahor (2) ──
  createMember('shaxnoza', 'Shaxnoza', 'female', 'Gulbahorning qizi', 0, undefined, { notes: 'Tursunova Gulbahorning qizi.' }),
  createMember('gulnora', 'Gulnora', 'female', 'Gulbahorning qizi', 0, undefined, { notes: 'Tursunova Gulbahorning qizi.' }),

  // ── 4-avlod: Shaxnozaning o‘g‘li — Big Admin ──
  createMember('dadajon', 'Dadajon X', 'male', 'Shaxnozaning o‘g‘li · Big Admin', 0, undefined, {
    bio: 'Shaxnozaning (Gulbahorning qizi) o‘g‘li. Sirojovlar shajarasining Big Admini.',
    notes: 'Tursunova Gulbahorning nabirasi (Shaxnozaning o‘g‘li). Oilaviy arxivning Big Admini.',
  }),
];

const connect = (parentId: string, childIds: string[]) => {
  const parent = familyMembers.find((member) => member.id === parentId);
  if (!parent) return;
  parent.childrenIds = childIds;
  childIds.forEach((childId) => {
    const child = familyMembers.find((member) => member.id === childId);
    if (child) {
      child.parentIds = Array.from(new Set([...child.parentIds, parentId]));
      child.generation = Math.max(child.generation, parent.generation + 1);
    }
  });
};

const linkSpouses = (aId: string, bId: string) => {
  const a = familyMembers.find((m) => m.id === aId);
  const b = familyMembers.find((m) => m.id === bId);
  if (!a || !b) return;
  a.spouseId = bId;
  b.spouseId = aId;
};

// Asoschilar nikohi
linkSpouses('tursun', 'izzat');
// Roziya o‘g‘li Xolbek + Musallam qizi Dilnoza (oilali)
linkSpouses('xolbek', 'dilnoza');

connect('tursun', ['soadat', 'rahmat', 'sadin', 'musallam', 'abdurashid', 'roziya', 'abduhamid', 'abdushukur', 'gulbahor']);
connect('izzat', ['soadat', 'rahmat', 'sadin', 'musallam', 'abdurashid', 'roziya', 'abduhamid', 'abdushukur', 'gulbahor']);
connect('soadat', ['faxridin', 'muzaffar', 'juraqol', 'muhabbat', 'shaxri', 'bodom']);
connect('rahmat', ['muqaddas', 'dilorom', 'dilfuza', 'shuxrat', 'shavkat', 'begzod']);
connect('sadin', ['gopur', 'rahim', 'dilshod', 'alisher', 'sherzod', 'rano', 'sabohat', 'malohat', 'malika', 'marifat', 'gulchihra']);
connect('musallam', ['rosil', 'bogdagul', 'rumiya', 'dilnoza', 'oral']);
connect('abdurashid', ['sohiba', 'asqar', 'ahror', 'azam', 'mahsud', 'napas', 'elbek', 'isom']);
connect('roziya', ['ilhom', 'xolbek', 'zohid', 'shamsidin', 'mohira', 'maqsuda', 'shuhida', 'sadoqat']);
connect('abduhamid', ['akmal', 'akbar', 'akrom', 'otabek', 'gulnoza', 'feruza']);
connect('abdushukur', ['saloh', 'shahob', 'xusnidin', 'xoliyor', 'surayyo', 'yulduz', 'gulasal']);
connect('gulbahor', ['shaxnoza', 'gulnora']);
connect('shaxnoza', ['dadajon']);

export const INITIAL_MEMBERS: FamilyMember[] = familyMembers;
export const INITIAL_ALBUMS: FamilyAlbum[] = [];
export const INITIAL_PHOTOS: FamilyPhoto[] = [];
export const INITIAL_EVENTS: FamilyEvent[] = [];
export const INITIAL_TIMELINE: TimelineEntry[] = [
  { id: 'tl_tursun_birth', year: 1910, dateStr: '1910', title: 'Mirzayev Tursun tavalludi', description: 'Qizilkarvon, Nayman qishlog‘i, Sayitabotda tavallud topgan. Urush paytida rais bo‘lgan.', memberId: 'tursun', category: 'birth' },
  { id: 'tl_izzat_birth', year: 1920, dateStr: '1920', title: 'Tog‘ayeva Izzat tavalludi', description: 'Tursunovlar sulolasi onasi.', memberId: 'izzat', category: 'birth' },
  { id: 'tl_soadat_birth', year: 1938, dateStr: '1938', title: 'Tursunova Soadat tavalludi', description: 'Eng katta opa. Uy bekasi.', memberId: 'soadat', category: 'birth' },
  { id: 'tl_sadin_birth', year: 1940, dateStr: '1940', title: 'Tursunov Sadin tavalludi', description: 'Kelajakda Kubada harbiy xizmat, qizil diplom sohibi.', memberId: 'sadin', category: 'birth' },
  { id: 'tl_roziya_birth', year: 1947, dateStr: '1947', title: 'Mirzayeva Roziya tavalludi', description: 'Eng katta oila sohibasi (8 farzand, 20 nevara, 10 chevara).', memberId: 'roziya', category: 'birth' },
  { id: 'tl_gulbahor_birth', year: 1957, dateStr: '1957', title: 'Tursunova Gulbahor tavalludi', description: 'Kenja singil. Xatirchi zavvedishi. 2025-yil Hajga borgan.', memberId: 'gulbahor', category: 'birth' },
  { id: 'tl_izzat_pass', year: 1978, dateStr: '1978', title: 'Tog‘ayeva Izzat vafoti', description: '9 farzandning onasi.', memberId: 'izzat', category: 'milestone' },
  { id: 'tl_tursun_pass', year: 1984, dateStr: '1984', title: 'Mirzayev Tursun vafoti', description: 'Tursunovlar asoschisi.', memberId: 'tursun', category: 'milestone' },
  { id: 'tl_sadin_pass', year: 2008, dateStr: '2008', title: 'Tursunov Sadin vafoti', description: 'Qizil diplom sohibi, juda aqlli inson.', memberId: 'sadin', category: 'milestone' },
  { id: 'tl_roziya_pass', year: 2024, dateStr: '2024', title: 'Mirzayeva Roziya vafoti', description: 'Eng katta oila onasi.', memberId: 'roziya', category: 'milestone' },
];
export const INITIAL_NOTES: FamilyNote[] = [
  {
    id: 'family-note-origin',
    title: 'Tursunovlar oilasi — kelib chiqishi',
    content: 'Asoschilar: Mirzayev Tursun (1910–1984) va Tog‘ayeva Izzat (1920–1978). 9 ta farzand: 5 o‘g‘il va 4 qiz. Qizilkarvon — Nayman qishlog‘i, Sayitabotda. Faqat 2 kishi Mirzayev va Mirzayeva familiyasida qolgan.',
    authorName: 'Big Admin',
    date: '2026',
    category: 'story',
  },
  {
    id: 'family-note-roziya',
    title: 'Eng katta oila — Roziya',
    content: 'Mirzayeva Roziya (1947–2024). 8 ta farzand (4 o‘g‘il, 4 qiz): Ilhom, Xolbek, Zohid, Shamsidin, Mohira, Maqsuda, Shuhida, Sadoqat. 20 ta nevara va 10 ta chevara.',
    authorName: 'Big Admin',
    date: '2026',
    category: 'story',
  },
  {
    id: 'family-note-sadin',
    title: 'Sadin — qizil diplom sohibi',
    content: 'Tursunov Sadin (1940–2008). 4 yil Kubada harbiy kemada xizmat qilgan. Ingliz tilida suhbat (beseda) topshirib universitetga kirgan, qizil diplom bilan bitirgan. Juda aqlli bo‘lgan. 11 ta farzandi bor.',
    authorName: 'Big Admin',
    date: '2026',
    category: 'story',
  },
  {
    id: 'family-note-marriage',
    title: 'Xolbek va Dilnoza oilasi',
    content: 'Roziyaning o‘g‘li Xolbek bilan Musallamning qizi Dilnoza oila qurgan. Shajarada turmush o‘rtoq sifatida bog‘langan.',
    authorName: 'Big Admin',
    date: '2026',
    category: 'story',
  },
];
export const INITIAL_ACTIVITIES: FamilyActivity[] = [];
export const INITIAL_NOTIFICATIONS: FamilyNotification[] = [];
