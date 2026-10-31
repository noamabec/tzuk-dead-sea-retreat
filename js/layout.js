// צוק · Tzuk — shared header, mobile menu, footer and floating buttons, rendered per language.
// Each page sets <html lang dir data-root> and <body data-page>, and holds two placeholders:
// <div id="layout-header"></div> before <main>, <div id="layout-footer"></div> after it.
import { CONTACT } from './data.js';

const NAV = [
  ['suites', 'suites.html', 'היחידות', 'Suites'],
  ['compound', 'compound.html', 'המתחם', 'The compound'],
  ['experiences', 'experiences.html', 'חוויות', 'Experiences'],
  ['gallery', 'gallery.html', 'גלריה', 'Gallery'],
  ['about', 'about.html', 'הסיפור שלנו', 'Our story'],
  ['guest-info', 'guest-info.html', 'מידע לאורחים', 'Guest info'],
  ['contact', 'contact.html', 'צור קשר', 'Contact'],
];

const T = {
  he: {
    homeLabel: 'צוק, לדף הבית', sub: 'ים המלח', book: 'להזמנה', check: 'בדיקת זמינות', other: 'EN', otherLang: 'en', otherName: 'English',
    open: 'פתיחת תפריט', menu: 'תפריט ראשי', mobileMenu: 'תפריט מובייל', skip: 'דילוג לתוכן',
    footCta: 'הזריחה הבאה מחכה.', whatsapp: 'וואטסאפ', blurb: 'מתחם אירוח על הצוק, מצוקי דרגות, ים המלח',
    cols: [['היחידות', [['suite.html?u=shachar', 'שחר'], ['suite.html?u=melach', 'מלח'], ['suite.html?u=sela', 'סלע']]],
      ['המתחם', [['compound.html', 'בריכה ומתקנים'], ['experiences.html', 'חוויות'], ['gallery.html', 'גלריה']]],
      ['מידע', [['guest-info.html', 'איך מגיעים'], ['guest-info.html#faq', 'שאלות נפוצות'], ['reviews.html', 'המלצות אורחים']]]],
    talk: 'דברו איתנו', address: 'מצוקי דרגות, ד.נ. ים המלח',
    legal: [['terms.html', 'תקנון וביטולים'], ['privacy.html', 'פרטיות'], ['accessibility.html', 'הצהרת נגישות']],
    legalLabel: 'משפטי', ig: 'אינסטגרם', fb: 'פייסבוק',
    sea: 'פני ים המלח, הנקודה הנמוכה ביותר ביבשה.', seaEnd: 'הגעתם לסוף הירידה.', seaAlt: 'גבישי מלח לבנים על חוף ים המלח', unit: 'מ\'',
    waLabel: 'כתבו לנו בוואטסאפ', a11y: 'נגישות', a11yLabel: 'תפריט נגישות',
    a11yItems: [['text', 'הגדלת טקסט'], ['contrast', 'ניגודיות גבוהה'], ['motion', 'עצירת אנימציות'], ['links', 'הדגשת קישורים']], a11yLink: 'הצהרת נגישות',
  },
  en: {
    homeLabel: 'Tzuk, home', sub: 'Dead Sea', book: 'Book', check: 'Check availability', other: 'עב', otherLang: 'he', otherName: 'עברית',
    open: 'Open menu', menu: 'Main menu', mobileMenu: 'Mobile menu', skip: 'Skip to content',
    footCta: 'The next sunrise is waiting.', whatsapp: 'WhatsApp', blurb: 'A cliff-top retreat at Metzoke Dragot, Dead Sea',
    cols: [['Suites', [['suite.html?u=shachar', 'Shachar'], ['suite.html?u=melach', 'Melach'], ['suite.html?u=sela', 'Sela']]],
      ['The compound', [['compound.html', 'Pool & facilities'], ['experiences.html', 'Experiences'], ['gallery.html', 'Gallery']]],
      ['Info', [['guest-info.html', 'Getting here'], ['guest-info.html#faq', 'FAQ'], ['reviews.html', 'Guest reviews']]]],
    talk: 'Talk to us', address: 'Metzoke Dragot, Dead Sea, Israel',
    legal: [['terms.html', 'Terms & cancellation'], ['privacy.html', 'Privacy'], ['accessibility.html', 'Accessibility']],
    legalLabel: 'Legal', ig: 'Instagram', fb: 'Facebook',
    sea: 'The Dead Sea shore, the lowest point on land.', seaEnd: 'You\'ve reached the end of the descent.', seaAlt: 'White salt crystals on the Dead Sea shore', unit: 'm',
    waLabel: 'Message us on WhatsApp', a11y: 'Accessibility', a11yLabel: 'Accessibility menu',
    a11yItems: [['text', 'Larger text'], ['contrast', 'High contrast'], ['motion', 'Stop animations'], ['links', 'Highlight links']], a11yLink: 'Accessibility statement',
  },
};

const icon = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  a11y: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3 6M12 15l3 6"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
};

