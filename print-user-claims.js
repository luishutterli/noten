const admin = require('firebase-admin');

const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const uid = "i622Fx2WqARShspXaIprtBaw57i1"; // LSH

admin.auth().getUser(uid)
    .then((userRecord) => {
        console.log(`Custom claims for user with uid ${uid}:`, userRecord.customClaims);
    })
    .catch((error) => {
        console.log('Error fetching user data:', error);
    });