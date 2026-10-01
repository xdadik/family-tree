export type Language = 'uz-latn' | 'uz-cyrl' | 'en' | 'ru';

export interface Translations {
  appName: string;
  tagline: string;
  home: string;
  tree: string;
  search: string;
  settings: string;
  goodMorning: string;
  ourFamilyTree: string;
  members: string;
  generations: string;
  viewTree: string;
  addMember: string;
  photos: string;
  events: string;
  timeline: string;
  more: string;
  recentActivity: string;
  seeAll: string;
  quickActions: string;
  searchPlaceholder: string;
  all: string;
  places: string;
  memories: string;
  noResults: string;
  treeView: string;
  listView: string;
  orbit3DView: string;
  zoomIn: string;
  zoomOut: string;
  centerCanvas: string;
  myPosition: string;
  filter: string;
  allGenerations: string;
  directLine: string;
  elders: string;
  youth: string;
  addFirstMember: string;
  noMembersYet: string;
  noMembersDesc: string;
  addChild: string;
  addSpouse: string;
  addParent: string;
  editProfile: string;
  deleteMember: string;
  shareProfile: string;
  confirmDelete: string;
  cancel: string;
  save: string;
  saveMember: string;
  fullName: string;
  relationship: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  birthDate: string;
  birthPlace: string;
  living: string;
  deceased: string;
  deathYear: string;
  phone: string;
  email: string;
  notes: string;
  whoAreParents: string;
  whoIsSpouse: string;
  login: string;
  logout: string;
  username: string;
  password: string;
  signIn: string;
  role: string;
  admin: string;
  viewer: string;
  adminShort: string;
  viewerShort: string;
  adminBadge: string;
  viewerBadge: string;
  adminNotice: string;
  readOnlyNotice: string;
  switchRole: string;
  language: string;
  selectLanguage: string;
  contactDeveloper: string;
  telegramContact: string;
  phoneContact: string;
  theme: string;
  dark: string;
  light: string;
  familyManagement: string;
  privacy: string;
  backup: string;
  about: string;
  createEvent: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  uploadPhoto: string;
  photoTitle: string;
  overviewTab: string;
  detailsTab: string;
  photosTab: string;
  timelineTab: string;
  you: string;
  notifications: string;
  markAllRead: string;
  familyPhotos: string;
  familyEvents: string;
  familyDetails: string;
  clearAllAndStartClean: string;
  resetTree: string;
  addMemory: string;
  viewProfile: string;
  tapToExplore: string;
  rotate3DHint: string;
  autoRotate: string;
  manualRotate: string;
  supportTitle: string;
  supportSubtitle: string;
  openTelegram: string;
  callPhone: string;
  notLoggedIn: string;
  enterCredentials: string;
  incorrectPassword: string;
  connectionError: string;
  loggedOutNotice: string;
  nameRequired: string;
  invalidBirthYear: string;
  deathBeforeBirth: string;
  invalidPhone: string;
  invalidEmail: string;
  memberAdded: string;
  memberUpdated: string;
  memberDeleted: string;
  photoAdded: string;
  eventCreated: string;
  memoryAdded: string;
  upcomingEvent: string;
  noUpcomingEvents: string;
  resultsFound: string;
  clear: string;
  voiceListening: string;
  copied: string;
  copyLink: string;
  linkCopied: string;
  inviteTitle: string;
  inviteDesc: string;
  adminAdded: string;
  adminAddFailed: string;
  adminRemoved: string;
  skip: string;
  next: string;
  getStarted: string;
  demoHint: string;
  close: string;
  noPhotosYet: string;
  noEventsYet: string;
  noNotifications: string;
  dataExported: string;
  dataImported: string;
  importFailed: string;
  profile: string;
  relations: string;
  noParents: string;
  noSpouse: string;
  noChildren: string;
  noSiblings: string;
  call: string;
  write: string;
  ob1Title: string;
  ob1Desc: string;
  ob2Title: string;
  ob2Desc: string;
  ob3Title: string;
  ob3Desc: string;
  parents: string;
  children: string;
  spouseLabel: string;
  siblings: string;
  biography: string;
  statusLabel: string;
  albums: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  'uz-latn': {
    appName: 'Sirojovlar',
    tagline: 'Oila Tarixi — Bizning Ildizimiz',
    home: 'Asosiy',
    tree: 'Shajara',
    search: 'Qidiruv',
    settings: 'Sozlamalar',
    goodMorning: 'Assalomu alaykum, Oila',
    ourFamilyTree: 'Sirojovlar Shajarasi',
    members: 'a\'zo',
    generations: 'avlod',
    viewTree: 'Shajarani ko\'rish',
    addMember: 'A\'zo qo\'shish',
    photos: 'Rasmlar',
    events: 'Tadbirlar',
    timeline: 'Xronologiya',
    more: 'Yana',
    recentActivity: 'So\'nggi harakatlar',
    seeAll: 'Barchasi',
    quickActions: 'Tezkor amallar',
    searchPlaceholder: 'Ism, qarindoshlik yoki manzil bo\'yicha...',
    all: 'Barchasi',
    places: 'Joylar',
    memories: 'Xotiralar',
    noResults: 'Hech narsa topilmadi',
    treeView: 'Shajara',
    listView: 'Ro\'yxat',
    orbit3DView: '3D Fazoviy Ko\'rinish',
    zoomIn: 'Yaqinlashtirish',
    zoomOut: 'Uzoqlashtirish',
    centerCanvas: 'Markazga olish',
    myPosition: 'Mening o\'rnim',
    filter: 'Filtr',
    allGenerations: 'Barcha avlodlar',
    directLine: 'To\'g\'ridan-to\'g\'ri shajara',
    elders: 'Kattalar',
    youth: 'Yoshlar',
    addFirstMember: 'Birinchi a\'zoni kiritish',
    noMembersYet: 'Hozircha shajarada a\'zolar yo\'q',
    noMembersDesc: 'O\'z oilangizni shakllantirish uchun birinchi oila a\'zongizni qo\'shing.',
    addChild: 'Farzand qo\'shish',
    addSpouse: 'Turmush o\'rtoq qo\'shish',
    addParent: 'Ota-ona qo\'shish',
    editProfile: 'Tahrirlash',
    deleteMember: 'O\'chirish',
    shareProfile: 'Ulashish',
    confirmDelete: 'Haqiqatan ham o\'chirmoqchimisiz?',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    saveMember: 'A\'zoni saqlash',
    fullName: 'F.I.SH *',
    relationship: 'Qarindoshlik *',
    gender: 'Jinsi',
    male: 'Erkak',
    female: 'Ayol',
    other: 'Boshqa',
    birthDate: 'Tug\'ilgan sana',
    birthPlace: 'Tug\'ilgan joyi',
    living: 'Hayot',
    deceased: 'Vafot etgan',
    deathYear: 'Vafot etgan yili',
    phone: 'Telefon',
    email: 'Elektron pochta',
    notes: 'Qo\'shimcha xotira va izohlar',
    whoAreParents: 'Ota-onasi kim?',
    whoIsSpouse: 'Turmush o\'rtog\'i kim?',
    login: 'Tizimga kirish',
    logout: 'Chiqish',
    username: 'Login / Foydalanuvchi nomi',
    password: 'Parol',
    signIn: 'Kirish',
    role: 'Roli',
    admin: 'Administrator (To\'liq huquq)',
    viewer: 'Kuzatuvchi (Faqat ko\'rish)',
    adminShort: 'Admin',
    viewerShort: 'Kuzatuvchi',
    adminBadge: 'ADMIN',
    viewerBadge: 'KUZATUVCHI',
    adminNotice: 'Siz Administrator sifatida to\'liq o\'zgartirish huquqiga egasiz.',
    readOnlyNotice: 'Siz faqat ko\'rish huquqiga egasiz. Tahrirlash uchun Admin bo\'lib kiring.',
    switchRole: 'Rolni o\'zgartirish',
    language: 'Til',
    selectLanguage: 'Tilni tanlang',
    contactDeveloper: 'Yordam',
    telegramContact: "Telegram: ma'lumot kiritilmagan",
    phoneContact: "Telefon: ma'lumot kiritilmagan",
    theme: 'Mavzu',
    dark: 'Qora (Dark)',
    light: 'Oq (Light)',
    familyManagement: 'Oila a\'zolari',
    privacy: 'Maxfiylik va xavfsizlik',
    backup: 'Nusxalash va tiklash',
    about: 'Ilova haqida',
    createEvent: 'Tadbir yaratish',
    eventTitle: 'Tadbir nomi',
    eventDate: 'Sana',
    eventTime: 'Vaqt',
    eventLocation: 'Joylashuv',
    uploadPhoto: 'Rasm yuklash',
    photoTitle: 'Rasm sarlavhasi',
    overviewTab: 'Umumiy',
    detailsTab: 'Tafsilotlar',
    photosTab: 'Rasmlar',
    timelineTab: 'Tarix',
    you: 'SIZ',
    notifications: 'Bildirishnomalar',
    markAllRead: 'Barchasini o\'qilgan deb belgilash',
    familyPhotos: 'Sirojovlar Oila Rasmlari',
    familyEvents: 'Sirojovlar Oila Tadbirlari',
    familyDetails: 'Sirojovlar Oila Ma\'lumotlari',
    clearAllAndStartClean: 'Barchasini tozalash va noldan boshlash',
    resetTree: 'Shajarani tozalash',
    addMemory: 'Xotira qo\'shish',
    viewProfile: 'Profilni ko\'rish',
    tapToExplore: 'Aylanani surish orqali 3D fazoni o\'rganing',
    rotate3DHint: '3D fazoni aylantirish uchun bosing va suring',
    autoRotate: 'Avto aylanish',
    manualRotate: 'Qo\'lda aylantirish',
    supportTitle: 'Yordam va Aloqa',
    supportSubtitle: 'Administrator bilan bog\'lanish',
    openTelegram: 'Telegram orqali yozish',
    callPhone: 'Qo\'ng\'iroq qilish',
    notLoggedIn: 'Tizimga kirilmagan',
    enterCredentials: 'Login va parolingizni kiriting',
    incorrectPassword: 'Login yoki parol noto\'g\'ri',
    connectionError: 'Serverga ulanib bo‘lmadi. Internetni va manzilni tekshiring.',
    loggedOutNotice: 'Siz hisobdan muvaffaqiyatli chiqdingiz',
    nameRequired: 'F.I.SH kiritilishi shart',
    invalidBirthYear: 'Tug\'ilgan yil 1850 va hozirgi yil oralig\'ida bo\'lishi kerak',
    deathBeforeBirth: 'Vafot yili tug\'ilgan yildan keyin bo\'lishi kerak',
    invalidPhone: 'Telefon raqam noto\'g\'ri (7–15 ta raqam)',
    invalidEmail: 'Email manzil noto\'g\'ri',
    memberAdded: 'Yangi a\'zo shajaraga qo\'shildi',
    memberUpdated: 'Ma\'lumot yangilandi',
    memberDeleted: 'A\'zo o\'chirildi',
    photoAdded: 'Yangi rasm arxivga qo\'shildi',
    eventCreated: 'Yangi tadbir belgilandi',
    memoryAdded: 'Xotira saqlandi',
    upcomingEvent: 'Yaqinlashayotgan tadbir',
    noUpcomingEvents: 'Yaqin tadbirlar yo\'q',
    resultsFound: 'natija topildi',
    clear: 'Tozalash',
    voiceListening: 'Ovoz eshitilmoqda...',
    copied: 'Nusxalandi!',
    copyLink: 'Havolani nusxalash',
    linkCopied: 'Havola nusxalandi!',
    inviteTitle: 'Sirojovlar Taklifnomasi',
    inviteDesc: 'Qarindoshlarga ushbu havolani yuboring. Ular shajarani ko\'rishlari mumkin.',
    adminAdded: 'Yangi admin muvaffaqiyatli qo\'shildi!',
    adminAddFailed: 'Admin qo\'shilmadi. Login takrorlanmaganini va parol kamida 4 belgidan iboratligini tekshiring.',
    adminRemoved: 'Admin o\'chirildi',
    skip: 'O\'tkazib yuborish',
    next: 'Davom etish',
    getStarted: 'Boshlash',
    demoHint: 'Demo: login admin / parol admin',
    close: 'Yopish',
    noPhotosYet: 'Rasmlar mavjud emas',
    noEventsYet: 'Hozircha rejalashtirilgan tadbirlar yo\'q',
    noNotifications: 'Bildirishnomalar yo\'q',
    dataExported: 'Ma\'lumotlar nusxalandi',
    dataImported: 'Ma\'lumotlar tiklandi',
    importFailed: 'Fayl yaroqsiz. JSON formatni tekshiring.',
    profile: 'Profil',
    relations: 'Qarindoshlik aloqalari',
    noParents: 'Kiritilmagan',
    noSpouse: 'Yo\'q',
    noChildren: 'Yo\'q',
    noSiblings: 'Kiritilmagan',
    call: 'Qo\'ng\'iroq',
    write: 'Yozish',
    ob1Title: 'Sirojovlar Sulolasi',
    ob1Desc: 'Avlodlar o‘rtasidagi rishtalarni mustahkamlang — ajdodlar va yaqinlaringizni yagona shajarada birlashtiring.',
    ob2Title: 'Avlodlar Rishtasi',
    ob2Desc: 'Ota-ona, turmush o‘rtoq va farzandlarni qo‘shing — tizim shajarani o‘zi tuzib beradi.',
    ob3Title: 'Oila Xotiralari',
    ob3Desc: 'Arxiv fotosuratlar, tadbirlar va qimmatli xotiralarni bir joyda saqlang.',
    parents: 'Ota-ona',
    children: 'Farzandlar',
    spouseLabel: 'Turmush o‘rtog‘i',
    siblings: 'Aka-uka, opa-singillar',
    biography: 'Biografiya',
    statusLabel: 'Holati',
    albums: 'Albomlar',
  },
  'uz-cyrl': {
    appName: 'Сирожовлар',
    tagline: 'Оила тарихи — бизнинг илдизимиз.',
    home: 'Асосий',
    tree: 'Шажара',
    search: 'Қидирув',
    settings: 'Созламалар',
    goodMorning: 'Ассалому алайкум, Оила',
    ourFamilyTree: 'Сирожовлар Шажараси',
    members: 'аъзо',
    generations: 'авлод',
    viewTree: 'Шажарани кўриш',
    addMember: 'Аъзо қўшиш',
    photos: 'Расмлар',
    events: 'Тадбирлар',
    timeline: 'Хронология',
    more: 'Яна',
    recentActivity: 'Сўнгги ҳаракатлар',
    seeAll: 'Барчаси',
    quickActions: 'Тезкор амаллар',
    searchPlaceholder: 'Исм, қариндошлик ёки манзил бўйича...',
    all: 'Барчаси',
    places: 'Жойлар',
    memories: 'Хотиралар',
    noResults: 'Ҳеч нарса топилмади',
    treeView: 'Шажара',
    listView: 'Рўйхат',
    orbit3DView: '3D Фазовий Кўриниш',
    zoomIn: 'Яқинлаштириш',
    zoomOut: 'Узоқлаштириш',
    centerCanvas: 'Марказга олиш',
    myPosition: 'Менинг ўрним',
    filter: 'Филтр',
    allGenerations: 'Барча авлодлар',
    directLine: 'Тўғридан-тўғри шажара',
    elders: 'Катталар',
    youth: 'Ёшлар',
    addFirstMember: 'Биринчи аъзони киритиш',
    noMembersYet: 'Ҳозирча шажарада аъзолар йўқ',
    noMembersDesc: 'Ўз оилангизни шакллантириш учун биринчи оила аъзонгизни қўшинг.',
    addChild: 'Фарзанд қўшиш',
    addSpouse: 'Турмуш ўртоқ қўшиш',
    addParent: 'Ота-она қўшиш',
    editProfile: 'Таҳрирлаш',
    deleteMember: 'Ўчириш',
    shareProfile: 'Улашиш',
    confirmDelete: 'Ҳақиқатан ҳам ўчирмоқчимисиз?',
    cancel: 'Бекор қилиш',
    save: 'Сақлаш',
    saveMember: 'Аъзони сақлаш',
    fullName: 'Ф.И.Ш *',
    relationship: 'Қариндошлик *',
    gender: 'Жинси',
    male: 'Эркак',
    female: 'Аёл',
    other: 'Бошқа',
    birthDate: 'Туғилган сана',
    birthPlace: 'Туғилган жойи',
    living: 'Ҳаёт',
    deceased: 'Вафот этган',
    deathYear: 'Вафот этган йили',
    phone: 'Телефон',
    email: 'Электрон почта',
    notes: 'Қўшимча хотира ва изоҳлар',
    whoAreParents: 'Ота-онаси ким?',
    whoIsSpouse: 'Турмуш ўртоғи ким?',
    login: 'Тизимга кириш',
    logout: 'Чиқиш',
    username: 'Логин / Фойдаланувчи номи',
    password: 'Парол',
    signIn: 'Кириш',
    role: 'Роли',
    admin: 'Администратор (Тўлиқ ҳуқуқ)',
    viewer: 'Кузатувчи (Фақат кўриш)',
    adminShort: 'Админ',
    viewerShort: 'Кузатувчи',
    adminBadge: 'АДМИН',
    viewerBadge: 'КУЗАТУВЧИ',
    adminNotice: 'Сиз Администратор сифатида тўлиқ ўзгартириш ҳуқуқига эгасиз.',
    readOnlyNotice: 'Сиз фақат кўриш ҳуқуқига эгасиз. Таҳрирлаш учун Админ бўлиб киринг.',
    switchRole: 'Ролни ўзгартириш',
    language: 'Тил',
    selectLanguage: 'Тилни танланг',
    contactDeveloper: 'Ёрдам',
    telegramContact: 'Телеграм: не указан',
    phoneContact: 'Телефон: не указан',
    theme: 'Мавзу',
    dark: 'Қора (Dark)',
    light: 'Оқ (Light)',
    familyManagement: 'Оила аъзолари',
    privacy: 'Махфийлик ва хавфсизлик',
    backup: 'Нусхалаш ва тиклаш',
    about: 'Илова ҳақида',
    createEvent: 'Тадбир яратиш',
    eventTitle: 'Тадбир номи',
    eventDate: 'Сана',
    eventTime: 'Вақт',
    eventLocation: 'Жойлашув',
    uploadPhoto: 'Расм юклаш',
    photoTitle: 'Расм сарлавҳаси',
    overviewTab: 'Умумий',
    detailsTab: 'Тафсилотлар',
    photosTab: 'Расмлар',
    timelineTab: 'Тарих',
    you: 'СИЗ',
    notifications: 'Билдиришномалар',
    markAllRead: 'Барчасини ўқилган деб белгилаш',
    familyPhotos: 'Сирожовлар Оила Расмлари',
    familyEvents: 'Сирожовлар Оила Тадбирлари',
    familyDetails: 'Сирожовлар Оила Маълумотлари',
    clearAllAndStartClean: 'Барчасини тозалаш ва нолдан бошлаш',
    resetTree: 'Шажарани тозалаш',
    addMemory: 'Хотира қўшиш',
    viewProfile: 'Профилни кўриш',
    tapToExplore: 'Айланани суриш орқали 3D фазони ўрганинг',
    rotate3DHint: '3D фазони айлантириш учун босинг ва суринг',
    autoRotate: 'Авто айланиш',
    manualRotate: 'Қўлда айлантириш',
    supportTitle: 'Ёрдам ва Алоқа',
    supportSubtitle: 'Администратор билан боғланиш',
    openTelegram: 'Телеграм орқали ёзиш',
    callPhone: 'Қўнғироқ қилиш',
    notLoggedIn: 'Тизимга кирилмаган',
    enterCredentials: 'Логин ва паролингизни киритинг',
    incorrectPassword: 'Логин ёки парол нотўғри',
    connectionError: 'Серверга уланиб бўлмади. Интернетни текширинг.',
    loggedOutNotice: 'Сиз ҳисобдан муваффақиятли чиқдингиз',
    nameRequired: 'Ф.И.Ш киритилиши шарт',
    invalidBirthYear: 'Туғилган йил 1850 ва ҳозирги йил оралиғида бўлиши керак',
    deathBeforeBirth: 'Вафот йили туғилган йилдан кейин бўлиши керак',
    invalidPhone: 'Телефон рақам нотўғри (7–15 та рақам)',
    invalidEmail: 'Email манзил нотўғри',
    memberAdded: 'Янги аъзо шажарага қўшилди',
    memberUpdated: 'Маълумот янгиланди',
    memberDeleted: 'Аъзо ўчирилди',
    photoAdded: 'Янги расм архивга қўшилди',
    eventCreated: 'Янги тадбир белгиланди',
    memoryAdded: 'Хотира сақланди',
    upcomingEvent: 'Яқинлашаётган тадбир',
    noUpcomingEvents: 'Яқин тадбирлар йўқ',
    resultsFound: 'натижа топилди',
    clear: 'Тозалаш',
    voiceListening: 'Овоз эшитилмоқда...',
    copied: 'Нусхаланди!',
    copyLink: 'Ҳаволани нусхалаш',
    linkCopied: 'Ҳавола нусхаланди!',
    inviteTitle: 'Сирожовлар Таклифномаси',
    inviteDesc: 'Қариндошларга ушбу ҳаволани юборинг.',
    adminAdded: 'Янги админ муваффақиятли қўшилди!',
    adminAddFailed: 'Админ қўшилмади. Логин ва паролни текширинг.',
    adminRemoved: 'Админ ўчирилди',
    skip: 'Ўтказиб юбориш',
    next: 'Давом этиш',
    getStarted: 'Бошлаш',
    demoHint: 'Демо: логин admin / парол admin',
    close: 'Ёпиш',
    noPhotosYet: 'Расмлар мавжуд эмас',
    noEventsYet: 'Ҳозирча режалаштирилган тадбирлар йўқ',
    noNotifications: 'Билдиришномалар йўқ',
    dataExported: 'Маълумотлар нусхаланди',
    dataImported: 'Маълумотлар тикланди',
    importFailed: 'Файл яроқсиз. JSON форматни текширинг.',
    profile: 'Профиль',
    relations: 'Қариндошлик алоқалари',
    noParents: 'Киритилмаган',
    noSpouse: 'Йўқ',
    noChildren: 'Йўқ',
    noSiblings: 'Киритилмаган',
    call: 'Қўнғироқ',
    write: 'Ёзиш',
    ob1Title: 'Сирожовлар Сулоласи',
    ob1Desc: 'Авлодлар ўртасидаги ришталарни мустаҳкамланг — аждодлар ва яқинларингизни ягона шажарада бирлаштиринг.',
    ob2Title: 'Авлодлар Риштаси',
    ob2Desc: 'Ота-она, турмуш ўртоқ ва фарзандларни қўшинг — тизим шажарани ўзи тузиб беради.',
    ob3Title: 'Оила Хотиралари',
    ob3Desc: 'Архив фотосуратлар, тадбирлар ва қимматли хотираларни бир жойда сақланг.',
    parents: 'Ота-она',
    children: 'Фарзандлар',
    spouseLabel: 'Турмуш ўртоғи',
    siblings: 'Ака-ука, опа-сингиллар',
    biography: 'Биография',
    statusLabel: 'Ҳолати',
    albums: 'Альбомлар',
  },
  en: {
    appName: 'Sirojovs',
    tagline: 'Family History — Our Roots.',
    home: 'Home',
    tree: 'Tree',
    search: 'Search',
    settings: 'Settings',
    goodMorning: 'Good morning, Family',
    ourFamilyTree: 'Sirojov Family Tree',
    members: 'members',
    generations: 'generations',
    viewTree: 'View Tree',
    addMember: 'Add Member',
    photos: 'Photos',
    events: 'Events',
    timeline: 'Timeline',
    more: 'More',
    recentActivity: 'Recent Activity',
    seeAll: 'See all',
    quickActions: 'Quick Actions',
    searchPlaceholder: 'Search by name, relation, or place...',
    all: 'All',
    places: 'Places',
    memories: 'Memories',
    noResults: 'No results found',
    treeView: 'Tree View',
    listView: 'List View',
    orbit3DView: '3D Orbit View',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    centerCanvas: 'Center',
    myPosition: 'My Position',
    filter: 'Filter',
    allGenerations: 'All Generations',
    directLine: 'Direct Ancestry',
    elders: 'Elders',
    youth: 'Youth',
    addFirstMember: 'Add First Member',
    noMembersYet: 'No members in tree yet',
    noMembersDesc: 'Start building your dynasty by adding your first family member.',
    addChild: 'Add Child',
    addSpouse: 'Add Spouse',
    addParent: 'Add Parent',
    editProfile: 'Edit Profile',
    deleteMember: 'Delete Member',
    shareProfile: 'Share Profile',
    confirmDelete: 'Are you sure you want to delete this member?',
    cancel: 'Cancel',
    save: 'Save',
    saveMember: 'Save Member',
    fullName: 'Full Name *',
    relationship: 'Relationship *',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    birthDate: 'Birth Date',
    birthPlace: 'Birth Place',
    living: 'Living',
    deceased: 'Deceased',
    deathYear: 'Year of Passing',
    phone: 'Phone',
    email: 'Email',
    notes: 'Personal Notes & Lore',
    whoAreParents: 'Who are their parents?',
    whoIsSpouse: 'Who is their spouse?',
    login: 'Log In',
    logout: 'Log Out',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    role: 'Role',
    admin: 'Administrator (Full Access)',
    viewer: 'Viewer (Read-Only)',
    adminShort: 'Admin',
    viewerShort: 'Viewer',
    adminBadge: 'ADMIN',
    viewerBadge: 'VIEWER',
    adminNotice: 'As Administrator, you have full permissions to add, edit, and delete.',
    readOnlyNotice: 'You have read-only access. Sign in as Admin to edit or add members.',
    switchRole: 'Switch Role',
    language: 'Language',
    selectLanguage: 'Select Language',
    contactDeveloper: 'Support',
    telegramContact: "Telegram: ma'lumot kiritilmagan",
    phoneContact: 'Phone: not set',
    theme: 'Appearance',
    dark: 'Dark (Monochrome)',
    light: 'Light (Minimal)',
    familyManagement: 'Family Members',
    privacy: 'Privacy & Security',
    backup: 'Backup & Export',
    about: 'About App',
    createEvent: 'Create Event',
    eventTitle: 'Event Title',
    eventDate: 'Date',
    eventTime: 'Time',
    eventLocation: 'Location',
    uploadPhoto: 'Upload Photo',
    photoTitle: 'Photo Title',
    overviewTab: 'Overview',
    detailsTab: 'Details',
    photosTab: 'Photos',
    timelineTab: 'Timeline',
    you: 'YOU',
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    familyPhotos: 'Sirojov Family Photos',
    familyEvents: 'Sirojov Family Events',
    familyDetails: 'Sirojov Family Details',
    clearAllAndStartClean: 'Clear all & start fresh',
    resetTree: 'Reset Family Tree',
    addMemory: 'Add Memory',
    viewProfile: 'View Profile',
    tapToExplore: 'Drag to explore 3D space',
    rotate3DHint: 'Tap and drag to orbit in 3D',
    autoRotate: 'Auto Rotate',
    manualRotate: 'Manual Rotate',
    supportTitle: 'Support & Contact',
    supportSubtitle: 'Contact Administrator',
    openTelegram: 'Open Telegram',
    callPhone: 'Call Phone',
    notLoggedIn: 'Not logged in',
    enterCredentials: 'Enter your username and password',
    incorrectPassword: 'Invalid username or password',
    connectionError: 'Cannot reach the server. Check your connection and try again.',
    loggedOutNotice: 'You have been logged out successfully',
    nameRequired: 'Full name is required',
    invalidBirthYear: 'Birth year must be between 1850 and current year',
    deathBeforeBirth: 'Death year must be after birth year',
    invalidPhone: 'Invalid phone (7–15 digits)',
    invalidEmail: 'Invalid email address',
    memberAdded: 'New member added to tree',
    memberUpdated: 'Profile updated',
    memberDeleted: 'Member deleted',
    photoAdded: 'New photo added to archive',
    eventCreated: 'New event created',
    memoryAdded: 'Memory saved',
    upcomingEvent: 'Upcoming event',
    noUpcomingEvents: 'No upcoming events',
    resultsFound: 'results found',
    clear: 'Clear',
    voiceListening: 'Listening...',
    copied: 'Copied!',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',
    inviteTitle: 'Sirojov Family Invite',
    inviteDesc: 'Send this link to relatives. They will be able to view the tree.',
    adminAdded: 'New admin added successfully!',
    adminAddFailed: 'Could not add admin. Check username and password (min 4 chars).',
    adminRemoved: 'Admin removed',
    skip: 'Skip',
    next: 'Continue',
    getStarted: 'Get started',
    demoHint: 'Demo: login admin / password admin',
    close: 'Close',
    noPhotosYet: 'No photos yet',
    noEventsYet: 'No scheduled events yet',
    noNotifications: 'No notifications',
    dataExported: 'Data copied to clipboard',
    dataImported: 'Data restored',
    importFailed: 'Invalid file. Check JSON format.',
    profile: 'Profile',
    relations: 'Family connections',
    noParents: 'Not added',
    noSpouse: 'None',
    noChildren: 'None',
    noSiblings: 'Not added',
    call: 'Call',
    write: 'Message',
    ob1Title: 'The Sirojov Dynasty',
    ob1Desc: 'Strengthen the bonds between generations — unite ancestors and loved ones in one tree.',
    ob2Title: 'Bonds of Generations',
    ob2Desc: 'Add parents, spouses and children — the tree builds itself.',
    ob3Title: 'Family Memories',
    ob3Desc: 'Keep archive photos, events and precious memories in one place.',
    parents: 'Parents',
    children: 'Children',
    spouseLabel: 'Spouse',
    siblings: 'Siblings',
    biography: 'Biography',
    statusLabel: 'Status',
    albums: 'Albums',
  },
  ru: {
    appName: 'Сироджовы',
    tagline: 'История семьи — наши корни.',
    home: 'Главная',
    tree: 'Древо',
    search: 'Поиск',
    settings: 'Настройки',
    goodMorning: 'Доброе утро, Семья',
    ourFamilyTree: 'Древо семьи Сироджовых',
    members: 'чел.',
    generations: 'покол.',
    viewTree: 'Смотреть древо',
    addMember: 'Добавить члена семьи',
    photos: 'Фотографии',
    events: 'События',
    timeline: 'Хронология',
    more: 'Ещё',
    recentActivity: 'Недавняя активность',
    seeAll: 'Все',
    quickActions: 'Быстрые действия',
    searchPlaceholder: 'Поиск по имени, родству или месту...',
    all: 'Все',
    places: 'Места',
    memories: 'Воспоминания',
    noResults: 'Ничего не найдено',
    treeView: 'Древо',
    listView: 'Список',
    orbit3DView: '3D Орбита',
    zoomIn: 'Приблизить',
    zoomOut: 'Отдалить',
    centerCanvas: 'По центру',
    myPosition: 'Моя позиция',
    filter: 'Фильтр',
    allGenerations: 'Все поколения',
    directLine: 'Прямая линия',
    elders: 'Старшие',
    youth: 'Младшие',
    addFirstMember: 'Добавить первого родственника',
    noMembersYet: 'В древе пока нет родственников',
    noMembersDesc: 'Начните строить семейное древо, добавив первого родственника.',
    addChild: 'Добавить ребёнка',
    addSpouse: 'Добавить супруга(у)',
    addParent: 'Добавить родителя',
    editProfile: 'Редактировать',
    deleteMember: 'Удалить',
    shareProfile: 'Поделиться',
    confirmDelete: 'Вы уверены, что хотите удалить?',
    cancel: 'Отмена',
    save: 'Сохранить',
    saveMember: 'Сохранить родственника',
    fullName: 'Ф.И.О. *',
    relationship: 'Кем приходится *',
    gender: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    other: 'Другой',
    birthDate: 'Дата рождения',
    birthPlace: 'Место рождения',
    living: 'Жив(а)',
    deceased: 'Умер(ла)',
    deathYear: 'Год смерти',
    phone: 'Телефон',
    email: 'Эл. почта',
    notes: 'Заметки и воспоминания',
    whoAreParents: 'Кто родители?',
    whoIsSpouse: 'Кто супруг(а)?',
    login: 'Вход в систему',
    logout: 'Выйти',
    username: 'Логин / Имя пользователя',
    password: 'Пароль',
    signIn: 'Войти',
    role: 'Роль',
    admin: 'Администратор (Полный доступ)',
    viewer: 'Наблюдатель (Только просмотр)',
    adminShort: 'Админ',
    viewerShort: 'Наблюдатель',
    adminBadge: 'АДМИН',
    viewerBadge: 'ПРОСМОТР',
    adminNotice: 'Как Администратор, вы можете добавлять, редактировать и удалять любые записи.',
    readOnlyNotice: 'У вас режим только чтения. Войдите как Администратор для редактирования.',
    switchRole: 'Сменить роль',
    language: 'Язык',
    selectLanguage: 'Выберите язык',
    contactDeveloper: 'Поддержка',
    telegramContact: "Telegram: ma'lumot kiritilmagan",
    phoneContact: 'Телефон: не указан',
    theme: 'Оформление',
    dark: 'Тёмная (Monochrome)',
    light: 'Светлая (Minimal)',
    familyManagement: 'Члены семьи',
    privacy: 'Конфиденциальность',
    backup: 'Резервная копия',
    about: 'О приложении',
    createEvent: 'Создать событие',
    eventTitle: 'Название события',
    eventDate: 'Дата',
    eventTime: 'Время',
    eventLocation: 'Место',
    uploadPhoto: 'Загрузить фото',
    photoTitle: 'Название фото',
    overviewTab: 'Обзор',
    detailsTab: 'Подробности',
    photosTab: 'Фотографии',
    timelineTab: 'Хроника',
    you: 'ВЫ',
    notifications: 'Уведомления',
    markAllRead: 'Прочитать все',
    familyPhotos: 'Семейные фотографии Сироджовых',
    familyEvents: 'Семейные события Сироджовых',
    familyDetails: 'Сведения о семье Сироджовых',
    clearAllAndStartClean: 'Очистить всё и начать с нуля',
    resetTree: 'Очистить древо',
    addMemory: 'Добавить воспоминание',
    viewProfile: 'Открыть профиль',
    tapToExplore: 'Вращайте для исследования 3D пространства',
    rotate3DHint: 'Нажмите и двигайте для вращения в 3D',
    autoRotate: 'Авто-вращение',
    manualRotate: 'Ручное вращение',
    supportTitle: 'Поддержка и связь',
    supportSubtitle: 'Связаться с администратором',
    openTelegram: 'Написать в Telegram',
    callPhone: 'Позвонить',
    notLoggedIn: 'Вход не выполнен',
    enterCredentials: 'Введите логин и пароль',
    incorrectPassword: 'Неверный логин или пароль',
    connectionError: 'Не удаётся связаться с сервером. Проверьте соединение.',
    loggedOutNotice: 'Вы успешно вышли из аккаунта',
    nameRequired: 'Ф.И.О. обязательно',
    invalidBirthYear: 'Год рождения должен быть между 1850 и текущим годом',
    deathBeforeBirth: 'Год смерти должен быть после года рождения',
    invalidPhone: 'Неверный телефон (7–15 цифр)',
    invalidEmail: 'Неверный email',
    memberAdded: 'Новый родственник добавлен',
    memberUpdated: 'Данные обновлены',
    memberDeleted: 'Родственник удалён',
    photoAdded: 'Новое фото добавлено',
    eventCreated: 'Новое событие создано',
    memoryAdded: 'Воспоминание сохранено',
    upcomingEvent: 'Ближайшее событие',
    noUpcomingEvents: 'Ближайших событий нет',
    resultsFound: 'найдено',
    clear: 'Очистить',
    voiceListening: 'Слушаю...',
    copied: 'Скопировано!',
    copyLink: 'Скопировать ссылку',
    linkCopied: 'Ссылка скопирована!',
    inviteTitle: 'Приглашение Сироджовых',
    inviteDesc: 'Отправьте эту ссылку родственникам.',
    adminAdded: 'Новый админ успешно добавлен!',
    adminAddFailed: 'Не удалось добавить. Проверьте логин и пароль.',
    adminRemoved: 'Админ удалён',
    skip: 'Пропустить',
    next: 'Далее',
    getStarted: 'Начать',
    demoHint: 'Демо: логин admin / пароль admin',
    close: 'Закрыть',
    noPhotosYet: 'Фотографий пока нет',
    noEventsYet: 'Запланированных событий пока нет',
    noNotifications: 'Уведомлений нет',
    dataExported: 'Данные скопированы',
    dataImported: 'Данные восстановлены',
    importFailed: 'Неверный файл. Проверьте JSON.',
    profile: 'Профиль',
    relations: 'Родственные связи',
    noParents: 'Не указаны',
    noSpouse: 'Нет',
    noChildren: 'Нет',
    noSiblings: 'Не указаны',
    call: 'Позвонить',
    write: 'Написать',
    ob1Title: 'Династия Сироджовых',
    ob1Desc: 'Укрепляйте связь поколений — объедините предков и близких в одном древе.',
    ob2Title: 'Связь поколений',
    ob2Desc: 'Добавляйте родителей, супругов и детей — древо построится само.',
    ob3Title: 'Семейные воспоминания',
    ob3Desc: 'Храните архивные фото, события и ценные воспоминания в одном месте.',
    parents: 'Родители',
    children: 'Дети',
    spouseLabel: 'Супруг(а)',
    siblings: 'Братья и сёстры',
    biography: 'Биография',
    statusLabel: 'Статус',
    albums: 'Альбомы',
  },
};
