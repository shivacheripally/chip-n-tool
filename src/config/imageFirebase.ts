import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTyRuUfjOjO51mwBuYEz3FIIQHg7J4tkU",
  authDomain: "srimahatishwariikkathsarees.firebaseapp.com",
  projectId: "srimahatishwariikkathsarees",
  storageBucket: "srimahatishwariikkathsarees.appspot.com",
  messagingSenderId: "84496369812",
  appId: "1:84496369812:web:9dd4a6a3bf424760538c81",
  measurementId: "G-9V2XV4YCZK"
};

const imageApp = initializeApp(firebaseConfig, 'imageApp');

export const imageStorage = getStorage(imageApp);

export default imageApp;
