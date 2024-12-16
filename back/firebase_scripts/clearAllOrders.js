// do przetestowania później, aby nie usuwać przykładu
const { db } = require('../firebase-config');

async function clearOrders() {
  try {
    const ordersSnapshot = await db.collection('Orders').get(); // Fetch all documents in the collection

    if (ordersSnapshot.empty) {
      console.log("No documents found in the 'Orders' collection to delete.");
      return;
    }

    const batch = db.batch(); // Use batch to perform multiple deletions
    ordersSnapshot.forEach((doc) => {
      batch.delete(doc.ref); // Add each document to the batch
    });

    await batch.commit(); // Execute the batch delete
    console.log("All documents in the 'Orders' collection have been deleted.");
  } catch (error) {
    console.error("Error while clearing 'Orders' collection: ", error);
  }
}

clearOrders();
