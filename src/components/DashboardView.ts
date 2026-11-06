import { appState } from '../state';

export function renderDashboardView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-dashboard-view';

  // Calculate KPIs
  const totalPatients = appState.patients.length;
  const activeTreatments = appState.treatmentPlans.filter(t => t.status === 'active').length;
  const totalPrescriptions = appState.prescriptions.length;
  const totalXrays = appState.clinicalImages.length;
  const totalRevenue = appState.patients.reduce((sum, p) => sum + p.totalPaid, 0);
  const totalDue = appState.patients.reduce((sum, p) => sum + p.dueAmount, 0);

  container.innerHTML = `
    <!-- KPI Summary Grid -->
    <div class="kdc-grid-4">
      <div class="kdc-stat-box" id="stat-patients" style="cursor: pointer;">
        <div class="kdc-stat-icon-wrapper" style="background: #e0f2fe; color: #0284c7;">
          <span class="material-symbols-rounded">groups</span>
        </div>
        <div>
          <div class="kdc-stat-value">${totalPatients} জন</div>
          <div class="kdc-stat-label">মোট নিবন্ধিত রোগী</div>
        </div>
      </div>

      <div class="kdc-stat-box" id="stat-rx" style="cursor: pointer;">
        <div class="kdc-stat-icon-wrapper" style="background: #dcfce7; color: #16a34a;">
          <span class="material-symbols-rounded">prescriptions</span>
        </div>
        <div>
          <div class="kdc-stat-value">${totalPrescriptions} টি</div>
          <div class="kdc-stat-label">প্রস্তুতকৃত প্রেসক্রিপশন</div>
        </div>
      </div>

      <div class="kdc-stat-box">
        <div class="kdc-stat-icon-wrapper" style="background: #ede9fe; color: #7c3aed;">
          <span class="material-symbols-rounded">payments</span>
        </div>
        <div>
          <div class="kdc-stat-value">৳ ${totalRevenue.toLocaleString()}</div>
          <div class="kdc-stat-label">মোট জমা (বকেয়া: ৳ ${totalDue.toLocaleString()})</div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Row: Recent Patients & Fast Tools -->
    <div class="kdc-dash-main-grid">
      
      <!-- Left Column: Patient Records & Quick Launch -->
      <div class="kdc-card">
        <div class="kdc-card-header">
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">folder_shared</span>
            <span>সাম্প্রতিক রোগী ও রেকর্ড তালিকা (${totalPatients} জন)</span>
          </div>
          <button class="kdc-btn kdc-btn-primary kdc-btn-sm" id="btn-dash-new-patient">
            <span class="material-symbols-rounded">person_add</span>
            <span>নতুন রোগী যুক্ত করুন</span>
          </button>
        </div>

        <div class="kdc-table-wrapper">
          <table class="kdc-table">
            <thead>
              <tr>
                <th>আইডি</th>
                <th>রোগীর নাম</th>
                <th>ফোন নম্বর</th>
                <th>বয়স / লিঙ্গ</th>
                <th>সর্বশেষ ভিজিট</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${appState.patients.length === 0 ? `
                <tr><td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">কোনো নিবন্ধিত রোগী পাওয়া যায়নি।</td></tr>
              ` : appState.patients.map(p => `
                <tr>
                  <td><strong class="tabular-nums" style="font-size: 13.5px; color: var(--kdc-teal-dark);">${p.id}</strong></td>
                  <td>
                    <div style="font-weight: 700; color: #0f172a; cursor: pointer; text-decoration: underline; text-decoration-color: #cbd5e1;" class="btn-dash-patient-file" data-patient-id="${p.id}" title="রোগীর প্রোফাইল ও মেডিকেল হিস্ট্রি দেখুন">${p.name}</div>
                    ${p.address ? `<div style="font-size: 12px; color: #64748b;">${p.address}</div>` : ''}
                  </td>
                  <td><span class="tabular-nums" style="font-weight: 600; color: #334155;">${p.phone}</span></td>
                  <td><span>${p.age} বছর (${p.gender === 'female' ? 'মহিলা' : 'পুরুষ'})</span></td>
                  <td><span class="tabular-nums" style="font-size: 13px; color: #64748b;">${p.lastVisitDate || p.registrationDate}</span></td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <!-- Patient Detail Dossier Button -->
                      <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-dash-patient-file" data-patient-id="${p.id}" title="রোগীর ফাইল ও এক্স-রে দেখুন">
                        <span class="material-symbols-rounded" style="font-size: 16px; color: var(--kdc-teal-primary);">folder_open</span>
                        <span>ফাইল</span>
                      </button>

                      <!-- Prescription shortcut -->
                      <button class="kdc-btn kdc-btn-primary kdc-btn-sm btn-dash-rx" data-patient-id="${p.id}" data-patient-name="${p.name}" data-patient-phone="${p.phone}" data-patient-age="${p.age}" data-patient-gender="${p.gender}" title="প্রেসক্রিপশন লিখুন">
                        <span class="material-symbols-rounded" style="font-size: 16px;">prescriptions</span>
                        <span>প্রেসক্রিপশন</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Quick Tools & Recent Prescriptions -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Clinical X-Ray Gallery Card -->
        <div class="kdc-card" style="cursor: pointer;" id="card-xray-gallery">
          <div class="kdc-card-title" style="font-size: 17px; margin-bottom: 8px;">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">view_in_ar</span>
            <span>ডিজিটাল রেডিওগ্রাফি ও এক্স-রে (${totalXrays} টি ফাইল)</span>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
            রোগীদের IOPA, OPG, ও বাইটউইং এক্স-রে হাই-রেজুলেশনে ফিল্টার ও ইনভার্ট করে পর্যবেক্ষণ করুন।
          </p>
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; color: #334155; font-weight: 600; font-size: 13.5px;">
            <span>রোগী ড্যাশবোর্ড থেকে রেডিওগ্রাফি গ্যালাই দেখুন</span>
            <span class="material-symbols-rounded" style="font-size: 18px; color: var(--kdc-teal-primary);">arrow_forward</span>
          </div>
        </div>

        <!-- Recent Prescriptions Widget -->
        <div class="kdc-card">
          <div class="kdc-card-title" style="font-size: 17px; margin-bottom: 12px;">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">history_edu</span>
            <span>সাম্প্রতিক প্রেসক্রিপশন (${appState.prescriptions.length})</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${appState.prescriptions.slice(0, 4).map(rx => `
              <div style="padding: 10px 12px; border: 1px solid #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; background: #fff;">
                <div>
                  <div style="font-weight: 700; font-size: 13.5px; color: #0f172a;">${rx.patientName}</div>
                  <div class="tabular-nums" style="font-size: 11.5px; color: #64748b;">${rx.rxNumber} · ${rx.date}</div>
                </div>
                <button class="kdc-btn kdc-btn-primary kdc-btn-sm btn-open-recent-rx" data-rx-id="${rx.id}">
                  <span class="material-symbols-rounded" style="font-size: 15px;">print</span>
                  <span>A4 প্রিন্ট</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  // Event Listeners
  container.querySelector('#btn-dash-new-patient')?.addEventListener('click', () => {
    appState.openModal('new_patient');
  });

  container.querySelector('#stat-patients')?.addEventListener('click', () => {
    appState.setTab('patients');
  });

  container.querySelector('#stat-rx')?.addEventListener('click', () => {
    appState.setTab('prescription');
  });

  container.querySelector('#stat-rx')?.addEventListener('click', () => {
    appState.setTab('prescription');
  });

  container.querySelector('#card-xray-gallery')?.addEventListener('click', () => {
    appState.setTab('patients');
  });

  container.querySelectorAll('.btn-dash-rx').forEach(btn => {
    btn.addEventListener('click', () => {
      const patientId = btn.getAttribute('data-patient-id') || 'P-NEW';
      const patientName = btn.getAttribute('data-patient-name') || '';
      const patientPhone = btn.getAttribute('data-patient-phone') || '';
      const patientAge = parseInt(btn.getAttribute('data-patient-age') || '25', 10);
      const patientGender = (btn.getAttribute('data-patient-gender') || 'male') as any;

      appState.createNewBlankPrescription({
        id: patientId,
        name: patientName,
        phone: patientPhone,
        age: patientAge,
        gender: patientGender,
        address: '',
        totalVisits: 1,
        totalBilled: 0,
        totalPaid: 0,
        dueAmount: 0,
        registrationDate: new Date().toISOString().split('T')[0],
        medicalAlerts: { diabetes: false, hypertension: false, cardiacHistory: false, bleedingDisorder: false, drugAllergies: [], pregnancy: false }
      });
    });
  });

  container.querySelectorAll('.btn-open-recent-rx').forEach(btn => {
    btn.addEventListener('click', () => {
      const rxId = btn.getAttribute('data-rx-id');
      const target = appState.prescriptions.find(p => p.id === rxId);
      if (target) {
        appState.setActivePrescription(target);
      }
    });
  });

  container.querySelectorAll('.btn-dash-patient-file').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.getAttribute('data-patient-id');
      if (pid) {
        appState.openPatientDetail(pid);
      }
    });
  });

  return container;
}
