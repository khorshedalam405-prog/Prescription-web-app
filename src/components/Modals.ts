import { appState } from '../state';
import { CLINIC_INFO, STAFF_ACCOUNTS } from '../constants';
import { Appointment, MedicineEntry, Patient } from '../types';

export function renderModals(): HTMLElement | null {
  if (!appState.activeModal) return null;

  const backdrop = document.createElement('div');
  backdrop.className = 'kdc-modal-backdrop kdc-no-print';

  const modalBox = document.createElement('div');
  modalBox.className = 'kdc-modal';

  if (appState.activeModal === 'new_patient') {
    renderNewPatientModal(modalBox);
  } else if (appState.activeModal === 'new_medicine') {
    renderNewMedicineModal(modalBox);
  } else if (appState.activeModal === 'role_switch') {
    renderRoleSwitchModal(modalBox);
  } else if (appState.activeModal === 'about_contact') {
    renderAboutContactModal(modalBox);
  }

  backdrop.appendChild(modalBox);

  // Close when clicking outside
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });

  return backdrop;
}

// 1. New Appointment Booking Modal
function renderNewAppointmentModal(container: HTMLElement) {
  const nextSerial = appState.appointments.length + 1;
  const today = new Date().toISOString().split('T')[0];
  const prefillName = appState.modalPrefillData?.name || '';
  const prefillPhone = appState.modalPrefillData?.phone || '';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">event_available</span>
        <span>নতুন সিরিয়াল / অ্যাপয়েন্টমেন্ট বুকিং</span>
      </h3>
      <button class="kdc-modal-close-btn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <form id="form-new-apt" style="display: flex; flex-direction: column; gap: 12px; font-size: 13.5px;">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">রোগীর পূর্ণ নাম *</label>
          <input type="text" id="apt-name" required value="${prefillName}" placeholder="যেমন: তানভীর আহমেদ" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">মোবাইল নম্বর *</label>
          <input type="tel" id="apt-phone" required value="${prefillPhone}" placeholder="017XXXXXXXX" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">বয়স</label>
          <input type="number" id="apt-age" value="28" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">লিঙ্গ</label>
          <select id="apt-gender" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="male">পুরুষ</option>
            <option value="female">মহিলা</option>
            <option value="other">অন্যান্য</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">তারিখ *</label>
          <input type="date" id="apt-date" value="${today}" required style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">সময়সূচী / স্লট *</label>
          <select id="apt-slot" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="বিকাল ৪:৩০">বিকাল ৪:৩০</option>
            <option value="বিকাল ৫:১৫">বিকাল ৫:১৫</option>
            <option value="সন্ধ্যা ৬:০০">সন্ধ্যা ৬:০০</option>
            <option value="সন্ধ্যা ৬:৪৫">সন্ধ্যা ৬:৪৫</option>
            <option value="সন্ধ্যা ৭:৩০">সন্ধ্যা ৭:৩০</option>
            <option value="রাত ৮:১৫">রাত ৮:১৫</option>
            <option value="রাত ৯:০০">রাত ৯:০০</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">প্রয়োজনীয় চিকিৎসা / সেবা *</label>
          <select id="apt-service" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="রুট ক্যানেল থেরাপি (RCT)">রুট ক্যানেল থেরাপি (RCT)</option>
            <option value="ফুল মাউথ স্কেলিং ও পলিশিং">ফুল মাউথ স্কেলিং ও পলিশিং</option>
            <option value="ডেন্টাল ফিলিং (লাইট কিউর)">ডেন্টাল ফিলিং (লাইট কিউর)</option>
            <option value="দাঁত তোলা (Extraction)">দাঁত তোলা (Extraction)</option>
            <option value="জেরকোনিয়া / পিএফএম ক্রাউন ক্যাপ">জেরকোনিয়া / পিএফএম ক্রাউন ক্যাপ</option>
            <option value="কসমেটিক টুথ হোয়াইটেনিং">কসমেটিক টুথ হোয়াইটেনিং</option>
            <option value="অর্থোডন্টিক ডেন্টাল ব্রেসেস">অর্থোডন্টিক ডেন্টাল ব্রেসেস</option>
            <option value="ডেন্টাল ইমপ্ল্যান্ট সার্জারি">ডেন্টাল ইমপ্ল্যান্ট সার্জারি</option>
            <option value="সাধারণ পরামর্শ ও চেকআপ">সাধারণ পরামর্শ ও চেকআপ</option>
          </select>
        </div>
      </div>

      <div>
        <label style="font-weight: 600; display: block; margin-bottom: 4px;">বিশেষ নোট / সমস্যা বিবরণ</label>
        <textarea id="apt-notes" rows="2" placeholder="দাঁতে তীব্র ব্যথা, মাড়ি দিয়ে রক্তপাত, ইত্যাদি..." style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;"></textarea>
      </div>

      <div style="background: var(--kdc-teal-subtle); border: 1px solid var(--kdc-teal-primary); border-radius: 6px; padding: 10px; font-size: 12.5px; color: var(--kdc-teal-deep);">
        ✓ বুকিং নিশ্চিত হওয়ার সাথে সাথে স্বয়ংক্রিয়ভাবে রোগীর নম্বরে হোয়াটসঅ্যাপ রিমাইন্ডার তৈরি হবে।
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
        <button type="button" class="kdc-btn kdc-btn-secondary btn-cancel-modal">বাতিল</button>
        <button type="submit" class="kdc-btn kdc-btn-primary">
          <span class="material-symbols-rounded">check</span>
          <span>সিরিয়াল নিশ্চিত করুন</span>
        </button>
      </div>
    </form>
  `;

  container.querySelector('.kdc-modal-close-btn')?.addEventListener('click', () => appState.closeModal());
  container.querySelector('.btn-cancel-modal')?.addEventListener('click', () => appState.closeModal());

  container.querySelector('#form-new-apt')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (container.querySelector('#apt-name') as HTMLInputElement).value;
    const phone = (container.querySelector('#apt-phone') as HTMLInputElement).value;
    const age = parseInt((container.querySelector('#apt-age') as HTMLInputElement).value || '25', 10);
    const gender = (container.querySelector('#apt-gender') as HTMLSelectElement).value as any;
    const date = (container.querySelector('#apt-date') as HTMLInputElement).value;
    const slot = (container.querySelector('#apt-slot') as HTMLSelectElement).value;
    const service = (container.querySelector('#apt-service') as HTMLSelectElement).value;
    const notes = (container.querySelector('#apt-notes') as HTMLTextAreaElement).value;

    const newApt: Appointment = {
      id: `APT-${Date.now()}`,
      serialNumber: nextSerial,
      patientId: `P-${Date.now().toString().slice(-4)}`,
      patientName: name,
      patientPhone: phone,
      patientAge: age,
      patientGender: gender,
      date,
      timeSlot: slot,
      serviceRequested: service,
      doctorName: CLINIC_INFO.doctorName,
      status: 'confirmed',
      notes,
      reminderStatus: 'scheduled',
      createdAt: new Date().toISOString().split('T')[0],
    };

    appState.addAppointment(newApt);
    appState.closeModal();
  });
}

// 2. New Patient Registration Modal
function renderNewPatientModal(container: HTMLElement) {
  const nextId = `P-${100 + appState.patients.length + 1}`;
  const prefillName = appState.modalPrefillData?.name || '';
  const prefillPhone = appState.modalPrefillData?.phone || '';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">person_add</span>
        <span>নতুন রোগী রেজিস্ট্রেশন ও স্বাস্থ্য ইতিহাস</span>
      </h3>
      <button class="kdc-modal-close-btn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <form id="form-new-patient" style="display: flex; flex-direction: column; gap: 12px; font-size: 13.5px;">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">রোগীর পূর্ণ নাম *</label>
          <input type="text" id="np-name" required value="${prefillName}" placeholder="যেমন: ফারহানা করিম" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">মোবাইল নম্বর *</label>
          <input type="tel" id="np-phone" required value="${prefillPhone}" placeholder="018XXXXXXXX" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">জন্ম তারিখ (DOB)</label>
          <input type="date" id="np-dob" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">বয়স (বছর) *</label>
          <input type="number" id="np-age" value="30" required min="1" max="120" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">লিঙ্গ</label>
          <select id="np-gender" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="female">মহিলা</option>
            <option value="male">পুরুষ</option>
            <option value="other">অন্যান্য</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">রক্তের গ্রুপ</label>
          <select id="np-blood" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      <div>
        <label style="font-weight: 600; display: block; margin-bottom: 4px;">ঠিকানা</label>
        <input type="text" id="np-address" placeholder="বাসা, রোড, এলাকা, ঢাকা" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
      </div>

      <!-- Medical Alerts Checklist -->
      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 12px;">
        <label style="font-weight: 700; color: #9f1239; display: block; margin-bottom: 6px;">মেডিকেল ইতিহাস ও অ্যালার্ট (টিক দিন):</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="np-alert-diabetes" />
            <span>ডায়াবেটিস (Diabetes)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="np-alert-htn" />
            <span>উচ্চ রক্তচাপ (Hypertension)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="np-alert-cardiac" />
            <span>হৃদরোগের ইতিহাস (Cardiac)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="np-alert-bleeding" />
            <span>রক্তক্ষরণ সমস্যা (Bleeding disorder)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="np-alert-pregnancy" />
            <span>গর্ভবতী (Pregnancy)</span>
          </label>
        </div>

        <div style="margin-top: 8px;">
          <label style="font-weight: 600; display: block; margin-bottom: 2px; color: #881337;">ঔষধ এলার্জি (কমা দিয়ে লিখুন):</label>
          <input type="text" id="np-alert-allergies" placeholder="যেমন: Penicillin, Sulfa" style="width: 100%; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
        <button type="button" class="kdc-btn kdc-btn-secondary btn-cancel-modal">বাতিল</button>
        <button type="submit" class="kdc-btn kdc-btn-primary">
          <span class="material-symbols-rounded">save</span>
          <span>রোগী নিবন্ধন সম্পন্ন করুন</span>
        </button>
      </div>
    </form>
  `;

  container.querySelector('.kdc-modal-close-btn')?.addEventListener('click', () => appState.closeModal());
  container.querySelector('.btn-cancel-modal')?.addEventListener('click', () => appState.closeModal());

  // Auto-sync Date of Birth and Age
  const dobInput = container.querySelector('#np-dob') as HTMLInputElement;
  const ageInput = container.querySelector('#np-age') as HTMLInputElement;

  if (dobInput && ageInput) {
    dobInput.addEventListener('change', () => {
      if (dobInput.value) {
        const birthDate = new Date(dobInput.value);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge >= 0 && calculatedAge <= 120) {
          ageInput.value = calculatedAge.toString();
        }
      }
    });

    ageInput.addEventListener('input', () => {
      const val = parseInt(ageInput.value, 10);
      if (val > 0 && val <= 120 && !dobInput.value) {
        const estYear = new Date().getFullYear() - val;
        dobInput.value = `${estYear}-01-01`;
      }
    });
  }

  container.querySelector('#form-new-patient')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (container.querySelector('#np-name') as HTMLInputElement).value;
    const phone = (container.querySelector('#np-phone') as HTMLInputElement).value;
    const dateOfBirth = (container.querySelector('#np-dob') as HTMLInputElement).value;
    const age = parseInt((container.querySelector('#np-age') as HTMLInputElement).value || '25', 10);
    const gender = (container.querySelector('#np-gender') as HTMLSelectElement).value as any;
    const blood = (container.querySelector('#np-blood') as HTMLSelectElement).value;
    const address = (container.querySelector('#np-address') as HTMLInputElement).value;

    const diabetes = (container.querySelector('#np-alert-diabetes') as HTMLInputElement).checked;
    const htn = (container.querySelector('#np-alert-htn') as HTMLInputElement).checked;
    const cardiac = (container.querySelector('#np-alert-cardiac') as HTMLInputElement).checked;
    const bleeding = (container.querySelector('#np-alert-bleeding') as HTMLInputElement).checked;
    const pregnancy = (container.querySelector('#np-alert-pregnancy') as HTMLInputElement).checked;
    const allergies = (container.querySelector('#np-alert-allergies') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean);

    const newPatient: Patient = {
      id: nextId,
      name,
      phone,
      age,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      bloodGroup: blood,
      address,
      medicalAlerts: {
        diabetes,
        hypertension: htn,
        cardiacHistory: cardiac,
        bleedingDisorder: bleeding,
        pregnancy,
        drugAllergies: allergies,
      },
      totalVisits: 1,
      totalBilled: 0,
      totalPaid: 0,
      dueAmount: 0,
      registrationDate: new Date().toISOString().split('T')[0],
    };

    appState.addPatient(newPatient);
    appState.selectedPatientId = nextId;
    appState.closeModal();
  });
}

