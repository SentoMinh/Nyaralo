// js/booking.js
function closeModal() {
  document.getElementById('booking-modal').classList.add('hidden');
  const errorEl = document.getElementById('error-msg');
  if (errorEl) {
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
  }
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
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorEl = document.getElementById('error-msg');
  if (errorEl) errorEl.classList.add('hidden');

  const data = Object.fromEntries(new FormData(form));

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
  if (typeof acceptedBookings !== 'undefined' && Array.isArray(acceptedBookings)) {
    const conflict = acceptedBookings.some(b => {
      const bStart = new Date(b.erkezes);
      const bEnd = new Date(b.tavozas);
      return start < bEnd && end > bStart;
    });
    if (conflict) {
      showError('A választott időszak már foglalt.');
      return;
    }
  }

  // Gomb állapot beállítása küldés alatt (vizuális visszajelzés)
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Foglalási kérelem elküldése';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="inline-flex items-center justify-center gap-2">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Küldés folyamatban...
      </span>
    `;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
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

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.message || 'Hiba történt a foglalási kérelem elküldése során.');
    }

    // Sikeres mentés: értesítés és frissítés
    alert('Foglalási kérelmed sikeresen rögzítve! Az oldal frissül.');
    closeModal();
    form.reset();

    // Naptár és oldal frissítése az adatbázisból
    if (typeof loadBookings === 'function') {
      await loadBookings();
    }
    window.location.reload();

  } catch (err) {
    const errorMsg = (err.message && err.message.includes('Failed to fetch'))
      ? 'Nem sikerült kapcsolódni a szerverhez. Kérjük indítsd el a backend szervert (npm start).'
      : (err.message || 'Hiba történt. Próbáld újra később.');
    showError(errorMsg);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm font-medium';
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}