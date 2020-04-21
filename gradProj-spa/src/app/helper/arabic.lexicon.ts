const countries = {
  AF: "أفغانستان",
  AL: "ألبانيا",
  AQ: "القطب الجنوبي",
  DZ: "الجزائر",
  AS: "ساموا الأمريكية",
  AD: "أندورا",
  AO: "أنجولا",
  AG: "أنتيجوا وبربودا",
  AZ: "أذربيجان",
  AR: "الأرجنتين",
  AU: "أستراليا",
  AT: "النمسا",
  BS: "الباهاما",
  BH: "البحرين",
  BD: "بنجلاديش",
  AM: "أرمينيا",
  BB: "بربادوس",
  BE: "بلجيكا",
  BM: "برمودا",
  BT: "بوتان",
  BO: "بوليفيا",
  BA: "البوسنة والهرسك",
  BW: "بتسوانا",
  BV: "جزيرة بوفيه",
  BR: "البرازيل",
  BZ: "بليز",
  IO: "المحيط الهندي البريطاني",
  SB: "جزر سليمان",
  VG: "جزر فرجين البريطانية",
  BN: "بروناي",
  BG: "بلغاريا",
  MM: "ميانمار",
  BI: "بوروندي",
  BY: "روسيا البيضاء",
  KH: "كمبوديا",
  CM: "الكاميرون",
  CA: "كندا",
  CV: "الرأس الأخضر",
  KY: "جزر الكايمن",
  CF: "جمهورية افريقيا الوسطى",
  LK: "سريلانكا",
  TD: "تشاد",
  CL: "شيلي",
  CN: "الصين",
  TW: "تايوان",
  CX: "جزيرة الكريسماس",
  CC: "جزر كوكوس",
  CO: "كولومبيا",
  KM: "جزر القمر",
  YT: "مايوت",
  CG: "الكونغو - برازافيل",
  CD: "جمهورية الكونغو الديمقراطية",
  CK: "جزر كوك",
  CR: "كوستاريكا",
  HR: "كرواتيا",
  CU: "كوبا",
  CY: "قبرص",
  CZ: "جمهورية التشيك",
  BJ: "بنين",
  DK: "الدانمرك",
  DM: "دومينيكا",
  DO: "جمهورية الدومينيك",
  EC: "الاكوادور",
  SV: "السلفادور",
  GQ: "غينيا الاستوائية",
  ET: "اثيوبيا",
  ER: "اريتريا",
  EE: "استونيا",
  FO: "جزر فارو",
  FK: "جزر فوكلاند",
  GS: "جورجيا الجنوبية وجزر ساندويتش الجنوبية",
  FJ: "فيجي",
  FI: "فنلندا",
  AX: "جزر أولان",
  FR: "فرنسا",
  GF: "غويانا",
  PF: "بولينيزيا الفرنسية",
  TF: "المقاطعات الجنوبية الفرنسية",
  DJ: "جيبوتي",
  GA: "الجابون",
  GE: "جورجيا",
  GM: "غامبيا",
  PS: "فلسطين",
  DE: "ألمانيا",
  GH: "غانا",
  GI: "جبل طارق",
  KI: "كيريباتي",
  GR: "اليونان",
  GL: "جرينلاند",
  GD: "جرينادا",
  GP: "جوادلوب",
  GU: "جوام",
  GT: "جواتيمالا",
  GN: "غينيا",
  GY: "غيانا",
  HT: "هايتي",
  HM: "جزيرة هيرد وماكدونالد",
  VA: "الفاتيكان",
  HN: "هندوراس",
  HK: "هونج كونج الصينية",
  HU: "المجر",
  IS: "أيسلندا",
  IN: "الهند",
  ID: "اندونيسيا",
  IR: "ايران",
  IQ: "العراق",
  IE: "أيرلندا",
  IL: "اسرائيل",
  IT: "ايطاليا",
  CI: "ساحل العاج",
  JM: "جامايكا",
  JP: "اليابان",
  KZ: "كازاخستان",
  JO: "الأردن",
  KE: "كينيا",
  KP: "كوريا الشمالية",
  KR: "كوريا الجنوبية",
  KW: "الكويت",
  KG: "قرغيزستان",
  LA: "لاوس",
  LB: "لبنان",
  LS: "ليسوتو",
  LV: "لاتفيا",
  LR: "ليبيريا",
  LY: "ليبيا",
  LI: "ليختنشتاين",
  LT: "ليتوانيا",
  LU: "لوكسمبورج",
  MO: "ماكاو الصينية",
  MG: "مدغشقر",
  MW: "ملاوي",
  MY: "ماليزيا",
  MV: "جزر الملديف",
  ML: "مالي",
  MT: "مالطا",
  MQ: "مارتينيك",
  MR: "موريتانيا",
  MU: "موريشيوس",
  MX: "المكسيك",
  MC: "موناكو",
  MN: "منغوليا",
  MD: "مولدافيا",
  ME: "الجبل الأسود",
  MS: "مونتسرات",
  MA: "المغرب",
  MZ: "موزمبيق",
  OM: "عمان",
  NA: "ناميبيا",
  NR: "نورو",
  NP: "نيبال",
  NL: "هولندا",
  CW: "كوراساو",
  AW: "آروبا",
  SX: "سينت مارتن",
  BQ: "بونير",
  NC: "كاليدونيا الجديدة",
  VU: "فانواتو",
  NZ: "نيوزيلاندا",
  NI: "نيكاراجوا",
  NE: "النيجر",
  NG: "نيجيريا",
  NU: "نيوي",
  NF: "جزيرة نورفوك",
  NO: "النرويج",
  MP: "جزر ماريانا الشمالية",
  UM: "جزر الولايات المتحدة البعيدة الصغيرة",
  FM: "ميكرونيزيا",
  MH: "جزر المارشال",
  PW: "بالاو",
  PK: "باكستان",
  PA: "بنما",
  PG: "بابوا غينيا الجديدة",
  PY: "باراجواي",
  PE: "بيرو",
  PH: "الفيلبين",
  PN: "بتكايرن",
  PL: "بولندا",
  PT: "البرتغال",
  GW: "غينيا بيساو",
  TL: "تيمور الشرقية",
  PR: "بورتوريكو",
  QA: "قطر",
  XK: "كوسوفو",
  RE: "روينيون",
  RO: "رومانيا",
  RU: "روسيا",
  RW: "رواندا",
  BL: "سان بارتيلمي",
  SH: "سانت هيلنا",
  KN: "سانت كيتس ونيفيس",
  AI: "أنجويلا",
  LC: "سانت لوسيا",
  MF: "سانت مارتين",
  PM: "سانت بيير وميكولون",
  VC: "سانت فنسنت وغرنادين",
  SM: "سان مارينو",
  ST: "ساو تومي وبرينسيبي",
  SA: "المملكة العربية السعودية",
  SN: "السنغال",
  RS: "صربيا",
  SC: "سيشل",
  SL: "سيراليون",
  SG: "سنغافورة",
  SK: "سلوفاكيا",
  VN: "فيتنام",
  SI: "سلوفينيا",
  SO: "الصومال",
  ZA: "جمهورية جنوب افريقيا",
  ZW: "زيمبابوي",
  ES: "أسبانيا",
  SS: "جنوب السودان",
  SD: "السودان",
  EH: "الصحراء الغربية",
  SR: "سورينام",
  SJ: "سفالبارد وجان مايان",
  SZ: "سوازيلاند",
  SE: "السويد",
  CH: "سويسرا",
  SY: "سوريا",
  TJ: "طاجكستان",
  TH: "تايلند",
  TG: "توجو",
  TK: "توكيلو",
  TO: "تونجا",
  TT: "ترينيداد وتوباغو",
  AE: "الامارات العربية المتحدة",
  TN: "تونس",
  TR: "تركيا",
  TM: "تركمانستان",
  TC: "جزر الترك وجايكوس",
  TV: "توفالو",
  UG: "أوغندا",
  UA: "أوكرانيا",
  MK: "مقدونيا",
  EG: "مصر",
  GB: "المملكة المتحدة",
  GG: "غيرنزي",
  JE: "جيرسي",
  IM: "جزيرة مان",
  TZ: "تانزانيا",
  US: "الولايات المتحدة الأمريكية",
  VI: "جزر فرجين الأمريكية",
  BF: "بوركينا فاسو",
  UY: "أورجواي",
  UZ: "أوزبكستان",
  VE: "فنزويلا",
  WF: "جزر والس وفوتونا",
  WS: "ساموا",
  YE: "اليمن",
  ZM: "زامبيا",
};
export const arabicLexicon = {
  country: "البلد",
  userDashboard: "لوحة المستخدم",
  information: "معلومات:",
  changeAlert: "لقد تم التعديل على معلومات المستخدم يرجى حفظها قبل الخروج",
  firstName: "الاسم الأول",
  lastName: "اسم العائلة",
  dateOfBirth: "تاريخ الميلاد",
  underAgeError: "عمر المستخدم يجب أن يكون أكبر من 8 سنين",
  invalidDate: "تاريخ غير صحيح",
  companyName: "اسم الشركة",
  schoolName: "اسم المدرسة",
  countrySelectPlaceHolder: "اختر بلدك...",
  programmingLanguages: "لغات البرمجة",
  gender: "الجنس",
  genderSelectPlaceHolder: "اختر جنسك...",
  description: "وصف عنك",
  saveButtonText: "حفظ التغيرات",
  male: "ذكر",
  female: "أنثى",
  other: "أخر",
  programmingLanguagesPlaceHolder: "اختر اللغات...",
  selectAll: "اختر الجميع",
  unselectAll: "إزلة  الجميع",
  filterSelectAll: "جميع النتائج ",
  filterUnSelectAll: "إزالة جميع النتائج",
  searchPlaceholder: "ابحث",
  home: "الرئيسية",
  profile: "الشخصية",
  signIn: "دخول",
  signUp: "تسجيل",
  editProfile: "تعديل الصفحة الشخصية",
  signOut: "خروج",
  descriptionPlaceHolder: "اكتب عن نفسك...",
  weekdays: ["إث", "ث", "أر", "خ", "ج", "س", "أح"],
  months: [
    "يناير",
    "فبراير ",
    " مارس ",
    " أبريل ",
    " مايو",
    " يونيو",
    " يوليو ",
    "أغسطس",
    "سبتمبر ",
    " أكتوبر",
    "نوفمبر",
    " ديسمبر ",
  ],
  signedInSuccessFullyMessage: "أهلاً بك",
  signedOutMessage: "وداعًا",
  signedUpSucessFullyMessage: "تم التسجيل بنجاح",
  authGuardMessage: "تأكد أنت داخل بحسابك",
  preventUnsavedChangesGuardMessage:
    "لديك تعديلات لم يتم حفظها, هل أنت متأكد من الخروج؟ ",
  updatedSuccessfullyMessage: "تم التعديل بنجاح !",
  signedInFailedMessage: "هنالك خطأ باسم المستخدم أو كلمة السر",
  retrievingDataErrorMessage: "خطأ في استرجاع البيانات! ",
  signInFormSubtitle: "سجل دخولك لتكمل.",
  usernameOrEmail: "اسم المستخدم أو الإيميل",
  password: "كلمة السر",
  forgotPassword: "نسيت كلمة السر؟",
  newUser: "مستخدم جديد؟",
  createAccount: "أنشئ حسابك",
  usernameOrEmailRequiredErrorMessage: "اسم المستخدم أو الإيميل مطلوب",
  passwordRequiredErrorMessage: "كلمة السر مطلوبة",
  signUpFormSubtitle: "قم بالتسجيل لتكمل",
  email: "الإيميل",
  emailPatternErrorMessage: "إيميل خاظئ",
  emailRequiredErrorMessage: "الإيميل مطلوب",
  username: "اسم المستخدم",
  usernameLengthErrorMessage: "اسم المستخدم يجب أن يكون بين 8-20 حرف",
  usernamePatternErrorMessage: "اسم المستخدم ممنوع فيه ال@",
  passwordLengthErrorMessage: "كلمة السر يجب أن تكون بين 8-20 حرف",
  confirmPassword: "تأكيد كلمة السر",
  confirmPasswordMismatchErrorMessage: "لا يماثل كلمة السر",
  confirmPasswordRequiredErrorMessage: "تأكيد كلمة السر مطلوب",
  or: "أو",
  alreadyAUser: "لديك حساب؟",
  usernameRequiredErrorMessage: "اسم المستخدم مطلوب",
  changePhoto: "غير صورتك",
  uploadPhoto: "ارفع صورة",
  ...countries,
  projectName: "Grad-Proj",
  projectLocation: "الأردن-عمان",
  projectPhoneNumber: "077xxxxxx",
  projectEmail: "Gradproj@company.com",
  about: "حول",
  why: "لماذا",
  mission: "مهامنا و أهدافنا",
  regulation: "قوانينا ",
  questionMark: "؟",
  posts: "المنشورات",
  create: "إنشاء",
  new: "جديد",
  cancel: "إلغاء",
  title: "العنوان",
  titleLengthErrorMessage: "العنوان يجيب أن يكون ما بين 20-400 حرف",
  titleIsRequiredErrorMessage: "العنوان مطلوب",
  emailUsedErrorMessage: "الإيميل مستخدم",
  usernameUsedErrorMessage: "اسم المستخدم مستخدم",
};
