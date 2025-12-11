import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import { imageStorage } from '../config/imageFirebase';
import { Product } from '../types';

const EditProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const product = location.state?.product as Product | null;

  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    category_id: product?.category_id || '',
    brand: product?.brand || '',
    short_description: product?.short_description || '',
    long_description: product?.long_description || '',
    current_price: product?.price.current.toString() || '',
    original_price: product?.price.original.toString() || '',
    images: product?.images || [''],
    imageFiles: [null as File | null],
    stock_status: (product?.stock_status || 'in_stock') as 'in_stock' | 'out_of_stock' | 'low_stock',
  });

  useEffect(() => {
    if (!product || !productId) {
      navigate('/');
    }
  }, [product, productId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleImageFileChange = (index: number, file: File | null) => {
    const newImageFiles = [...formData.imageFiles];
    newImageFiles[index] = file;
    setFormData(prev => ({
      ...prev,
      imageFiles: newImageFiles
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const finalImages: string[] = [];

      for (let i = 0; i < formData.images.length; i++) {
        if (formData.imageFiles[i]) {
          const timestamp = Date.now();
          const storageRef = ref(imageStorage, `products/${productId}/${timestamp}_${i}`);
          await uploadBytes(storageRef, formData.imageFiles[i]!);
          const url = await getDownloadURL(storageRef);
          finalImages.push(url);
        } else if (formData.images[i]) {
          finalImages.push(formData.images[i]);
        }
      }

      const productData = {
        sku: formData.sku,
        name: formData.name,
        category_id: formData.category_id,
        brand: formData.brand,
        short_description: formData.short_description,
        long_description: formData.long_description,
        price: {
          current: parseFloat(formData.current_price),
          original: parseFloat(formData.original_price)
        },
        images: finalImages,
        stock_status: formData.stock_status,
        updated_at: new Date()
      };

      if (!productId) {
        setError('Product ID is missing');
        return;
      }

      await updateDoc(doc(db, 'products', productId), productData);
      setSuccess(true);
      setTimeout(() => navigate('/products'), 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Product Updated Successfully!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                <input
                  type="number"
                  name="current_price"
                  value={formData.current_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                <select
                  name="stock_status"
                  value={formData.stock_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="btn-standard flex-1 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Upload size={18} className="mr-2" />
                      Update Product
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-standard px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
