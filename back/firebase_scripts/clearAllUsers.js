// do przetestowania później, aby nie usuwać przykładu
const { db } = require('../firebase-config');

async function clearUsers() {
  try {
    const usersSnapshot = await db.collection('Users').get(); // Fetch all documents in the collection

    if (usersSnapshot.empty) {
      console.log("No documents found in the 'Users' collection to delete.");
      return;
    }

    const batch = db.batch(); // Use batch to perform multiple deletions
    usersSnapshot.forEach((doc) => {
      batch.delete(doc.ref); // Add each document to the batch
    });

    await batch.commit(); // Execute the batch delete
    console.log("All documents in the 'Users' collection have been deleted.");
  } catch (error) {
    console.error("Error while clearing 'Users' collection: ", error);
  }
}

clearUsers();