// 3. New Medicine Modal
function renderNewMedicineModal(container: HTMLElement) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">medication</span>
        <span>নতুন ডেন্টাল ঔষধ এন্ট্রি</span>
      </h3>
      <button class="kdc-modal-close-btn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <form id="form-new-med" style="display: flex; flex-direction: column; gap: 12px; font-size: 13.5px;">
      <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">ধরন</label>
          <select id="nmed-type" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="Tab.">Tab. (ট্যাবলেট)</option>
            <option value="Cap.">Cap. (ক্যাপসুল)</option>
            <option value="Mouthwash">Mouthwash (মাউথওয়াশ)</option>
            <option value="Gel">Gel (জেল/মলম)</option>
            <option value="Syrup">Syrup (সিরাপ)</option>
            <option value="Inj.">Inj. (ইনজেকশন)</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">ব্র্যান্ডের নাম *</label>
          <input type="text" id="nmed-brand" required placeholder="যেমন: Napa Extra, Torax, Moxacil" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">স্ট্রেন্থ</label>
          <input type="text" id="nmed-strength" placeholder="500mg, 10mg" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">জেনেরিক উপাদান *</label>
          <input type="text" id="nmed-generic" required placeholder="যেমন: Amoxicillin, Paracetamol" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">ক্যাটাগরি</label>
          <select id="nmed-cat" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="Antibiotic">Antibiotic (অ্যান্টিবায়োটিক)</option>
            <option value="Painkiller / NSAID">Painkiller / NSAID (ব্যথানাশক)</option>
            <option value="Antacid / PPI">Antacid / PPI (গ্যাসের ওষুধ)</option>
            <option value="Mouthwash">Mouthwash (মাউথওয়াশ)</option>
            <option value="Antiseptic">Antiseptic (জীবাণুনাশক)</option>
            <option value="Steroid">Steroid (স্টেরয়েড)</option>
            <option value="Other">Other (অন্যান্য)</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">সাধারণ ডোজ</label>
          <input type="text" id="nmed-dosage" value="১ + ০ + ১" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">খাওয়ার সময়</label>
          <select id="nmed-timing" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="খাবারের পরে">খাবারের পরে</option>
            <option value="খাবারের আগে">খাবারের আগে</option>
            <option value="রাতে শোয়ার আগে">রাতে শোয়ার আগে</option>
          </select>
        </div>
        <div>
          <label style="font-weight: 600; display: block; margin-bottom: 4px;">সাধারণ মেয়াদ</label>
          <input type="text" id="nmed-duration" value="৫ দিন" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
        <button type="button" class="kdc-btn kdc-btn-secondary btn-cancel-modal">বাতিল</button>
        <button type="submit" class="kdc-btn kdc-btn-primary">
          <span class="material-symbols-rounded">save</span>
          <span>ঔষধ ডাটাবেজে যুক্ত করুন</span>
        </button>
      </div>
    </form>
  `;

  container.querySelector('.kdc-modal-close-btn')?.addEventListener('click', () => appState.closeModal());
  container.querySelector('.btn-cancel-modal')?.addEventListener('click', () => appState.closeModal());

  container.querySelector('#form-new-med')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = (container.querySelector('#nmed-type') as HTMLSelectElement).value as any;
    const brand = (container.querySelector('#nmed-brand') as HTMLInputElement).value;
    const strength = (container.querySelector('#nmed-strength') as HTMLInputElement).value;
    const generic = (container.querySelector('#nmed-generic') as HTMLInputElement).value;
    const category = (container.querySelector('#nmed-cat') as HTMLSelectElement).value as any;
    const dosage = (container.querySelector('#nmed-dosage') as HTMLInputElement).value;
    const timing = (container.querySelector('#nmed-timing') as HTMLSelectElement).value as any;
    const duration = (container.querySelector('#nmed-duration') as HTMLInputElement).value;

    const newMed: MedicineEntry = {
      id: `med_${Date.now()}`,
      brandName: brand,
      genericName: generic,
      type,
      strength: strength || 'N/A',
      category,
      commonDosage: dosage,
      defaultDuration: duration,
      defaultTiming: timing,
      unitPrice: 10,
      stockCount: 100,
    };

    appState.addMedicine(newMed);
    appState.closeModal();
  });
}

// 4. Role Switch / Access Control Modal
function renderRoleSwitchModal(container: HTMLElement) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">security</span>
        <span>ড্যাশবোর্ড রোল ও অ্যাক্সেস কন্ট্রোল (RBAC)</span>
      </h3>
      <button class="kdc-modal-close-btn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <p style="font-size: 13.5px; color: #475569; margin-bottom: 16px;">
      ক্লিনিকের গোপনীয়তা ও সিকিউরিটির স্বার্থে বিভিন্ন ইউজার রোলের জন্য নির্ধারিত অ্যাক্সেস অনুমতি রয়েছে। যেকোনো রোলে সুইচ করে পরীক্ষা করুন:
    </p>

    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
      ${STAFF_ACCOUNTS.map(staff => `
        <div style="border: 2px solid ${appState.currentUser.id === staff.id ? 'var(--kdc-teal-primary)' : '#e2e8f0'}; background: ${appState.currentUser.id === staff.id ? 'var(--kdc-teal-subtle)' : '#fff'}; border-radius: 10px; padding: 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;" class="btn-select-user-role" data-user-id="${staff.id}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: ${staff.role === 'doctor' ? '#e0f2fe' : staff.role === 'receptionist' ? '#fef3c7' : '#dcfce7'}; color: ${staff.role === 'doctor' ? '#0369a1' : staff.role === 'receptionist' ? '#b45309' : '#15803d'}; display: flex; align-items: center; justify-content: center; font-weight: bold;">
              ${staff.role === 'doctor' ? '🩺' : staff.role === 'receptionist' ? '📋' : '🧑‍🦰'}
            </div>
            <div>
              <div style="font-weight: 700; color: #0f172a; font-size: 14.5px;">${staff.name}</div>
              <div style="font-size: 12.5px; color: #64748b;">${staff.designation} · ডিফল্ট পিন: <strong>${staff.pin}</strong></div>
            </div>
          </div>

          <div>
            ${appState.currentUser.id === staff.id ? `
              <span style="background: var(--kdc-teal-primary); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">বর্তমান রোল</span>
            ` : `
              <button class="kdc-btn kdc-btn-secondary kdc-btn-sm">লগইন করুন</button>
            `}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Permissions Breakdown Table -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px;">
      <div style="font-weight: 700; margin-bottom: 6px; color: #334155;">অনুমতি ও অধিকার ম্যাট্রিক্স:</div>
      <ul style="padding-left: 16px; margin: 0; line-height: 1.6; color: #475569;">
        <li><strong>ডাক্তার / অ্যাডমিন:</strong> সকল রোগী রেকর্ড, প্রেসক্রিপশন ড্রাফট ও প্রিন্ট, ৩ডি ট্রিটমেন্ট প্ল্যান, রেভিনিউ রিপোর্ট ও সেটিংস।</li>
        <li><strong>রিসিপশনিস্ট:</strong> নতুন রোগী এন্ট্রি, অ্যাপয়েন্টমেন্ট শিডিউলিং, টোকেন কিউ ব্যবস্থাপনা, হোয়াটসঅ্যাপ রিমাইন্ডার প্রেরণ।</li>
        <li><strong>রোগী পোর্টাল:</strong> অনলাইন অ্যাপয়েন্টমেন্ট বুকিং ও সাধারণ সেবা পরামর্শ ভিউ।</li>
      </ul>
    </div>
  `;

  container.querySelector('.kdc-modal-close-btn')?.addEventListener('click', () => appState.closeModal());

  container.querySelectorAll('.btn-select-user-role').forEach(div => {
    div.addEventListener('click', () => {
      const uid = div.getAttribute('data-user-id');
      const targetUser = STAFF_ACCOUNTS.find(s => s.id === uid);
      if (targetUser) {
        appState.setUser(targetUser);
        appState.closeModal();
      }
    });
  });
}

// 5. About & Contact Information Modal
function renderAboutContactModal(container: HTMLElement) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
      <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span class="material-symbols-rounded" style="color: var(--kdc-teal-primary);">local_hospital</span>
        <span>${CLINIC_INFO.nameBangla} - পরিচিতি ও যোগাযোগ</span>
      </h3>
      <button class="kdc-modal-close-btn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #64748b;">✕</button>
    </div>

    <div style="font-size: 14px; line-height: 1.6; color: #334155; display: flex; flex-direction: column; gap: 14px;">
      <div style="background: var(--kdc-teal-subtle); border-left: 4px solid var(--kdc-teal-primary); padding: 12px 16px; border-radius: 4px;">
        <strong style="color: var(--kdc-teal-deep); font-size: 15px;">মজবুত দাঁত, মজবুত আত্মবিশ্বাস</strong>
        <p style="margin-top: 4px; font-size: 13.5px;">
          খাদিজা ডেন্টাল কেয়ার একটি আধুনিক প্রযুক্তিনির্ভর ডেন্টাল ক্লিনিক। এখানে ব্যথামুক্ত রুট ক্যানেল, কসমেটিক স্মাইল ডিজাইন, ডেন্টাল ইমপ্ল্যান্ট এবং শিশুদের দাঁতের বিশেষায়িত চিকিৎসা প্রদান করা হয়।
        </p>
      </div>

      <div>
        <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">প্রধান দন্ত চিকিৎসক:</h4>
        <p style="font-size: 14px;">
          <strong>${CLINIC_INFO.doctorName}</strong><br>
          ${CLINIC_INFO.doctorDegree}<br>
          ${CLINIC_INFO.doctorDesignation}<br>
          <span style="color: #64748b;">${CLINIC_INFO.bmdcRegNo}</span>
        </p>
      </div>

      <div>
        <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">চেম্বার ও যোগাযোগের ঠিকানা:</h4>
        <p style="font-size: 14px;">
          📍 ${CLINIC_INFO.addressBangla}<br>
          ⏰ ${CLINIC_INFO.chamberTiming}<br>
          📞 হটলাইন: <strong class="tabular-nums">${CLINIC_INFO.phone}</strong><br>
          📧 ইমেইল: ${CLINIC_INFO.email}
        </p>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 8px;">
        <a href="${CLINIC_INFO.whatsapp}" target="_blank" rel="noopener noreferrer" class="kdc-btn kdc-btn-whatsapp" style="text-decoration: none; flex: 1;">
          <span class="material-symbols-rounded">chat</span>
          <span>হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন</span>
        </a>
      </div>
    </div>
  `;

  container.querySelector('.kdc-modal-close-btn')?.addEventListener('click', () => appState.closeModal());
}
