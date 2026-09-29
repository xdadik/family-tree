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
 * Change it after entering the app by adding delegated admins in Settings.
 */
export const ADMIN_USER: CurrentUser = {
  id: 'u_owner',
  username: 'admin',
  name: 'Big Admin',
  email: 'admin@family.local',
  avatarUrl: '',
  role: 'owner',
};

const createMember = (
  id: string,
  fullName: string,
  gender: FamilyMember['gender'],
  relationLabel: string,
  birthYear: number,
  deathYear?: number,
  notes = '',
): FamilyMember => ({
  id,
  fullName,
  gender,
  relationLabel,
  birthDate: birthYear === 0 ? '19..' : `${birthYear}`,
  birthYear,
  deathDate: deathYear ? `${deathYear}` : undefined,
  deathYear,
  isLiving: !deathYear,
  birthPlace: '',
  avatarUrl: '',
  notes,
  generation: 1,
  parentIds: [],
  childrenIds: [],
});

const familyMembers: FamilyMember[] = [
  createMember('tursun', 'Mirzayev Tursun', 'male', 'Ota · Tursunovlar asoschisi', 1910, 1984, 'Urush paytida rais bo‘lgan. 9 ta farzandi bor: 5 ta o‘g‘il va 4 ta qiz. 1 ta qizini o‘qitgan.'),
  createMember('izzat', 'Tog‘ayeva Izzat', 'female', 'Ona · Tursunovlar asoschisi', 1920, 1978, '9 farzandning onasi. Tursunovlar oilasining asoschisi.'),

  createMember('soadat', 'Tursunova Soadat', 'female', 'Eng katta opa', 1938, 1984, 'Uy bekasi. 6 farzandi bor.'),
  createMember('rahmat', 'Tursunov Rahmat', 'male', 'Aka', 1939, undefined, 'Sentyabrda vafot etgan. Toshkentda politexnika institutida o‘qigan.'),
  createMember('sadin', 'Tursunov Sadin', 'male', 'Aka', 1940, 2008, '4 yil Kubada harbiy kemada xizmat qilgan. Universitetda ingliz tilida suhbatdan o‘tib, qizil diplom bilan bitirgan. Juda aqlli bo‘lgan. 11 ta farzandi bor.'),
  createMember('musallam', 'Tursunova Musallam', 'female', 'Opa', 0, 1998, 'Tug‘ilgan yili taxminan 19.. Uy bekasi bo‘lgan. 5 ta farzandi bor.'),
  createMember('abdurashid', 'Mirzayev Abdurashid', 'male', 'Aka', 1943, undefined, 'Tug‘ilgan yili taxminan 1943. Matematik o‘qituvchi bo‘lgan, SamGIni tugatgan. 7 ta o‘g‘il va 1 ta qizi bor.'),
  createMember('roziya', 'Mirzayeva Roziya', 'female', 'Opa', 1947, 2024, '8 ta farzandi: 4 ta o‘g‘il va 4 ta qiz. 20 ta nevara va 10 ta chevara. Eng katta oila.'),
  createMember('abduhamid', 'Tursunov Abduhamid (Abduakim)', 'male', 'Aka', 1949, 2000, 'SamGIda o‘qigan. Zamnachalnik, ya’ni boshqaruvchi bo‘lgan. Chernobilda bo‘lgan. 4 ta o‘g‘il va 2 ta qizi bor.'),
  createMember('abdushukur', 'Tursunov Abdushukur', 'male', 'Aka', 1951, undefined, '3 ta qiz va 4 ta o‘g‘ilning otasi.'),
  createMember('gulbahor', 'Tursunova Gulbahor', 'female', 'Singil', 1957, undefined, 'Maktabgacha ta’lim yo‘nalishida o‘qigan. Xatirchida zavvedishi, ya’ni boshqaruvchi bo‘lgan. 2025-yil Hajga borgan. 2 ta qizi bor.'),

  createMember('faxridin', 'Faxridin', 'male', 'Soadatning o‘g‘li', 0),
  createMember('muzaffar', 'Muzaffar', 'male', 'Soadatning o‘g‘li', 0),
  createMember('juraqol', 'Juraqol', 'male', 'Soadatning o‘g‘li', 0),
  createMember('muhabbat', 'Muhabbat', 'female', 'Soadatning qizi', 0),
  createMember('shaxri', 'Shaxri', 'female', 'Soadatning qizi', 0),
  createMember('bodom', 'Bodom', 'female', 'Soadatning qizi', 0),

  createMember('muqaddas', 'Muqaddas', 'female', 'Rahmatning qizi', 0),
  createMember('dilorom', 'Dilorom', 'female', 'Rahmatning qizi', 0),
  createMember('dilfuza', 'Dilfuza', 'female', 'Rahmatning qizi', 0),
  createMember('shuxrat', 'Shuxrat', 'male', 'Rahmatning o‘g‘li', 0),
  createMember('shavkat', 'Shavkat', 'male', 'Rahmatning o‘g‘li', 0),
  createMember('begzod', 'Begzod', 'male', 'Rahmatning o‘g‘li', 0),

  createMember('gopur', 'Gopur', 'male', 'Sading o‘g‘li', 0),
  createMember('rahim', 'Rahim', 'male', 'Sading o‘g‘li', 0),
  createMember('dilshod', 'Dilshod', 'male', 'Sading o‘g‘li', 0),
  createMember('alisher', 'Alisher', 'male', 'Sading o‘g‘li', 0),
  createMember('sherzod', 'Sherzod', 'male', 'Sading o‘g‘li', 0),
  createMember('rano', 'Rano', 'female', 'Sading qizi', 0),
  createMember('sabohat', 'Sabohat', 'female', 'Sading qizi', 0),
  createMember('malohat', 'Malohat', 'female', 'Sading qizi', 0),
  createMember('malika', 'Malika', 'female', 'Sading qizi', 0),
  createMember('marifat', 'Ma’rifat', 'female', 'Sading qizi', 0),
  createMember('gulchihra', 'Gulchihra', 'female', 'Sading qizi', 0),

  createMember('rosil', 'Rosil', 'male', 'Musallamning o‘g‘li', 0),
  createMember('bogdagul', 'Bog‘dagul', 'female', 'Musallamning qizi', 0),
  createMember('rumiya', 'Rumiya', 'female', 'Musallamning qizi', 0),
  createMember('dilnoza', 'Dilnoza', 'female', 'Musallamning qizi', 0),
  createMember('oral', 'O‘ral', 'male', 'Musallamning o‘g‘li', 0),

  createMember('sohiba', 'Sohiba', 'female', 'Abdurashidning qizi', 0),
  createMember('asqar', 'Asqar', 'male', 'Abdurashidning o‘g‘li', 0),
  createMember('ahror', 'Ahror', 'male', 'Abdurashidning o‘g‘li', 0),
  createMember('azam', 'Azam', 'male', 'Abdurashidning o‘g‘li', 0),
  createMember('mahsud', 'Mahsud', 'male', 'Abdurashidning o‘g‘li', 0),
  createMember('napas', 'Napas', 'male', 'Abdurashidning o‘g‘li', 0),
  createMember('elbek', 'Elbek', 'male', 'Abdurashidning o‘g‘li', 0),
  createMember('isom', 'Isom', 'male', 'Abdurashidning o‘g‘li', 0),

  createMember('ilhom', 'Ilhom', 'male', 'Roziyaning o‘g‘li', 0),
  createMember('xolbek', 'Xolbek', 'male', 'Roziyaning o‘g‘li', 0),
  createMember('zohid', 'Zohid', 'male', 'Roziyaning o‘g‘li', 0),
  createMember('shamsidin', 'Shamsidin', 'male', 'Roziyaning o‘g‘li', 0),
  createMember('mohira', 'Mohira', 'female', 'Roziyaning qizi', 0),
  createMember('maqsuda', 'Maqsuda', 'female', 'Roziyaning qizi', 0),
  createMember('shuhida', 'Shuhida', 'female', 'Roziyaning qizi', 0),
  createMember('sadoqat', 'Sadoqat', 'female', 'Roziyaning qizi', 0),

  createMember('akmal', 'Akmal', 'male', 'Abduhamidning o‘g‘li', 0),
  createMember('akbar', 'Akbar', 'male', 'Abduhamidning o‘g‘li', 0),
  createMember('akrom', 'Akrom', 'male', 'Abduhamidning o‘g‘li', 0),
  createMember('otabek', 'Otabek', 'male', 'Abduhamidning o‘g‘li', 0),
  createMember('gulnoza', 'Gulnoza', 'female', 'Abduhamidning qizi', 0),
  createMember('feruza', 'Feruza', 'female', 'Abduhamidning qizi', 0),

  createMember('saloh', 'Saloh', 'male', 'Abdushukurning o‘g‘li', 0),
  createMember('shahob', 'Shahob', 'male', 'Abdushukurning o‘g‘li', 0),
  createMember('xusnidin', 'Xusnidin', 'male', 'Abdushukurning o‘g‘li', 0),
  createMember('xoliyor', 'Xoliyor', 'male', 'Abdushukurning o‘g‘li', 0),
  createMember('surayyo', 'Surayyo', 'female', 'Abdushukurning qizi', 0),
  createMember('yulduz', 'Yulduz', 'female', 'Abdushukurning qizi', 0),
  createMember('gulasal', 'Gulasal', 'female', 'Abdushukurning qizi', 0),

  createMember('shaxnoza', 'Shaxnoza', 'female', 'Gulbahorning qizi', 0),
  createMember('gulnora', 'Gulnora', 'female', 'Gulbahorning qizi', 0),
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

familyMembers.find((member) => member.id === 'tursun')!.spouseId = 'izzat';
familyMembers.find((member) => member.id === 'izzat')!.spouseId = 'tursun';
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

export const INITIAL_MEMBERS: FamilyMember[] = familyMembers;
export const INITIAL_ALBUMS: FamilyAlbum[] = [];
export const INITIAL_PHOTOS: FamilyPhoto[] = [];
export const INITIAL_EVENTS: FamilyEvent[] = [];
export const INITIAL_TIMELINE: TimelineEntry[] = [];
export const INITIAL_NOTES: FamilyNote[] = [
  {
    id: 'family-note-1',
    title: 'Tursunovlar oilasi haqida',
    content: 'Faqat 2 kishi Mirzayev va Mirzayeva oilasida qolgan. Qizilkarvon — Nayman qishlog‘i, Sayitabotda. Roziyaning o‘g‘li Xolbek va Musallamning qizi Dilnoza alohida qayd etilgan.',
    authorName: 'Big Admin',
    date: '2026',
    category: 'story',
  },
];
export const INITIAL_ACTIVITIES: FamilyActivity[] = [];
export const INITIAL_NOTIFICATIONS: FamilyNotification[] = [];
