import { appState } from '../state';
import { MedicineEntry } from '../types';

export function renderMedicineView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-medicine-view';

  const q = appState.medicineSearchQuery.toLowerCase();
  const filteredMeds = appState.medicines.filter(m => 
    m.brandName.toLowerCase().includes(q) ||
    m.genericName.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q)
  );

  container.innerHTML = `
    <!-- Top Back Bar -->
    <div style="margin-bottom: 12px;">
      <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-back-dashboard" style="display: inline-flex; align-items: center; gap: 6px;">
        <span class="material-symbols-rounded" style="font-size: 18px;">arrow_back</span>
        <span>হোম ড্যাশবোর্ডে ফিরে যান</span>
      </button>
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
      <div>
        <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 28px;">medication</span>
          <span>ডেন্টাল ঔষধ এন্ট্রি ও প্রিসেট ডাটাবেজ</span>
        </h2>
        <p style="font-size: 14px; color: #64748b;">
          প্রেসক্রিপশনের জন্য নিয়মিত ব্যবহৃত অ্যান্টিবায়োটিক, ব্যথানাশক, মাউথওয়াশ ও এন্টাসিডের স্টক ও ডোজ প্রিসেট।
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="kdc-btn kdc-btn-primary" id="btn-open-new-med-modal">
          <span class="material-symbols-rounded">add</span>
          <span>নতুন ঔষধ এন্ট্রি করুন</span>
        </button>
      </div>
    </div>

    <!-- Search input -->
    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
      <span class="material-symbols-rounded" style="color: #64748b; font-size: 22px;">search</span>
      <input type="text" id="med-search-input" value="${appState.medicineSearchQuery}" placeholder="ব্র্যান্ডের নাম, জেনেরিক নাম বা ক্যাটাগরি দিয়ে সার্চ করুন (যেমন: Napa, Moxacil, Torax, Antibiotic)..." style="width: 100%; border: none; font-size: 15px; outline: none;" />
      ${appState.medicineSearchQuery ? `
        <button id="btn-clear-med-search" style="background: none; border: none; color: #64748b; cursor: pointer;">
          <span class="material-symbols-rounded">close</span>
        </button>
      ` : ''}
    </div>

    <!-- Medicines Table Card -->
    <div class="kdc-card">
      <div class="kdc-table-wrapper">
        <table class="kdc-table">
          <thead>
            <tr>
              <th>ধরন</th>
              <th>ব্র্যান্ডের নাম</th>
              <th>জেনেরিক উপাদান</th>
              <th>ক্যাটাগরি</th>
              <th>সাধারণ ডোজ ও সময়</th>
              <th>স্টক লেভেল</th>
              <th>খুচরা মূল্য</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${filteredMeds.length === 0 ? `
              <tr><td colspan="8" style="text-align: center; color: #64748b; padding: 24px;">কোনো ঔষধ পাওয়া যায়নি। নতুন ঔষধ এন্ট্রি করতে উপরের বাটনে চাপুন।</td></tr>
            ` : filteredMeds.map(m => `
              <tr>
                <td><span style="font-weight: 700; color: var(--kdc-teal-primary); font-size: 13px;">${m.type}</span></td>
                <td>
                  <strong style="font-size: 15px; color: #0f172a;">${m.brandName}</strong>
                  <span style="font-size: 12px; color: #64748b; margin-left: 4px;">(${m.strength})</span>
                </td>
                <td style="color: #334155; font-size: 13.5px;">${m.genericName}</td>
                <td>
                  <span style="background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                    ${m.category}
                  </span>
                </td>
                <td>
                  <div style="font-weight: 700; color: #0f172a;">${m.commonDosage}</div>
                  <div style="font-size: 11.5px; color: #64748b;">${m.defaultTiming} (${m.defaultDuration})</div>
                </td>
                <td>
                  <span class="tabular-nums" style="font-weight: 700; color: ${m.stockCount < 50 ? '#dc2626' : '#16a34a'};">
                    ${m.stockCount} টি
                  </span>
                </td>
                <td>
                  <span class="tabular-nums" style="font-weight: 600;">৳ ${m.unitPrice.toFixed(1)}</span>
                </td>
                <td>
                  <button class="kdc-btn kdc-btn-primary kdc-btn-sm btn-quick-rx-add" data-id="${m.id}" title="প্রেসক্রিপশনে যোগ করুন">
                    <span class="material-symbols-rounded" style="font-size: 16px;">add</span>
                    <span>Rx তে দিন</span>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Handlers
  container.querySelector('#med-search-input')?.addEventListener('input', (e) => {
    appState.medicineSearchQuery = (e.target as HTMLInputElement).value;
    appState.notify();
  });

  container.querySelector('#btn-clear-med-search')?.addEventListener('click', () => {
    appState.medicineSearchQuery = '';
    appState.notify();
  });

  container.querySelector('#btn-open-new-med-modal')?.addEventListener('click', () => {
    appState.openModal('new_medicine');
  });

  container.querySelectorAll('.btn-quick-rx-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const mid = btn.getAttribute('data-id');
      const med = appState.medicines.find(m => m.id === mid);
      if (med) {
        appState.activePrescription.medicines.push({
          id: `m_${Date.now()}`,
          type: med.type,
          brandName: med.brandName,
          genericName: med.genericName,
          strength: med.strength,
          dosage: med.commonDosage,
          mealTiming: med.defaultTiming,
          duration: med.defaultDuration,
          instructions: '',
        });
        appState.savePrescription(appState.activePrescription);
        appState.showToast(`${med.brandName} প্রেসক্রিপশনে যুক্ত হয়েছে!`, 'success');
        appState.setTab('prescription');
      }
    });
  });

  container.querySelector('.btn-back-dashboard')?.addEventListener('click', () => {
    appState.setTab('dashboard');
  });

  return container;
}
