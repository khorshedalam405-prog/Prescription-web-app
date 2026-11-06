import { Appointment, MedicineEntry, Patient, Prescription, ToothRecord, TreatmentPlan, UserAccount, UserRole, AutomatedReminder, ClinicalImage, ClinicSettings } from './types';
import { INITIAL_APPOINTMENTS, INITIAL_MEDICINES, INITIAL_PATIENTS, INITIAL_PRESCRIPTIONS, DEFAULT_TEETH_DATA, INITIAL_TREATMENT_PLANS, STAFF_ACCOUNTS, REMINDER_TEMPLATES, CLINIC_INFO, INITIAL_CLINICAL_IMAGES, DEFAULT_CLINIC_SETTINGS } from './constants';

export type AppTab = 
  | 'dashboard'
  | 'prescription'
  | 'patients'
  | 'medicines'
  | 'access_control'
  | 'settings';

class AppStateStore {
  private listeners: Set<() => void> = new Set();

  currentTab: AppTab = 'dashboard';
  currentUser: UserAccount = STAFF_ACCOUNTS[0]; // Doctor by default
  
  patients: Patient[] = [];
  appointments: Appointment[] = [];
  prescriptions: Prescription[] = [];
  medicines: MedicineEntry[] = [];
  treatmentPlans: TreatmentPlan[] = [];
  teethRecords: ToothRecord[] = [];
  reminders: AutomatedReminder[] = [];
  clinicalImages: ClinicalImage[] = [];

  // Clinic Settings (Fully Customizable)
  settings: ClinicSettings = DEFAULT_CLINIC_SETTINGS;

  // Patient Detail Dashboard state
  activePatientSubView: 'list' | 'detail' = 'list';
  patientDetailTab: 'overview' | 'treatments' | 'xrays' | 'prescriptions' = 'overview';
  selectedImageForLightbox: ClinicalImage | null = null;
  xrayInvertMode: boolean = false;

  // Prescription currently being drafted/printed
  activePrescription: Prescription = INITIAL_PRESCRIPTIONS[0];
  selectedPatientId: string = 'P-101';
  selectedToothNumber: number | null = 46;

  // Search and filters
  globalSearchQuery: string = '';
  globalSearchActive: boolean = false;
  patientSearchQuery: string = '';
  appointmentDateFilter: string = '2026-11-04';
  medicineSearchQuery: string = '';

  // Mobile UX Controls
  isMobileDrawerOpen: boolean = false;
  prescriptionMobileTab: 'editor' | 'preview' = 'editor';

  // Modals & UI controls
  activeModal: 'new_patient' | 'new_medicine' | 'role_switch' | 'about_contact' | null = null;
  modalPrefillData: { name?: string; phone?: string } | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'info' | 'warning' = 'success';
  private toastTimer: any = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const set = localStorage.getItem('kdc_settings');
      this.settings = set ? { ...DEFAULT_CLINIC_SETTINGS, ...JSON.parse(set) } : DEFAULT_CLINIC_SETTINGS;

      const p = localStorage.getItem('kdc_patients');
      this.patients = p ? JSON.parse(p) : INITIAL_PATIENTS;

      const a = localStorage.getItem('kdc_appointments');
      this.appointments = a ? JSON.parse(a) : INITIAL_APPOINTMENTS;

      const rx = localStorage.getItem('kdc_prescriptions');
      this.prescriptions = rx ? JSON.parse(rx) : INITIAL_PRESCRIPTIONS;

      const m = localStorage.getItem('kdc_medicines');
      this.medicines = m ? JSON.parse(m) : INITIAL_MEDICINES;

      const tp = localStorage.getItem('kdc_treatment_plans');
      this.treatmentPlans = tp ? JSON.parse(tp) : INITIAL_TREATMENT_PLANS;

      const t = localStorage.getItem('kdc_teeth');
      this.teethRecords = t ? JSON.parse(t) : DEFAULT_TEETH_DATA;

