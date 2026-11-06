import { appState } from '../state';
import { Patient } from '../types';
import { renderPatientDetailView } from './PatientDetailView';

export function renderPatientsView(): HTMLElement {
  // If detail subview is active, render the dedicated Patient Detail Dashboard
  if (appState.activePatientSubView === 'detail') {
    return renderPatientDetailView();
  }

  const container = document.createElement('div');
  container.className = 'kdc-patients-view';

  const q = appState.patientSearchQuery.toLowerCase();
  const filteredPatients = appState.patients.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.phone.includes(q) ||
    p.id.toLowerCase().includes(q)
  );

  const selectedPatient = appState.patients.find(p => p.id === appState.selectedPatientId) || appState.patients[0];

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
          <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 28px;">folder_shared</span>
          <span>পূর্বের রোগী ও ডিজিটাল মেডিকেল রেকর্ড</span>
        </h2>
        <p style="font-size: 14px; color: #64748b;">
          রোগীর অতীত চিকিৎসার ইতিহাস, ড্রাগ এলার্জি, ডায়াবেটিস/উচ্চ রক্তচাপ সতর্কতা ও পূর্বের প্রেসক্রিপশন পর্যালোচনা।
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="kdc-btn kdc-btn-primary" id="btn-open-new-patient-modal">
          <span class="material-symbols-rounded">person_add</span>
          <span>নতুন রোগী রেজিস্ট্রেশন</span>
        </button>
      </div>
    </div>

    <!-- Search Bar & Filters -->
    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
      <span class="material-symbols-rounded" style="color: #64748b; font-size: 22px;">search</span>
      <input type="text" id="patient-search-input" value="${appState.patientSearchQuery}" placeholder="রোগীর নাম, মোবাইল নম্বর বা রোগী আইডি দিয়ে সার্চ করুন (যেমন: তানভীর, 01711, P-101)..." style="width: 100%; border: none; font-size: 15px; outline: none;" />
      ${appState.patientSearchQuery ? `
        <button id="btn-clear-patient-search" style="background: none; border: none; color: #64748b; cursor: pointer;">
          <span class="material-symbols-rounded">close</span>
        </button>
      ` : ''}
    </div>

    <!-- 2 Column Layout: Patient List (Left) + Selected Patient Dossier (Right) -->
    <div class="kdc-patients-split-grid">
      
      <!-- Patient List Table -->
      <div class="kdc-card">
        <div class="kdc-card-header">
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">contacts</span>
            <span>নিবন্ধিত রোগী তালিকা (${filteredPatients.length} জন)</span>
          </div>
        </div>

        <div class="kdc-table-wrapper">
          <table class="kdc-table">
            <thead>
              <tr>
                <th>আইডি</th>
                <th>রোগীর নাম</th>
                <th>বয়স / লিঙ্গ</th>
                <th>মেডিকেল সতর্কতা</th>
                <th>বকেয়া (Due)</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPatients.length === 0 ? `
                <tr><td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">কোনো রোগী পাওয়া যায়নি।</td></tr>
              ` : filteredPatients.map(p => `
                <tr style="cursor: pointer; background: ${p.id === selectedPatient?.id ? 'var(--kdc-teal-subtle)' : ''};" class="patient-row-select" data-patient-id="${p.id}">
                  <td><strong class="tabular-nums" style="color: var(--kdc-teal-dark);">${p.id}</strong></td>
                  <td>
                    <div style="font-weight: 700; color: #0f172a;">${p.name}</div>
                    <div class="tabular-nums" style="font-size: 12px; color: #64748b;">${p.phone}</div>
                  </td>
                  <td>${p.age} বছর (${p.gender === 'female' ? 'মহিলা' : 'পুরুষ'})</td>
                  <td>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                      ${p.medicalAlerts.diabetes ? `<span style="background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">ডায়াবেটিস</span>` : ''}
                      ${p.medicalAlerts.hypertension ? `<span style="background: #ffedd5; color: #ea580c; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">হাইপারটেনশন</span>` : ''}
                      ${p.medicalAlerts.drugAllergies.length > 0 ? `<span style="background: #fef08a; color: #854d0e; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">এলার্জি: ${p.medicalAlerts.drugAllergies.join(',')}</span>` : ''}
                      ${!p.medicalAlerts.diabetes && !p.medicalAlerts.hypertension && p.medicalAlerts.drugAllergies.length === 0 ? `<span style="color: #10b981; font-size: 12px;">স্বাভাবিক</span>` : ''}
                    </div>
                  </td>
                  <td>
                    <span class="tabular-nums" style="font-weight: 700; color: ${p.dueAmount > 0 ? '#dc2626' : '#16a34a'};">
                      ${p.dueAmount > 0 ? `৳ ${p.dueAmount.toLocaleString()}` : 'পরিশোধিত'}
                    </span>
                  </td>
                  <td>
                    <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-view-p-file" data-patient-id="${p.id}">
                      <span>ফাইল দেখুন</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Selected Patient Comprehensive Dossier -->
      ${selectedPatient ? `
        <div class="kdc-card" style="border-top: 4px solid var(--kdc-teal-primary);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px;">
            <div>
              <div class="tabular-nums" style="font-size: 12.5px; font-weight: 700; color: var(--kdc-teal-primary);">${selectedPatient.id}</div>
              <h3 style="font-size: 20px; font-weight: 800; color: #0f172a;">${selectedPatient.name}</h3>
              <p style="font-size: 13.5px; color: #475569;">
                মোবাইল: <strong class="tabular-nums">${selectedPatient.phone}</strong> · রক্তের গ্রুপ: <strong>${selectedPatient.bloodGroup || 'অজানা'}</strong>
              </p>
              <p style="font-size: 12.5px; color: #64748b;">ঠিকানা: ${selectedPatient.address || 'তথ্য নেই'}</p>
            </div>
            
            <button class="kdc-btn kdc-btn-whatsapp kdc-btn-sm" id="btn-patient-wa-chat" data-phone="${selectedPatient.phone}">
              <span class="material-symbols-rounded">chat</span>
              <span>হোয়াটসঅ্যাপ</span>
            </button>
          </div>

          <!-- Medical Alerts Box -->
          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="font-weight: 700; color: #9f1239; font-size: 13.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded" style="font-size: 18px;">warning</span>
              <span>মেডিকেল এলার্ট ও সতর্কতা:</span>
            </div>
            <ul style="font-size: 13px; color: #881337; padding-left: 18px; margin: 0; line-height: 1.5;">
              ${selectedPatient.medicalAlerts.diabetes ? `<li>ডায়াবেটিসের ইতিহাস রয়েছে। লোকাল এনেস্থেশিয়া ও সার্জারির পূর্বে সুগার লেভেল চেক আবশ্যক।</li>` : ''}
              ${selectedPatient.medicalAlerts.hypertension ? `<li>উচ্চ রক্তচাপ রয়েছে (HTN)। এপিনেফ্রিন যুক্ত এনেস্থেশিয়া ব্যবহারে সতর্কতা।</li>` : ''}
              ${selectedPatient.medicalAlerts.drugAllergies.length > 0 ? `<li><strong>ড্রাগ এলার্জি:</strong> ${selectedPatient.medicalAlerts.drugAllergies.join(', ')}</li>` : ''}
              ${selectedPatient.medicalAlerts.cardiacHistory ? `<li>হৃদরোগের ইতিহাস রয়েছে।</li>` : ''}
              ${selectedPatient.medicalAlerts.bleedingDisorder ? `<li>রক্তক্ষরণ জনিত জটিলতা (Bleeding tendency)।</li>` : ''}
              ${!selectedPatient.medicalAlerts.diabetes && !selectedPatient.medicalAlerts.hypertension && selectedPatient.medicalAlerts.drugAllergies.length === 0 ? `<li>কোনো জটিল স্বাস্থ্য ঝুঁকি বা এলার্জি নথিভুক্ত নেই।</li>` : ''}
            </ul>
          </div>

          <!-- Financial Snapshot -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="font-weight: 700; color: #334155; font-size: 13.5px; margin-bottom: 6px;">বিলিং ও লেনদেন ওভারভিউ:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center;">
              <div>
                <div style="font-size: 11.5px; color: #64748b;">মোট বিল</div>
                <div class="tabular-nums" style="font-weight: 700; font-size: 15px;">৳ ${selectedPatient.totalBilled.toLocaleString()}</div>
              </div>
              <div>
                <div style="font-size: 11.5px; color: #64748b;">পরিশোধিত</div>
                <div class="tabular-nums" style="font-weight: 700; font-size: 15px; color: #16a34a;">৳ ${selectedPatient.totalPaid.toLocaleString()}</div>
              </div>
              <div>
                <div style="font-size: 11.5px; color: #64748b;">বকেয়া (Due)</div>
                <div class="tabular-nums" style="font-weight: 700; font-size: 15px; color: ${selectedPatient.dueAmount > 0 ? '#dc2626' : '#16a34a'};">৳ ${selectedPatient.dueAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons for This Patient -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="kdc-btn kdc-btn-primary" id="btn-open-full-patient-dossier" style="width: 100%; justify-content: center;">
              <span class="material-symbols-rounded">clinical_notes</span>
              <span>সম্পূর্ণ হিস্ট্রি ও ড্যাশবোর্ড দেখুন</span>
            </button>

            <div style="display: flex; gap: 8px;">
              <button class="kdc-btn kdc-btn-secondary" id="btn-patient-create-rx" style="flex: 1;">
                <span class="material-symbols-rounded">prescriptions</span>
                <span>প্রেসক্রিপশন</span>
              </button>

              <button class="kdc-btn kdc-btn-secondary" id="btn-patient-view-plan" style="flex: 1;">
                <span class="material-symbols-rounded">dentistry</span>
                <span>ট্রিটমেন্ট প্ল্যান</span>
              </button>
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // Handlers
  container.querySelector('#patient-search-input')?.addEventListener('input', (e) => {
    appState.patientSearchQuery = (e.target as HTMLInputElement).value;
    appState.notify();
  });

  container.querySelector('#btn-clear-patient-search')?.addEventListener('click', () => {
    appState.patientSearchQuery = '';
    appState.notify();
  });

  container.querySelector('#btn-open-new-patient-modal')?.addEventListener('click', () => {
    appState.openModal('new_patient');
  });

  container.querySelectorAll('.patient-row-select').forEach(row => {
    row.addEventListener('click', () => {
      const pid = row.getAttribute('data-patient-id');
      if (pid) {
        appState.selectedPatientId = pid;
        appState.notify();
      }
    });
  });

  container.querySelector('#btn-patient-wa-chat')?.addEventListener('click', () => {
    const phone = selectedPatient?.phone || '';
    appState.sendWhatsAppReminder(phone, `আসসালামু আলাইকুম ${selectedPatient?.name}, খাদিজা ডেন্টাল কেয়ার থেকে আপনার সাথে যোগাযোগ করা হচ্ছে। কোনো সহায়তার প্রয়োজন হলে আমাদের জানাতে পারেন।`);
  });

  container.querySelector('#btn-patient-create-rx')?.addEventListener('click', () => {
    if (selectedPatient) {
      appState.createNewBlankPrescription(selectedPatient);
    }
  });



  container.querySelector('#btn-open-full-patient-dossier')?.addEventListener('click', () => {
    if (selectedPatient) {
      appState.openPatientDetail(selectedPatient.id);
    }
  });

  container.querySelectorAll('.btn-view-p-file').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = (e.currentTarget as HTMLElement).getAttribute('data-patient-id');
      if (pid) {
        appState.openPatientDetail(pid);
      }
    });
  });

  container.querySelector('.btn-back-dashboard')?.addEventListener('click', () => {
    appState.setTab('dashboard');
  });

  return container;
}
