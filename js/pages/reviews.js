// All reviews, filterable by unit (?unit= preselects one).
import { UNITS, REVIEWS } from '../data.js';
import { reviewHTML } from './suite.js';

export function render({ lang }) {
  const he = lang === 'he';
  const root = document.getElementById('reviewsRoot');
  const start = new URLSearchParams(location.search).get('unit');
  const filters = [['all', he ? 'כל היחידות' : 'All units'], ...Object.keys(UNITS).map((k) => [k, UNITS[k][lang].name])];
  const active = UNITS[start] ? start : 'all';
  root.innerHTML = `
    <div class="reviews-head section-head">
      <ul class="chips" aria-label="${he ? 'סינון לפי יחידה' : 'Filter by unit'}">${filters.map(([k, l]) => `<li><button type="button" class="chip" data-f="${k}" aria-pressed="${k === active}">${l}</button></li>`).join('')}</ul>
      <div class="score" aria-label="${he ? 'דירוג ממוצע 4.9 מתוך 5, על סמך 112 חוות דעת' : 'Average rating 4.9 out of 5 from 112 reviews'}"><span class="score-num"><bdi>4.9</bdi></span><span class="stars" aria-hidden="true">★★★★★</span><span class="score-meta"><bdi>112</bdi> ${he ? 'חוות דעת' : 'reviews'}</span></div>
    </div>
    <div class="review-grid">${REVIEWS.map((r) => `<div data-unit="${r.unit}">${reviewHTML(r, lang)}</div>`).join('')}</div>`;
  const apply = (k) => {
    root.querySelectorAll('[data-f]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.f === k)));
    root.querySelectorAll('.review-grid > [data-unit]').forEach((el) => { el.hidden = k !== 'all' && el.dataset.unit !== k; });
    window.ScrollTrigger?.refresh();
  };
  root.querySelectorAll('[data-f]').forEach((c) => c.addEventListener('click', () => apply(c.dataset.f)));
  apply(active);
}
