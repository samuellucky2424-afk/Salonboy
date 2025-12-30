
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  experience: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
  philosophy: string;
  education: string[];
  skills: string[];
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Appointment {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  doctorId: string;
  date: string;
  time: string;
  message: string;
  createdAt?: string;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface JobApplication {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  yearsOfExperience: number;
  passportPhoto: File | string | null;
  cv: File | string | null;
  status: ApplicationStatus;
  createdAt: string;
  approvalDetails?: {
    approvedPosition: string;
    amount: string;
    startDate: string;
    department: string;
    notes: string;
  };
}

export enum JobRole {
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  LAB_TECH = 'Lab Technician',
  PHARMACIST = 'Pharmacist',
  RADIOLOGIST = 'Radiologist',
  MIDWIFE = 'Midwife',
  PHYSIO = 'Physiotherapist',
  MED_SEC = 'Medical Secretary',
  RECEPTIONIST = 'Receptionist',
  IT_SUPPORT = 'IT Support',
  CLEANER = 'Cleaner',
  SECURITY = 'Security',
  ACCOUNTANT = 'Accountant',
  HR_OFFICER = 'HR Officer',
  AMBULANCE_DRIVER = 'Ambulance Driver'
}

export interface HomepageContent {
  id?: string;
  doctors?: Doctor[];
  services?: Service[];
  heroTitle?: string;
  heroDescription?: string;
  stats?: Array<{ icon: string; label: string; val: string }>;
  careers?: Array<{ title: string; desc: string }>;
  updatedAt?: string;
}
