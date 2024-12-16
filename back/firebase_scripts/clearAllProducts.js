const { db } = require('../firebase-config');

async function clearProducts() {
  try {
    const productsSnapshot = await db.collection('Products').get(); // Fetch all documents in the collection

    if (productsSnapshot.empty) {
      console.log("No documents found in the 'Products' collection to delete.");
      return;
    }

    const batch = db.batch(); // Use batch to perform multiple deletions
    productsSnapshot.forEach((doc) => {
      batch.delete(doc.ref); // Add each document to the batch
    });

    await batch.commit(); // Execute the batch delete
    console.log("All documents in the 'Products' collection have been deleted.");
  } catch (error) {
    console.error("Error while clearing 'Products' collection: ", error);
  }
}

clearProducts();
