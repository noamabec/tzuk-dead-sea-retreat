// צוק · Tzuk — date range picker in the site's language (replaces the native date input).
// Markup it expects inside `host`:
//   <button class="dp-trigger" data-role="checkin">…</button> <input type="hidden" name="checkin">
//   <button class="dp-trigger" data-role="checkout">…</button> <input type="hidden" name="checkout">
// Options: { lang, unit (shows booked nights + nightly prices), onChange({checkin, checkout}) }
import { UNITS, iso, parseISO, addDays, isBooked, isWeekendNight, nightsBetween } from './data.js';

const T = {
  he: {
    months: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
    days: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
    dayNames: ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'],
    pick: 'בחירת תאריך', pickIn: 'בחרו תאריך הגעה', pickOut: 'עכשיו תאריך עזיבה',
    nights: (n) => (n === 1 ? 'לילה אחד' : `${n} לילות`), clear: 'ניקוי', done: 'אישור', prev: 'החודש הקודם', next: 'החודש הבא',
    booked: 'תפוס', minNights: 'בסופי שבוע אפשר להזמין מ-2 לילות', title: 'בחירת תאריכים', close: 'סגירה',
  },
  en: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    pick: 'Select date', pickIn: 'Choose your arrival date', pickOut: 'Now your departure date',
    nights: (n) => (n === 1 ? '1 night' : `${n} nights`), clear: 'Clear', done: 'Done', prev: 'Previous month', next: 'Next month',
    booked: 'Booked', minNights: 'Weekend stays are 2 nights minimum', title: 'Select dates', close: 'Close',
  },
};

const short = (d, t) => `${t.days[d.getDay()]}, ${d.getDate()} ב${t.months[d.getMonth()]}`;
const shortEn = (d, t) => `${t.days[d.getDay()]}, ${t.months[d.getMonth()].slice(0, 3)} ${d.getDate()}`;