      const rem = localStorage.getItem('kdc_reminders');
      if (rem) {
        this.reminders = JSON.parse(rem);
      } else {
        // Generate initial reminders from initial appointments
        this.reminders = [
          {
            id: 'rem_1',
            patientName: 'তানভীর আহমেদ',
            patientPhone: '01711234567',
            type: 'upcoming_24h',
            appointmentDate: '2026-11-04',
            appointmentTime: 'বিকাল ৪:৩০',
            messageText: REMINDER_TEMPLATES.upcoming24h('তানভীর আহমেদ', 'বিকাল ৪:৩০'),
            status: 'sent',
            scheduledFor: '2026-11-03 10:00',
            sentAt: '2026-11-03 10:05',
          },
          {
            id: 'rem_2',
            patientName: 'নাসরিন সুলতানা',
            patientPhone: '01822334455',
            type: 'appointment_confirm',
            appointmentDate: '2026-11-04',
            appointmentTime: 'বিকাল ৫:১৫',
            messageText: REMINDER_TEMPLATES.appointmentConfirm('নাসরিন সুলতানা', '2026-11-04', 'বিকাল ৫:১৫', CLINIC_INFO.doctorName),
            status: 'queued',
            scheduledFor: '2026-11-04 12:00',
          },
          {
            id: 'rem_3',
            patientName: 'মোঃ রফিকুল ইসলাম',
            patientPhone: '01933445566',
            type: 'upcoming_2h',
            appointmentDate: '2026-11-04',
            appointmentTime: 'সন্ধ্যা ৬:০০',
            messageText: REMINDER_TEMPLATES.upcoming2h('মোঃ রফিকুল ইসলাম', 'সন্ধ্যা ৬:০০'),
            status: 'sent',
            scheduledFor: '2026-11-04 16:00',
            sentAt: '2026-11-04 16:02',
          },
        ];
      }

      const img = localStorage.getItem('kdc_clinical_images');
      this.clinicalImages = img ? JSON.parse(img) : INITIAL_CLINICAL_IMAGES;

