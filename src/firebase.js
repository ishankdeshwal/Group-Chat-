import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCBi30GLtH8S26rEfJiLnnFchq1T0AhfTs",
  authDomain: "ishank-chatapp.firebaseapp.com",
  projectId: "ishank-chatapp",
  storageBucket: "ishank-chatapp.appspot.com",
  messagingSenderId: "791235600011",
  appId: "1:791235600011:web:f2cc0f199ef20518123e8e"
};


export const app = initializeApp(firebaseConfig);