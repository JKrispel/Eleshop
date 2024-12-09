import React from 'react';
import { useParams } from 'react-router-dom';
import './styles/ProductDetails.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const product = {
    id: productId,
    name: `Product ${productId}`,
    description: 'This is a detailed description of the product.',
    image: 'https://via.placeholder.com/300',
  };

  return (
    <div className="product-details-container">
      <img src={product.image} alt={product.name} className="product-details-image" />
      <h1 className="product-details-title">{product.name}</h1>
      <p className="product-details-description">{product.description}</p>
    </div>
  );
};

export default ProductDetails;
