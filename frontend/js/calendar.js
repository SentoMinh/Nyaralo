// js/calendar.js
let calendarBookings = [];
let acceptedBookings = []; // Kompatibilitás más komponensekkel (pl. booking.js)

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings?status=naptar`);
    if (res.ok) {
      calendarBookings = await res.json();
      acceptedBookings = calendarBookings;
    } else {
      const fallbackRes = await fetch(`${API_BASE}/bookings?status=elfogadva`);
      if (fallbackRes.ok) {
        calendarBookings = await fallbackRes.json();
        acceptedBookings = calendarBookings;
      } else {
        calendarBookings = [];
        acceptedBookings = [];
      }
    }
  } catch (e) {
    console.error('Nem sikerült betölteni a naptár adatait:', e);
    calendarBookings = [];
    acceptedBookings = [];
  }
  renderCalendar();
}

function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDateStatus(date) {
  const dateStr = formatDateStr(date);
  const matches = calendarBookings.filter(b => dateStr >= b.erkezes && dateStr < b.tavozas);
  if (matches.length === 0) return null;
  // Ha bármelyik már elfogadott, akkor pirosként (elfogadva) jelenítjük meg
  const isAccepted = matches.some(b => b.statusz === 'elfogadva' || !b.statusz);
  return isAccepted ? 'elfogadva' : 'fuggo';
}

function isOccupied(date) {
  return getDateStatus(date) !== null;
}

function renderCalendar() {
  const container = document.getElementById('calendar');
  if (!container) return;
  container.innerHTML = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let m = 0; m < 6; m++) {
    const month = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const monthName = month.toLocaleDateString('hu-HU', { month: 'long', year: 'numeric' });

    const table = document.createElement('div');
    table.className = 'inline-block mr-6 mb-6 align-top';
    table.innerHTML = `<h3 class="font-medium mb-2 capitalize">${monthName}</h3>`;

    const days = ['H', 'K', 'Sz', 'Cs', 'P', 'Szo', 'V'];
    let html = '<div class="grid grid-cols-7 gap-1 text-center text-xs">';
    days.forEach(d => html += `<div class="font-medium text-gray-500">${d}</div>`);

    const firstDay = (month.getDay() + 6) % 7; // Hétfő = 0
    for (let i = 0; i < firstDay; i++) html += '<div></div>';

    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const status = getDateStatus(date);
      const past = date < today;
      let cls = 'w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ';
      let title = '';

      if (past) {
        cls += 'text-gray-300';
        title = 'Múltbeli időpont';
      } else if (status === 'elfogadva') {
        cls += 'bg-red-300 text-red-900 font-medium cursor-not-allowed';
        title = 'Foglalt (elfogadott)';
      } else if (status === 'fuggo') {
        cls += 'bg-yellow-200 text-yellow-900 border border-yellow-400 font-medium cursor-not-allowed';
        title = 'Függőben (elbírálás alatt)';
      } else {
        cls += 'bg-green-100 hover:bg-green-200 text-green-900 cursor-pointer';
        title = 'Szabad időpont';
      }
      html += `<div class="${cls}" title="${title}">${d}</div>`;
    }
    html += '</div>';
    table.innerHTML += html;
    container.appendChild(table);
  }
}

function initCalendar() {
  loadBookings();
}