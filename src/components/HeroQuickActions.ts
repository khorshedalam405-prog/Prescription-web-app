import { appState } from '../state';
import { CLINIC_INFO } from '../constants';

export function renderHeroQuickActions(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'kdc-hero-action-section kdc-no-print';

  section.innerHTML = `
    <!-- The exact 3 Signature Pill Buttons from the User Mockup -->
    <div class="kdc-action-pills-row">
      <button class="kdc-action-pill-btn" id="btn-pill-prescription" title="নতুন প্রেসক্রিপশন তৈরি ও প্রিন্ট করুন">
        <span>প্রেসক্রিপশন</span>
      </button>

      <button class="kdc-action-pill-btn" id="btn-pill-patients" title="পূর্ববর্তী সকল রোগীর হিস্ট্রি ও রেকর্ড দেখুন">
        <span>পূর্বের রোগী</span>
      </button>

      <button class="kdc-action-pill-btn" id="btn-pill-medicines" title="ডেন্টাল ঔষধ এন্ট্রি ও স্টক ম্যানেজমেন্ট">
        <span>ঔষধ এন্ট্রি</span>
      </button>
    </div>

    <!-- Quick Clinic Status Notification Strip -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary); font-size: 24px;">schedule</span>
        <div>
          <span style="font-weight: 700; color: #0f172a; font-size: 14.5px;">চেম্বার সময়সূচী: </span>
          <span style="color: #475569; font-size: 14px;">${CLINIC_INFO.chamberTiming}</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-quick-new-patient">
          <span class="material-symbols-rounded">person_add</span>
          <span>নতুন রোগী রেজিস্টার</span>
        </button>

        <a href="tel:${appState.settings.phoneClean}" class="kdc-btn kdc-btn-primary kdc-btn-sm" style="text-decoration: none;">
          <span class="material-symbols-rounded">call</span>
          <span>হটলাইন: ${appState.settings.phone}</span>
        </a>
      </div>
    </div>
  `;

  // Pill click handlers
  section.querySelector('#btn-pill-prescription')?.addEventListener('click', () => {
    appState.createNewBlankPrescription();
  });

  section.querySelector('#btn-pill-patients')?.addEventListener('click', () => {
    appState.setTab('patients');
  });

  section.querySelector('#btn-pill-medicines')?.addEventListener('click', () => {
    appState.setTab('medicines');
  });

  section.querySelector('#btn-quick-new-patient')?.addEventListener('click', () => {
    appState.openModal('new_patient');
  });

  return section;
}
