// js/booking.js
function closeModal() {
  document.getElementById('booking-modal').classList.add('hidden');
  document.getElementById('error-msg').classList.add('hidden');
}

document.getElementById('booking-form')?.addEventListener('input', calculatePrice);

function calculatePrice() {
  const form = document.getElementById('booking-form');
  const erkezes = form.erkezes.value;
  const tavozas = form.tavozas.value;
  if (!erkezes || !tavozas) return;

  const start = new Date(erkezes);
  const end = new Date(tavozas);
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));

  document.getElementById('ejszakak-szama').textContent = nights > 0 ? `${nights} éjszaka` : '';
  document.getElementById('osszeg').textContent =
    nights > 0 ? (nights * NYARALO.arEjszaka).toLocaleString('hu-HU') + ' Ft' : '0 Ft';
}

document.getElementById('booking-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const errorEl = document.getElementById('error-msg');

  // Validációk
  const start = new Date(data.erkezes);
  const end = new Date(data.tavozas);
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  const vendegek = parseInt(data.vendegek);

  if (end <= start) {
    showError('A távozás dátumának későbbinek kell lennie az érkezésnél.');
    return;
  }
  if (nights < NYARALO.minEjszaka) {
    showError(`Minimum ${NYARALO.minEjszaka} éjszakát kell foglalni.`);
    return;
  }
  if (vendegek > NYARALO.ferőhely) {
    showError(`Maximum ${NYARALO.ferőhely} fő lehet.`);
    return;
  }

  // Ütközés ellenőrzés (acceptedBookings-ból)
  const conflict = acceptedBookings.some(b => {
    const bStart = new Date(b.erkezes);
    const bEnd = new Date(b.tavozas);
    return start < bEnd && end > bStart;
  });
  if (conflict) {
    showError('A választott időszak már foglalt.');
    return;
  }

  // Küldés backend-re
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        osszeg: nights * NYARALO.arEjszaka,
        statusz: 'fuggo'
      })
    });
    if (!res.ok) throw new Error('Hiba a foglalás során');
    alert('Foglalási kérelmed sikeresen elküldve! Hamarosan e-mailben értesítünk.');
    closeModal();
    form.reset();
  } catch (err) {
    showError('Hiba történt. Próbáld újra később.');
  }
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}