export function rangePicker(host, opts = {}) {
  const lang = opts.lang || 'he';
  const t = T[lang];
  const fmt = (d) => (lang === 'en' ? shortEn(d, t) : short(d, t));
  const unit = opts.unit && UNITS[opts.unit] ? opts.unit : null;
  const triggers = { checkin: host.querySelector('[data-role="checkin"]'), checkout: host.querySelector('[data-role="checkout"]') };
  const inputs = { checkin: host.querySelector('input[name="checkin"]'), checkout: host.querySelector('input[name="checkout"]') };
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const todayIso = iso(today);
  let checkin = inputs.checkin.value || null;
  let checkout = inputs.checkout.value || null;
  let hover = null;
  let view = new Date((checkin ? parseISO(checkin) : today).getFullYear(), (checkin ? parseISO(checkin) : today).getMonth(), 1, 12);
  let focusIso = checkin || todayIso;
  const mobile = () => window.matchMedia('(max-width: 720px)').matches;

  const panel = document.createElement('div');
  panel.className = 'dp-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', t.title);
  panel.hidden = true;
  const scrim = document.createElement('div');
  scrim.className = 'dp-scrim';
  scrim.hidden = true;
  // lives on <body> so sticky / transformed parents can't clip or offset it
  document.body.append(panel, scrim);

  function syncTriggers() {
    ['checkin', 'checkout'].forEach((role) => {
      const v = role === 'checkin' ? checkin : checkout;
      inputs[role].value = v || '';
      const label = triggers[role].querySelector('.dp-value');
      label.textContent = v ? fmt(parseISO(v)) : t.pick;
      triggers[role].classList.toggle('has-value', !!v);
    });
    opts.onChange?.({ checkin, checkout });
  }

  function dayState(d) {
    const key = iso(d);
    const past = key < todayIso;
    const booked = unit ? isBooked(unit, d) : false;
    const end = checkout || (checkin && hover && hover > checkin ? hover : null);
    return {
      key, past, booked,
      start: key === checkin,
      end: !!end && key === end,
      inRange: !!(checkin && end && key > checkin && key < end),
    };
  }

  // a stay can't run across a booked night
  function rangeFree(from, to) {
    if (!unit) return true;
    return nightsBetween(from, to).every((d) => !isBooked(unit, d));
  }

  function monthHTML(first) {
    const y = first.getFullYear(); const m = first.getMonth();
    const lead = first.getDay();
    const count = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < lead; i += 1) cells += '<span class="dp-cell is-empty" aria-hidden="true"></span>';
    for (let day = 1; day <= count; day += 1) {
      const d = new Date(y, m, day, 12);
      const s = dayState(d);
      const disabled = s.past || (s.booked && !(checkin && !checkout && s.key > checkin));
      const cls = ['dp-day', s.start && 'is-start', s.end && 'is-end', s.inRange && 'is-range', s.booked && 'is-booked', s.key === todayIso && 'is-today', isWeekendNight(d) && 'is-weekend'].filter(Boolean).join(' ');
      const price = unit && !s.past && !s.booked ? `<small>${(isWeekendNight(d) ? UNITS[unit].weekend : UNITS[unit].weekday).toLocaleString('en-US')}</small>` : '';
      const label = `${t.dayNames[d.getDay()]}, ${day} ${t.months[m]} ${y}${s.booked ? `, ${t.booked}` : ''}`;
      cells += `<button type="button" class="${cls}" data-date="${s.key}" ${disabled ? 'disabled' : ''} tabindex="${s.key === focusIso ? 0 : -1}" aria-label="${label}" aria-pressed="${s.start || s.end}"><span>${day}</span>${price}</button>`;
    }
    return `<div class="dp-month"><p class="dp-month-title">${t.months[m]} <span dir="ltr">${y}</span></p><div class="dp-weekdays" aria-hidden="true">${t.days.map((w) => `<span>${w}</span>`).join('')}</div><div class="dp-grid">${cells}</div></div>`;
  }

  function render() {
    const months = mobile() ? [view] : [view, new Date(view.getFullYear(), view.getMonth() + 1, 1, 12)];
    const n = checkin && checkout ? nightsBetween(checkin, checkout).length : 0;
    const status = !checkin ? t.pickIn : !checkout ? t.pickOut : t.nights(n);
    const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1, 12);
    panel.innerHTML = `
      <div class="dp-head">
        <p class="dp-status" aria-live="polite">${status}</p>
        <div class="dp-nav">
          <button type="button" class="dp-arrow" data-nav="-1" aria-label="${t.prev}" ${canPrev ? '' : 'disabled'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
          <button type="button" class="dp-arrow" data-nav="1" aria-label="${t.next}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
        </div>
      </div>
      <div class="dp-months">${months.map(monthHTML).join('')}</div>
      <div class="dp-foot">
        <p class="dp-note">${t.minNights}</p>
        <button type="button" class="dp-clear">${t.clear}</button>
        <button type="button" class="btn btn-primary btn-sm dp-done" ${checkin && checkout ? '' : 'disabled'}>${t.done}</button>
      </div>`;
    if (lang === 'en') panel.querySelectorAll('.dp-arrow svg').forEach((s) => { s.style.transform = 'scaleX(-1)'; });
  }

  function open(role) {
    if (role === 'checkout' && !checkin) role = 'checkin';
    if (role === 'checkin' && checkin && checkout) { /* re-pick from scratch on the arrival field */ }
    focusIso = (role === 'checkout' ? checkout || checkin : checkin) || todayIso;
    view = new Date(parseISO(focusIso).getFullYear(), parseISO(focusIso).getMonth(), 1, 12);
    render();
    panel.hidden = false;
    // no spot that leaves the fields visible (a full-width bar mid-screen): bring the bar up under the header, then it opens below
    const lift = place();
    if (lift > 0) {
      if (window.__lenis) window.__lenis.scrollTo(window.scrollY + lift, { duration: 0.6 });
      else window.scrollTo({ top: window.scrollY + lift, behavior: 'smooth' });
    }
    if (!raf) raf = requestAnimationFrame(follow);
    scrim.hidden = !mobile();
    host.classList.add('dp-open');
    Object.values(triggers).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    if (mobile()) window.__lenis?.stop();
    requestAnimationFrame(() => panel.querySelector(`[data-date="${focusIso}"]`)?.focus({ preventScroll: true }) || panel.querySelector('.dp-day:not([disabled])')?.focus({ preventScroll: true }));
  }
  // desktop: fixed to the viewport next to the date fields; below if it fits, else above,
  // else beside the form (the sticky booking card), else as high as the header allows
  function place() {
    panel.style.cssText = '';
    if (mobile() || panel.hidden) return 0;
    let covers = 0;
    const a = triggers.checkin.getBoundingClientRect();
    const b = triggers.checkout.getBoundingClientRect();
    const top = Math.min(a.top, b.top); const bottom = Math.max(a.bottom, b.bottom);
    const vw = document.documentElement.clientWidth; const vh = window.innerHeight;
    const minTop = (document.getElementById('siteHeader')?.offsetHeight || 76) + 8;
    if (bottom < minTop - 8 || top > vh) { close(false); return 0; } // fields scrolled away
    const w = panel.offsetWidth; const h = panel.offsetHeight;
    let y = bottom + 10;
    let x = lang === 'he' ? Math.max(a.right, b.right) - w : Math.min(a.left, b.left);
    if (y + h > vh - 12) {
      if (top - 10 - h >= minTop) y = top - 10 - h;
      else {
        y = Math.min(Math.max(minTop, top - 60), vh - 12 - h);
        y = Math.max(minTop, y);
        const box = host.getBoundingClientRect();
        if (box.right + 16 + w <= vw - 16) x = box.right + 16;
        else if (box.left - 16 - w >= 16) x = box.left - 16 - w;
        else covers = top - minTop;
      }
    }
    x = Math.min(Math.max(16, x), vw - 16 - w);
    panel.style.cssText = `position:fixed;top:${y}px;left:${x}px;right:auto;bottom:auto;max-height:${vh - y - 12}px;overflow-y:auto`;
    return covers;
  }
  // follow the fields every frame while open (smooth scroll and parallax keep moving them after scroll events end)
  let raf = 0;
  const follow = () => { place(); raf = panel.hidden ? 0 : requestAnimationFrame(follow); };

  function close(returnFocus = true) {
    if (panel.hidden) return;
    panel.hidden = true; scrim.hidden = true;
    host.classList.remove('dp-open');
    Object.values(triggers).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    window.__lenis?.start();
    if (returnFocus) triggers[checkin && !checkout ? 'checkin' : 'checkout'].focus({ preventScroll: true });
  }

  function pick(key) {
    if (!checkin || checkout || key <= checkin) {
      checkin = key; checkout = null;
    } else if (rangeFree(checkin, key)) {
      checkout = key;
    } else {
      checkin = key; checkout = null;
    }
    focusIso = key;
    hover = null;
    syncTriggers();
    render();
    panel.querySelector(`[data-date="${key}"]`)?.focus({ preventScroll: true });
    if (checkin && checkout && !mobile()) setTimeout(() => close(), 280);
  }

  Object.entries(triggers).forEach(([role, btn]) => {
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => (panel.hidden ? open(role) : close(false)));
  });
  panel.addEventListener('click', (e) => {
    const day = e.target.closest('.dp-day');
    if (day && !day.disabled) { pick(day.dataset.date); return; }
    const nav = e.target.closest('[data-nav]');
    if (nav) { view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1, 12); render(); return; }
    if (e.target.closest('.dp-clear')) { checkin = null; checkout = null; syncTriggers(); render(); return; }
    if (e.target.closest('.dp-done')) close();
  });
  panel.addEventListener('mouseover', (e) => {
    const day = e.target.closest('.dp-day');
    if (!day || !checkin || checkout) return;
    if (hover === day.dataset.date) return;
    hover = day.dataset.date;
    panel.querySelectorAll('.dp-day').forEach((b) => {
      const k = b.dataset.date;
      b.classList.toggle('is-range', k > checkin && k < hover);
      b.classList.toggle('is-end', k === hover && hover > checkin);
    });
  });
  // arrow keys move by day/week; in RTL "left" is forward
  panel.addEventListener('keydown', (e) => {
    const day = e.target.closest('.dp-day');
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (!day) return;
    const rtl = lang === 'he';
    const step = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, ArrowDown: 7, ArrowUp: -7 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = iso(addDays(parseISO(day.dataset.date), step));
    if (next < todayIso) return;
    focusIso = next;
    const first = new Date(view.getFullYear(), view.getMonth(), 1, 12);
    const lastShown = new Date(view.getFullYear(), view.getMonth() + (mobile() ? 1 : 2), 0, 12);
    const nd = parseISO(next);
    if (nd < first || nd > lastShown) view = new Date(nd.getFullYear(), nd.getMonth(), 1, 12);
    render();
    panel.querySelector(`[data-date="${next}"]`)?.focus({ preventScroll: true });
  });
  scrim.addEventListener('click', () => close());
  document.addEventListener('pointerdown', (e) => { if (!panel.hidden && !host.contains(e.target) && !panel.contains(e.target) && !scrim.contains(e.target)) close(false); });

  syncTriggers();
  return {
    get value() { return { checkin, checkout }; },
    set(range) { checkin = range.checkin || null; checkout = range.checkout || null; syncTriggers(); },
    open: () => open('checkin'),
  };
}
