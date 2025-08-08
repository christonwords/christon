import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, type Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const firebaseReady = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.storageBucket && config.messagingSenderId && config.appId
);

let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (firebaseReady) {
  const app = getApps().length ? getApps()[0] : initializeApp(config as any);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage };

export async function adminLogin(email: string, password: string) {
  if (!auth) throw new Error('Admin login unavailable: Firebase is not configured.');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
  if (!auth) return;
  return signOut(auth);
}

export async function uploadFileAndGetUrl(file: File, pathPrefix: string) {
  if (!storage) throw new Error('Uploads unavailable: Firebase is not configured.');
  const storageRef = ref(storage, `${pathPrefix}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export function logEvent(event: string, data?: Record<string, any>) {
  try {
    if (!db) return Promise.resolve();
    const eventsRef = collection(db, 'analytics');
    return addDoc(eventsRef, {
      event,
      data: data || {},
      ts: new Date().toISOString(),
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      path: typeof location !== 'undefined' ? location.pathname + location.search : '/',
    });
  } catch (e) {
    return Promise.resolve();
  }
}