// צוק · Tzuk — site data shared by the unit page, the booking flow and the reviews page.
// Fictional portfolio content: prices, availability and reviews are samples.

// path prefix to the site root: '' on Hebrew pages, '../' on /en/ pages
export const ROOT = document.documentElement.dataset.root || '';

export const CONTACT = {
  phone: '02-555-0142',
  phoneHref: 'tel:+97225550142',
  whatsapp: 'https://wa.me/972525550142',
  email: 'stay@tzuk.co.il',
};

export const UNITS = {
  shachar: {
    guests: 2, size: 45, bedrooms: 1, weekday: 1450, weekend: 1850, breakfast: true,
    cover: 'suite-shachar.jpg',
    gallery: ['suite-shachar.jpg', 'shachar-terrace.jpg', 'shachar-bath.jpg', 'shachar-exterior.jpg', 'day-pool.jpg'],
    amenities: ['bed', 'jacuzzi', 'coffee', 'shower', 'ac', 'wifi', 'linen', 'terrace'],
    he: {
      name: 'שחר', type: 'סוויטה זוגית',
      tag: 'סוויטה זוגית, הכי קרובה לשפת הצוק',
      headline: 'המיטה מול הזריחה.',
      body: ['חלון זכוכית מהרצפה עד התקרה פונה מזרחה, אל הרי מואב. בחמש וארבעים בבוקר האור נכנס ישר למיטה, ואין שום דבר בינכם לבין הים שלמטה.', 'במרפסת הפרטית יש ג\'קוזי מחומם מול הנוף, ובפנים קירות אבן גיר, מצעי פשתן ומקלחת גשם. סוויטה לשניים, בלי טלוויזיה ובלי שכנים צמודים.'],
      beds: 'מיטה זוגית רחבה', view: 'נוף ישיר לים המלח',
      special: 'ג\'קוזי במרפסת מול הזריחה',
    },
    en: {
      name: 'Shachar', type: 'Couples suite',
      tag: 'A suite for two, closest to the cliff edge',
      headline: 'The bed faces the sunrise.',
      body: ['A floor-to-ceiling window faces east, toward the mountains of Moab. At 5:40 in the morning the light comes straight into bed, and nothing stands between you and the sea below.', 'The private terrace has a heated jacuzzi facing the view; inside, limestone walls, linen sheets and a rain shower. A suite for two, with no TV and no neighbors next door.'],
      beds: 'One wide double bed', view: 'Direct Dead Sea view',
      special: 'Terrace jacuzzi facing the sunrise',
    },
  },
  melach: {
    guests: 5, size: 70, bedrooms: 2, weekday: 1650, weekend: 2150, breakfast: false,
    cover: 'suite-melach.jpg',
    gallery: ['suite-melach.jpg', 'melach-kitchen.jpg', 'melach-kids.jpg', 'melach-terrace.jpg', 'review-kids.jpg'],
    amenities: ['bed', 'kids', 'kitchen', 'coffee', 'shower', 'ac', 'wifi', 'terrace'],
    he: {
      name: 'מלח', type: 'יחידה משפחתית',
      tag: 'יחידה משפחתית מרווחת, עם מטבח מלא',
      headline: 'מקום לכולם, ושקט לכל אחד.',
      body: ['שני חדרי שינה, סלון פתוח ומטבח מאובזר באמת, כך שאפשר לבשל ארוחת ערב בלי לצאת מהמתחם. חלונות גדולים פונים לים, ומרפסת מוצלת עם שולחן ארוך מחכה לארוחות של כל המשפחה.', 'חדר הילדים עם שתי מיטות יחיד וחלון עגול קטן אל המדבר. הבריכה המשותפת במרחק עשרים צעדים.'],
      beds: 'מיטה זוגית + 2 מיטות יחיד + ספה נפתחת', view: 'נוף לים מהסלון ומהמרפסת',
      special: '2 חדרי שינה ומטבח מלא',
    },
    en: {
      name: 'Melach', type: 'Family unit',
      tag: 'A roomy family unit with a full kitchen',
      headline: 'Room for everyone, quiet for each.',
      body: ['Two bedrooms, an open living room and a properly equipped kitchen, so you can cook dinner without leaving the compound. Large windows face the sea, and a shaded terrace with a long table waits for family meals.', 'The kids\' room has two single beds and a small round window onto the desert. The shared pool is twenty steps away.'],
      beds: 'Double bed + 2 singles + sofa bed', view: 'Sea view from the living room and terrace',
      special: '2 bedrooms and a full kitchen',
    },
  },
  sela: {
    guests: 4, size: 55, bedrooms: 1, weekday: 1350, weekend: 1750, breakfast: true,
    cover: 'suite-sela.jpg',
    gallery: ['suite-sela.jpg', 'sela-bedroom.jpg', 'sela-bath.jpg', 'sela-night.jpg', 'night-fire.jpg'],
    amenities: ['bed', 'courtyard', 'outshower', 'bath', 'coffee', 'ac', 'wifi', 'linen'],
    he: {
      name: 'סלע', type: 'סוויטת אבן',
      tag: 'סוויטת אבן עם חצר פנימית ומקלחת חוץ',
      headline: 'בנויה מהסלע שעליו היא עומדת.',
      body: ['קירות מאבן גיר מקומית, חתוכה ביד, ששומרים על קרירות גם באוגוסט. דלת מקושתת נפתחת לחצר פנימית פרטית עם עץ זית ותיק, ספסל אבן ומקלחת חוץ.', 'בפנים אמבט אבן, תאורה רכה ושקט מוחלט. ה-WiFi חלש כאן, ואורחים אומרים שזה החלק האהוב עליהם.'],
      beds: 'מיטה זוגית + ספה נפתחת', view: 'חצר פנימית פרטית',
      special: 'חצר פרטית ומקלחת חוץ',
    },
    en: {
      name: 'Sela', type: 'Stone suite',
      tag: 'A stone suite with a private courtyard and outdoor shower',
      headline: 'Built from the rock it stands on.',
      body: ['Hand-cut local limestone walls keep it cool even in August. An arched door opens onto a private courtyard with an old olive tree, a stone bench and an outdoor shower.', 'Inside: a stone bathtub, soft light and complete silence. The WiFi is weak here, and guests say that\'s their favorite part.'],
      beds: 'Double bed + sofa bed', view: 'Private inner courtyard',
      special: 'Private courtyard and outdoor shower',
    },
  },
};

