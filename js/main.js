// צוק · Tzuk — interactions for every page.
// The site is a descent: cliff top (hero) → sea (footer). The altimeter follows the scroll.
import { renderLayout } from './layout.js?v=3';
import { rangePicker } from './datepicker.js?v=3';

const { lang, page } = renderLayout();
const he = lang === 'he';
const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const ALT_BOTTOM = 430; // metres from the cliff top down to the sea

// page-specific content is rendered before the shared behaviors attach to it
if (body.dataset.module) {
  const mod = await import(`./pages/${body.dataset.module}.js`);
  await mod.render?.({ lang, page });
}

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!reduceMotion && typeof window.Lenis !== 'undefined') {
  lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
  window.__lenis = lenis;
  if (hasGsap) {
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((t) => lenis.raf(t * 1000));
    window.gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
const header = document.getElementById('siteHeader');
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const target = id.length > 1 && document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  closeMenu();
  const offset = -header.offsetHeight - 16;
  if (lenis) lenis.scrollTo(target, { offset });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ---------- header + altimeter + mobile progress ---------- */
const altMark = document.getElementById('altMark');
const altValue = document.getElementById('altValue');
const altLabel = document.getElementById('altLabel');
const progress = document.getElementById('scrollProgress');
// the section depth tags ("−120 מ'") are the altimeter's keyframes: when a tag sits at 40% of the viewport
// the altimeter reads exactly its number; between tags it interpolates, and the page end is the sea
let altStops = null; let altFor = 0;
function measureAlt() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const stops = [[0, 0]];
  document.querySelectorAll('.depth-num').forEach((el) => {
    const m = Number(el.textContent.replace(/[^\d]/g, ''));
    const y = Math.min(max, Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4));
    const last = stops[stops.length - 1];
    if (y <= 0 && stops.length === 1) stops[0] = [0, m]; // a tag already past the line on load: start there
    else if (m > last[1] && m < ALT_BOTTOM && y > last[0]) stops.push([y, m]);
  });
  stops.push([Math.max(max, stops[stops.length - 1][0] + 1), ALT_BOTTOM]);
  altStops = stops; altFor = document.documentElement.scrollHeight;
}
function depthAt(y) {
  if (!altStops || altFor !== document.documentElement.scrollHeight) measureAlt();
  for (let i = 1; i < altStops.length; i += 1) {
    const [y1, m1] = altStops[i]; const [y0, m0] = altStops[i - 1];
    if (y <= y1) return m0 + ((y - y0) / (y1 - y0)) * (m1 - m0);
  }
  return ALT_BOTTOM;
}
window.addEventListener('resize', () => { altStops = null; });
window.addEventListener('load', () => { altStops = null; onScroll(); });
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-solid', y > 40 || body.classList.contains('menu-open'));
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const p = Math.min(1, Math.max(0, y / max));
  const metres = Math.round(Math.min(ALT_BOTTOM, Math.max(0, depthAt(y))));
  const d = metres / ALT_BOTTOM;
  altMark.style.top = `${d * 100}%`;
  altLabel.style.top = `${d * 100}%`;
  altValue.textContent = metres === 0 ? '+0' : `−${metres}`;
  progress.style.transform = `scaleX(${p})`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- mobile menu ---------- */
const burger = document.getElementById('burger');
const menu = document.getElementById('mobileMenu');
function closeMenu() {
  if (menu.hidden) return;
  menu.hidden = true;
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', he ? 'פתיחת תפריט' : 'Open menu');
  body.classList.remove('menu-open');
  lenis?.start();
  onScroll();
}
burger.addEventListener('click', () => {
  if (!menu.hidden) { closeMenu(); return; }
  menu.hidden = false;
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', he ? 'סגירת תפריט' : 'Close menu');
  body.classList.add('menu-open');
  lenis?.stop();
  onScroll();
  menu.querySelector('a').focus();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenu(); closeA11y(); } });

