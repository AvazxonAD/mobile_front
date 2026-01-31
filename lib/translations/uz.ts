export const uzTranslations = {
  // Authentication
  auth: {
    welcome: "Xush kelibsiz",
    login: "Kirish",
    signup: "Ro'yxatdan o'tish",
    email: "Elektron pochta",
    password: "Parol",
    name: "To'liq ism",
    confirmPassword: "Parolni tasdiqlang",
    forgotPassword: "Parolni unutdingizmi?",
    alreadyHaveAccount: "Hisobingiz bormi?",
    dontHaveAccount: "Hisobingiz yo'qmi?",
    signInHere: "Bu yerda kiring",
    createAccount: "Hisob yarating",
    loginButton: "Kirish",
    signupButton: "Ro'yxatdan o'tish",
    or: "yoki",
  },

  // Dashboard
  dashboard: {
    welcomeBack: "Qaytganingiz bilan",
    readyToContinue: "O'sish yo'lingizni davom ettirishga tayyormisiz? Bugunni foydali qilaylik.",
    quickActions: "Tezkor harakatlar",
    todaysWisdom: "Bugungi hikmat",
    recentAchievements: "So'nggi yutuqlar",
    level: "Daraja",
    toNext: "keyingisiga",
    pointsTo: "ball",
    daysStrong: "kun kuchli",
    totalEarned: "jami ishlab topilgan",
    streak: "Ketma-ketlik",
    points: "Ballar",
  },

  // Navigation
  nav: {
    home: "Bosh sahifa",
    challenges: "Vazifalar",
    knowledge: "Bilim",
    progress: "Taraqqiyot",
    profile: "Profil",
    settings: "Sozlamalar",
  },

  // Quick Actions
  actions: {
    dailyChallenge: "Kunlik vazifa",
    assessment: "Baholash",
    learn: "O'rganish",
    track: "Kuzatish",
    new: "Yangi",
    aiPowered: "AI bilan",
    hub: "Markaz",
  },

  // Common
  common: {
    loading: "Yuklanmoqda...",
    error: "Xatolik",
    success: "Muvaffaqiyat",
    cancel: "Bekor qilish",
    save: "Saqlash",
    delete: "O'chirish",
    edit: "Tahrirlash",
    view: "Ko'rish",
    back: "Orqaga",
    next: "Keyingi",
    previous: "Oldingi",
    close: "Yopish",
    open: "Ochish",
    more: "Ko'proq",
  },

  // Badges and Achievements
  badges: {
    firstLogin: "Birinchi kirish",
    weekStreak: "Haftalik ketma-ketlik",
    monthStreak: "Oylik ketma-ketlik",
    knowledgeSeeker: "Bilim izlovchi",
    challengeCompleter: "Vazifa bajaruvchi",
    progressMaker: "Taraqqiyot qiluvchi",
  },

  // Wisdom quotes
  wisdom: {
    steveJobs:
      "Ajoyib ish qilishning yagona yo'li - qilayotgan ishingizni sevishdir. Agar hali topmagan bo'lsangiz, qidirishda davom eting.",
  },

  // Form validation messages
  validation: {
    required: "Bu maydon majburiy",
    emailInvalid: "Noto'g'ri elektron pochta formati",
    passwordTooShort: "Parol juda qisqa",
    passwordsNotMatch: "Parollar mos kelmaydi",
  },

  // Toast messages
  toast: {
    welcomeBack: "Qaytganingiz bilan!",
    signInSuccess: "Hisobingizga muvaffaqiyatli kirdingiz",
    signInFailed: "Kirish amalga oshmadi",
    signUpSuccess: "Hisobingiz muvaffaqiyatli yaratildi",
    signUpFailed: "Ro'yxatdan o'tish amalga oshmadi",
    missingInfo: "Ma'lumot yetishmayapti",
    fillAllFields: "Iltimos, barcha maydonlarni to'ldiring",
    passwordTooShort: "Parol juda qisqa",
    passwordMinLength: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    somethingWrong: "Nimadir noto'g'ri ketdi. Iltimos, qayta urinib ko'ring.",
    invalidCredentials: "Noto'g'ri email yoki parol. demo@example.com / demo123 ni sinab ko'ring",
  },
}

export type TranslationKey = keyof typeof uzTranslations