export function renderLayout() {
  const html = document.documentElement;
  const lang = html.lang === 'en' ? 'en' : 'he';
  const root = html.dataset.root || '';
  const page = document.body.dataset.page || '';
  const t = T[lang];
  const file = location.pathname.split('/').pop() || 'index.html';
  // the same page in the other language: Hebrew pages live at the root, English under /en/
  const otherHref = (lang === 'he' ? `en/${file}` : `../${file}`) + location.search;
  const nav = NAV.map(([key, href, he, en]) => `<li><a href="${href}"${key === page ? ' aria-current="page"' : ''}>${lang === 'he' ? he : en}</a></li>`).join('');
  const navMobile = NAV.map(([key, href, he, en]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ''}>${lang === 'he' ? he : en}</a>`).join('');

  const header = `
  <a class="skip-link" href="#main">${t.skip}</a>
  <header class="site-header${page === 'home' ? '' : ' is-inner'}" id="siteHeader">
    <div class="header-inner">
      <a href="index.html" class="logo" aria-label="${t.homeLabel}">
        <span class="logo-word">צ<span class="vav">ו</span>ק</span><span class="logo-line" aria-hidden="true"></span><span class="logo-sub">${t.sub}</span>
      </a>
      <nav class="main-nav" aria-label="${t.menu}"><ul>${nav}</ul></nav>
      <div class="header-actions">
        <a href="${otherHref}" class="lang" lang="${t.otherLang}" hreflang="${t.otherLang}">${t.other}</a>
        <a href="book.html" class="btn btn-primary btn-sm">${t.book}</a>
        <button class="burger" id="burger" aria-label="${t.open}" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" hidden>
    <nav aria-label="${t.mobileMenu}">${navMobile}</nav>
    <div class="mobile-menu-foot">
      <a href="book.html" class="btn btn-primary">${t.check}</a>
      <a href="${otherHref}" lang="${t.otherLang}">${t.otherName}</a>
      <a href="${CONTACT.phoneHref}"><bdi>${CONTACT.phone}</bdi></a>
    </div>
  </div>
  <div class="altimeter" aria-hidden="true">
    <span class="alt-rail"><span class="alt-mark" id="altMark"></span><span class="alt-value" id="altLabel"><span dir="ltr" id="altValue">+0</span> ${t.unit}</span></span>
    <span class="alt-bottom" dir="ltr">−430</span>
  </div>
  <div class="scroll-progress" aria-hidden="true"><span id="scrollProgress"></span></div>`;

  const cols = t.cols.map(([title, links]) => `<nav aria-label="${title}"><h3>${title}</h3>${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>`).join('');
  const footer = `
  <footer class="site-footer" id="footer">
    <div class="wrap footer-cta">
      <h2 class="h3">${t.footCta}</h2>
      <div class="footer-cta-actions">
        <a href="book.html" class="btn btn-primary">${t.check}</a>
        <a href="${CONTACT.whatsapp}" class="btn btn-ghost-light">${t.whatsapp}</a>
      </div>
    </div>
    <div class="wrap footer-grid">
      <div class="footer-brand"><p class="logo logo-light"><span class="logo-word">צ<span class="vav">ו</span>ק</span></p><p>${t.blurb}</p></div>
      ${cols}
      <div class="footer-contact"><h3>${t.talk}</h3><a href="${CONTACT.phoneHref}"><bdi>${CONTACT.phone}</bdi></a><a href="${CONTACT.whatsapp}">${t.whatsapp}</a><a href="mailto:${CONTACT.email}"><bdi>${CONTACT.email}</bdi></a><p>${t.address}</p></div>
    </div>
    <div class="wrap footer-legal">
      <nav aria-label="${t.legalLabel}">${t.legal.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>
      <div class="social"><a href="#" aria-label="${t.ig}">${icon.ig}</a><a href="#" aria-label="${t.fb}">${icon.fb}</a></div>
      <p>${lang === 'en' ? '© Tzuk 2026' : '© צוק 2026'} · <a class="credit" href="https://www.abecweb.com" target="_blank" rel="noopener">${lang === 'en' ? 'Website by Noam Abecassis · ' : 'האתר נבנה ע"י נועם אבקסיס · '}<bdi>www.abecweb.com</bdi></a></p>
    </div>
    <figure class="sea-level">
      <img src="${root}assets/img/day-sea.jpg" width="1200" height="1200" alt="${t.seaAlt}" loading="lazy">
      <figcaption><span class="sea-depth" dir="ltr">−430</span><span class="sea-unit">${t.unit}</span><span class="sea-text">${t.sea}<br>${t.seaEnd}</span></figcaption>
    </figure>
  </footer>
  <a href="${CONTACT.whatsapp}" class="fab-whatsapp" aria-label="${t.waLabel}">${icon.wa}</a>
  <div class="a11y">
    <button class="a11y-toggle" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="${t.a11yLabel}">${icon.a11y}</button>
    <div class="a11y-panel" id="a11yPanel" hidden>
      <p class="a11y-title">${t.a11y}</p>
      ${t.a11yItems.map(([k, l]) => `<button type="button" data-a11y="${k}">${l}</button>`).join('')}
      <a href="accessibility.html">${t.a11yLink}</a>
    </div>
  </div>`;

  document.getElementById('layout-header')?.insertAdjacentHTML('afterend', header);
  document.getElementById('layout-header')?.remove();
  document.getElementById('layout-footer')?.insertAdjacentHTML('afterend', footer);
  document.getElementById('layout-footer')?.remove();
  return { lang, root, page };
}
