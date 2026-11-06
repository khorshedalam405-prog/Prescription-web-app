export type UserRole = 'doctor' | 'receptionist' | 'patient';

export interface ClinicSettings {
  // Doctor & Clinic Info
  doctorName: string;
  doctorNameEnglish: string;
  doctorDegree: string;
  doctorDegreeEnglish: string;
  doctorDesignation: string;
  doctorDesignationEnglish: string;
  bmdcRegNo: string;
  chamberName: string;
  chamberNameEnglish: string;
  tagline: string;
  chamberAddress: string;
  chamberAddressEnglish: string;
  phone: string;
  phoneClean: string;
  whatsapp: string;
  email: string;
  chamberTiming: string;
  
  // Prescription Layout Customization (matching user uploaded image layout)
  rxHeaderStyle: 'image_template' | 'modern';
  rxLeftColHeader1: string; // "H/O:"
  rxLeftColHeader2: string; // "O/E:"
  rxLeftColHeader3: string; // "Adv:"
  rxNextVisitText: string; // "দিন পর দেখা করবেন।"
  rxShowToothChartNote: boolean;
  rxShowLogo: boolean;
  
  // Appointments & Slot Settings
  appointmentSlotDurationMin: number;
  consultationFee: number;
  followUpFee: number;
  
  // Reminder SMS Templates
  smsConfirmTemplate: string;
  sms24hTemplate: string;
  sms2hTemplate: string;
  smsFollowupTemplate: string;
  
  // UI, Theme & Logo
  currencySymbol: string;
  themeColor: string;
  primaryColor?: string;
  customLogoUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  pin: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  serialNumber: number;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  serviceRequested: string;
  doctorName: string;
  status: AppointmentStatus;
  notes?: string;
  reminderStatus: 'scheduled' | 'sent' | 'delivered';
  lastReminderSentAt?: string;
  createdAt: string;
}

export interface MedicalAlerts {
  diabetes: boolean;
  hypertension: boolean;
  cardiacHistory: boolean;
  bleedingDisorder: boolean;
  drugAllergies: string[];
  pregnancy: boolean;
  otherNotes?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  dateOfBirth?: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  address: string;
  bloodGroup?: string;
  medicalAlerts: MedicalAlerts;
  totalVisits: number;
  totalBilled: number;
  totalPaid: number;
  dueAmount: number;
  registrationDate: string;
  lastVisitDate?: string;
}

export type ToothCondition = 
  | 'healthy'
  | 'caries'
  | 'filled'
  | 'rct_needed'
  | 'rct_done'
  | 'crown'
  | 'missing'
  | 'implant'
  | 'impacted';

export interface ToothRecord {
  toothNumber: number; // FDI notation: 11-48
  name: string;
  quadrant: 1 | 2 | 3 | 4; // 1: Upper Right, 2: Upper Left, 3: Lower Left, 4: Lower Right
  condition: ToothCondition;
  notes?: string;
  costEstimate?: number;
}

export interface TreatmentItem {
  id: string;
  procedureName: string;
  toothNumber?: number;
  category: 'Restorative' | 'Endodontics' | 'Periodontics' | 'Oral Surgery' | 'Prosthodontics' | 'Orthodontics' | 'Preventive';
  cost: number;
  discount: number;
  status: 'planned' | 'in_progress' | 'completed';
  appointmentDate?: string;
  remarks?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  items: TreatmentItem[];
  totalCost: number;
  paidAmount: number;
  status: 'active' | 'completed' | 'on_hold';
}

export interface PrescribedMedicine {
  id: string;
  type: 'Tab.' | 'Cap.' | 'Syrup' | 'Mouthwash' | 'Gel' | 'Drops' | 'Inj.';
  brandName: string;
  genericName?: string;
  strength: string;
  dosage: string; // e.g. "১ + ০ + ১"
  mealTiming: 'খাবারের আগে' | 'খাবারের পরে' | 'খাবারের সাথে' | 'রাতে শোয়ার আগে';
  duration: string; // e.g. "৫ দিন", "৭ দিন"
  instructions?: string; // e.g. "কুসুম গরম পানিতে মিশিয়ে কুলি করবেন"
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  patientPhone: string;
  date: string;
  doctorName: string;
  doctorDegree: string;
  doctorRegNo: string;
  vitals: {
    bp?: string;
    pulse?: string;
    weight?: string;
    temperature?: string;
  };
  chiefComplaints: string[]; // C/C
  clinicalFindings: string[]; // O/E
  investigations: string[]; // X-Ray, etc.
  diagnosis: string; // Dx
  medicines: PrescribedMedicine[];
  advices: string[];
  nextVisit?: string;
  specialNotes?: string;
}

export interface MedicineEntry {
  id: string;
  brandName: string;
  genericName: string;
  type: 'Tab.' | 'Cap.' | 'Syrup' | 'Mouthwash' | 'Gel' | 'Drops' | 'Inj.';
  strength: string;
  category: 'Antibiotic' | 'Painkiller / NSAID' | 'Antacid / PPI' | 'Mouthwash' | 'Antiseptic' | 'Steroid' | 'Muscle Relaxant' | 'Other';
  commonDosage: string;
  defaultDuration: string;
  defaultTiming: 'খাবারের আগে' | 'খাবারের পরে' | 'খাবারের সাথে' | 'রাতে শোয়ার আগে';
  unitPrice: number;
  stockCount: number;
}

export interface AutomatedReminder {
  id: string;
  patientName: string;
  patientPhone: string;
  type: 'appointment_confirm' | 'upcoming_24h' | 'upcoming_2h' | 'post_op_care' | 'routine_6m';
  appointmentDate: string;
  appointmentTime: string;
  messageText: string;
  status: 'queued' | 'sent' | 'failed';
  scheduledFor: string;
  sentAt?: string;
}

export type ClinicalImageType = 'iopa_xray' | 'opg_xray' | 'bitewing' | 'intraoral_photo' | 'post_op_photo' | 'ct_scan';

export interface ClinicalImage {
  id: string;
  patientId: string;
  title: string;
  type: ClinicalImageType;
  date: string;
  toothNumber?: number;
  imageUrl: string;
  notes?: string;
  doctorNotes?: string;
}

