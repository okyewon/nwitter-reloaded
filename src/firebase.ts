import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBks9NxPLalBQ7SH2HMMru4UD0rVIfoPx8",
  authDomain: "nwitter-reloaded-11a83.firebaseapp.com",
  projectId: "nwitter-reloaded-11a83",
  storageBucket: "nwitter-reloaded-11a83.appspot.com",
  messagingSenderId: "203280504389",
  appId: "1:203280504389:web:ded66609ba7270d431752c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