export const AMENITIES = {
  bed: { he: 'מצעי פשתן ומיטה רחבה', en: 'Linen sheets, wide bed' },
  jacuzzi: { he: 'ג\'קוזי מחומם במרפסת', en: 'Heated terrace jacuzzi' },
  coffee: { he: 'מכונת אספרסו', en: 'Espresso machine' },
  shower: { he: 'מקלחת גשם', en: 'Rain shower' },
  ac: { he: 'מיזוג אוויר', en: 'Air conditioning' },
  wifi: { he: 'WiFi', en: 'WiFi' },
  linen: { he: 'מגבות וחלוקים', en: 'Towels and robes' },
  terrace: { he: 'מרפסת פרטית', en: 'Private terrace' },
  kids: { he: 'חדר ילדים', en: 'Kids\' bedroom' },
  kitchen: { he: 'מטבח מלא', en: 'Full kitchen' },
  courtyard: { he: 'חצר פנימית פרטית', en: 'Private courtyard' },
  outshower: { he: 'מקלחת חוץ', en: 'Outdoor shower' },
  bath: { he: 'אמבט אבן', en: 'Stone bathtub' },
};

export const ADDONS = [
  { id: 'breakfast', price: 180, per: 'day', img: 'day-breakfast.jpg',
    he: { name: 'סל בוקר מקומי', desc: 'לחם מהכפר, גבינות עיזים, תמרים וקפה. לזוג, בכל בוקר.' },
    en: { name: 'Local breakfast basket', desc: 'Village bread, goat cheese, dates and coffee. For two, every morning.' } },
  { id: 'massage', price: 650, per: 'once', img: 'exp-massage.jpg',
    he: { name: 'עיסוי זוגי במרפסת', desc: '60 דקות בשקיעה, מול העמק.' },
    en: { name: 'Couples massage on the terrace', desc: '60 minutes at sunset, facing the valley.' } },
  { id: 'dinner', price: 520, per: 'once', img: 'exp-dinner.jpg',
    he: { name: 'ארוחת שף בחצר', desc: 'ארוחת ערב מקומית לזוג, מוגשת בחצר עם נרות.' },
    en: { name: 'Chef\'s dinner in the courtyard', desc: 'A local dinner for two, served by candlelight.' } },
  { id: 'decor', price: 350, per: 'once', img: 'exp-proposal.jpg',
    he: { name: 'עיצוב חגיגי ליחידה', desc: 'ליום הולדת, יום נישואים או הצעת נישואים.' },
    en: { name: 'Celebration styling', desc: 'For a birthday, an anniversary or a proposal.' } },
  { id: 'jeep', price: 480, per: 'once', img: 'exp-jeep.jpg',
    he: { name: 'סיור ג\'יפים במדבר יהודה', desc: 'שלוש שעות עם מדריך מקומי, יוצאים מהמתחם.' },
    en: { name: 'Judean Desert jeep tour', desc: 'Three hours with a local guide, from the compound.' } },
];

