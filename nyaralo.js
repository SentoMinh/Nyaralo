// ==================== ADATOK ====================
const PRICE_PER_NIGHT = 15000;
const ADMIN_USER = { felhasznalonev: 'admin', jelszo: 'admin123' };

// localStorage kulcsok
const STORAGE_KEY = 'nyaralo_foglalasok';
const SESSION_KEY = 'nyaralo_admin_session';

// ==================== SEGÉDFÜGGVÉNYEK ====================
function getBookings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveBookings(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('hu-HU');
}

function nightsBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.round((e - s) / (1000 * 60 * 60 * 24)));
}

function statusBadge(status) {
  const colors = {
    'Függőben': 'bg-yellow-100 text-yellow-800',
    'Elfogadva': 'bg-green-100 text-green-800',
    'Elutasítva': 'bg-red-100 text-red-800',
    'Lemondva': 'bg-slate-100 text-slate-600'
  };
  return `<span class="px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-100'}">${status}</span>`;
}

function paymentBadge(status) {
  const colors = {
    'Nincs fizetve': 'bg-red-100 text-red-700',
    'Fizetésre vár': 'bg-orange-100 text-orange-700',
    'Fizetve': 'bg-emerald-100 text-emerald-700'
  };
  return `<span class="px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-100'}">${status}</span>`;
}

// ==================== OLDALVÁLTÁS ====================
function showPage(page) {
  document.getElementById('page-booking').classList.add('hidden');
  document.getElementById('page-admin').classList.add('hidden');
  document.getElementById('btn-booking').className = 'px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100';
  document.getElementById('btn-admin').className = 'px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100';

  if (page === 'booking') {
    document.getElementById('page-booking').classList.remove('hidden');
    document.getElementById('btn-booking').className = 'px-4 py-2 rounded-lg font-medium bg-blue-600 text-white';
  } else {
    document.getElementById('page-admin').classList.remove('hidden');
    document.getElementById('btn-admin').className = 'px-4 py-2 rounded-lg font-medium bg-blue-600 text-white';
    if (isLoggedIn()) {
      document.getElementById('login-box').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      renderBookings();
    } else {
      document.getElementById('login-box').classList.remove('hidden');
      document.getElementById('dashboard').classList.add('hidden');
    }
  }
}

// ==================== ÁRSZÁMÍTÁS ====================
function updatePrice() {
  const erkezesMezo = document.querySelector('[name="erkezes"]');
  const tavozasMezo = document.querySelector('[name="tavozas"]');
  const arMezo = document.getElementById('calculated-price');

  const erkezes = erkezesMezo.value;
  const tavozas = tavozasMezo.value;

  // Ha valamelyik dátum nincs kiválasztva
  if (!erkezes || !tavozas) {
    arMezo.textContent = '0 Ft';
    return;
  }

  // YYYY-MM-DD formátum szétbontása
  const [eEv, eHonap, eNap] = erkezes.split('-').map(Number);
  const [tEv, tHonap, tNap] = tavozas.split('-').map(Number);

  // Dátumok létrehozása
  const erkezesDatum = new Date(eEv, eHonap - 1, eNap);
  const tavozasDatum = new Date(tEv, tHonap - 1, tNap);

  // Ha a távozás korábbi vagy ugyanaz a nap
  if (tavozasDatum <= erkezesDatum) {
    arMezo.textContent = 'Hibás dátum!';
    return;
  }

  // Éjszakák számítása
  const kulonbseg = tavozasDatum.getTime() - erkezesDatum.getTime();
  const ejszakak = Math.round(
    kulonbseg / (1000 * 60 * 60 * 24)
  );

  // Teljes ár
  const teljesAr = ejszakak * PRICE_PER_NIGHT;

  // Ár kiírása
  arMezo.textContent =
    teljesAr.toLocaleString('hu-HU') +
    ' Ft (' +
    ejszakak +
    ' éjszaka)';
}

// ==================== FOGLALÁS ELKÜLDÉSE ====================
document.getElementById('booking-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  // Validáció
  if (data.erkezes >= data.tavozas) {
    alert('A távozás dátumának későbbinek kell lennie az érkezésnél!');
    return;
  }

  const nights = nightsBetween(data.erkezes, data.tavozas);
  if (nights < 1) {
    alert('Legalább 1 éjszakára kell foglalni!');
    return;
  }

  const bookings = getBookings();
  const newBooking = {
    id: bookings.length ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
    nev: data.nev.trim(),
    email: data.email.trim(),
    telefon: data.telefon.trim(),
    erkezes: data.erkezes,
    tavozas: data.tavozas,
    vendegek_szama: parseInt(data.vendegek_szama),
    fizetesi_mod: data.fizetesi_mod,
    teljes_ar: nights * PRICE_PER_NIGHT,
    statusz: 'Függőben',
    fizetesi_statusz: 'Nincs fizetve',
    letrehozva: new Date().toISOString()
  };

  bookings.push(newBooking);
  saveBookings(bookings);

  form.reset();
  document.getElementById('calculated-price').textContent = '0 Ft';
  document.getElementById('success-msg').classList.remove('hidden');
  setTimeout(() => document.getElementById('success-msg').classList.add('hidden'), 5000);
});