      if (this.prescriptions.length > 0) {
        this.activePrescription = this.prescriptions[0];
      }
    } catch (e) {
      console.error('Storage loading error, using defaults', e);
      this.settings = DEFAULT_CLINIC_SETTINGS;
      this.patients = INITIAL_PATIENTS;
      this.appointments = INITIAL_APPOINTMENTS;
      this.prescriptions = INITIAL_PRESCRIPTIONS;
      this.medicines = INITIAL_MEDICINES;
      this.treatmentPlans = INITIAL_TREATMENT_PLANS;
      this.teethRecords = DEFAULT_TEETH_DATA;
      this.clinicalImages = INITIAL_CLINICAL_IMAGES;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('kdc_settings', JSON.stringify(this.settings));
      localStorage.setItem('kdc_patients', JSON.stringify(this.patients));
      localStorage.setItem('kdc_appointments', JSON.stringify(this.appointments));
      localStorage.setItem('kdc_prescriptions', JSON.stringify(this.prescriptions));
      localStorage.setItem('kdc_medicines', JSON.stringify(this.medicines));
      localStorage.setItem('kdc_treatment_plans', JSON.stringify(this.treatmentPlans));
      localStorage.setItem('kdc_teeth', JSON.stringify(this.teethRecords));
      localStorage.setItem('kdc_reminders', JSON.stringify(this.reminders));
      localStorage.setItem('kdc_clinical_images', JSON.stringify(this.clinicalImages));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }

  // --- Clinic Customization Settings Methods ---
  updateSettings(newSettings: Partial<ClinicSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();
    this.showToast('চেম্বার কাস্টমাইজেশন সেটিংস সফলভাবে আপডেট করা হয়েছে!', 'success');
    this.notify();
  }

  resetSettingsToDefault() {
    this.settings = { ...DEFAULT_CLINIC_SETTINGS };
    this.saveToStorage();
    this.showToast('ডিফল্ট সেটিংস রিস্টোর করা হয়েছে', 'info');
    this.notify();
  }

  exportBackupData() {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.settings,
      patients: this.patients,
      appointments: this.appointments,
      prescriptions: this.prescriptions,
      medicines: this.medicines,
      treatmentPlans: this.treatmentPlans,
      reminders: this.reminders,
      clinicalImages: this.clinicalImages,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Khadija_Dental_Care_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('ডাটা ব্যাকআপ ফাইল ডাউনলোড করা হয়েছে', 'success');
  }

  importBackupData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.settings = { ...DEFAULT_CLINIC_SETTINGS, ...data.settings };
      if (Array.isArray(data.patients)) this.patients = data.patients;
      if (Array.isArray(data.appointments)) this.appointments = data.appointments;
      if (Array.isArray(data.prescriptions)) this.prescriptions = data.prescriptions;
      if (Array.isArray(data.medicines)) this.medicines = data.medicines;
      if (Array.isArray(data.treatmentPlans)) this.treatmentPlans = data.treatmentPlans;
      if (Array.isArray(data.reminders)) this.reminders = data.reminders;
      if (Array.isArray(data.clinicalImages)) this.clinicalImages = data.clinicalImages;
      this.saveToStorage();
      this.showToast('ডাটা সফলভাবে ইমপোর্ট ও রিস্টোর করা হয়েছে!', 'success');
      this.notify();
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      this.showToast('অকার্যকর ব্যাকআপ ফাইল! ফাইলটি আবার পরীক্ষা করুন।', 'warning');
      return false;
    }
  }

  // --- Patient Detail Dashboard Navigation & Images ---
  openPatientDetail(patientId: string, tab: 'overview' | 'treatments' | 'xrays' | 'prescriptions' = 'overview') {
    this.selectedPatientId = patientId;
    this.activePatientSubView = 'detail';
    this.patientDetailTab = tab;
    this.currentTab = 'patients';
    this.notify();
  }

  closePatientDetail() {
    this.activePatientSubView = 'list';
    this.notify();
  }

  setPatientDetailTab(tab: 'overview' | 'treatments' | 'xrays' | 'prescriptions') {
    this.patientDetailTab = tab;
    this.notify();
  }

  addClinicalImage(image: ClinicalImage) {
    this.clinicalImages.unshift(image);
    this.showToast('নতুন এক্স-রে / ক্লিনিক্যাল ছবি সফলভাবে আপলোড হয়েছে', 'success');
    this.notify();
  }

  deleteClinicalImage(imageId: string) {
    this.clinicalImages = this.clinicalImages.filter(img => img.id !== imageId);
    this.showToast('ছবিটি মুছে ফেলা হয়েছে', 'info');
    this.notify();
  }

  openImageLightbox(image: ClinicalImage) {
    this.selectedImageForLightbox = image;
    this.notify();
  }

  closeImageLightbox() {
    this.selectedImageForLightbox = null;
    this.notify();
  }

  toggleXrayInvert() {
    this.xrayInvertMode = !this.xrayInvertMode;
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn());
  }

  setTab(tab: AppTab) {
    this.currentTab = tab;
    this.isMobileDrawerOpen = false;
    this.notify();
  }

  toggleMobileDrawer(open?: boolean) {
    this.isMobileDrawerOpen = open !== undefined ? open : !this.isMobileDrawerOpen;
    this.notify();
  }

  setPrescriptionMobileTab(tab: 'editor' | 'preview') {
    this.prescriptionMobileTab = tab;
    this.notify();
  }

  setUser(user: UserAccount) {
    this.currentUser = user;
    this.showToast(`${user.name} হিসেবে লগইন করা হয়েছে`, 'info');
    this.notify();
  }

  showToast(message: string, type: 'success' | 'info' | 'warning' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
      this.notify();
    }, 3800);
    this.notify();
  }

  openModal(modal: 'new_patient' | 'new_medicine' | 'role_switch' | 'about_contact' | null) {
    this.activeModal = modal;
    this.notify();
  }

  openModalWithData(modal: 'new_patient', data?: { name?: string; phone?: string }) {
    this.modalPrefillData = data || null;
    this.activeModal = modal;
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.modalPrefillData = null;
    this.notify();
  }

  setGlobalSearch(query: string) {
    this.globalSearchQuery = query;
    this.notify();
  }

  navigateToPatient(patientId: string, tab: 'overview' | 'treatments' | 'xrays' | 'prescriptions' = 'overview') {
    this.selectedPatientId = patientId;
    this.activePatientSubView = 'detail';
    this.patientDetailTab = tab;
    this.currentTab = 'patients';
    this.showToast(`রোগীর প্রোফাইল ও মেডিকেল হিস্ট্রি লোড করা হয়েছে`, 'info');
    this.notify();
  }

  // --- Patients ---
  addPatient(patient: Patient) {
    this.patients.unshift(patient);
    this.showToast(`নতুন রোগী ${patient.name} সফলভাবে নিবন্ধিত হয়েছে`, 'success');
    this.notify();
  }

  updatePatient(id: string, updates: Partial<Patient>) {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.patients[idx] = { ...this.patients[idx], ...updates };
      this.notify();
    }
  }

  // --- Appointments ---
  addAppointment(apt: Appointment) {
    this.appointments.unshift(apt);
    // Auto-create a scheduled reminder
    const newRem: AutomatedReminder = {
      id: `rem_${Date.now()}`,
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      type: 'appointment_confirm',
      appointmentDate: apt.date,
      appointmentTime: apt.timeSlot,
      messageText: REMINDER_TEMPLATES.appointmentConfirm(apt.patientName, apt.date, apt.timeSlot, apt.doctorName),
      status: 'queued',
      scheduledFor: `${apt.date} 09:00`,
    };
    this.reminders.unshift(newRem);
    this.showToast(`সিরিয়াল #${apt.serialNumber} - ${apt.patientName}-এর অ্যাপয়েন্টমেন্ট সফলভাবে যুক্ত হয়েছে`, 'success');
    this.notify();
  }

  updateAppointmentStatus(id: string, status: Appointment['status']) {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      this.showToast(`অ্যাপয়েন্টমেন্ট স্ট্যাটাস পরিবর্তিত: ${status}`, 'info');
      this.notify();
    }
  }

  // --- Reminders & WhatsApp ---
  sendWhatsAppReminder(phone: string, text: string, reminderId?: string) {
    // Format bangladeshi phone number
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '88' + cleanPhone;
    if (!cleanPhone.startsWith('88')) cleanPhone = '88' + cleanPhone;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    // Open whatsapp in new tab
    window.open(whatsappUrl, '_blank');

    if (reminderId) {
      const rem = this.reminders.find(r => r.id === reminderId);
      if (rem) {
        rem.status = 'sent';
        rem.sentAt = new Date().toLocaleString('bn-BD');
      }
    }
    this.showToast(`WhatsApp রিমাইন্ডার পাঠানো হচ্ছে (${cleanPhone})`, 'success');
    this.notify();
  }

  triggerSimulatedReminders() {
    let count = 0;
    this.reminders.forEach(r => {
      if (r.status === 'queued') {
        r.status = 'sent';
        r.sentAt = new Date().toLocaleTimeString('bn-BD');
        count++;
      }
    });
    this.showToast(`${count} টি স্বয়ংক্রিয় রিমাইন্ডার সফলভাবে প্রেরণ সম্পন্ন`, 'success');
    this.notify();
  }

  // --- Prescription ---
  savePrescription(prescription: Prescription) {
    const existingIdx = this.prescriptions.findIndex(p => p.id === prescription.id);
    if (existingIdx !== -1) {
      this.prescriptions[existingIdx] = prescription;
    } else {
      this.prescriptions.unshift(prescription);
    }
    this.activePrescription = prescription;
    this.showToast(`প্রেসক্রিপশন #${prescription.rxNumber} সফলভাবে সংরক্ষিত হয়েছে`, 'success');
    this.notify();
  }

  setActivePrescription(prescription: Prescription) {
    this.activePrescription = prescription;
    this.currentTab = 'prescription';
    this.notify();
  }

  createNewBlankPrescription(patient?: Patient) {
    const rxCount = this.prescriptions.length + 1;
    const newRx: Prescription = {
      id: `RX-${Date.now()}`,
      rxNumber: `KDC-RX-${8490 + rxCount}`,
      patientId: patient ? patient.id : 'P-NEW',
      patientName: patient ? patient.name : '',
      patientAge: patient ? patient.age : 25,
      patientGender: patient ? patient.gender : 'male',
      patientPhone: patient ? patient.phone : '',
      date: new Date().toISOString().split('T')[0],
      doctorName: CLINIC_INFO.doctorName,
      doctorDegree: CLINIC_INFO.doctorDegree,
      doctorRegNo: CLINIC_INFO.bmdcRegNo,
      vitals: { bp: '120/80 mmHg', pulse: '72 bpm', weight: '', temperature: '98.6°F' },
      chiefComplaints: ['দাঁতে ব্যথা ও কামড়াতে সমস্যা'],
      clinicalFindings: ['Oral cavity caries examined'],
      investigations: ['IOPA X-Ray recommended'],
      diagnosis: 'Dental Caries with Pulp Involvement',
      medicines: [
        {
          id: `m_${Date.now()}_1`,
          type: 'Tab.',
          brandName: 'Napa Extra',
          genericName: 'Paracetamol + Caffeine',
          strength: '665mg',
          dosage: '১ + ০ + ১',
          mealTiming: 'খাবারের পরে',
          duration: '৩ দিন',
          instructions: 'ব্যথা হলে খাবেন',
        },
        {
          id: `m_${Date.now()}_2`,
          type: 'Cap.',
          brandName: 'Moxacil',
          genericName: 'Amoxicillin',
          strength: '500mg',
          dosage: '১ + ১ + ১',
          mealTiming: 'খাবারের পরে',
          duration: '৫ দিন',
          instructions: 'ভরা পেটে নির্দিষ্ট সময়ে',
        },
        {
          id: `m_${Date.now()}_3`,
          type: 'Cap.',
          brandName: 'Maxpro',
          genericName: 'Esomeprazole',
          strength: '20mg',
          dosage: '১ + ০ + ১',
          mealTiming: 'খাবারের আগে',
          duration: '৫ দিন',
          instructions: 'খাবারের ২০ মিনিট পূর্বে',
        },
      ],
      advices: [
        'কুসুম গরম পানিতে লবণ দিয়ে নিয়মিত কুলকুচি করুন।',
        'নরম ও পুষ্টিকর খাবার গ্রহণ করবেন।',
        'দাঁত খোঁচাখুঁচি থেকে বিরত থাকুন।',
      ],
      nextVisit: '৭ দিন পর চেকআপের জন্য আসবেন',
      specialNotes: '',
    };

    this.activePrescription = newRx;
    this.currentTab = 'prescription';
    this.showToast('নতুন প্রেসক্রিপশন ড্রাফট প্রস্তুত', 'info');
    this.notify();
  }

  // --- Teeth Records ---
  updateToothCondition(toothNumber: number, condition: ToothRecord['condition'], notes?: string, cost?: number) {
    const tooth = this.teethRecords.find(t => t.toothNumber === toothNumber);
    if (tooth) {
      tooth.condition = condition;
      if (notes !== undefined) tooth.notes = notes;
      if (cost !== undefined) tooth.costEstimate = cost;
      this.selectedToothNumber = toothNumber;
      this.showToast(`দাঁত #${toothNumber} (${tooth.name}) এর অবস্থা আপডেট করা হয়েছে`, 'success');
      this.notify();
    }
  }

  // --- Medicines ---
  addMedicine(med: MedicineEntry) {
    this.medicines.unshift(med);
    this.showToast(`নতুন ঔষধ ${med.brandName} যুক্ত হয়েছে`, 'success');
    this.notify();
  }
}

export const appState = new AppStateStore();
