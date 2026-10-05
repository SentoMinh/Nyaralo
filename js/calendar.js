// js/calendar.js
let acceptedBookings = []; // Backend-ből jön

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings?status=elfogadva`);
    acceptedBookings = await res.json();
  } catch (e) {
    // Mock adat fejlesztéshez
    acceptedBookings = [
      { erkezes: '2025-07-10', tavozas: '2025-07-15' },
      { erkezes: '2025-08-01', tavozas: '2025-08-05' }
    ];
  }
  renderCalendar();
}

function isOccupied(date) {
  return acceptedBookings.some(b => {
    const start = new Date(b.erkezes);
    const end = new Date(b.tavozas);
    return date >= start && date < end;
  });
}

function renderCalendar() {
  const container = document.getElementById('calendar');
  container.innerHTML = '';
  const today = new Date();
  today.setHours(0,0,0,0);

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
      const occupied = isOccupied(date);
      const past = date < today;
      let cls = 'w-8 h-8 flex items-center justify-center rounded text-sm ';
      if (past) cls += 'text-gray-300';
      else if (occupied) cls += 'bg-red-300 text-red-900';
      else cls += 'bg-green-100 hover:bg-green-200 cursor-pointer';
      html += `<div class="${cls}">${d}</div>`;
    }
    html += '</div>';
    table.innerHTML += html;
    container.appendChild(table);
  }
}

function initCalendar() {
  loadBookings();
}