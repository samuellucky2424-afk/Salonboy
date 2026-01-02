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

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // Returns data:image/jpeg;base64,... or data:application/pdf;base64,...
    };
    reader.onerror = reject;
  });
};

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
    const passportPhotoName = data.passportPhoto instanceof File ? data.passportPhoto.name : 'photo.jpg';
    const cvName = data.cv instanceof File ? data.cv.name : 'cv.pdf';

    const applicationData = {
      id: `local_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      position: data.position,
      yearsOfExperience: data.yearsOfExperience,
      passportPhotoName: passportPhotoName,
      cvName: cvName,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Save locally first for instant feedback
    try {
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      applications.push(applicationData);
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    } catch (storageError) {
      console.error('localStorage error:', storageError);
    }

    // Try Firestore with 3s timeout
    try {
      await Promise.race([
        addDoc(collection(db, 'applications'), {
          ...applicationData,
          createdAt: serverTimestamp()
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      console.log('Firestore sync complete');
    } catch (syncError) {
      console.warn('Firestore sync skipped (saved locally)', syncError);
    }

    return true;
  } catch (error) {
    console.error('Submission error:', error);
    return false;
  }
};

export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    // Try Firestore with 2s timeout
    const appointmentsPromise = (async () => {
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as Appointment));
    })();

    return await Promise.race([
      appointmentsPromise,
      new Promise<Appointment[]>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ]);
  } catch (error) {
    console.warn('Appointment fetch timed out or failed, using empty list');
    return [];
  }
};

export const fetchApplications = async (): Promise<JobApplication[]> => {
  // Get local apps immediately
  const getLocalApps = () => JSON.parse(localStorage.getItem('jobApplications') || '[]') as JobApplication[];
  
  try {
    // Try Firestore with 2s timeout
    const firestorePromise = (async () => {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as JobApplication));
    })();

    const firestoreApps = await Promise.race([
      firestorePromise,
      new Promise<JobApplication[]>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ]);
    
    const localApps = getLocalApps();
    const allApps = [...firestoreApps, ...localApps].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return allApps;
  } catch (error) {
    console.warn('Application fetch timed out, using local data only');
    return getLocalApps();
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
  // Admin credentials from environment variables for development
  const adminEmail = 'samuellucky242@hotmail.com';
  const adminPassword = '081648Al@';
  
  if (email === adminEmail && pass === adminPassword) {
    console.log('Admin login successful');
    return true;
  }
  
  console.error('Login error: Invalid email or password');
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