// unit: shachar | melach | sela · photo: an asset or null · reply: the hosts' answer or null
export const REVIEWS = [
  { unit: 'shachar', who: { he: 'נועה ר.', en: 'Noa R.' }, city: { he: 'חיפה', en: 'Haifa' }, when: { he: 'מרץ 2026', en: 'March 2026' }, initials: 'נר', photo: 'review-coffee.jpg', lang: 'he',
    text: 'התעוררנו ב-5:30 בלי שעון, פשוט מהאור. <strong>ישבנו עם קפה על המרפסת ואף אחד מאיתנו לא דיבר עשר דקות.</strong> זה הזמן הכי ארוך שלא הסתכלנו בטלפון מאז החתונה.',
    reply: { he: 'תודה נועה! הקפה הבא עלינו.', en: 'Thank you Noa! The next coffee is on us.', by: { he: 'מאיה', en: 'Maya' } } },
  { unit: 'sela', who: { he: 'אורי ב.', en: 'Uri B.' }, city: { he: 'רמת גן', en: 'Ramat Gan' }, when: { he: 'ינואר 2026', en: 'January 2026' }, initials: 'אב', lang: 'he',
    text: '<strong>הדרך למעלה קצת מפחידה בחושך</strong>, תגיעו לפני השקיעה. חוץ מזה הכל היה מושלם.' },
  { unit: 'melach', who: { he: 'שירן ל.', en: 'Shiran L.' }, city: { he: 'מודיעין', en: 'Modi\'in' }, when: { he: 'אוקטובר 2025', en: 'October 2025' }, initials: 'של', lang: 'he',
    text: 'באנו עם שני ילדים, בני 6 ו-9, וקצת חששנו מהשקט. בסוף הם אלה שלא רצו לעזוב. <strong>עידו השאיר להם פנס ומפה לשביל הזריחה,</strong> והם קמו לבד ב-5 בבוקר. המטבח ביחידת מלח מאובזר באמת, בישלנו כל ערב.',
    reply: { he: 'הפנס מחכה להם לביקור הבא.', en: 'The flashlight is waiting for their next visit.', by: { he: 'עידו', en: 'Ido' } } },
  { unit: 'shachar', who: { he: 'Lena K.', en: 'Lena K.' }, city: { he: 'המבורג', en: 'Hamburg' }, when: { he: 'פברואר 2026', en: 'February 2026' }, initials: 'LK', lang: 'en',
    text: 'We came for the Dead Sea and stayed for the pool. <strong>Swimming at sunset with the whole valley below us felt unreal.</strong> Maya\'s tips for Masada at dawn were spot on.',
    translation: 'באנו בשביל ים המלח ונשארנו בשביל הבריכה. לשחות בשקיעה עם כל העמק מתחתינו הרגיש לא אמיתי.' },
  { unit: 'melach', who: { he: 'דנה מ.', en: 'Dana M.' }, city: { he: 'כפר סבא', en: 'Kfar Saba' }, when: { he: 'אפריל 2026', en: 'April 2026' }, initials: 'דמ', photo: 'review-kids.jpg', lang: 'he',
    text: 'הילדים ישבו ככה חצי שעה. בבית הם לא יושבים ככה חצי דקה.' },
  { unit: 'sela', who: { he: 'יוסי ש.', en: 'Yossi S.' }, city: { he: 'ירושלים', en: 'Jerusalem' }, when: { he: 'נובמבר 2025', en: 'November 2025' }, initials: 'יש', lang: 'he',
    text: 'חגגנו 35 שנות נישואים. <strong>מאיה קישטה את החצר בנרות בלי שביקשנו</strong>, כנראה ראתה בהזמנה. ה-WiFi חלש ביחידת סלע, ובדיעבד זה היה הדבר הכי טוב שקרה לנו.' },
  { unit: 'shachar', who: { he: 'עמית ג.', en: 'Amit G.' }, city: { he: 'תל אביב', en: 'Tel Aviv' }, when: { he: 'דצמבר 2025', en: 'December 2025' }, initials: 'עג', lang: 'he',
    text: 'הג\'קוזי במרפסת בעשר בלילה, עם הכוכבים מעל והאורות של ירדן מעבר לים. <strong>הצעתי שם נישואים.</strong> היא אמרה כן, אז אני חייב לתת חמישה כוכבים.',
    reply: { he: 'מזל טוב! מחכים לכם ביום הנישואים הראשון.', en: 'Congratulations! See you on your first anniversary.', by: { he: 'מאיה ועידו', en: 'Maya & Ido' } } },
  { unit: 'melach', who: { he: 'רונית ח.', en: 'Ronit H.' }, city: { he: 'באר שבע', en: 'Be\'er Sheva' }, when: { he: 'מאי 2026', en: 'May 2026' }, initials: 'רח', lang: 'he',
    text: 'הבריכה מחוממת באמת, גם בערב. <strong>היחידה גדולה יותר ממה שנראה בתמונות.</strong> רק חבל שאין עוד מקום בחניה לרכב שני.' },
  { unit: 'sela', who: { he: 'Marc D.', en: 'Marc D.' }, city: { he: 'ליון', en: 'Lyon' }, when: { he: 'מרץ 2026', en: 'March 2026' }, initials: 'MD', lang: 'en',
    text: 'The stone suite stays cool even at midday. <strong>Showering outside under the olive tree is something I will miss.</strong> Bring good shoes for Nahal Dragot.',
    translation: 'הסוויטה נשארת קרירה גם בצהריים. מקלחת בחוץ מתחת לעץ הזית היא משהו שיחסר לי.' },
  { unit: 'shachar', who: { he: 'מיכל ו.', en: 'Michal V.' }, city: { he: 'רעננה', en: 'Ra\'anana' }, when: { he: 'ינואר 2026', en: 'January 2026' }, initials: 'מו', lang: 'he',
    text: 'סל הבוקר הגיע בדיוק בשמונה, עם לחם חם. קטן אבל מושלם.' },
  { unit: 'melach', who: { he: 'אלון ק.', en: 'Alon K.' }, city: { he: 'נתניה', en: 'Netanya' }, when: { he: 'אוגוסט 2025', en: 'August 2025' }, initials: 'אק', lang: 'he',
    text: 'נסענו באוגוסט וחששנו מהחום. <strong>בבוקר ובערב זה גן עדן, בצהריים נשארים בפנים או בבריכה.</strong> עידו המליץ על עין גדי בשבע בבוקר וזה היה בול.' },
  { unit: 'sela', who: { he: 'הדס א.', en: 'Hadas A.' }, city: { he: 'קיסריה', en: 'Caesarea' }, when: { he: 'פברואר 2026', en: 'February 2026' }, initials: 'הא', lang: 'he',
    text: 'החצר בלילה, עם הפנסים והשקט, שווה את כל הנסיעה. <strong>אמבט האבן הוא הדבר הכי יפה שראיתי בצימר.</strong>',
    reply: { he: 'תודה הדס, נעביר את המחמאה לסלע.', en: 'Thank you Hadas, we\'ll pass the compliment on to the stone.', by: { he: 'עידו', en: 'Ido' } } },
];

