import { appState } from '../state';
import { ClinicalImage, ClinicalImageType, Patient, Appointment, TreatmentItem, Prescription } from '../types';
import { CLINIC_INFO, FDI_TOOTH_MAP } from '../constants';
import { renderTreatmentHistoryDashboard } from './TreatmentHistoryDashboard';

export function renderPatientDetailView(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kdc-patient-detail-view';

  const patient = appState.patients.find(p => p.id === appState.selectedPatientId) || appState.patients[0];
  if (!patient) {
    container.innerHTML = `
      <div class="kdc-card" style="text-align: center; padding: 48px;">
        <span class="material-symbols-rounded" style="font-size: 48px; color: #94a3b8;">person_off</span>
        <h3 style="font-size: 18px; font-weight: 700; margin: 12px 0;">কোনো রোগী নির্বাচিত নেই</h3>
        <button class="kdc-btn kdc-btn-primary" id="btn-back-to-patients-list">
          <span class="material-symbols-rounded">arrow_back</span>
          <span>সকল রোগীর তালিকায় ফিরে যান</span>
        </button>
      </div>
    `;
    container.querySelector('#btn-back-to-patients-list')?.addEventListener('click', () => {
      appState.closePatientDetail();
    });
    return container;
  }

  // Patient related data
  const patientAppointments = appState.appointments
    .filter(a => a.patientId === patient.id || a.patientPhone === patient.phone || a.patientName === patient.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const patientTreatments: { item: TreatmentItem; planId: string }[] = [];
  appState.treatmentPlans.forEach(plan => {
    if (plan.patientId === patient.id || plan.patientName === patient.name) {
      plan.items.forEach(item => {
        patientTreatments.push({ item, planId: plan.id });
      });
    }
  });

  const patientImages = appState.clinicalImages.filter(img => img.patientId === patient.id);
  const patientPrescriptions = appState.prescriptions.filter(rx => rx.patientId === patient.id || rx.patientPhone === patient.phone || rx.patientName === patient.name);

  const activeTab = appState.patientDetailTab;

  container.innerHTML = `
    <!-- Top Breadcrumb & Patient Switcher -->
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="kdc-btn kdc-btn-secondary" id="btn-back-to-patients" style="padding: 6px 14px; font-size: 13.5px;">
          <span class="material-symbols-rounded" style="font-size: 18px;">arrow_back</span>
          <span>সকল রোগী তালিকা</span>
        </button>
        <div style="font-size: 13.5px; color: #64748b;">
          রোগীর প্রোফাইল ও সম্পূর্ণ মেডিকেল ড্যাশবোর্ড / <strong style="color: var(--kdc-teal-dark);">${patient.name}</strong>
        </div>
      </div>

      <!-- Quick Patient Switcher -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <label for="detail-patient-switcher" style="font-size: 13px; color: #64748b; font-weight: 600;">রোগী পরিবর্তন:</label>
        <select id="detail-patient-switcher" class="kdc-input" style="padding: 6px 12px; font-size: 13.5px; width: auto; max-width: 220px;">
          ${appState.patients.map(p => `
            <option value="${p.id}" ${p.id === patient.id ? 'selected' : ''}>${p.name} (${p.id})</option>
          `).join('')}
        </select>
      </div>
    </div>

    <!-- Patient Header Banner -->
    <div class="kdc-card" style="border-top: 4px solid var(--kdc-teal-primary); margin-bottom: 20px; padding: 20px 24px;">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
        <!-- Left: Avatar & Identity -->
        <div style="display: flex; align-items: center; gap: 18px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--kdc-teal-primary), var(--kdc-teal-dark)); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; box-shadow: 0 4px 14px rgba(14, 131, 136, 0.35); flex-shrink: 0;">
            ${patient.name.charAt(0)}
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="tabular-nums" style="background: var(--kdc-teal-subtle); color: var(--kdc-teal-dark); padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 700;">
                আইডি: ${patient.id}
              </span>
              <span style="background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                ${patient.gender === 'female' ? 'মহিলা (Female)' : 'পুরুষ (Male)'} · ${patient.age} বছর
              </span>
              <span style="background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 700;">
                রক্তের গ্রুপ: ${patient.bloodGroup || 'অজানা'}
              </span>
            </div>

            <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 4px 0 2px 0;">
              ${patient.name}
            </h1>

            <div style="font-size: 13.5px; color: #475569; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-rounded" style="font-size: 16px; color: var(--kdc-teal-primary);">phone</span>
                <strong class="tabular-nums">${patient.phone}</strong>
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-rounded" style="font-size: 16px; color: #64748b;">location_on</span>
                <span>${patient.address || 'ঠিকানা দেওয়া নেই'}</span>
              </span>
              <span style="display: flex; align-items: center; gap: 4px; color: #64748b;">
                <span class="material-symbols-rounded" style="font-size: 16px;">calendar_today</span>
                <span>নিবন্ধন: ${patient.registrationDate || '2026-10-15'}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Action Buttons -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button class="kdc-btn kdc-btn-primary" id="btn-detail-new-rx">
            <span class="material-symbols-rounded">prescriptions</span>
            <span>প্রেসক্রিপশন লিখুন</span>
          </button>

          <button class="kdc-btn kdc-btn-secondary" id="btn-detail-new-apt">
            <span class="material-symbols-rounded">add_circle</span>
            <span>অ্যাপয়েন্টমেন্ট দিন</span>
          </button>

          <button class="kdc-btn kdc-btn-whatsapp" id="btn-detail-whatsapp" data-phone="${patient.phone}">
            <span class="material-symbols-rounded">chat</span>
            <span>WhatsApp</span>
          </button>

          <button class="kdc-btn kdc-btn-secondary" id="btn-detail-print" title="রোগীর সম্পূর্ণ হিস্ট্রি প্রিন্ট করুন">
            <span class="material-symbols-rounded">print</span>
            <span>প্রিন্ট সামারি</span>
          </button>
        </div>
      </div>

      <!-- Medical Alerts Banner -->
      <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <span style="font-size: 12.5px; font-weight: 700; color: #991b1b; display: flex; align-items: center; gap: 4px;">
          <span class="material-symbols-rounded" style="font-size: 18px;">warning</span>
          <span>মেডিকেল সতর্কতা (Medical Alerts):</span>
        </span>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${patient.medicalAlerts.diabetes ? `
            <span style="background: #fee2e2; border: 1px solid #fecdd3; color: #991b1b; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              <span>🩸 ডায়াবেটিস (DM)</span>
            </span>
          ` : ''}

          ${patient.medicalAlerts.hypertension ? `
            <span style="background: #ffedd5; border: 1px solid #fed7aa; color: #9a3412; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              <span>💓 উচ্চ রক্তচাপ (HTN)</span>
            </span>
          ` : ''}

          ${patient.medicalAlerts.drugAllergies && patient.medicalAlerts.drugAllergies.length > 0 ? `
            <span style="background: #fef9c3; border: 1px solid #fef08a; color: #854d0e; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              <span>⚠️ এলার্জি: ${patient.medicalAlerts.drugAllergies.join(', ')}</span>
            </span>
          ` : ''}

          ${patient.medicalAlerts.cardiacHistory ? `
            <span style="background: #fdf2f8; border: 1px solid #fbcfe8; color: #9d174d; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">
              🫀 কার্ডিয়াক হিস্ট্রি
            </span>
          ` : ''}

          ${patient.medicalAlerts.bleedingDisorder ? `
            <span style="background: #fef2f2; border: 1px solid #fee2e2; color: #b91c1c; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">
              🩸 রক্তক্ষরণ ঝুঁকি (Bleeding Disorder)
            </span>
          ` : ''}

          ${!patient.medicalAlerts.diabetes && !patient.medicalAlerts.hypertension && (!patient.medicalAlerts.drugAllergies || patient.medicalAlerts.drugAllergies.length === 0) ? `
            <span style="background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
              ✓ কোনো জটিল মেডিকেল এলার্জি বা ঝুঁকি নথিভুক্ত নেই
            </span>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- 4 KPI Snapshot Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <!-- Total Visits -->
      <div class="kdc-card" style="padding: 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: var(--kdc-teal-subtle); color: var(--kdc-teal-primary); display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded" style="font-size: 26px;">event_available</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b; font-weight: 600;">মোট অ্যাপয়েন্টমেন্ট</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #0f172a;">${patientAppointments.length} টি ভিজিট</div>
          <div style="font-size: 11.5px; color: var(--kdc-teal-dark);">সর্বশেষ: ${patient.lastVisitDate || 'আজ'}</div>
        </div>
      </div>

      <!-- Treatments -->
      <div class="kdc-card" style="padding: 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded" style="font-size: 26px;">dentistry</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b; font-weight: 600;">চিকিৎসা হিস্ট্রি</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #0f172a;">${patientTreatments.length} টি প্রসিডিউর</div>
          <div style="font-size: 11.5px; color: #0284c7;">
            ${patientTreatments.filter(t => t.item.status === 'completed').length} সম্পন্ন · ${patientTreatments.filter(t => t.item.status !== 'completed').length} চলমান
          </div>
        </div>
      </div>

      <!-- Clinical Images / X-Rays -->
      <div class="kdc-card" style="padding: 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: #f3e8ff; color: #7e22ce; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded" style="font-size: 26px;">radiology</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b; font-weight: 600;">এক্স-রে ও ক্লিনিক্যাল ছবি</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #0f172a;">${patientImages.length} টি রেডিওগ্রাফ</div>
          <div style="font-size: 11.5px; color: #7e22ce;">IOPA, OPG ও ক্যামেরা ছবি</div>
        </div>
      </div>

      <!-- Financial Balance -->
      <div class="kdc-card" style="padding: 16px; display: flex; align-items: center; gap: 14px;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: ${patient.dueAmount > 0 ? '#fee2e2' : '#ecfdf5'}; color: ${patient.dueAmount > 0 ? '#dc2626' : '#16a34a'}; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-rounded" style="font-size: 26px;">payments</span>
        </div>
        <div>
          <div style="font-size: 12.5px; color: #64748b; font-weight: 600;">বিলিং ও বকেয়া স্ট্যাটাস</div>
          <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: ${patient.dueAmount > 0 ? '#dc2626' : '#16a34a'};">
            ${patient.dueAmount > 0 ? `৳ ${patient.dueAmount.toLocaleString()} বকেয়া` : 'সম্পূর্ণ পরিশোধিত'}
          </div>
          <div class="tabular-nums" style="font-size: 11.5px; color: #64748b;">
            বিল: ৳${patient.totalBilled.toLocaleString()} · জমা: ৳${patient.totalPaid.toLocaleString()}
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Tab Bar for Detail View -->
    <div style="display: flex; gap: 8px; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px; overflow-x: auto; padding-bottom: 2px;">
      <button class="kdc-subtab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
        <span class="material-symbols-rounded">dashboard</span>
        <span>সারসংক্ষেপ (Overview)</span>
      </button>

      <button class="kdc-subtab-btn ${activeTab === 'treatments' ? 'active' : ''}" data-tab="treatments">
        <span class="material-symbols-rounded">dentistry</span>
        <span>চিকিৎসা ইতিহাস (${patientTreatments.length})</span>
      </button>

      <button class="kdc-subtab-btn ${activeTab === 'xrays' ? 'active' : ''}" data-tab="xrays">
        <span class="material-symbols-rounded">radiology</span>
        <span>এক্স-রে ও ক্লিনিক্যাল ছবি (${patientImages.length})</span>
      </button>

      <button class="kdc-subtab-btn ${activeTab === 'prescriptions' ? 'active' : ''}" data-tab="prescriptions">
        <span class="material-symbols-rounded">prescriptions</span>
        <span>প্রেসক্রিপশন রেকর্ড (${patientPrescriptions.length})</span>
      </button>
    </div>

    <!-- Tab Content Renderers -->
    <div id="patient-detail-tab-content">
      ${activeTab === 'treatments' ? '' : renderTabContent(activeTab, patient, patientAppointments, patientTreatments, patientImages, patientPrescriptions)}
    </div>

    <!-- Lightbox Modal Container (if active) -->
    ${appState.selectedImageForLightbox ? renderLightboxModal(appState.selectedImageForLightbox) : ''}
  `;

  if (activeTab === 'treatments') {
    const tabSlot = container.querySelector('#patient-detail-tab-content');
    if (tabSlot) {
      tabSlot.appendChild(renderTreatmentHistoryDashboard(patient.id));
    }
  }

  // Attach event handlers
  setupDetailViewEvents(container, patient);

  return container;
}

function renderTabContent(
  tab: 'overview' | 'treatments' | 'xrays' | 'prescriptions',
  patient: Patient,
  appointments: Appointment[],
  treatments: { item: TreatmentItem; planId: string }[],
  images: ClinicalImage[],
  prescriptions: Prescription[]
): string {
  switch (tab) {
    case 'overview':
      return renderOverviewTab(patient, appointments, treatments, images, prescriptions);
    case 'treatments':
      return renderTreatmentsTab(patient, treatments);
    case 'xrays':
      return renderXraysTab(patient, images);
    case 'prescriptions':
      return renderPrescriptionsTab(patient, prescriptions);
  }
}

// -------------------------------------------------------------
// TAB 1: OVERVIEW
// -------------------------------------------------------------
function renderOverviewTab(
  patient: Patient,
  appointments: Appointment[],
  treatments: { item: TreatmentItem; planId: string }[],
  images: ClinicalImage[],
  prescriptions: Prescription[]
): string {
  const nextApt = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');
  const latestRx = prescriptions[0];
  const latestImg = images[0];

  return `
    <div class="kdc-detail-overview-grid">
      <!-- Left Column: Medical & Treatment Highlights -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Next Appointment Highlight -->
        <div class="kdc-card" style="border-left: 4px solid var(--kdc-teal-primary); padding: 18px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px;">
            <div style="font-weight: 700; color: var(--kdc-teal-dark); font-size: 15px; display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-rounded">calendar_clock</span>
              <span>আসন্ন বা পরবর্তী অ্যাপয়েন্টমেন্ট</span>
            </div>
            ${nextApt ? `
              <span class="kdc-badge ${nextApt.status === 'confirmed' ? 'kdc-badge-confirmed' : 'kdc-badge-pending'}">
                ${nextApt.status === 'confirmed' ? 'কনফার্মড' : 'অপেক্ষমাণ'}
              </span>
            ` : ''}
          </div>

          ${nextApt ? `
            <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              ${nextApt.serviceRequested}
            </div>
            <div style="font-size: 13.5px; color: #475569; display: flex; gap: 16px; margin-bottom: 8px; flex-wrap: wrap;">
              <span>📅 তারিখ: <strong>${nextApt.date}</strong></span>
              <span>⏰ সময়: <strong>${nextApt.timeSlot}</strong></span>
              <span>👨‍⚕️ চিকিৎসক: <strong>${nextApt.doctorName}</strong></span>
            </div>
            ${nextApt.notes ? `
              <div style="font-size: 13px; color: #64748b; background: #f8fafc; padding: 8px 12px; border-radius: 6px;">
                নোট: ${nextApt.notes}
              </div>
            ` : ''}
          ` : `
            <div style="font-size: 14px; color: #64748b; padding: 8px 0;">
              এই মুহূর্তে কোনো আসন্ন অ্যাপয়েন্টমেন্ট নির্ধারিত নেই।
            </div>
            <button class="kdc-btn kdc-btn-primary kdc-btn-sm" id="btn-quick-schedule-apt">
              <span class="material-symbols-rounded">add</span>
              <span>নতুন অ্যাপয়েন্টমেন্ট শিডিউল করুন</span>
            </button>
          `}
        </div>

        <!-- Latest Clinical Prescription & Findings -->
        <div class="kdc-card">
          <div class="kdc-card-header">
            <div class="kdc-card-title">
              <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">prescriptions</span>
              <span>সর্বশেষ ডায়াগনোসিস ও প্রেসক্রিপশন (${latestRx ? latestRx.date : 'তথ্য নেই'})</span>
            </div>
            ${latestRx ? `
              <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-view-latest-rx" data-rx-id="${latestRx.id}">
                <span>প্রেসক্রিপশন ওপেন করুন</span>
              </button>
            ` : ''}
          </div>

          ${latestRx ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
              <div style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 12px; color: #64748b; font-weight: 600;">রোগীর প্রধান সমস্যা (Chief Complaint):</div>
                <div style="font-weight: 700; color: #0f172a; font-size: 13.5px; margin-top: 2px;">
                  ${latestRx.chiefComplaints.join(', ')}
                </div>
              </div>

              <div style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="font-size: 12px; color: #64748b; font-weight: 600;">ক্লিনিক্যাল ডায়াগনোসিস (Dx):</div>
                <div style="font-weight: 700; color: var(--kdc-teal-dark); font-size: 13.5px; margin-top: 2px;">
                  ${latestRx.diagnosis}
                </div>
              </div>
            </div>

            <!-- Vitals Snapshot -->
            <div style="display: flex; gap: 12px; font-size: 12.5px; color: #475569; margin-bottom: 12px; background: var(--kdc-teal-subtle); padding: 8px 12px; border-radius: 6px; flex-wrap: wrap;">
              <span><strong>ব্লাড প্রেশার (BP):</strong> ${latestRx.vitals.bp || '120/80 mmHg'}</span>
              <span><strong>পালস:</strong> ${latestRx.vitals.pulse || '74 bpm'}</span>
              <span><strong>তাপমাত্রা:</strong> ${latestRx.vitals.temperature || '98.6°F'}</span>
            </div>

            <!-- Medicines list preview -->
            <div style="font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">নির্দেশিত ওষুধসমূহ:</div>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
              ${latestRx.medicines.slice(0, 3).map(m => `
                <li><strong>${m.type} ${m.brandName}</strong> (${m.dosage}) - ${m.mealTiming}, ${m.duration}</li>
              `).join('')}
              ${latestRx.medicines.length > 3 ? `<li style="color: var(--kdc-teal-dark); font-weight: 600;">+ আরো ${latestRx.medicines.length - 3} টি ওষুধ প্রেসক্রিপশনে অন্তর্ভুক্ত</li>` : ''}
            </ul>
          ` : `
            <div style="font-size: 13.5px; color: #64748b; padding: 16px 0; text-align: center;">
              এখনও কোনো প্রেসক্রিপশন নথিভুক্ত করা হয়নি।
            </div>
          `}
        </div>

        <!-- Active Treatment Progress -->
        <div class="kdc-card">
          <div class="kdc-card-header">
            <div class="kdc-card-title">
              <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">dentistry</span>
              <span>চলমান চিকিৎসা পরিকল্পনা ও অগ্রগতি</span>
            </div>
            <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-jump-to-treatments-tab">
              <span>সব দেখুন</span>
            </button>
          </div>

          ${treatments.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${treatments.slice(0, 3).map(t => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <div>
                    <div style="font-weight: 700; color: #0f172a; font-size: 14px;">
                      ${t.item.procedureName}
                      ${t.item.toothNumber ? `<span style="background: var(--kdc-teal-subtle); color: var(--kdc-teal-dark); padding: 1px 6px; border-radius: 4px; font-size: 11px; margin-left: 6px;">দাঁত #${t.item.toothNumber}</span>` : ''}
                    </div>
                    <div style="font-size: 12px; color: #64748b;">
                      ক্যাটাগরি: ${t.item.category} · প্রাক্কলিত খরচ: ৳${t.item.cost.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <span class="kdc-badge ${t.item.status === 'completed' ? 'kdc-badge-confirmed' : t.item.status === 'in_progress' ? 'kdc-badge-in_progress' : 'kdc-badge-pending'}">
                      ${t.item.status === 'completed' ? 'সম্পন্ন' : t.item.status === 'in_progress' ? 'চলমান' : 'পরিকল্পিত'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="font-size: 13.5px; color: #64748b; padding: 16px 0; text-align: center;">
              কোনো চিকিৎসা পরিকল্পনা পাওয়া যায়নি।
            </div>
          `}
        </div>

      </div>

      <!-- Right Column: Recent Dental X-Ray & Quick Notes -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Latest Radiology Thumbnail Card -->
        <div class="kdc-card" style="border-top: 3px solid #7e22ce;">
          <div class="kdc-card-header">
            <div class="kdc-card-title">
              <span class="material-symbols-rounded" style="color: #7e22ce;">radiology</span>
              <span>সর্বশেষ ডেন্টাল এক্স-রে</span>
            </div>
            <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-jump-to-xrays-tab">
              <span>সকল এক্স-রে (${images.length})</span>
            </button>
          </div>

          ${latestImg ? `
            <div style="background: #0b0f19; border-radius: 8px; overflow: hidden; position: relative; cursor: pointer; border: 1px solid #1e293b;" class="btn-inspect-image" data-image-id="${latestImg.id}">
              <img src="${latestImg.imageUrl}" alt="${latestImg.title}" style="width: 100%; height: 190px; object-fit: contain; display: block;" />
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); padding: 10px 12px; color: #ffffff;">
                <div style="font-weight: 700; font-size: 13px;">${latestImg.title}</div>
                <div style="font-size: 11px; opacity: 0.8;">তারিখ: ${latestImg.date} · ক্লিক করে বড় করুন</div>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 12.5px; color: #475569;">
              <strong>পর্যবেক্ষণ:</strong> ${latestImg.notes || 'কোনো রেডিওলজিক্যাল নোট পাওয়া যায়নি।'}
            </div>
          ` : `
            <div style="text-align: center; padding: 24px; color: #64748b; background: #f8fafc; border-radius: 8px;">
              <span class="material-symbols-rounded" style="font-size: 36px; color: #cbd5e1;">image_not_supported</span>
              <div style="font-size: 13.5px; margin-top: 6px;">এখনও কোনো এক্স-রে বা ছবি আপলোড করা হয়নি।</div>
              <button class="kdc-btn kdc-btn-primary kdc-btn-sm" id="btn-overview-upload-xray" style="margin-top: 10px;">
                <span class="material-symbols-rounded">cloud_upload</span>
                <span>এক্স-রে আপলোড করুন</span>
              </button>
            </div>
          `}
        </div>

        <!-- Clinical Notes & Doctor Summary -->
        <div class="kdc-card">
          <div class="kdc-card-header">
            <div class="kdc-card-title">
              <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">sticky_note_2</span>
              <span>ডাক্তারের বিশেষ মন্তব্য ও পরামর্শ</span>
            </div>
          </div>

          <div style="font-size: 13.5px; color: #334155; line-height: 1.6; background: #f8fafc; padding: 12px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
            ${patient.medicalAlerts?.otherNotes ? patient.medicalAlerts.otherNotes : 'রোগীর সাধারণ মুখের স্বাস্থ্যবিধি মাঝারি মানের। নিয়মিত স্কেলিং ও খাদ্য গ্রহণের পর ফ্লসিং করার পরামর্শ দেওয়া হয়েছে।'}
          </div>

          <!-- Quick Action Links -->
          <div style="display: flex; gap: 8px; margin-top: 16px;">
          </div>
        </div>

      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 2: APPOINTMENTS HISTORY
// -------------------------------------------------------------
function renderAppointmentsTab(patient: Patient, appointments: Appointment[]): string {
  return `
    <div class="kdc-card">
      <div class="kdc-card-header">
        <div>
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">event_note</span>
            <span>${patient.name} - অ্যাপয়েন্টমেন্ট হিস্ট্রি (${appointments.length} টি)</span>
          </div>
          <div style="font-size: 13px; color: #64748b;">অতীতের সকল ডেন্টাল চেকআপ, ভিজিট ও শিডিউল পর্যালোচনা করুন।</div>
        </div>

        <button class="kdc-btn kdc-btn-primary" id="btn-tab-new-appointment">
          <span class="material-symbols-rounded">add_circle</span>
          <span>নতুন অ্যাপয়েন্টমেন্ট বুকিং</span>
        </button>
      </div>

      <div class="kdc-table-wrapper">
        <table class="kdc-table">
          <thead>
            <tr>
              <th>তারিখ ও সময়</th>
              <th>সিরিয়াল</th>
              <th>সেবা / কারণ</th>
              <th>চিকিৎসক</th>
              <th>স্ট্যাটাস</th>
              <th>নোট</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: #64748b; padding: 32px;">এই রোগীর কোনো অতীত বা বর্তমান অ্যাপয়েন্টমেন্ট রেকর্ড নেই।</td></tr>
            ` : appointments.map(a => `
              <tr>
                <td>
                  <div style="font-weight: 700; color: #0f172a;">${a.date}</div>
                  <div style="font-size: 12px; color: #64748b;">${a.timeSlot}</div>
                </td>
                <td><strong class="tabular-nums" style="color: var(--kdc-teal-dark);">#${a.serialNumber}</strong></td>
                <td>
                  <strong style="color: #0f172a;">${a.serviceRequested}</strong>
                </td>
                <td>${a.doctorName}</td>
                <td>
                  <span class="kdc-badge ${
                    a.status === 'confirmed' ? 'kdc-badge-confirmed' :
                    a.status === 'in_progress' ? 'kdc-badge-in_progress' :
                    a.status === 'completed' ? 'kdc-badge-confirmed' :
                    a.status === 'cancelled' ? 'kdc-badge-cancelled' : 'kdc-badge-pending'
                  }">
                    ${
                      a.status === 'confirmed' ? 'নিশ্চিত' :
                      a.status === 'in_progress' ? 'চলমান' :
                      a.status === 'completed' ? 'সম্পন্ন' :
                      a.status === 'cancelled' ? 'বাতিল' : 'অপেক্ষমাণ'
                    }
                  </span>
                </td>
                <td style="font-size: 12.5px; color: #64748b; max-width: 200px;">
                  ${a.notes || '—'}
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="kdc-btn kdc-btn-whatsapp kdc-btn-sm btn-apt-whatsapp-remind" data-phone="${patient.phone}" data-date="${a.date}" data-time="${a.timeSlot}">
                      <span class="material-symbols-rounded">chat</span>
                      <span>রিমাইন্ডার</span>
                    </button>
                    ${a.status !== 'completed' ? `
                      <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-mark-apt-done" data-apt-id="${a.id}">
                        <span>সম্পন্ন</span>
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 3: TREATMENT HISTORY & ODONTOGRAM
// -------------------------------------------------------------
function renderTreatmentsTab(patient: Patient, _treatments: { item: TreatmentItem; planId: string }[]): string {
  const dashContainer = document.createElement('div');
  dashContainer.appendChild(renderTreatmentHistoryDashboard(patient.id));
  return dashContainer.innerHTML;
}

// -------------------------------------------------------------
// TAB 4: CLINICAL IMAGES & RADIOLOGY (X-RAYS)
// -------------------------------------------------------------
function renderXraysTab(patient: Patient, images: ClinicalImage[]): string {
  return `
    <div class="kdc-card" style="margin-bottom: 24px;">
      <div class="kdc-card-header">
        <div>
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: #7e22ce;">radiology</span>
            <span>ডেন্টাল রেডিওগ্রাফি ও ক্লিনিক্যাল ছবি গ্যালারি (${images.length} টি)</span>
          </div>
          <div style="font-size: 13px; color: #64748b;">
            IOPA এক্স-রে, OPG প্যানোরামিক, বাইটউইং ও ইন্ট্রাওরাল ক্যামেরা ছবির ডিজিটাল আর্কাইভ।
          </div>
        </div>

        <button class="kdc-btn kdc-btn-primary" id="btn-toggle-upload-xray-panel">
          <span class="material-symbols-rounded">add_photo_alternate</span>
          <span>নতুন এক্স-রে / ছবি আপলোড</span>
        </button>
      </div>

      <!-- Upload Form Collapsible Container -->
      <div id="xray-upload-container" style="display: none; background: #f8fafc; border: 1.5px dashed var(--kdc-teal-primary); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h4 style="font-size: 16px; font-weight: 700; color: var(--kdc-teal-dark); margin: 0; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-rounded">cloud_upload</span>
            <span>রোগী ${patient.name}-এর জন্য নতুন ক্লিনিক্যাল রেডিওগ্রাফ / ছবি যোগ করুন</span>
          </h4>
          <button id="btn-cancel-xray-upload" style="background: none; border: none; color: #64748b; cursor: pointer;">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <form id="form-upload-clinical-image" class="kdc-xray-upload-form">
          <!-- Left: Details -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="kdc-form-group">
              <label class="kdc-label">ছবির শিরোনাম / বিবরণ *</label>
              <input type="text" id="xray-title" class="kdc-input" placeholder="যেমন: IOPA এক্স-রে দাঁত নং ৪৬" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="kdc-form-group">
                <label class="kdc-label">ইমেজ টাইপ *</label>
                <select id="xray-type" class="kdc-input">
                  <option value="iopa_xray">IOPA (Periapical X-Ray)</option>
                  <option value="opg_xray">OPG (Panoramic Full Mouth)</option>
                  <option value="bitewing">Bitewing Radiograph</option>
                  <option value="intraoral_photo">Intraoral HD Camera Photo</option>
                  <option value="post_op_photo">Post-Operative Photo</option>
                  <option value="ct_scan">CBCT / 3D Dental Scan</option>
                </select>
              </div>

              <div class="kdc-form-group">
                <label class="kdc-label">দাঁত নম্বর (FDI Notation)</label>
                <select id="xray-tooth-number" class="kdc-input">
                  <option value="">প্রযোজ্য নয় / ফুল মাউথ</option>
                  ${Object.keys(FDI_TOOTH_MAP).map(tNum => `
                    <option value="${tNum}">দাঁত #${tNum} - ${FDI_TOOTH_MAP[parseInt(tNum)]}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="kdc-form-group">
              <label class="kdc-label">তারিখ</label>
              <input type="date" id="xray-date" class="kdc-input" value="${new Date().toISOString().split('T')[0]}" />
            </div>
          </div>

          <!-- Right: File Picker & Notes -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="kdc-form-group">
              <label class="kdc-label">ইমেজ ফাইল নির্বাচন করুন (বা ড্র্যাগ করুন) *</label>
              <input type="file" id="xray-file-input" class="kdc-input" accept="image/*" />
              <div style="display: flex; gap: 8px; margin-top: 6px;">
                <button type="button" class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-use-sample-xray">
                  <span class="material-symbols-rounded">image</span>
                  <span>নমুনা IOPA এক্স-রে ব্যবহার করুন</span>
                </button>
              </div>
            </div>

            <!-- Image Preview Box -->
            <div id="xray-preview-box" style="height: 100px; background: #0b0f19; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #1e293b;">
              <span style="color: #64748b; font-size: 12.5px;">ফাইল নির্বাচন করলে প্রিভিউ এখানে দেখা যাবে</span>
            </div>

            <div class="kdc-form-group">
              <label class="kdc-label">রেডিওলজিস্ট / ডাক্তারের পর্যবেক্ষণ নোট</label>
              <textarea id="xray-notes" class="kdc-input" rows="2" placeholder="হাড়ের ঘনত্ব, পাল্পের গভীরতা বা পেরিয়াপিক্যাল লিশন সংক্রান্ত পর্যবেক্ষণ..."></textarea>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
            <button type="button" class="kdc-btn kdc-btn-secondary" id="btn-cancel-xray-upload-2">বাতিল</button>
            <button type="submit" class="kdc-btn kdc-btn-primary">
              <span class="material-symbols-rounded">save</span>
              <span>সংরক্ষণ ও গ্যালারিতে যোগ করুন</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Radiology Gallery Grid -->
      ${images.length === 0 ? `
        <div style="text-align: center; padding: 48px; background: #f8fafc; border-radius: 12px;">
          <span class="material-symbols-rounded" style="font-size: 48px; color: #94a3b8;">radiology</span>
          <h4 style="font-size: 16px; font-weight: 700; color: #334155; margin: 12px 0 6px 0;">কোনো এক্স-রে বা ক্লিনিক্যাল ছবি নেই</h4>
          <p style="font-size: 13.5px; color: #64748b; max-width: 420px; margin: 0 auto 16px auto;">
            রোগীর চিকিৎসা নির্ভুল করতে IOPA, OPG বা ইন্ট্রাওরাল ক্যামেরা ছবি আপলোড করে ডিজিটাল রেকর্ডে সংরক্ষণ করুন।
          </p>
          <button class="kdc-btn kdc-btn-primary" id="btn-empty-upload-xray">
            <span class="material-symbols-rounded">cloud_upload</span>
            <span>প্রথম এক্স-রে ছবি আপলোড করুন</span>
          </button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${images.map(img => {
            const typeLabel = 
              img.type === 'iopa_xray' ? 'IOPA Periapical' :
              img.type === 'opg_xray' ? 'OPG Panoramic' :
              img.type === 'bitewing' ? 'Bitewing' :
              img.type === 'intraoral_photo' ? 'Intraoral Photo' : 'Clinical Image';

            return `
              <div class="kdc-card" style="padding: 0; overflow: hidden; border: 1px solid #cbd5e1; display: flex; flex-direction: column;">
                <!-- Radiographic Dark Canvas Image Frame -->
                <div style="background: #0b0f19; height: 180px; position: relative; overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center;" class="btn-inspect-image" data-image-id="${img.id}">
                  <img src="${img.imageUrl}" alt="${img.title}" class="${appState.xrayInvertMode ? 'kdc-xray-inverted' : ''}" style="width: 100%; height: 100%; object-fit: contain; transition: transform 0.25s ease;" />
                  
                  <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                    <span style="background: rgba(126, 34, 206, 0.85); color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                      ${typeLabel}
                    </span>
                    ${img.toothNumber ? `
                      <span style="background: rgba(14, 131, 136, 0.85); color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                        #${img.toothNumber}
                      </span>
                    ` : ''}
                  </div>

                  <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;" class="xray-card-overlay">
                    <span style="background: rgba(255,255,255,0.9); color: #0f172a; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                      <span class="material-symbols-rounded" style="font-size: 16px;">zoom_in</span>
                      <span>রেডিওলজি ভিউয়ার</span>
                    </span>
                  </div>
                </div>

                <!-- Meta & Notes -->
                <div style="padding: 14px 16px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${img.title}</div>
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">তারিখ: <strong>${img.date}</strong></div>
                    <p style="font-size: 12.5px; color: #475569; margin: 0 0 12px 0; line-height: 1.4;">
                      ${img.notes || 'কোনো রেডিওলজিক্যাল পর্যবেক্ষণ লিপিবদ্ধ করা হয়নি।'}
                    </p>
                  </div>

                  <!-- Actions -->
                  <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                    <button class="kdc-btn kdc-btn-secondary kdc-btn-sm btn-inspect-image" data-image-id="${img.id}">
                      <span class="material-symbols-rounded">zoom_in</span>
                      <span>পরীক্ষা করুন</span>
                    </button>

                    <button class="kdc-btn kdc-btn-danger kdc-btn-sm btn-delete-clinical-image" data-image-id="${img.id}" title="ছবি মুছে ফেলুন">
                      <span class="material-symbols-rounded" style="font-size: 16px;">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 5: PRESCRIPTIONS
// -------------------------------------------------------------
function renderPrescriptionsTab(patient: Patient, prescriptions: Prescription[]): string {
  return `
    <div class="kdc-card">
      <div class="kdc-card-header">
        <div>
          <div class="kdc-card-title">
            <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">prescriptions</span>
            <span>${patient.name} - প্রেসক্রিপশন আর্কাইভ (${prescriptions.length} টি)</span>
          </div>
          <div style="font-size: 13px; color: #64748b;">পূর্বে প্রদানকৃত সকল ডিজিটাল প্রেসক্রিপশন দেখুন ও সরাসরি A4 সাইজে প্রিন্ট নিন।</div>
        </div>

        <button class="kdc-btn kdc-btn-primary" id="btn-tab-create-new-rx">
          <span class="material-symbols-rounded">add</span>
          <span>নতুন প্রেসক্রিপশন লিখুন</span>
        </button>
      </div>

      ${prescriptions.length === 0 ? `
        <div style="text-align: center; padding: 40px; color: #64748b;">
          কোনো পূর্ববর্তী প্রেসক্রিপশন পাওয়া যায়নি।
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${prescriptions.map(rx => `
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                  <strong class="tabular-nums" style="color: var(--kdc-teal-dark); font-size: 14px;">#${rx.rxNumber}</strong>
                  <span style="font-size: 12px; color: #64748b;">তারিখ: <strong>${rx.date}</strong></span>
                  <span style="background: var(--kdc-teal-subtle); color: var(--kdc-teal-dark); padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                    ${rx.medicines.length} টি ওষুধ
                  </span>
                </div>

                <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                  ${rx.diagnosis}
                </div>

                <div style="font-size: 13px; color: #475569;">
                  উপসর্গ: ${rx.chiefComplaints.join(', ')} · চিকিৎসক: ${rx.doctorName}
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="kdc-btn kdc-btn-secondary btn-open-rx-for-print" data-rx-id="${rx.id}">
                  <span class="material-symbols-rounded">print</span>
                  <span>A4 প্রিন্ট ভিউ</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// -------------------------------------------------------------
// RADIOLOGY LIGHTBOX MODAL (Interactive X-Ray Negative/Invert Mode)
// -------------------------------------------------------------
function renderLightboxModal(image: ClinicalImage): string {
  const isInverted = appState.xrayInvertMode;

  return `
    <div class="kdc-modal-backdrop" id="xray-lightbox-backdrop" style="background: rgba(11, 15, 25, 0.92); z-index: 9999;">
      <div style="max-width: 950px; width: 100%; max-height: 94vh; display: flex; flex-direction: column; background: #0f141f; border-radius: 14px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
        
        <!-- Lightbox Toolbar -->
        <div style="padding: 12px 20px; background: #161e2e; border-bottom: 1px solid #283548; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-rounded" style="color: #a855f7;">radiology</span>
            <div>
              <div style="font-weight: 700; font-size: 15px;">${image.title}</div>
              <div style="font-size: 12px; color: #94a3b8;">
                রোগী আইডি: ${image.patientId} · তারিখ: ${image.date} ${image.toothNumber ? `· দাঁত #${image.toothNumber}` : ''}
              </div>
            </div>
          </div>

          <!-- Diagnostic Controls (Invert Contrast / Negative mode) -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-toggle-xray-invert" style="background: ${isInverted ? '#7e22ce' : '#1e293b'}; color: #ffffff; border-color: #384252;">
              <span class="material-symbols-rounded">contrast</span>
              <span>${isInverted ? 'স্বাভাবিক কালার (Normal)' : 'নেগেটিভ ইনভার্ট (X-Ray Invert)'}</span>
            </button>

            <button class="kdc-btn kdc-btn-secondary kdc-btn-sm" id="btn-close-lightbox" style="background: #1e293b; color: #ffffff; border-color: #384252;">
              <span class="material-symbols-rounded">close</span>
              <span>বন্ধ করুন</span>
            </button>
          </div>
        </div>

        <!-- Lightbox Image Viewport -->
        <div style="flex-grow: 1; min-height: 420px; display: flex; align-items: center; justify-content: center; background: #07090e; padding: 20px; overflow: auto;">
          <img src="${image.imageUrl}" alt="${image.title}" style="max-height: 520px; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 0 30px rgba(0,0,0,0.8); ${isInverted ? 'filter: invert(1) contrast(1.25);' : ''}" />
        </div>

        <!-- Lightbox Radiology Findings Footer -->
        <div style="padding: 14px 20px; background: #161e2e; border-top: 1px solid #283548; color: #cbd5e1; font-size: 13px;">
          <div style="font-weight: 700; color: #f1f5f9; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-rounded" style="font-size: 18px; color: var(--kdc-teal-primary);">diagnosis</span>
            <span>রেডিওলজিক্যাল ডায়াগনোসিস ও ক্লিনিক্যাল নোট:</span>
          </div>
          <p style="margin: 0; line-height: 1.5; color: #94a3b8;">
            ${image.notes || 'কোনো অতিরিক্ত ডায়াগনস্টিক নোট নথিভুক্ত করা হয়নি।'}
          </p>
          ${image.doctorNotes ? `
            <div style="margin-top: 6px; color: var(--kdc-teal-subtle); font-weight: 600;">
              চিকিৎসক নির্দেশনা: ${image.doctorNotes}
            </div>
          ` : ''}
        </div>

      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// EVENT HANDLERS
// -------------------------------------------------------------
function setupDetailViewEvents(container: HTMLElement, patient: Patient) {
  // Breadcrumb back
  container.querySelector('#btn-back-to-patients')?.addEventListener('click', () => {
    appState.closePatientDetail();
  });

  // Switcher
  container.querySelector('#detail-patient-switcher')?.addEventListener('change', (e) => {
    const newId = (e.target as HTMLSelectElement).value;
    appState.openPatientDetail(newId, appState.patientDetailTab);
  });

  // Quick Action Buttons
  container.querySelector('#btn-detail-new-rx')?.addEventListener('click', () => {
    appState.createNewBlankPrescription(patient);
  });

  container.querySelector('#btn-detail-new-apt')?.addEventListener('click', () => {
    appState.openModalWithData('new_patient', { name: patient.name, phone: patient.phone });
  });

  container.querySelector('#btn-detail-whatsapp')?.addEventListener('click', () => {
    appState.sendWhatsAppReminder(patient.phone, `আসসালামু আলাইকুম ${patient.name}, খাদিজা ডেন্টাল কেয়ার থেকে আপনার সাথে যোগাযোগ করা হচ্ছে।`);
  });

  container.querySelector('#btn-detail-print')?.addEventListener('click', () => {
    window.print();
  });

  // Subtab switching
  container.querySelectorAll('.kdc-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as any;
      if (tab) {
        appState.setPatientDetailTab(tab);
      }
    });
  });

  // Overview quick links
  container.querySelector('#btn-quick-schedule-apt')?.addEventListener('click', () => {
    appState.openModalWithData('new_patient', { name: patient.name, phone: patient.phone });
  });

  container.querySelector('#btn-view-latest-rx')?.addEventListener('click', (e) => {
    const rxId = (e.currentTarget as HTMLElement).getAttribute('data-rx-id');
    const rx = appState.prescriptions.find(p => p.id === rxId);
    if (rx) {
      appState.setActivePrescription(rx);
    }
  });

  container.querySelector('#btn-jump-to-treatments-tab')?.addEventListener('click', () => {
    appState.setPatientDetailTab('treatments');
  });

  container.querySelector('#btn-jump-to-xrays-tab')?.addEventListener('click', () => {
    appState.setPatientDetailTab('xrays');
  });

  container.querySelector('#btn-overview-upload-xray')?.addEventListener('click', () => {
    appState.setPatientDetailTab('xrays');
  });



  // Patient Actions
  container.querySelector('#btn-tab-new-appointment')?.addEventListener('click', () => {
    appState.openModalWithData('new_patient', { name: patient.name, phone: patient.phone });
  });

  container.querySelectorAll('.btn-apt-whatsapp-remind').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = e.currentTarget as HTMLElement;
      const phone = el.getAttribute('data-phone') || patient.phone;
      const date = el.getAttribute('data-date') || '';
      const time = el.getAttribute('data-time') || '';
      appState.sendWhatsAppReminder(phone, `আসসালামু আলাইকুম ${patient.name}, খাদিজা ডেন্টাল কেয়ারে আপনার অ্যাপয়েন্টমেন্ট তারিখ: ${date}, সময়: ${time}। সময়মতো উপস্থিত হওয়ার অনুরোধ রইলো।`);
    });
  });

  container.querySelectorAll('.btn-mark-apt-done').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const aptId = (e.currentTarget as HTMLElement).getAttribute('data-apt-id');
      if (aptId) {
        appState.updateAppointmentStatus(aptId, 'completed');
      }
    });
  });

  // Treatments Tab


  // Radiology / X-Ray Upload Toggle
  const uploadContainer = container.querySelector('#xray-upload-container') as HTMLElement;
  const toggleUploadBtn = container.querySelector('#btn-toggle-upload-xray-panel');
  const emptyUploadBtn = container.querySelector('#btn-empty-upload-xray');
  const cancelUploadBtn = container.querySelector('#btn-cancel-xray-upload');
  const cancelUploadBtn2 = container.querySelector('#btn-cancel-xray-upload-2');

  const openUpload = () => {
    if (uploadContainer) {
      uploadContainer.style.display = 'block';
      uploadContainer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeUpload = () => {
    if (uploadContainer) uploadContainer.style.display = 'none';
  };

  toggleUploadBtn?.addEventListener('click', () => {
    if (uploadContainer.style.display === 'none') openUpload();
    else closeUpload();
  });
  emptyUploadBtn?.addEventListener('click', openUpload);
  cancelUploadBtn?.addEventListener('click', closeUpload);
  cancelUploadBtn2?.addEventListener('click', closeUpload);

  // File Upload reader
  let uploadedDataUrl = '';
  const fileInput = container.querySelector('#xray-file-input') as HTMLInputElement;
  const previewBox = container.querySelector('#xray-preview-box') as HTMLElement;

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        uploadedDataUrl = ev.target?.result as string;
        if (previewBox) {
          previewBox.innerHTML = `
            <img src="${uploadedDataUrl}" alt="Preview" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
          `;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Use sample X-ray helper
  container.querySelector('#btn-use-sample-xray')?.addEventListener('click', () => {
    uploadedDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480"><rect width="600" height="480" fill="%230a0d14"/><rect x="40" y="30" width="520" height="420" rx="8" fill="%23141a24" stroke="%23384252" stroke-width="2"/><text x="60" y="65" fill="%2394a3b8" font-family="monospace" font-size="14" font-weight="bold">KDC DIGITAL RADIOGRAPHY · NEW SCAN</text><path d="M250 160 C250 120 350 120 350 160 C360 240 360 310 340 360 C330 380 310 380 305 350 C300 320 295 270 290 270 C285 270 280 320 275 350 C270 380 250 380 240 360 Z" fill="%23cbd5e1" opacity="0.85"/><circle cx="295" cy="370" r="30" fill="%230f141d" stroke="%2338bdf8" stroke-dasharray="3 3"/><text x="340" y="375" fill="%2338bdf8" font-family="sans-serif" font-size="12">Apical Root Apex</text></svg>';
    if (previewBox) {
      previewBox.innerHTML = `
        <img src="${uploadedDataUrl}" alt="Preview" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
      `;
    }
    const titleInput = container.querySelector('#xray-title') as HTMLInputElement;
    if (titleInput && !titleInput.value) {
      titleInput.value = 'নতুন ডিজিটাল IOPA এক্স-রে';
    }
  });

  // Submit Upload Form
  container.querySelector('#form-upload-clinical-image')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (container.querySelector('#xray-title') as HTMLInputElement).value;
    const type = (container.querySelector('#xray-type') as HTMLSelectElement).value as ClinicalImageType;
    const toothStr = (container.querySelector('#xray-tooth-number') as HTMLSelectElement).value;
    const date = (container.querySelector('#xray-date') as HTMLInputElement).value || new Date().toISOString().split('T')[0];
    const notes = (container.querySelector('#xray-notes') as HTMLTextAreaElement).value;

    const finalImageUrl = uploadedDataUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480"><rect width="600" height="480" fill="%230b0f19"/><text x="120" y="240" fill="%2394a3b8" font-size="18">Khadija Dental Care Radiograph</text></svg>';

    const newImage: ClinicalImage = {
      id: `img_${Date.now()}`,
      patientId: patient.id,
      title,
      type,
      date,
      toothNumber: toothStr ? parseInt(toothStr, 10) : undefined,
      imageUrl: finalImageUrl,
      notes,
    };

    appState.addClinicalImage(newImage);
  });

  // Lightbox Open & Close
  container.querySelectorAll('.btn-inspect-image').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgId = (e.currentTarget as HTMLElement).getAttribute('data-image-id');
      const img = appState.clinicalImages.find(i => i.id === imgId);
      if (img) {
        appState.openImageLightbox(img);
      }
    });
  });

  container.querySelector('#btn-close-lightbox')?.addEventListener('click', () => {
    appState.closeImageLightbox();
  });

  container.querySelector('#xray-lightbox-backdrop')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      appState.closeImageLightbox();
    }
  });

  container.querySelector('#btn-toggle-xray-invert')?.addEventListener('click', () => {
    appState.toggleXrayInvert();
  });

  // Delete Image
  container.querySelectorAll('.btn-delete-clinical-image').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgId = (e.currentTarget as HTMLElement).getAttribute('data-image-id');
      if (imgId && confirm('আপনি কি নিশ্চিত যে এই এক্স-রে রেকর্ডটি মুছে ফেলতে চান?')) {
        appState.deleteClinicalImage(imgId);
      }
    });
  });

  // Prescriptions Tab Actions
  container.querySelector('#btn-tab-create-new-rx')?.addEventListener('click', () => {
    appState.createNewBlankPrescription(patient);
  });

  container.querySelectorAll('.btn-open-rx-for-print').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rxId = (e.currentTarget as HTMLElement).getAttribute('data-rx-id');
      const rx = appState.prescriptions.find(p => p.id === rxId);
      if (rx) {
        appState.setActivePrescription(rx);
      }
    });
  });
}
