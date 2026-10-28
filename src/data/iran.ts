export const iranProvinces = [
  'east-azerbaijan',
  'west-azerbaijan',
  'ardabil',
  'isfahan',
  'alborz',
  'ilam',
  'bushehr',
  'tehran',
  'chaharmahal-and-bakhtiari',
  'south-khorasan',
  'razavi-khorasan',
  'north-khorasan',
  'khuzestan',
  'zanjan',
  'semnan',
  'sistan-and-baluchestan',
  'fars',
  'qazvin',
  'qom',
  'kurdistan',
  'kerman',
  'kermanshah',
  'kohgiluyeh-and-boyer-ahmad',
  'golestan',
  'gilan',
  'lorestan',
  'mazandaran',
  'markazi',
  'hormozgan',
  'hamadan',
  'yazd',
] as const

export type IranProvince = (typeof iranProvinces)[number]

export const iranianBanks = [
  'melli',
  'mellat',
  'saderat',
  'sepah',
  'tejarat',
  'keshavarzi',
  'maskan',
  'refah',
  'pasargad',
  'parsian',
  'saman',
  'sarmayeh',
  'ayandeh',
  'other',
] as const

export type IranianBank = (typeof iranianBanks)[number]

export const provinceLabels: Record<IranProvince, { en: string; fa: string }> = {
  'east-azerbaijan': { en: 'East Azerbaijan', fa: 'آذربایجان شرقی' },
  'west-azerbaijan': { en: 'West Azerbaijan', fa: 'آذربایجان غربی' },
  ardabil: { en: 'Ardabil', fa: 'اردبیل' },
  isfahan: { en: 'Isfahan', fa: 'اصفهان' },
  alborz: { en: 'Alborz', fa: 'البرز' },
  ilam: { en: 'Ilam', fa: 'ایلام' },
  bushehr: { en: 'Bushehr', fa: 'بوشهر' },
  tehran: { en: 'Tehran', fa: 'تهران' },
  'chaharmahal-and-bakhtiari': { en: 'Chaharmahal and Bakhtiari', fa: 'چهارمحال و بختیاری' },
  'south-khorasan': { en: 'South Khorasan', fa: 'خراسان جنوبی' },
  'razavi-khorasan': { en: 'Razavi Khorasan', fa: 'خراسان رضوی' },
  'north-khorasan': { en: 'North Khorasan', fa: 'خراسان شمالی' },
  khuzestan: { en: 'Khuzestan', fa: 'خوزستان' },
  zanjan: { en: 'Zanjan', fa: 'زنجان' },
  semnan: { en: 'Semnan', fa: 'سمنان' },
  'sistan-and-baluchestan': { en: 'Sistan and Baluchestan', fa: 'سیستان و بلوچستان' },
  fars: { en: 'Fars', fa: 'فارس' },
  qazvin: { en: 'Qazvin', fa: 'قزوین' },
  qom: { en: 'Qom', fa: 'قم' },
  kurdistan: { en: 'Kurdistan', fa: 'کردستان' },
  kerman: { en: 'Kerman', fa: 'کرمان' },
  kermanshah: { en: 'Kermanshah', fa: 'کرمانشاه' },
  'kohgiluyeh-and-boyer-ahmad': { en: 'Kohgiluyeh and Boyer-Ahmad', fa: 'کهگیلویه و بویراحمد' },
  golestan: { en: 'Golestan', fa: 'گلستان' },
  gilan: { en: 'Gilan', fa: 'گیلان' },
  lorestan: { en: 'Lorestan', fa: 'لرستان' },
  mazandaran: { en: 'Mazandaran', fa: 'مازندران' },
  markazi: { en: 'Markazi', fa: 'مرکزی' },
  hormozgan: { en: 'Hormozgan', fa: 'هرمزگان' },
  hamadan: { en: 'Hamadan', fa: 'همدان' },
  yazd: { en: 'Yazd', fa: 'یزد' },
}

export const bankLabels: Record<IranianBank, { en: string; fa: string }> = {
  melli: { en: 'Bank Melli', fa: 'ملی' },
  mellat: { en: 'Bank Mellat', fa: 'ملت' },
  saderat: { en: 'Bank Saderat', fa: 'صادرات' },
  sepah: { en: 'Bank Sepah', fa: 'سپه' },
  tejarat: { en: 'Bank Tejarat', fa: 'تجارت' },
  keshavarzi: { en: 'Bank Keshavarzi', fa: 'کشاورزی' },
  maskan: { en: 'Bank Maskan', fa: 'مسکن' },
  refah: { en: 'Bank Refah', fa: 'رفاه' },
  pasargad: { en: 'Bank Pasargad', fa: 'پاسارگاد' },
  parsian: { en: 'Bank Parsian', fa: 'پارسیان' },
  saman: { en: 'Bank Saman', fa: 'سامان' },
  sarmayeh: { en: 'Bank Sarmayeh', fa: 'سرمایه' },
  ayandeh: { en: 'Bank Ayandeh', fa: 'آینده' },
  other: { en: 'Other', fa: 'سایر' },
}

export function normalizeIranPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('98') && digits.length === 12) return `0${digits.slice(2)}`
  if (digits.length === 10 && digits.startsWith('9')) return `0${digits}`
  return digits
}