/* ---------- booking bars: the site's own date picker ---------- */
document.querySelectorAll('form[data-range]').forEach((form) => {
  const params = new URLSearchParams(location.search);
  if (params.get('checkin')) form.querySelector('input[name="checkin"]').value = params.get('checkin');
  if (params.get('checkout')) form.querySelector('input[name="checkout"]').value = params.get('checkout');
  const guests = form.querySelector('select[name="guests"]');
  if (guests && params.get('guests')) guests.value = params.get('guests');
  const clearError = () => form.querySelector('.field-error')?.remove();
  form.picker = rangePicker(form, {
    lang,
    unit: form.dataset.unit || null,
    onChange: (range) => { clearError(); form.dispatchEvent(new CustomEvent('rangechange', { detail: range })); },
  });
  form.dispatchEvent(new CustomEvent('rangechange', { detail: form.picker.value }));
  form.addEventListener('submit', (e) => {
    clearError();
    if (form.querySelector('input[name="checkin"]').value && form.querySelector('input[name="checkout"]').value) return;
    e.preventDefault();
    const p = document.createElement('p');
    p.className = 'field-error';
    p.setAttribute('role', 'alert');
    p.textContent = he ? 'בחרו תאריך הגעה ותאריך עזיבה.' : 'Choose your arrival and departure dates.';
    form.append(p);
    form.querySelector('.dp-trigger').click();
  });
});

/* ---------- reveal on enter ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ---------- drag-to-scroll rows (mouse only; touch scrolls natively) ---------- */
document.querySelectorAll('.distance-row, .drag-row').forEach((row) => {
  let startX = 0; let startScroll = 0; let down = false;
  row.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; startX = e.clientX; startScroll = row.scrollLeft;
    row.classList.add('is-dragging');
    row.setPointerCapture(e.pointerId);
  });
  row.addEventListener('pointermove', (e) => { if (down) row.scrollLeft = startScroll - (e.clientX - startX); });
  const end = () => { down = false; row.classList.remove('is-dragging'); };
  row.addEventListener('pointerup', end);
  row.addEventListener('pointercancel', end);
});

/* ---------- place cards: the photo opens in a circle from the pin ---------- */
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
document.querySelectorAll('.place').forEach((card) => {
  const pin = card.querySelector('.place-pin');
  const setOpen = (open) => { card.classList.toggle('is-open', open); pin.setAttribute('aria-pressed', String(open)); };
  // touch screens have no hover, so the photo simply stays open and the pin toggle goes away
  if (!canHover) { card.classList.add('is-open', 'is-static'); pin.hidden = true; return; }
  pin.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!card.classList.contains('is-open')); });
  card.addEventListener('mouseenter', () => setOpen(true));
  card.addEventListener('mouseleave', () => setOpen(false));
});

/* ---------- typographic list: the photo beside it follows the hovered/focused row ---------- */
document.querySelectorAll('[data-swap-list]').forEach((list) => {
  const img = document.querySelector(list.dataset.swapList);
  list.querySelectorAll('[data-img]').forEach((row) => {
    const show = () => {
      list.querySelectorAll('[data-img]').forEach((r) => r.classList.toggle('is-active', r === row));
      if (img.getAttribute('src') !== row.dataset.img) { img.classList.add('is-swapping'); setTimeout(() => { img.src = row.dataset.img; img.alt = row.dataset.alt || ''; img.classList.remove('is-swapping'); }, 180); }
    };
    row.addEventListener('mouseenter', show);
    row.addEventListener('focusin', show);
    row.addEventListener('click', show);
  });
});

/* ---------- forms that don't send anywhere (portfolio): validate, then confirm ---------- */
document.querySelectorAll('form[data-local-form]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) || (f.type === 'tel' && f.value.replace(/\D/g, '').length < 9);
      f.closest('.form-field')?.classList.toggle('has-error', bad);
      f.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;
    form.hidden = true;
    form.nextElementSibling?.removeAttribute('hidden');
    form.nextElementSibling?.focus();
  });
  form.addEventListener('input', (e) => { const f = e.target.closest('.form-field'); if (f?.classList.contains('has-error')) { f.classList.remove('has-error'); e.target.setAttribute('aria-invalid', 'false'); } });
});

