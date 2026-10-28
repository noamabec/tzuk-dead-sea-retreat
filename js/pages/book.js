// Booking flow: dates → unit → add-ons → guest details → payment.
// Portfolio project: no card page. "To payment" shows a short loading state, then a designed
// temporary-error message with a WhatsApp fallback. Nothing is stored or sent anywhere.
import { UNITS, ADDONS, CONTACT, quote, money, parseISO, ROOT } from '../data.js';

const L = {
  he: {
    pickDates: 'בחרו תאריך הגעה ותאריך עזיבה.', minN: 'בסופי שבוע (שישי ושבת) אפשר להזמין מ-2 לילות.',
    s2Lead: (n, g) => `${n} לילות, ${g === 1 ? 'אורח אחד' : `${g} אורחים`}. מוצגות היחידות שמתאימות לכם.`,
    pickUnit: 'בחרו יחידה כדי להמשיך.', select: 'בחירה', selected: 'נבחרה', total: (n) => `ל-${n} לילות`,
    booked: 'תפוסה בתאריכים האלה', small: (n) => `מתאימה עד ${n} אורחים`, kidsNo: 'מיועדת למבוגרים בלבד',
    add: 'הוספה', added: 'נוסף ✓', included: 'כלול ביחידה', perDay: (n) => `ליום · ${n} ימים`, once: 'פעם אחת',
    dates: 'תאריכים', nights: 'לילות', guests: 'אורחים', unit: 'יחידה', addons: 'תוספות', totalLbl: 'סה"כ',
    empty: 'בחרו תאריכים כדי להתחיל.', guestN: (a, k) => `${a} מבוגרים${k ? ` + ${k} ילדים` : ''}`,
    loadingTitle: 'מעבירים אתכם לתשלום מאובטח…', loadingText: 'זה לוקח רק כמה שניות.',
    errTitle: 'אירעה תקלה זמנית במערכת ההזמנות.',
    errText: 'ההזמנה לא בוצעה ולא חויבתם. אפשר לנסות שוב בעוד כמה דקות, או לסגור את ההזמנה איתנו בוואטסאפ, עם כל הפרטים שכבר מילאתם.',
    retry: 'ניסיון חוזר', wa: 'המשך בוואטסאפ', back: 'חזרה לפרטים',
    waText: (s) => `שלום, אני רוצה להזמין ב${s.unit} מ-${s.checkin} עד ${s.checkout} (${s.nights} לילות, ${s.guests}). ${s.addons ? `תוספות: ${s.addons}. ` : ''}סה"כ ${s.total}. שם: ${s.name}`,
    fmt: (s) => { const d = parseISO(s); return `${d.getDate()}.${d.getMonth() + 1}`; },
  },
  en: {
    pickDates: 'Choose your arrival and departure dates.', minN: 'Weekend stays (Friday and Saturday) are 2 nights minimum.',
    s2Lead: (n, g) => `${n} nights, ${g === 1 ? '1 guest' : `${g} guests`}. Showing the units that fit.`,
    pickUnit: 'Choose a unit to continue.', select: 'Select', selected: 'Selected', total: (n) => `for ${n} nights`,
    booked: 'Booked on these dates', small: (n) => `Sleeps up to ${n}`, kidsNo: 'Adults only',
    add: 'Add', added: 'Added ✓', included: 'Included with this unit', perDay: (n) => `a day · ${n} days`, once: 'once',
    dates: 'Dates', nights: 'Nights', guests: 'Guests', unit: 'Unit', addons: 'Add-ons', totalLbl: 'Total',
    empty: 'Choose dates to get started.', guestN: (a, k) => `${a} adults${k ? ` + ${k} kids` : ''}`,
    loadingTitle: 'Taking you to secure payment…', loadingText: 'This only takes a few seconds.',
    errTitle: 'Our booking system hit a temporary error.',
    errText: 'Your booking wasn\'t made and you weren\'t charged. Try again in a few minutes, or finish the booking with us on WhatsApp with everything you\'ve already filled in.',
    retry: 'Try again', wa: 'Continue on WhatsApp', back: 'Back to details',
    waText: (s) => `Hi, I'd like to book ${s.unit} from ${s.checkin} to ${s.checkout} (${s.nights} nights, ${s.guests}). ${s.addons ? `Add-ons: ${s.addons}. ` : ''}Total ${s.total}. Name: ${s.name}`,
    fmt: (s) => { const d = parseISO(s); return `${d.getMonth() + 1}/${d.getDate()}`; },
  },
};

