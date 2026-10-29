// Unit page template: suite.html?u=shachar|melach|sela, rendered from data.js in either language.
import { UNITS, AMENITIES, ADDONS, REVIEWS, quote, money, ROOT } from '../data.js';
import { openLightbox } from './lightbox.js';

const ICONS = {
  bed: '<path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6M3 15h18M7 9V6h10v3"/>',
  jacuzzi: '<path d="M3 13h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2zM8 9c0-1.5 1-1.5 1-3M12 9c0-1.5 1-1.5 1-3M16 9c0-1.5 1-1.5 1-3"/>',
  coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9zM16 11h2a2 2 0 0 1 0 4h-2M8 4v2M11 4v2"/>',
  shower: '<path d="M6 21V7a3 3 0 0 1 6 0M9 10h8M11 14v1M14 14v1M17 14v1M12 18v1M15 18v1"/>',
  ac: '<path d="M4 6h16v6H4zM8 16l-1 3M12 16v3M16 16l1 3M7 9h10"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  linen: '<path d="M4 7h16v4H4zM6 11v8M18 11v8M9 15h6"/>',
  terrace: '<path d="M3 20h18M5 20V11M19 20V11M3 11h18L12 5z"/>',
  kids: '<circle cx="9" cy="7" r="2.5"/><circle cx="16" cy="9" r="2"/><path d="M5 20v-3a4 4 0 0 1 8 0v3M13 20v-2a3 3 0 0 1 6 0v2"/>',
  kitchen: '<path d="M4 4h16v16H4zM4 10h16M9 4v6M8 14h3"/>',
  courtyard: '<path d="M12 21v-7M12 14c-4 0-6-3-6-6a6 6 0 0 1 12 0c0 3-2 6-6 6zM4 21h16"/>',
  outshower: '<path d="M7 21V6a2 2 0 0 1 4 0v1M8 10h7M10 13v1M13 13v1M11 16v1M14 16v1M3 21h18"/>',
  bath: '<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ''}</svg>`;

const L = {
  he: {
    home: 'דף הבית', suites: 'היחידות', from: 'החל מ-', night: 'ללילה', checkin: 'הגעה', checkout: 'עזיבה', guests: 'אורחים',
    guestOpt: (n) => (n === 1 ? 'אורח אחד' : `${n} אורחים`), book: 'להזמנה', check: 'בדיקת זמינות',
    pickDates: 'בחרו תאריכים כדי לראות מחיר כולל', free: 'ביטול חינם עד 14 יום לפני ההגעה', total: (n) => `סה"כ ל-${n} לילות`,
    booked: 'היחידה תפוסה באחד הלילות. נסו תאריכים אחרים.', tooMany: (n) => `היחידה מתאימה עד ${n} אורחים.`, minN: 'בסוף שבוע מינימום 2 לילות.',
    photos: (n) => `כל ${n} התמונות`, about: 'על היחידה', inUnit: 'מה יש ביחידה', plan: 'תוכנית היחידה', included: 'מה כלול',
    inc: (u) => [u.breakfast ? 'סל בוקר מקומי בכל בוקר' : 'סל בוקר בתוספת של ₪180', 'גישה לבריכה המחוממת', 'חניה פרטית', 'צ\'ק-אין מ-15:00, צ\'ק-אאוט עד 11:00', 'מצעים, מגבות וחלוקים', 'קפה, תה ומים מינרלים'],
    addons: 'להוסיף לחופשה', addAt: 'אפשר להוסיף בזמן ההזמנה', perDay: 'ליום', once: '', reviews: (n) => `מה כתבו על ${n}`, others: 'יחידות נוספות',
    guestsUp: (n) => `עד ${n} אורחים`, size: 'מ"ר', bedroomsN: (n) => (n === 1 ? 'חדר שינה אחד' : `${n} חדרי שינה`), more: 'לפרטים', planNote: (s) => `${s} מ"ר · תרשים להמחשה`,
    living: 'סלון', bedroom: 'חדר שינה', kids: 'חדר ילדים', bath: 'מקלחת', terrace: 'מרפסת', court: 'חצר', kitchen: 'מטבח',
  },
  en: {
    home: 'Home', suites: 'Suites', from: 'From ', night: 'a night', checkin: 'Arrival', checkout: 'Departure', guests: 'Guests',
    guestOpt: (n) => (n === 1 ? '1 guest' : `${n} guests`), book: 'Book', check: 'Check availability',
    pickDates: 'Choose dates to see the total price', free: 'Free cancellation up to 14 days before arrival', total: (n) => `Total for ${n} nights`,
    booked: 'One of these nights is booked. Try other dates.', tooMany: (n) => `This unit sleeps up to ${n}.`, minN: 'Weekends: 2 nights minimum.',
    photos: (n) => `All ${n} photos`, about: 'About the unit', inUnit: 'In the unit', plan: 'Floor plan', included: 'What\'s included',
    inc: (u) => [u.breakfast ? 'Local breakfast basket every morning' : 'Breakfast basket for ₪180 extra', 'Access to the heated pool', 'Private parking', 'Check-in from 15:00, check-out by 11:00', 'Linen, towels and robes', 'Coffee, tea and mineral water'],
    addons: 'Add to your stay', addAt: 'Add any of these while booking', perDay: 'a day', once: '', reviews: (n) => `What guests wrote about ${n}`, others: 'Other units',
    guestsUp: (n) => `Up to ${n} guests`, size: 'm²', bedroomsN: (n) => (n === 1 ? '1 bedroom' : `${n} bedrooms`), more: 'Details', planNote: (s) => `${s} m² · illustrative plan`,
    living: 'Living', bedroom: 'Bedroom', kids: 'Kids', bath: 'Bath', terrace: 'Terrace', court: 'Courtyard', kitchen: 'Kitchen',
  },
};

function planSVG(id, t) {
  // simple illustrative floor plans, drawn in the site's line style
  // rooms share walls like a real plan; outdoor areas are dashed
  const room = (x, y, w, h, label, out) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${out ? ' class="out"' : ''}/><text x="${x + w / 2}" y="${y + h / 2 + 3}" text-anchor="middle">${label}</text>`;
  const plans = {
    shachar: room(0, 0, 240, 160, t.bedroom) + room(240, 0, 100, 90, t.bath) + room(240, 90, 100, 70, t.kitchen) + room(0, 160, 340, 80, t.terrace, 1),
    melach: room(0, 0, 170, 130, t.living) + room(170, 0, 170, 130, t.kitchen) + room(0, 130, 120, 110, t.bedroom) + room(120, 130, 120, 110, t.kids) + room(240, 130, 100, 110, t.bath),
    sela: room(0, 0, 210, 150, t.bedroom) + room(210, 0, 130, 150, t.bath) + room(0, 150, 340, 90, t.court, 1),
  };
  return `<svg viewBox="-2 -2 344 244" role="img" aria-label="${t.plan}"><g fill="none" stroke="#A64B25" stroke-width=".75">${plans[id]}</g><style>rect.out{stroke-dasharray:3 4;stroke:#C9A58E}text{fill:#6B5F55;stroke:none;font:400 9.5px var(--font-body);letter-spacing:.04em}</style></svg>`;
}

export function render({ lang }) {
  const he = lang === 'he';
  const t = L[lang];
  const params = new URLSearchParams(location.search);
  const id = UNITS[params.get('u')] ? params.get('u') : 'shachar';
  const u = UNITS[id];
  const c = u[lang];
  document.title = `${c.name} · ${he ? 'צוק' : 'Tzuk'}`;
  document.querySelector('meta[name="description"]').content = `${c.name}: ${c.tag}.`;
  const img = (f) => `${ROOT}assets/img/${f}`;
  const guestOptions = [1, 2, 3, 4, 5].map((n) => `<option value="${n}"${n === Math.min(2, u.guests) ? ' selected' : ''}${n > u.guests ? ' disabled' : ''}>${t.guestOpt(n)}</option>`).join('');
  const reviews = REVIEWS.filter((r) => r.unit === id).slice(0, 3);
  const others = Object.keys(UNITS).filter((k) => k !== id);
  const cal = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';

  document.getElementById('main').innerHTML = `
    <section class="page-hero" aria-labelledby="unitTitle">
      <div class="wrap">
        <div class="page-hero-copy">
          <ol class="crumbs"><li><a href="index.html">${t.home}</a></li><li><a href="suites.html">${t.suites}</a></li><li aria-current="page">${c.name}</li></ol>
          <p class="depth-tag"><span class="depth-label">${c.type}</span></p>
          <h1 id="unitTitle" class="h1">${c.name}</h1>
          <p class="lead">${c.tag}.</p>
        </div>
        <div class="unit-gallery">
          ${u.gallery.map((g, i) => `<button type="button" data-lb="${i}" aria-label="${c.name}, ${i + 1}/${u.gallery.length}"><img src="${img(g)}" alt="" ${i ? 'loading="lazy"' : ''} width="1200" height="900">${i === u.gallery.length - 1 ? `<span class="all-photos">${t.photos(u.gallery.length)}</span>` : ''}</button>`).join('')}
        </div>
      </div>
    </section>

    <div class="wrap unit-layout">
      <div class="unit-main">
        <section aria-labelledby="aboutTitle">
          <p class="depth-tag"><span class="depth-label">${t.about}</span></p>
          <h2 id="aboutTitle" class="h2">${c.headline}</h2>
          ${c.body.map((p) => `<p>${p}</p>`).join('')}
          <ul class="facts"><li>${t.guestsUp(u.guests)}</li><li><bdi>${u.size}</bdi> ${t.size}</li><li>${t.bedroomsN(u.bedrooms)}</li><li>${c.beds}</li><li>${c.view}</li></ul>
        </section>
        <section aria-labelledby="amenTitle">
          <h2 id="amenTitle" class="h2">${t.inUnit}</h2>
          <ul class="icon-grid">${u.amenities.map((a) => `<li>${svg(a)}${AMENITIES[a][lang]}</li>`).join('')}</ul>
        </section>
        <section aria-labelledby="planTitle">
          <h2 id="planTitle" class="h2">${t.plan}</h2>
          <div class="plan">${planSVG(id, t)}<p class="card-note">${t.planNote(u.size)}</p></div>
        </section>
        <section aria-labelledby="incTitle">
          <h2 id="incTitle" class="h2">${t.included}</h2>
          <ul class="included">${t.inc(u).map((x) => `<li>${x}</li>`).join('')}</ul>
        </section>
      </div>

      <aside class="booking-card" aria-label="${t.check}">
        <p class="from">${t.from}<bdi>${money(u.weekday, lang)}</bdi> ${t.night}</p>
        <form id="unitBook" action="book.html" method="get" data-range data-unit="${id}">
          <input type="hidden" name="unit" value="${id}">
          <div class="fields">
            <div class="field"><span class="field-label" id="uIn">${t.checkin}</span><button type="button" class="dp-trigger" data-role="checkin" aria-labelledby="uIn">${cal}<span class="dp-value"></span></button><input type="hidden" name="checkin"></div>
            <div class="field"><span class="field-label" id="uOut">${t.checkout}</span><button type="button" class="dp-trigger" data-role="checkout" aria-labelledby="uOut">${cal}<span class="dp-value"></span></button><input type="hidden" name="checkout"></div>
            <div class="field" style="grid-column:1/-1"><label class="field-label" for="uGuests">${t.guests}</label><select id="uGuests" name="guests">${guestOptions}</select></div>
          </div>
          <p class="card-msg" id="cardMsg" role="status">${t.pickDates}</p>
          <div class="card-total" id="cardTotal" hidden><span id="cardTotalLabel"></span><bdi id="cardTotalValue"></bdi></div>
          <button type="submit" class="btn btn-primary" id="cardSubmit">${t.book}</button>
          <p class="card-note">${t.free}</p>
        </form>
      </aside>
    </div>

    <section class="section" aria-labelledby="addTitle">
      <div class="wrap">
        <header class="section-head"><h2 id="addTitle" class="h2">${t.addons}</h2><p class="section-lead">${t.addAt}</p></header>
        <div class="addon-row">${ADDONS.slice(0, 3).map((a) => `<article class="addon-card reveal"><img src="${img(a.img)}" alt="" loading="lazy" width="1200" height="900"><div class="addon-body"><h3>${a[lang].name}</h3><p>${a[lang].desc}</p><p class="addon-price"><bdi>${money(a.price, lang)}</bdi> ${a.per === 'day' ? t.perDay : ''}</p></div></article>`).join('')}</div>
      </div>
    </section>

    <section class="section reviews" aria-labelledby="revTitle">
      <div class="wrap">
        <header class="section-head"><h2 id="revTitle" class="h2">${t.reviews(c.name)}</h2></header>
        <div class="review-grid">${reviews.map((r) => reviewHTML(r, lang)).join('')}</div>
        <p class="section-cta"><a href="reviews.html?unit=${id}" class="link-arrow">${he ? 'לכל חוות הדעת' : 'All reviews'}</a></p>
      </div>
    </section>

    <section class="section" aria-labelledby="otherTitle">
      <div class="wrap">
        <header class="section-head"><h2 id="otherTitle" class="h2">${t.others}</h2></header>
        <div class="other-units">${others.map((k) => `<article class="suite-card reveal"><a href="suite.html?u=${k}" class="suite-media"><img src="${img(UNITS[k].cover)}" alt="" loading="lazy" width="1200" height="905"><span class="suite-name">${UNITS[k][lang].name}</span></a><div class="suite-body"><p class="suite-tag">${UNITS[k][lang].tag}</p><p class="suite-price">${t.from}<bdi>${money(UNITS[k].weekday, lang)}</bdi> ${t.night}</p><a href="suite.html?u=${k}" class="btn btn-ghost">${t.more}</a></div></article>`).join('')}</div>
      </div>
    </section>

    <div class="unit-bar"><p>${t.from}<bdi>${money(u.weekday, lang)}</bdi> ${t.night}</p><a href="#unitBook" class="btn btn-primary btn-sm">${t.check}</a></div>`;

  document.querySelectorAll('.unit-gallery [data-lb]').forEach((b) => b.addEventListener('click', () => openLightbox(u.gallery.map((g) => ({ src: img(g), alt: c.name })), Number(b.dataset.lb), lang)));

  const form = document.getElementById('unitBook');
  const guests = form.querySelector('select[name="guests"]');
  const msg = document.getElementById('cardMsg');
  const totalBox = document.getElementById('cardTotal');
  const submit = document.getElementById('cardSubmit');
  function update() {
    const checkin = form.querySelector('input[name="checkin"]').value;
    const checkout = form.querySelector('input[name="checkout"]').value;
    totalBox.hidden = true;
    submit.disabled = false;
    if (!checkin || !checkout) { msg.textContent = t.pickDates; return; }
    const q = quote(id, checkin, checkout);
    if (!q.available) { msg.textContent = t.booked; submit.disabled = true; return; }
    if (!q.minNightsOk) { msg.textContent = t.minN; submit.disabled = true; return; }
    if (Number(guests.value) > u.guests) { msg.textContent = t.tooMany(u.guests); submit.disabled = true; return; }
    msg.textContent = '';
    document.getElementById('cardTotalLabel').textContent = t.total(q.nights.length);
    document.getElementById('cardTotalValue').textContent = money(q.total, lang);
    totalBox.hidden = false;
  }
  form.addEventListener('rangechange', update);
  guests.addEventListener('change', update);
}

export function reviewHTML(r, lang) {
  const he = lang === 'he';
  const unitName = UNITS[r.unit][lang].name;
  const unitLabel = he ? `${r.unit === 'melach' ? 'יחידת' : 'סוויטת'} ${unitName}` : `${unitName} ${r.unit === 'melach' ? 'unit' : 'suite'}`;
  const foreign = r.lang !== lang;
  return `<article class="review reveal"${r.lang === 'en' ? ' lang="en" dir="ltr"' : ' lang="he" dir="rtl"'}>
    ${r.photo ? `<img src="${ROOT}assets/img/${r.photo}" alt="" loading="lazy" class="review-photo" width="1200" height="905">` : ''}
    <p>${r.text}</p>
    ${foreign && r.translation && he ? `<p class="translation" lang="he" dir="rtl">"${r.translation}"</p>` : ''}
    <footer><span class="avatar" aria-hidden="true">${r.initials}</span><span><b>${r.who[lang]}</b>, ${r.city[lang]}<br><small>${unitLabel} · ${r.when[lang]}</small></span></footer>
    ${r.reply ? `<p class="host-reply"${r.lang !== lang ? ` lang="${lang}" dir="${he ? 'rtl' : 'ltr'}"` : ''}>${r.reply[lang]} <span>· ${r.reply.by[lang]}</span></p>` : ''}
  </article>`;
}
