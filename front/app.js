// app.js
document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
  
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const products = await response.json();
  
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
  
        productCard.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p class="price">${product.price} zł</p>
        `;
  
        productList.appendChild(productCard);
      });
    } catch (error) {
      console.error('Błąd podczas pobierania produktów:', error);
      productList.innerHTML = `<p>Nie udało się załadować listy produktów.</p>`;
    }
  });

