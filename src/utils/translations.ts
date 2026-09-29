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
  loggedOutNotice: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  'uz-latn': {
    appName: 'Sirojovlar',
    tagline: 'Oila tariximiz va avlodlar rishtasi.',
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
    adminBadge: 'ADMIN',
    viewerBadge: 'KUZATUVCHI',
    adminNotice: 'Siz Administrator sifatida to\'liq o\'zgartirish huquqiga egasiz.',
    readOnlyNotice: 'Siz faqat ko\'rish huquqiga egasiz. Tahrirlash uchun Admin bo\'lib kiring.',
    switchRole: 'Rolni o\'zgartirish',
    language: 'Til',
    selectLanguage: 'Tilni tanlang',
    contactDeveloper: 'Yordam',
    telegramContact: 'Telegram: @zafarov1ich',
    phoneContact: 'Tel: +998 94 840 31 06',
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
    loggedOutNotice: 'Siz hisobdan muvaffaqiyatli chiqdingiz',
  },
  'uz-cyrl': {
    appName: 'Сирожовлар',
    tagline: 'Оила тарихимиз ва авлодлар риштаси.',
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
    adminBadge: 'АДМИН',
    viewerBadge: 'КУЗАТУВЧИ',
    adminNotice: 'Сиз Администратор сифатида тўлиқ ўзгартириш ҳуқуқига эгасиз.',
    readOnlyNotice: 'Сиз фақат кўриш ҳуқуқига эгасиз. Таҳрирлаш учун Админ бўлиб киринг.',
    switchRole: 'Ролни ўзгартириш',
    language: 'Тил',
    selectLanguage: 'Тилни танланг',
    contactDeveloper: 'Ёрдам',
    telegramContact: 'Телеграм: @zafarov1ich',
    phoneContact: 'Тел: +998 94 840 31 06',
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
    loggedOutNotice: 'Сиз ҳисобдан муваффақиятли чиқдингиз',
  },
  en: {
    appName: 'Sirojovs',
    tagline: 'Keep your family connected across generations.',
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
    adminBadge: 'ADMIN',
    viewerBadge: 'VIEWER',
    adminNotice: 'As Administrator, you have full permissions to add, edit, and delete.',
    readOnlyNotice: 'You have read-only access. Sign in as Admin to edit or add members.',
    switchRole: 'Switch Role',
    language: 'Language',
    selectLanguage: 'Select Language',
    contactDeveloper: 'Support',
    telegramContact: 'Telegram: @zafarov1ich',
    phoneContact: 'Phone: +998 94 840 31 06',
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
    loggedOutNotice: 'You have been logged out successfully',
  },
  ru: {
    appName: 'Сироджовы',
    tagline: 'Сохраняйте семейную связь сквозь поколения.',
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
    adminBadge: 'АДМИН',
    viewerBadge: 'ПРОСМОТР',
    adminNotice: 'Как Администратор, вы можете добавлять, редактировать и удалять любые записи.',
    readOnlyNotice: 'У вас режим только чтения. Войдите как Администратор для редактирования.',
    switchRole: 'Сменить роль',
    language: 'Язык',
    selectLanguage: 'Выберите язык',
    contactDeveloper: 'Поддержка',
    telegramContact: 'Telegram: @zafarov1ich',
    phoneContact: 'Тел: +998 94 840 31 06',
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
    loggedOutNotice: 'Вы успешно вышли из аккаунта',
  },
};
