import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft } from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchProductById, fetchReviews } from '../services/apiService';
import { formatPrice, formatDate } from '../utils/formatters';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const productData = await fetchProductById(productId);
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.images[0]);
          
          // Fetch reviews for the product
          const reviewsData = await fetchReviews(productId);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }
      addToCart(product, quantity);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/products"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`border rounded-lg overflow-hidden ${
                  selectedImage === image ? 'border-blue-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-20 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            {renderStars(product.average_rating)}
            <span className="ml-2 text-gray-600">
              ({product.review_count} reviews)
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price.current)}
              </span>
              {product.price.original > product.price.current && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {formatPrice(product.price.original)}
                </span>
              )}
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.stock_status === 'in_stock'
                  ? 'bg-green-100 text-green-800'
                  : product.stock_status === 'low_stock'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock_status === 'in_stock'
                ? 'In Stock'
                : product.stock_status === 'low_stock'
                ? 'Low Stock'
                : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{product.long_description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Key Specifications:</h3>
            <div className="grid grid-cols-1 gap-2">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">{spec.key}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                +
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
              disabled={product.stock_status === 'out_of_stock'}
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Heart size={20} className="text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {renderStars(product.average_rating)}
            <span className="ml-2 text-lg font-medium">
              {product.average_rating.toFixed(1)} out of 5
            </span>
          </div>
          <p className="text-gray-600">
            Based on {product.review_count} customer reviews
          </p>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-2">
                {renderStars(review.rating)}
                <span className="ml-2 font-medium">{review.title}</span>
              </div>
              <p className="text-gray-600 mb-2">{review.comment}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">{review.user_name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(review.date)}</span>
                {review.verified_purchase && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-green-600">Verified Purchase</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;