// ==================== ADMIN BEJELENTKEZÉS ====================
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;

  if (user === ADMIN_USER.felhasznalonev && pass === ADMIN_USER.jelszo) {
    localStorage.setItem(SESSION_KEY, 'true');
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    renderBookings();
  } else {
    document.getElementById('login-error').classList.remove('hidden');
  }
});

function logout() {
  localStorage.removeItem(SESSION_KEY);
  showPage('admin');
}

// ==================== FOGLALÁSOK MEGJELENÍTÉSE ====================
function renderBookings() {
  let bookings = getBookings();
  const statusFilter = document.getElementById('filter-status').value;
  const paymentFilter = document.getElementById('filter-payment').value;

  if (statusFilter) bookings = bookings.filter(b => b.statusz === statusFilter);
  if (paymentFilter) bookings = bookings.filter(b => b.fizetesi_statusz === paymentFilter);

  // Legújabb elöl
  bookings.sort((a, b) => b.id - a.id);

  document.getElementById('total-count').textContent = getBookings().length;

  const tbody = document.getElementById('bookings-table');
  const empty = document.getElementById('empty-state');

  if (bookings.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  tbody.innerHTML = bookings.map(b => `
    <tr class="hover:bg-slate-50 transition">
      <td class="px-4 py-3 font-mono text-slate-500">#${b.id}</td>
      <td class="px-4 py-3">
        <div class="font-medium text-slate-800">${b.nev}</div>
        <div class="text-xs text-slate-500">${b.email}</div>
        <div class="text-xs text-slate-500">${b.telefon}</div>
      </td>
      <td class="px-4 py-3">
        <div>${formatDate(b.erkezes)}</div>
        <div class="text-xs text-slate-500">→ ${formatDate(b.tavozas)}</div>
        <div class="text-xs text-blue-600">${nightsBetween(b.erkezes, b.tavozas)} éjszaka</div>
      </td>
      <td class="px-4 py-3 text-center">${b.vendegek_szama} fő</td>
      <td class="px-4 py-3 font-semibold">${b.teljes_ar.toLocaleString('hu-HU')} Ft</td>
      <td class="px-4 py-3">
        <select onchange="updateStatus(${b.id}, 'statusz', this.value)" class="text-xs border rounded-lg px-2 py-1">
          <option value="Függőben" ${b.statusz === 'Függőben' ? 'selected' : ''}>Függőben</option>
          <option value="Elfogadva" ${b.statusz === 'Elfogadva' ? 'selected' : ''}>Elfogadva</option>
          <option value="Elutasítva" ${b.statusz === 'Elutasítva' ? 'selected' : ''}>Elutasítva</option>
          <option value="Lemondva" ${b.statusz === 'Lemondva' ? 'selected' : ''}>Lemondva</option>
        </select>
      </td>
      <td class="px-4 py-3">
        <select onchange="updateStatus(${b.id}, 'fizetesi_statusz', this.value)" class="text-xs border rounded-lg px-2 py-1">
          <option value="Nincs fizetve" ${b.fizetesi_statusz === 'Nincs fizetve' ? 'selected' : ''}>Nincs fizetve</option>
          <option value="Fizetésre vár" ${b.fizetesi_statusz === 'Fizetésre vár' ? 'selected' : ''}>Fizetésre vár</option>
          <option value="Fizetve" ${b.fizetesi_statusz === 'Fizetve' ? 'selected' : ''}>Fizetve</option>
        </select>
        <div class="text-xs text-slate-400 mt-1">${b.fizetesi_mod}</div>
      </td>
      <td class="px-4 py-3">
        <button onclick="deleteBooking(${b.id})" class="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition" title="Törlés">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function updateStatus(id, field, value) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    bookings[idx][field] = value;
    saveBookings(bookings);
    renderBookings();
  }
}

function deleteBooking(id) {
  if (!confirm('Biztosan törölni szeretnéd ezt a foglalást?')) return;
  let bookings = getBookings();
  bookings = bookings.filter(b => b.id !== id);
  saveBookings(bookings);
  renderBookings();
}

// ==================== INDÍTÁS ====================
document.addEventListener('DOMContentLoaded', function() {
  // Mai dátum minimumként
  const today = new Date().toISOString().split('T')[0];
  document.querySelector('[name="erkezes"]').min = today;
  document.querySelector('[name="tavozas"]').min = today;

  // Árszámítás események
  document.querySelector('[name="erkezes"]').addEventListener('change', updatePrice);
  document.querySelector('[name="tavozas"]').addEventListener('change', updatePrice);

  // Alapértelmezett oldal
  showPage('booking');
});