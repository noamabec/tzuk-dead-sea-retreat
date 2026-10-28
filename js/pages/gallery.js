// Gallery: filter chips + masonry + lightbox.
import { ROOT } from '../data.js';
import { openLightbox } from './lightbox.js';

const PHOTOS = [
  ['hero-pool.jpg', 2048, 1152, 'pool', 'הבריכה בזריחה', 'The pool at sunrise'],
  ['suite-shachar.jpg', 1200, 905, 'shachar', 'המיטה מול הזריחה, שחר', 'The bed facing the sunrise, Shachar'],
  ['view-wide.jpg', 1456, 736, 'view', 'המבט מהמצוק אל ים המלח', 'The view from the cliff to the Dead Sea'],
  ['shachar-terrace.jpg', 1400, 1056, 'shachar', 'הג\'קוזי במרפסת של שחר', 'The terrace jacuzzi at Shachar'],
  ['sela-night.jpg', 1400, 1056, 'night', 'החצר של סלע בלילה', 'Sela\'s courtyard at night'],
  ['suite-melach.jpg', 1200, 905, 'melach', 'הסלון של מלח', 'The Melach living room'],
  ['place-eingedi.jpg', 905, 1200, 'view', 'מפל דוד בעין גדי', 'David waterfall, Ein Gedi'],
  ['day-pool.jpg', 1200, 1200, 'pool', 'הבריכה בשקיעה', 'The pool at sunset'],
  ['sela-bedroom.jpg', 1400, 1056, 'sela', 'חדר השינה של סלע', 'The Sela bedroom'],
  ['night-fire.jpg', 2048, 1152, 'night', 'מדורה תחת שביל החלב', 'The fire pit under the Milky Way'],
  ['melach-terrace.jpg', 1400, 1056, 'melach', 'המרפסת המוצלת של מלח', 'Melach\'s shaded terrace'],
  ['shachar-exterior.jpg', 1400, 1056, 'shachar', 'שחר מבחוץ, על שפת הצוק', 'Shachar from outside, on the cliff edge'],
  ['sela-bath.jpg', 1400, 1056, 'sela', 'אמבט האבן של סלע', 'Sela\'s stone bathtub'],
  ['compound-aerial.jpg', 2048, 1152, 'view', 'המתחם מלמעלה', 'The compound from above'],
  ['place-dragot.jpg', 905, 1200, 'view', 'הקניון של נחל דרגות', 'The Nahal Dragot canyon'],
  ['melach-kids.jpg', 1400, 1056, 'melach', 'חדר הילדים במלח', 'The kids\' room at Melach'],
  ['shachar-bath.jpg', 1400, 1056, 'shachar', 'מקלחת הגשם של שחר', 'Shachar\'s rain shower'],
  ['suite-sela.jpg', 1200, 905, 'sela', 'מקלחת החוץ בחצר של סלע', 'The outdoor shower in Sela\'s courtyard'],
  ['exp-dinner.jpg', 1400, 1056, 'night', 'ארוחת שף בחצר', 'Chef\'s dinner in the courtyard'],
  ['exp-masada.jpg', 1200, 905, 'view', 'זריחה במצדה', 'Sunrise at Masada'],
  ['melach-kitchen.jpg', 1400, 1056, 'melach', 'המטבח של מלח', 'The Melach kitchen'],
  ['day-breakfast.jpg', 1200, 1200, 'pool', 'סל בוקר במרפסת', 'Breakfast on the terrace'],
];
const FILTERS = [
  ['all', 'הכל', 'All'], ['shachar', 'שחר', 'Shachar'], ['melach', 'מלח', 'Melach'], ['sela', 'סלע', 'Sela'],
  ['pool', 'בריכה', 'Pool'], ['view', 'נוף', 'View'], ['night', 'לילה', 'Night'],
];

export function render({ lang }) {
  const he = lang === 'he';
  const root = document.getElementById('galleryRoot');
  root.innerHTML = `
    <ul class="chips" aria-label="${he ? 'סינון תמונות' : 'Filter photos'}">${FILTERS.map(([k, h, e], i) => `<li><button type="button" class="chip" data-filter="${k}" aria-pressed="${i === 0}">${he ? h : e}</button></li>`).join('')}</ul>
    <p class="sr-only" id="galCount" aria-live="polite"></p>
    <div class="masonry">${PHOTOS.map(([f, w, h, tag, ch, ce], i) => `<figure data-tag="${tag}"><button type="button" data-i="${i}" aria-label="${he ? 'הגדלה' : 'Enlarge'}: ${he ? ch : ce}"><img src="${ROOT}assets/img/${f}" width="${w}" height="${h}" alt="${he ? ch : ce}" loading="lazy"></button><figcaption>${he ? ch : ce}</figcaption></figure>`).join('')}</div>`;

  let visible = PHOTOS.map((_, i) => i);
  root.querySelectorAll('[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
    root.querySelectorAll('[data-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    const k = chip.dataset.filter;
    visible = [];
    root.querySelectorAll('.masonry figure').forEach((fig, i) => {
      const show = k === 'all' || fig.dataset.tag === k;
      fig.hidden = !show;
      if (show) visible.push(i);
    });
    document.getElementById('galCount').textContent = he ? `${visible.length} תמונות` : `${visible.length} photos`;
    window.ScrollTrigger?.refresh();
  }));
  root.querySelectorAll('.masonry [data-i]').forEach((btn) => btn.addEventListener('click', () => {
    const list = visible.map((i) => ({ src: `${ROOT}assets/img/${PHOTOS[i][0]}`, alt: he ? PHOTOS[i][4] : PHOTOS[i][5], caption: he ? PHOTOS[i][4] : PHOTOS[i][5] }));
    openLightbox(list, visible.indexOf(Number(btn.dataset.i)), lang);
  }));
}
