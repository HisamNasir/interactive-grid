import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2p1Xjuh_V6haLa7ELO4mgHdmlJCIRGwc",

  authDomain: "interactive-grid-97f4f.firebaseapp.com",

  projectId: "interactive-grid-97f4f",

  storageBucket: "interactive-grid-97f4f.appspot.com",

  messagingSenderId: "32820469297",

  appId: "1:32820469297:web:cf1c45f043a4de1a41ff10"

};

const app = initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const db = getFirestore(app);
export { storage, ref,db, uploadBytes, getDownloadURL, firebaseApp as default };