/* ---------- availability (sample): a stable pseudo-random set of booked nights per unit ---------- */
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// Friday and Saturday nights are weekend nights in Israel
export const isWeekendNight = (d) => d.getDay() === 5 || d.getDay() === 6;
export function isBooked(unitId, d) {
  const key = iso(d);
  const r = hash(`${unitId}:${key}`);
  // weekends book up more often
  return r < (isWeekendNight(d) ? 0.42 : 0.18);
}
export function nightsBetween(checkin, checkout) {
  const nights = [];
  for (let d = parseISO(checkin); iso(d) < checkout; d = addDays(d, 1)) nights.push(new Date(d));
  return nights;
}
export function quote(unitId, checkin, checkout) {
  const u = UNITS[unitId];
  const nights = nightsBetween(checkin, checkout);
  const total = nights.reduce((sum, d) => sum + (isWeekendNight(d) ? u.weekend : u.weekday), 0);
  const available = nights.length > 0 && nights.every((d) => !isBooked(unitId, d));
  const hasWeekend = nights.some(isWeekendNight);
  return { nights, total, available, minNightsOk: !hasWeekend || nights.length >= 2 };
}
export const money = (n, lang) => (lang === 'en' ? `₪${n.toLocaleString('en-US')}` : `₪${n.toLocaleString('he-IL')}`);
