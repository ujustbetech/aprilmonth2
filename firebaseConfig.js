import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/storage';
import { getStorage } from "firebase/storage";

const firebaseApp={
    apiKey: "AIzaSyDIpTIVBaVMQq5tcvej8zygAMh3pthzTGQ",
  authDomain: "loginotp-839fb.firebaseapp.com",
  projectId: "loginotp-839fb",  
  storageBucket: "loginotp-839fb.appspot.com",
  messagingSenderId: "216262538040",
  appId: "1:216262538040:web:a23ef3d6441c2f39b907cd"
};

const app =initializeApp(firebaseApp);
const db = getFirestore();
const auth = getAuth(app);
const storage=getStorage();

export { db, auth,storage }


