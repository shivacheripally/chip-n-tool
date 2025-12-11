import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwx-HaY2-3HZrwQXPc7KKMcYfoV9lTEl8",
  authDomain: "chipntool.firebaseapp.com",
  projectId: "chipntool",
  storageBucket: "chipntool.firebasestorage.app",
  messagingSenderId: "673743470424",
  appId: "1:673743470424:web:590e8ca6f7d2fc29d22f2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;