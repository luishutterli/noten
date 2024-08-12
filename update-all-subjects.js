const admin = require('firebase-admin');

const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateSubjects() {
    const subjectsCollection = db.collection('subjects');

    try {
        const snapshot = await subjectsCollection.get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    const batch = db.batch();

    snapshot.forEach(doc => {
      const docRef = subjectsCollection.doc(doc.id);
      batch.update(docRef, { premade: true });
    });

    await batch.commit();
    console.log('All documents updated successfully.');
    } catch (error) {
        console.error("Error updating subjects", error);
    }
}

updateSubjects();