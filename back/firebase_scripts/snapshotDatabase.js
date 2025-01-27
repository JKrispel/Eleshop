const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportFirestore() {
  try {
    const collections = await db.listCollections();
    const exportData = {};

    for (const collection of collections) {
      const snapshot = await collection.get();
      exportData[collection.id] = [];

      snapshot.forEach((doc) => {
        exportData[collection.id].push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }

    fs.writeFileSync('firestore-backup.json', JSON.stringify(exportData, null, 2));
    console.log('Firestore backup created successfully!');
  } catch (error) {
    console.error('Error exporting Firestore data:', error);
  }
}

exportFirestore();
