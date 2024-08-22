
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, /*connectAuthEmulator*/ } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
/* import { getAnalytics } from "firebase/analytics"; */

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCQ_il9Q3JfrFa2OY6HLkvcmwRz320HjFE", // TODO: Delete and Change key
    authDomain: "noten-rechner.ch",
    projectId: "noten-29b59",
    storageBucket: "noten-29b59.appspot.com",
    messagingSenderId: "302809455493",
    appId: "1:302809455493:web:90657650e4dfa4375682ec",
    measurementId: "G-C9JRSGW5YB",
};


const app = initializeApp(firebaseConfig);

window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LenVRMqAAAAAJio7getYJGENqY-9B7-81uL17Em"),
    isTokenAutoRefreshEnabled: true
});

const auth = getAuth(app);
/* connectAuthEmulator(auth, "http://127.0.0.1:9099"); */
const firestore = getFirestore(app);
connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
/* const analytics = getAnalytics(app); */

const getUserClaims = async () => {
    const token = await auth.currentUser.getIdTokenResult(true);
    return token.claims;
};

export { app, appCheck, auth, firestore, getUserClaims/* analytics */ };