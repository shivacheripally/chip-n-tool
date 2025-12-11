import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const ProductListingPage = () => {
  const { categoryId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {categoryId ? `Products in ${categoryId}` : 'All Products'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Product list will be implemented later */}
      </div>
    </div>
  );
};

export default ProductListingPage;