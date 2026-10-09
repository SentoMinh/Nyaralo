// js/admin.js
async function loadAdminBookings() {
  const res = await fetch(`${API_BASE}/bookings`);
  const bookings = await res.json();
  const tbody = document.getElementById('bookings-table');
  tbody.innerHTML = '';

  bookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.className = 'border-t';
    tr.innerHTML = `
      <td class="p-3">#${b.id}</td>
      <td class="p-3">${b.nev}<br><span class="text-xs text-gray-500">${b.email}</span></td>
      <td class="p-3">${b.erkezes} – ${b.tavozas}</td>
      <td class="p-3">${b.vendegek}</td>
      <td class="p-3">${b.osszeg.toLocaleString('hu-HU')} Ft</td>
      <td class="p-3"><span class="px-2 py-1 rounded text-xs ${statusClass(b.statusz)}">${b.statusz}</span></td>
      <td class="p-3">
        <select onchange="updatePayment(${b.id}, this.value)" class="border rounded px-2 py-1 text-xs">
          <option value="nincs" ${b.fizetes==='nincs'?'selected':''}>Nincs fizetve</option>
          <option value="var" ${b.fizetes==='var'?'selected':''}>Fizetésre vár</option>
          <option value="fizetve" ${b.fizetes==='fizetve'?'selected':''}>Fizetve</option>
        </select>
      </td>
      <td class="p-3 space-x-1">
        ${b.statusz === 'fuggo' ? `
          <button onclick="updateStatus(${b.id},'elfogadva')" class="bg-green-600 text-white px-2 py-1 rounded text-xs">Elfogad</button>
          <button onclick="updateStatus(${b.id},'elutasitva')" class="bg-red-600 text-white px-2 py-1 rounded text-xs">Elutasít</button>
        ` : ''}
        ${b.statusz === 'elfogadva' ? `
          <button onclick="updateStatus(${b.id},'lemondva')" class="bg-orange-600 text-white px-2 py-1 rounded text-xs">Lemond</button>
        ` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function statusClass(s) {
  return {
    fuggo: 'bg-yellow-100 text-yellow-800',
    elfogadva: 'bg-green-100 text-green-800',
    elutasitva: 'bg-red-100 text-red-800',
    lemondva: 'bg-gray-100 text-gray-800'
  }[s] || '';
}

async function updateStatus(id, status) {
  await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statusz: status })
  });
  loadAdminBookings();
}

async function updatePayment(id, fizetes) {
  await fetch(`${API_BASE}/bookings/${id}/payment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fizetes })
  });
}

loadAdminBookings();