export function render({ lang }) {
  const t = L[lang];
  const params = new URLSearchParams(location.search);
  const state = { step: 1, checkin: null, checkout: null, adults: 2, kids: 0, unit: UNITS[params.get('unit')] ? params.get('unit') : null, addons: new Set() };
  const dates = document.getElementById('bookDates');
  const adults = document.getElementById('bAdults');
  const kids = document.getElementById('bKids');
  const panels = [...document.querySelectorAll('.step-panel')];
  const labels = [...document.querySelectorAll('[data-step-label]')];
  const guests = () => state.adults + state.kids;
  if (params.get('guests')) adults.value = String(Math.min(5, Number(params.get('guests')) || 2));
  if (params.get('checkin')) dates.querySelector('input[name="checkin"]').value = params.get('checkin');
  if (params.get('checkout')) dates.querySelector('input[name="checkout"]').value = params.get('checkout');

  const nightsCount = () => (state.checkin && state.checkout ? quote('shachar', state.checkin, state.checkout).nights.length : 0);
  function unitStatus(id) {
    const u = UNITS[id];
    const q = quote(id, state.checkin, state.checkout);
    if (!q.available) return { ok: false, reason: t.booked, q };
    if (guests() > u.guests) return { ok: false, reason: t.small(u.guests), q };
    if (id === 'shachar' && state.kids > 0) return { ok: false, reason: t.kidsNo, q };
    return { ok: true, q };
  }
  function addonPrice(a) {
    const u = state.unit && UNITS[state.unit];
    if (a.id === 'breakfast' && u?.breakfast) return 0;
    return a.per === 'day' ? a.price * nightsCount() : a.price;
  }
  function totals() {
    const room = state.unit ? quote(state.unit, state.checkin, state.checkout).total : 0;
    const extras = ADDONS.filter((a) => state.addons.has(a.id)).reduce((s, a) => s + addonPrice(a), 0);
    return { room, extras, total: room + extras };
  }

  function renderSummary() {
    const box = document.getElementById('sumContent');
    const img = document.getElementById('sumImg');
    img.src = `${ROOT}assets/img/${state.unit ? UNITS[state.unit].cover : 'hero-pool.jpg'}`;
    if (!state.checkin || !state.checkout) { box.innerHTML = `<p class="sum-empty">${t.empty}</p>`; return; }
    const tt = totals();
    const chosen = ADDONS.filter((a) => state.addons.has(a.id));
    box.innerHTML = `<dl>
      <dt>${t.dates}</dt><dd><bdi>${t.fmt(state.checkin)} – ${t.fmt(state.checkout)}</bdi></dd>
      <dt>${t.nights}</dt><dd>${nightsCount()}</dd>
      <dt>${t.guests}</dt><dd>${t.guestN(state.adults, state.kids)}</dd>
      ${state.unit ? `<dt>${t.unit}</dt><dd>${UNITS[state.unit][lang].name} · <bdi>${money(tt.room, lang)}</bdi></dd>` : ''}
      ${chosen.map((a) => `<dt>${a[lang].name}</dt><dd><bdi>${addonPrice(a) ? money(addonPrice(a), lang) : t.included}</bdi></dd>`).join('')}
    </dl>${state.unit ? `<div class="sum-total"><span>${t.totalLbl}</span><bdi>${money(tt.total, lang)}</bdi></div>` : ''}`;
  }

  function renderUnits() {
    document.getElementById('s2Lead').textContent = t.s2Lead(nightsCount(), guests());
    const ids = Object.keys(UNITS).sort((a, b) => Number(unitStatus(b).ok) - Number(unitStatus(a).ok));
    if (state.unit && !unitStatus(state.unit).ok) state.unit = null;
    document.getElementById('unitOptions').innerHTML = ids.map((id) => {
      const u = UNITS[id]; const s = unitStatus(id); const sel = state.unit === id;
      return `<article class="unit-option${sel ? ' is-selected' : ''}${s.ok ? '' : ' is-unavailable'}">
        <img src="${ROOT}assets/img/${u.cover}" alt="" width="1200" height="905" loading="lazy">
        <div><h3>${u[lang].name}</h3><p>${u[lang].tag}</p><p>${lang === 'he' ? `עד ${u.guests} אורחים · ${u.size} מ"ר` : `Sleeps ${u.guests} · ${u.size} m²`}</p>${s.ok ? '' : `<p class="reason">${s.reason}</p>`}</div>
        <div class="opt-price">${s.ok ? `<strong><bdi>${money(s.q.total, lang)}</bdi></strong><small>${t.total(s.q.nights.length)}</small><br><button type="button" class="btn ${sel ? 'btn-primary' : 'btn-ghost'} btn-sm" data-unit="${id}" aria-pressed="${sel}" style="margin-top:10px">${sel ? t.selected : t.select}</button>` : ''}</div>
      </article>`;
    }).join('');
    document.querySelectorAll('#unitOptions [data-unit]').forEach((b) => b.addEventListener('click', () => {
      state.unit = b.dataset.unit;
      document.getElementById('s2Msg').textContent = '';
      renderUnits(); renderSummary();
    }));
  }

  function renderAddons() {
    document.getElementById('addonOptions').innerHTML = ADDONS.map((a) => {
      const included = a.id === 'breakfast' && UNITS[state.unit]?.breakfast;
      const on = state.addons.has(a.id);
      const price = a.per === 'day' ? `<bdi>${money(a.price, lang)}</bdi> ${t.perDay(nightsCount())}` : `<bdi>${money(a.price, lang)}</bdi>`;
      return `<article class="addon-option${on || included ? ' is-on' : ''}">
        <img src="${ROOT}assets/img/${a.img}" alt="" width="96" height="96" loading="lazy">
        <div><h3>${a[lang].name}</h3><p>${a[lang].desc}</p>
        ${included ? `<p><strong>${t.included}</strong></p>` : `<p>${price}</p><button type="button" class="addon-toggle" data-addon="${a.id}" aria-pressed="${on}">${on ? t.added : t.add}</button>`}</div>
      </article>`;
    }).join('');
    document.querySelectorAll('[data-addon]').forEach((b) => b.addEventListener('click', () => {
      if (state.addons.has(b.dataset.addon)) state.addons.delete(b.dataset.addon); else state.addons.add(b.dataset.addon);
      renderAddons(); renderSummary();
    }));
  }

  function go(step, initial = false) {
    state.step = step;
    panels.forEach((p) => { p.hidden = Number(p.dataset.step) !== step; });
    labels.forEach((l) => {
      const n = Number(l.dataset.stepLabel);
      l.classList.toggle('is-done', n < step);
      l.classList.toggle('is-current', n === step);
      if (n === step) l.setAttribute('aria-current', 'step'); else l.removeAttribute('aria-current');
    });
    if (step === 2) renderUnits();
    if (step === 3) renderAddons();
    renderSummary();
    const top = document.getElementById('bookRoot').getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) (window.__lenis ? window.__lenis.scrollTo(top, { immediate: true }) : window.scrollTo(0, top));
    const heading = panels[step - 1].querySelector('h2, .pay-state');
    if (!initial) heading?.focus({ preventScroll: true });
    window.ScrollTrigger?.refresh();
  }

  function datesValid() {
    const msg = document.getElementById('s1Msg');
    if (!state.checkin || !state.checkout) { msg.textContent = t.pickDates; return false; }
    if (!quote('shachar', state.checkin, state.checkout).minNightsOk) { msg.textContent = t.minN; return false; }
    msg.textContent = '';
    return true;
  }

  function guestValid() {
    let ok = true;
    document.querySelectorAll('#guestForm [required]').forEach((f) => {
      const v = f.type === 'checkbox' ? f.checked : f.value.trim();
      const bad = !v || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) || (f.type === 'tel' && f.value.replace(/\D/g, '').length < 9);
      f.closest('.form-field').classList.toggle('has-error', bad);
      f.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { f.focus(); ok = false; }
    });
    return ok;
  }

  function pay() {
    const box = document.getElementById('payState');
    box.innerHTML = `<div class="spinner" aria-hidden="true"></div><h2 class="h2">${t.loadingTitle}</h2><p>${t.loadingText}</p>`;
    go(5);
    setTimeout(() => {
      const chosen = ADDONS.filter((a) => state.addons.has(a.id)).map((a) => a[lang].name).join(', ');
      const text = t.waText({ unit: UNITS[state.unit][lang].name, checkin: t.fmt(state.checkin), checkout: t.fmt(state.checkout), nights: nightsCount(), guests: t.guestN(state.adults, state.kids), addons: chosen, total: money(totals().total, lang), name: document.getElementById('gName').value.trim() });
      box.innerHTML = `<svg class="pay-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.5"/></svg>
        <h2 class="h2">${t.errTitle}</h2><p>${t.errText}</p>
        <div class="btn-row"><button type="button" class="btn btn-ghost" data-retry>${t.retry}</button><a class="btn btn-primary" href="${CONTACT.whatsapp}?text=${encodeURIComponent(text)}">${t.wa}</a></div>
        <p style="margin-top:18px"><button type="button" class="btn-back" data-back4>${t.back}</button></p>`;
      box.setAttribute('role', 'alert');
      box.focus({ preventScroll: true });
      box.querySelector('[data-retry]').addEventListener('click', pay);
      box.querySelector('[data-back4]').addEventListener('click', () => go(4));
    }, 1800);
  }

  dates.addEventListener('rangechange', (e) => {
    state.checkin = e.detail.checkin; state.checkout = e.detail.checkout;
    if (state.checkin && state.checkout) document.getElementById('s1Msg').textContent = '';
    renderSummary();
  });
  adults.addEventListener('change', () => { state.adults = Number(adults.value); renderSummary(); });
  kids.addEventListener('change', () => { state.kids = Number(kids.value); renderSummary(); });
  state.adults = Number(adults.value);

  panels.forEach((p) => {
    p.querySelector('[data-next]')?.addEventListener('click', () => {
      if (state.step === 1 && !datesValid()) return;
      if (state.step === 2 && !state.unit) { document.getElementById('s2Msg').textContent = t.pickUnit; return; }
      go(state.step + 1);
    });
    p.querySelector('[data-back]')?.addEventListener('click', () => go(state.step - 1));
  });
  document.querySelector('[data-pay]').addEventListener('click', () => { if (guestValid()) pay(); });
  document.getElementById('guestForm').addEventListener('input', (e) => {
    const f = e.target.closest('.form-field');
    if (f?.classList.contains('has-error')) { f.classList.remove('has-error'); e.target.setAttribute('aria-invalid', 'false'); }
  });

  // arriving with dates (from the home bar or a unit page) skips straight to choosing a unit
  queueMicrotask(() => {
    if (dates.querySelector('input[name="checkin"]').value && dates.querySelector('input[name="checkout"]').value) {
      state.checkin = dates.querySelector('input[name="checkin"]').value;
      state.checkout = dates.querySelector('input[name="checkout"]').value;
      if (datesValid()) { go(2, true); return; }
    }
    go(1, true);
  });
}
