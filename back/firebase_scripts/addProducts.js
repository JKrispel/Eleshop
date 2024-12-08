// skrypt dodający przykładowe produkty (WIP)
const { db } = require('../firebase-config');

const products = [
  {
    id: "Laptop2",
    description: "Nowoczesny laptop z dużym ekranem.",
    category: "Elektronika",
    name: "Laptop Dell",
    price: 6000,
    imageUrl: "https://i.imgur.com/zROaZYc.jpeg"
  },
  {
    id: "Smartphone1",
    description: "Wydajny smartfon z 5G.",
    category: "Telefony",
    name: "Smartphone Samsung",
    price: 2500,
    imageUrl: "https://i.imgur.com/0bO6F2h.jpeg"
  },
  {
    id: "Headphones1",
    description: "Słuchawki z aktywną redukcją hałasu.",
    category: "Audio",
    name: "Słuchawki Bose",
    price: 1200,
    imageUrl: "https://i.imgur.com/5gOXJww.jpeg"
  }
];

async function addProducts() {
  try {
    for (const product of products) {
      await db.collection('Products').doc(product.id).set(product);
    }
    console.log("Produkty zostały pomyślnie dodane!");
  } catch (error) {
    console.error("Błąd podczas dodawania produktów: ", error);
  }
}

addProducts();
