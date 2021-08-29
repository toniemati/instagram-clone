import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfcespcYSh955DuWu0VanzmJB6dHEgY_I",
  authDomain: "instagram-clone-7d0b8.firebaseapp.com",
  projectId: "instagram-clone-7d0b8",
  storageBucket: "instagram-clone-7d0b8.appspot.com",
  messagingSenderId: "906196738511",
  appId: "1:906196738511:web:daef4ca5f3582de34532ba",
  measurementId: "G-NJPNFHLXNJ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };