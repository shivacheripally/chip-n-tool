import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    addToCart(product, 1);
  };

  const renderStars = () => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(product.average_rating)
                ? 'text-yellow-400 fill-current'
                : i < product.average_rating
                ? 'text-yellow-400 fill-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({product.review_count})</span>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 ${
        compact ? 'h-full' : 'flex flex-col'
      }`}
    >
      <Link to={`/products/${product.id}`} className="block flex-1">
        <div className="relative">
          {product.price.original > product.price.current && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
              {Math.round(((product.price.original - product.price.current) / product.price.original) * 100)}% OFF
            </span>
          )}

          <div className="absolute top-3 right-3 z-10">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          </div>

          <div className="h-56 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {product.brand && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{product.brand}</p>
          )}

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-snug">{product.name}</h3>

          {!compact && <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{product.short_description}</p>}

          <div className="mb-3 flex items-center gap-3">
            <div>
              {renderStars()}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price.current)}
            </span>

            {product.price.original > product.price.current && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price.original)}
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1.5 rounded-full ${
              product.stock_status === 'in_stock'
                ? 'bg-green-50 text-green-700'
                : product.stock_status === 'low_stock'
                ? 'bg-orange-50 text-orange-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {product.stock_status === 'in_stock'
                ? 'In Stock'
                : product.stock_status === 'low_stock'
                ? 'Low Stock'
                : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>

      {!compact && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center transition-colors"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;