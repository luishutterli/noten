import React, { useEffect } from "react";
import * as firebaseui from "firebaseui";
import {GoogleAuthProvider, EmailAuthProvider} from 'firebase/auth';
import "firebaseui/dist/firebaseui.css";
import { auth } from "../firebase";

const FirebaseAuth = () => {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: "/",
      callbacks: {
        signInFailure: (error) => {
          console.log("Sign in error:", error);
          return false;
        },
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          console.log("User signed in:", authResult);
          return false;
        },
      },
    });
  }, []);

  return <div id="firebaseui-auth-container"></div>;
};

export default FirebaseAuth;
