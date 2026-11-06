import { appState } from '../state';
import { CLINIC_INFO } from '../constants';
import { Appointment } from '../types';

export function renderAppointmentsView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-appointments-view';

  // Filters
  const dateFilter = appState.appointmentDateFilter;
  const filteredApts = appState.appointments.filter(a => !dateFilter || a.date === dateFilter);

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
      <div>
        <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
          <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 28px;">calendar_month</span>
          <span>রোগী অ্যাপয়েন্টমেন্ট বুকিং ও সিরিয়াল ম্যানেজমেন্ট</span>
        </h2>
        <p style="font-size: 14px; color: #64748b;">
          তারিখ অনুযায়ী সিরিয়াল ট্র্যাকিং, অনলাইন বুকিং এন্ট্রি ও সরাসরি হোয়াটসঅ্যাপ নোটিফিকেশন প্রদান।
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px;">
          <span class="material-symbols-rounded" style="font-size: 18px; color: #64748b;">event</span>
          <label style="font-size: 13px; font-weight: 600; color: #475569;">তারিখ ফিল্টার:</label>
          <input type="date" id="apt-filter-date" value="${dateFilter}" style="border: none; font-size: 13.5px; font-weight: 600; outline: none; background: transparent;" />
        </div>

        <button class="kdc-btn kdc-btn-primary" id="btn-open-booking-modal">
          <span class="material-symbols-rounded">add_circle</span>
          <span>নতুন অ্যাপয়েন্টমেন্ট বুকিং</span>
        </button>
      </div>
    </div>

    <!-- Appointment Summary Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 13px; color: #64748b;">তারিখের মোট সিরিয়াল</div>
          <div class="tabular-nums" style="font-size: 22px; font-weight: 800; color: #0f172a;">${filteredApts.length} জন</div>
        </div>
        <span class="material-symbols-rounded" style="font-size: 32px; color: var(--kdc-teal-primary); opacity: 0.8;">confirmation_number</span>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 13px; color: #64748b;">নিশ্চিত অ্যাপয়েন্টমেন্ট</div>
          <div class="tabular-nums" style="font-size: 22px; font-weight: 800; color: #16a34a;">
            ${filteredApts.filter(a => a.status === 'confirmed').length} জন
          </div>
        </div>
        <span class="material-symbols-rounded" style="font-size: 32px; color: #16a34a; opacity: 0.8;">check_circle</span>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 13px; color: #64748b;">অপেক্ষমান (Pending)</div>
          <div class="tabular-nums" style="font-size: 22px; font-weight: 800; color: #d97706;">
            ${filteredApts.filter(a => a.status === 'pending').length} জন
          </div>
        </div>
        <span class="material-symbols-rounded" style="font-size: 32px; color: #d97706; opacity: 0.8;">pending_actions</span>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 13px; color: #64748b;">চিকিৎসা সম্পন্ন</div>
          <div class="tabular-nums" style="font-size: 22px; font-weight: 800; color: #0284c7;">
            ${filteredApts.filter(a => a.status === 'completed').length} জন
          </div>
        </div>
        <span class="material-symbols-rounded" style="font-size: 32px; color: #0284c7; opacity: 0.8;">task_alt</span>
      </div>
    </div>

    <!-- Appointment Table Card -->
    <div class="kdc-card">
      <div class="kdc-table-wrapper">
        <table class="kdc-table">
          <thead>
            <tr>
              <th>টোকেন / সিরিয়াল</th>
              <th>রোগীর নাম ও পরিচয়</th>
              <th>তারিখ ও সময়</th>
              <th>সেবা / সমস্যা</th>
              <th>চিকিৎসক</th>
              <th>স্ট্যাটাস</th>
              <th>রিমাইন্ডার</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${filteredApts.length === 0 ? `
              <tr><td colspan="8" style="text-align: center; color: #64748b; padding: 32px;">এই তারিখে কোনো বুকিং নেই। নতুন বুকিং করতে উপরের বাটনে ক্লিক করুন।</td></tr>
            ` : filteredApts.map(apt => `
              <tr>
                <td>
                  <div style="background: var(--kdc-teal-subtle); border: 1.5px solid var(--kdc-teal-primary); border-radius: 8px; width: 44px; height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <span style="font-size: 9px; font-weight: 700; color: var(--kdc-teal-deep); text-transform: uppercase;">টোকেন</span>
                    <strong class="tabular-nums" style="font-size: 18px; color: var(--kdc-teal-dark); line-height: 1;">#${apt.serialNumber}</strong>
                  </div>
                </td>
                <td>
                  <div style="font-weight: 700; color: #0f172a; font-size: 15px;">${apt.patientName}</div>
                  <div class="tabular-nums" style="font-size: 12.5px; color: #64748b;">${apt.patientPhone} · ${apt.patientAge} বছর (${apt.patientGender === 'female' ? 'মহিলা' : 'পুরুষ'})</div>
                </td>
                <td>
                  <div class="tabular-nums" style="font-weight: 600; color: #0f172a;">${apt.date}</div>
                  <div class="tabular-nums" style="font-size: 12.5px; color: var(--kdc-teal-dark); font-weight: 700;">${apt.timeSlot}</div>
                </td>
                <td>
                  <span style="font-weight: 600; color: #1e293b;">${apt.serviceRequested}</span>
                  ${apt.notes ? `<div style="font-size: 11.5px; color: #64748b;">নোট: ${apt.notes}</div>` : ''}
                </td>
                <td>
                  <span style="font-size: 13.5px; color: #334155;">${apt.doctorName}</span>
                </td>
                <td>
                  <select class="kdc-apt-status-select" data-apt-id="${apt.id}" style="padding: 4px 8px; border-radius: 6px; font-size: 12.5px; font-weight: 600; border: 1px solid #cbd5e1; background: #fff;">
                    <option value="pending" ${apt.status === 'pending' ? 'selected' : ''}>অপেক্ষমান (Pending)</option>
                    <option value="confirmed" ${apt.status === 'confirmed' ? 'selected' : ''}>নিশ্চিত (Confirmed)</option>
                    <option value="in_progress" ${apt.status === 'in_progress' ? 'selected' : ''}>চিকিৎসাধীন (In Progress)</option>
                    <option value="completed" ${apt.status === 'completed' ? 'selected' : ''}>সম্পন্ন (Completed)</option>
                    <option value="cancelled" ${apt.status === 'cancelled' ? 'selected' : ''}>বাতিল (Cancelled)</option>
                  </select>
                </td>
                <td>
                  <button class="kdc-btn kdc-btn-whatsapp kdc-btn-sm btn-send-apt-wa" data-phone="${apt.patientPhone}" data-name="${apt.patientName}" data-date="${apt.date}" data-time="${apt.timeSlot}" title="হোয়াটসঅ্যাপ রিমাইন্ডার পাঠান">
                    <span class="material-symbols-rounded" style="font-size: 16px;">chat</span>
                    <span>হোয়াটসঅ্যাপ</span>
                  </button>
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="kdc-btn kdc-btn-primary kdc-btn-sm btn-apt-prescribe" data-name="${apt.patientName}" data-phone="${apt.patientPhone}" data-age="${apt.patientAge}" data-gender="${apt.patientGender}" title="প্রেসক্রিপশন লিখুন">
                      <span class="material-symbols-rounded" style="font-size: 16px;">prescriptions</span>
                      <span>Rx</span>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Handlers
  container.querySelector('#apt-filter-date')?.addEventListener('change', (e) => {
    appState.appointmentDateFilter = (e.target as HTMLInputElement).value;
    appState.notify();
  });

  container.querySelector('#btn-open-booking-modal')?.addEventListener('click', () => {
    appState.openModal('new_patient');
  });

  container.querySelectorAll('.kdc-apt-status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const aptId = sel.getAttribute('data-apt-id');
      const val = (e.target as HTMLSelectElement).value as any;
      if (aptId) appState.updateAppointmentStatus(aptId, val);
    });
  });

  container.querySelectorAll('.btn-send-apt-wa').forEach(btn => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-phone') || '';
      const name = btn.getAttribute('data-name') || '';
      const date = btn.getAttribute('data-date') || '';
      const time = btn.getAttribute('data-time') || '';
      const message = `আসসালামু আলাইকুম ${name}, খাদিজা ডেন্টাল কেয়ার এ আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে।\nতারিখ: ${date}\nসময়: ${time}\nচিকিৎসক: ${CLINIC_INFO.doctorName}\nচেম্বার: ${CLINIC_INFO.addressBangla}।\nহটলাইন: ${CLINIC_INFO.phone}।`;
      appState.sendWhatsAppReminder(phone, message);
    });
  });

  container.querySelectorAll('.btn-apt-prescribe').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || '';
      const phone = btn.getAttribute('data-phone') || '';
      const age = parseInt(btn.getAttribute('data-age') || '25', 10);
      const gender = (btn.getAttribute('data-gender') || 'male') as any;

      appState.createNewBlankPrescription({
        id: 'P-APT',
        name,
        phone,
        age,
        gender,
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

  return container;
}
