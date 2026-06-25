import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { fetchCategories, fetchProducts } from '../services/apiService';
import { Category, Product } from '../types';

const ProductListingPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchTerm = searchParams.get('search')?.trim().toLowerCase() || '';

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const selectedCategory = useMemo(() => {
    if (!categoryId) {
      return null;
    }

    return categories.find(
      (category) => category.slug === categoryId || category.id === categoryId
    ) || null;
  }, [categories, categoryId]);

  const activeCategoryId = useMemo(() => {
    if (!categoryId) {
      return '';
    }

    if (selectedCategory) {
      return selectedCategory.id;
    }

    return categoryId.startsWith('cat_')
      ? categoryId
      : `cat_${categoryId.replace(/-/g, '_')}`;
  }, [categoryId, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategoryId
        ? product.category_id === activeCategoryId
        : true;

      const matchesSearch = searchTerm
        ? [
            product.name,
            product.brand,
            product.sku,
            product.short_description,
            ...product.tags,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(searchTerm))
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategoryId, searchTerm]);

  const pageTitle = selectedCategory
    ? selectedCategory.name
    : categoryId
    ? `Products in ${categoryId.replace(/-/g, ' ')}`
    : searchTerm
    ? `Search results for "${searchParams.get('search')}"`
    : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {pageTitle}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-96 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-600">
            Try browsing another category or searching for a different product.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
