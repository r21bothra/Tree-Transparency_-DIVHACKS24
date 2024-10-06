// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSHKAC7xw_IslNrybvzrPd0bWYIlO4nVc",
  authDomain: "treetransperancy.firebaseapp.com",
  projectId: "treetransperancy",
  storageBucket: "treetransperancy.appspot.com",
  messagingSenderId: "234658785180",
  appId: "1:234658785180:web:02692a167159ce08a28a59",
  measurementId: "G-5CEZEPWN9Q"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const app = firebaseApp;
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore();
