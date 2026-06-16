import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_IMAGE,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_IMAGE,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_IMAGE,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_IMAGE,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_IMAGE,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_IMAGE,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_IMAGE,
};

const imageApp = initializeApp(firebaseConfig, 'imageApp');

export const imageStorage = getStorage(imageApp);

export default imageApp;
