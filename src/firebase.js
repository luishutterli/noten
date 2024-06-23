import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCQ_il9Q3JfrFa2OY6HLkvcmwRz320HjFE", // TODO: Delete and Change key
    authDomain: "noten-29b59.firebaseapp.com",
    projectId: "noten-29b59",
    storageBucket: "noten-29b59.appspot.com",
    messagingSenderId: "302809455493",
    appId: "1:302809455493:web:90657650e4dfa4375682ec",
    measurementId: "G-C9JRSGW5YB"
};

export const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();