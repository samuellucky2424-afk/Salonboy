import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { Appointment, JobApplication, ApplicationStatus } from '../types';

// Safe environment variable access for different environments
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    return (import.meta as any).env?.[key] || '';
  } catch {
    return '';
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export const submitContactMessage = async (data: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
  try {
    await addDoc(collection(db, 'contacts'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error submitting contact:', error);
    return false;
  }
};

export const submitAppointment = async (data: Appointment): Promise<boolean> => {
  try {
    await addDoc(collection(db, 'appointments'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error submitting appointment:', error);
    return false;
  }
};

export const submitJobApplication = async (data: JobApplication): Promise<boolean> => {
  try {
    let passportPhotoUrl = '';
    let cvUrl = '';

    // Handle File uploads if they are browser File objects
    try {
      if (data.passportPhoto instanceof File) {
        const photoRef = ref(storage, `applications/photos/${Date.now()}_${data.passportPhoto.name}`);
        const photoSnapshot = await uploadBytes(photoRef, data.passportPhoto);
        passportPhotoUrl = await getDownloadURL(photoSnapshot.ref);
      } else if (typeof data.passportPhoto === 'string') {
        passportPhotoUrl = data.passportPhoto;
      }

      if (data.cv instanceof File) {
        const cvRef = ref(storage, `applications/cvs/${Date.now()}_${data.cv.name}`);
        const cvSnapshot = await uploadBytes(cvRef, data.cv);
        cvUrl = await getDownloadURL(cvSnapshot.ref);
      } else if (typeof data.cv === 'string') {
        cvUrl = data.cv;
      }
    } catch (uploadError) {
      console.warn('File upload failed, continuing with empty URLs:', uploadError);
    }

    await addDoc(collection(db, 'applications'), {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      position: data.position,
      yearsOfExperience: data.yearsOfExperience,
      passportPhoto: passportPhotoUrl || 'https://via.placeholder.com/150',
      cv: cvUrl || '#',
      status: 'Pending',
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error submitting application:', error);
    return false;
  }
};

export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ 
      id: d.id, 
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as Appointment));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const fetchApplications = async (): Promise<JobApplication[]> => {
  try {
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ 
      id: d.id, 
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as JobApplication));
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

export const updateApplicationStatus = async (id: string, status: ApplicationStatus, approvalDetails?: any): Promise<boolean> => {
  try {
    const appRef = doc(db, 'applications', id);
    const updateData: any = { status };
    if (approvalDetails) {
      updateData.approvalDetails = approvalDetails;
    }
    await updateDoc(appRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    return false;
  }
};

export const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
  // Simple hardcoded admin credentials (non-Firebase)
  const validUsername = 'luckymmc';
  const validPassword = '081648Al@';
  
  // Allow login with either username or email format
  const isValidUsername = (email === validUsername || email === 'luckymmc@luminahealth.com') && pass === validPassword;
  
  if (isValidUsername) {
    return true;
  }
  
  console.error('Login error: Invalid credentials');
  return false;
};

export const updateHomepageContent = async (content: any): Promise<boolean> => {
  try {
    // Store in localStorage as a fallback since Firestore may not be configured
    localStorage.setItem('homepageContent', JSON.stringify({
      ...content,
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error('Error updating homepage content:', error);
    return false;
  }
};

export const getHomepageContent = async (): Promise<any> => {
  try {
    const stored = localStorage.getItem('homepageContent');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }
};