/* ---------- accessibility widget ---------- */
const a11yToggle = document.getElementById('a11yToggle');
const a11yPanel = document.getElementById('a11yPanel');
function closeA11y() { a11yPanel.hidden = true; a11yToggle.setAttribute('aria-expanded', 'false'); }
a11yToggle.addEventListener('click', () => {
  const open = a11yPanel.hidden;
  a11yPanel.hidden = !open;
  a11yToggle.setAttribute('aria-expanded', String(open));
});
a11yPanel.querySelectorAll('[data-a11y]').forEach((btn) => {
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => {
    const cls = { text: 'a11y-text', contrast: 'a11y-contrast', motion: 'no-motion', links: 'a11y-links' }[btn.dataset.a11y];
    const on = root.classList.toggle(cls);
    btn.setAttribute('aria-pressed', String(on));
    if (btn.dataset.a11y === 'motion') { if (on) lenis?.stop(); else lenis?.start(); }
    if (hasGsap) window.ScrollTrigger.refresh();
  });
});

/* ---------- motion ---------- */
if (hasGsap && !reduceMotion) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const has = (s) => document.querySelector(s);

  if (has('.hero')) {
    // home hero: the view settles in, then the copy rises line by line
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.from('.hero .hero-img', { scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0)
      .from('.hero .coords', { y: 16, opacity: 0, duration: 0.8 }, 0.4)
      .from('.hero .h1 > span', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.5)
      .from('.hero .lead', { y: 18, opacity: 0, duration: 0.9 }, 0.9)
      .from('.hero + .booking-bar', { y: 40, opacity: 0, duration: 1 }, 1.0);
    // the descent: the camera drops toward the sea as you scroll
    gsap.to('.hero .hero-img', { yPercent: -14, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero .hero-content', { y: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true } });
  }
  if (has('.page-hero')) {
    gsap.from('.page-hero .page-hero-copy > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' });
    if (has('.page-hero-img')) gsap.to('.page-hero-img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  if (has('.promise')) gsap.to('.promise-img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.promise', start: 'top bottom', end: 'bottom top', scrub: true } });

  // A day at Tzuk: pinned, the background moves from dawn to night
  if (has('.day-pin')) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const day = document.querySelector('.day');
      const steps = [...day.querySelectorAll('.day-step')];
      const ticks = [...day.querySelectorAll('.day-clock li')];
      const colorAt = gsap.utils.interpolate(['#F3DCCB', '#F4EEE4', '#DDEBE6', '#ECC7A8', '#2A231E']);
      let current = 0;
      const st = ScrollTrigger.create({
        trigger: '.day-pin', start: 'top top', end: `+=${steps.length * 90}%`, pin: true, scrub: true,
        onUpdate(self) {
          const p = self.progress;
          day.style.setProperty('--day-bg', colorAt(Math.min(1, p * 1.05)));
          const night = p > 0.82;
          day.classList.toggle('is-night', night);
          day.style.setProperty('--day-fg', night ? '#F4EEE4' : '#2A231E');
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          if (idx !== current) {
            steps[current].classList.remove('is-active'); ticks[current].classList.remove('is-active');
            steps[idx].classList.add('is-active'); ticks[idx].classList.add('is-active');
            current = idx;
          }
        },
      });
      return () => { st.kill(); day.style.removeProperty('--day-bg'); day.style.removeProperty('--day-fg'); day.classList.remove('is-night'); steps.forEach((s, i) => s.classList.toggle('is-active', i === 0)); };
    });
  }

  // lazy images and fonts change the page height after load: keep pin positions in sync
  let refreshTimer;
  const queueRefresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150); };
  new ResizeObserver(queueRefresh).observe(document.getElementById('main'));
  document.fonts?.ready.then(queueRefresh);
}
