// Units overview: once dates are picked, each unit shows whether it's free and the total.
import { UNITS, quote, money } from '../data.js';

export function render({ lang }) {
  const he = lang === 'he';
  const form = document.getElementById('suitesBar');
  const guests = form.querySelector('select[name="guests"]');

  function update() {
    const checkin = form.querySelector('input[name="checkin"]').value;
    const checkout = form.querySelector('input[name="checkout"]').value;
    document.querySelectorAll('[data-unit]').forEach((row) => {
      const id = row.dataset.unit;
      const u = UNITS[id];
      row.querySelector('.avail')?.remove();
      const book = row.querySelector('[data-book]');
      const params = new URLSearchParams({ unit: id, guests: guests.value });
      if (!checkin || !checkout) {
        book.href = `book.html?${params}`;
        return;
      }
      params.set('checkin', checkin);
      params.set('checkout', checkout);
      book.href = `book.html?${params}`;
      const q = quote(id, checkin, checkout);
      const tooSmall = Number(guests.value) > u.guests;
      const ok = q.available && !tooSmall && q.minNightsOk;
      const badge = document.createElement('p');
      badge.className = `avail${ok ? '' : ' is-no'}`;
      badge.setAttribute('role', 'status');
      if (tooSmall) badge.textContent = he ? `מתאימה עד ${u.guests} אורחים` : `Sleeps up to ${u.guests}`;
      else if (!q.available) badge.textContent = he ? 'תפוסה בתאריכים האלה' : 'Booked on these dates';
      else if (!q.minNightsOk) badge.textContent = he ? 'בסוף שבוע מינימום 2 לילות' : 'Weekends: 2 nights minimum';
      else badge.textContent = he ? `פנויה · ${money(q.total, lang)} ל-${q.nights.length} לילות` : `Available · ${money(q.total, lang)} for ${q.nights.length} nights`;
      row.querySelector('[data-price]').before(badge);
    });
  }
  form.addEventListener('rangechange', update);
  guests.addEventListener('change', update);
}
