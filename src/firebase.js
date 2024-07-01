
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCQ_il9Q3JfrFa2OY6HLkvcmwRz320HjFE", // TODO: Delete and Change key
    authDomain: "noten-29b59.firebaseapp.com",
    projectId: "noten-29b59",
    storageBucket: "noten-29b59.appspot.com",
    messagingSenderId: "302809455493",
    appId: "1:302809455493:web:90657650e4dfa4375682ec",
    measurementId: "G-C9JRSGW5YB"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, firestore, analytics };