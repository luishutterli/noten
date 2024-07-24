const admin = require('firebase-admin');

const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const uid = "i622Fx2WqARShspXaIprtBaw57i1"; // LSH

admin.auth().setCustomUserClaims(uid, { admin: true }).then(() => console.log(`Success, made user with uid ${uid} an admin`)).catch((error) => console.log(error));