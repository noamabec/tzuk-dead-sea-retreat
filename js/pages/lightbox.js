// A simple accessible lightbox shared by the unit page and the gallery.
let box = null;
let items = [];
let index = 0;
let lastFocus = null;

function build(lang) {
  const he = lang === 'he';
  box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', he ? 'גלריית תמונות' : 'Photo gallery');
  box.hidden = true;
  const prevIcon = he ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6';
  const nextIcon = he ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6';
  box.innerHTML = `
    <div class="lb-top"><span class="lb-count" aria-live="polite"></span><button type="button" class="lb-btn lb-close" aria-label="${he ? 'סגירה' : 'Close'}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <figure class="lb-stage"><img alt=""><figcaption class="lb-caption"></figcaption></figure>
    <div class="lb-nav"><button type="button" class="lb-btn lb-prev" aria-label="${he ? 'התמונה הקודמת' : 'Previous photo'}"><svg viewBox="0 0 24 24"><path d="${prevIcon}"/></svg></button><button type="button" class="lb-btn lb-next" aria-label="${he ? 'התמונה הבאה' : 'Next photo'}"><svg viewBox="0 0 24 24"><path d="${nextIcon}"/></svg></button></div>`;
  document.body.append(box);
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    // in RTL the "next" arrow points left
    if (e.key === 'ArrowLeft') show(index + (he ? 1 : -1));
    if (e.key === 'ArrowRight') show(index + (he ? -1 : 1));
    if (e.key === 'Tab') {
      const f = [...box.querySelectorAll('button')];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
}

function show(i) {
  index = (i + items.length) % items.length;
  const it = items[index];
  const img = box.querySelector('.lb-stage img');
  img.src = it.src;
  img.alt = it.alt || '';
  box.querySelector('.lb-caption').textContent = it.caption || '';
  box.querySelector('.lb-count').innerHTML = `<bdi>${index + 1} / ${items.length}</bdi>`;
}

function close() {
  box.hidden = true;
  window.__lenis?.start();
  lastFocus?.focus();
}

export function openLightbox(list, start, lang) {
  if (!box) build(lang);
  items = list;
  lastFocus = document.activeElement;
  show(start);
  box.hidden = false;
  window.__lenis?.stop();
  box.querySelector('.lb-close').focus();
}
