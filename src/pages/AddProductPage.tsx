import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Plus, X, Eye, Edit2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import { imageStorage } from '../config/imageFirebase';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

const AddProductPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category_id: '',
    brand: '',
    short_description: '',
    long_description: '',
    current_price: '',
    original_price: '',
    images: [''],
    imageFiles: [null as File | null],
    specifications: [{ key: '', value: '' }],
    stock_status: 'in_stock' as 'in_stock' | 'out_of_stock' | 'low_stock',
    tags: ['']
  });

  // TODO: Uncomment admin role check when ready to restrict access
  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

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

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
      imageFiles: [...prev.imageFiles, null]
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      const newImageFiles = formData.imageFiles.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages,
        imageFiles: newImageFiles
      }));
    }
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  const addSpecificationField = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecificationField = (index: number) => {
    if (formData.specifications.length > 1) {
      const newSpecs = formData.specifications.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        specifications: newSpecs
      }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTagField = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTagField = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tags: newTags
      }));
    }
  };

  const uploadImagesToStorage = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < formData.imageFiles.length; i++) {
      const file = formData.imageFiles[i];
      const urlFromInput = formData.images[i];

      if (file) {
        try {
          const storageRef = ref(imageStorage, `products/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          uploadedUrls.push(downloadURL);
        } catch (err) {
          console.error(`Error uploading image ${i}:`, err);
          throw new Error(`Failed to upload image: ${file.name}`);
        }
      } else if (urlFromInput.trim()) {
        uploadedUrls.push(urlFromInput);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const imageUrls = await uploadImagesToStorage();

      if (imageUrls.length === 0) {
        throw new Error('Please add at least one product image');
      }

      const productData: Omit<Product, 'id' | 'average_rating' | 'review_count'> = {
        sku: formData.sku,
        name: formData.name,
        category_id: formData.category_id,
        brand: formData.brand,
        short_description: formData.short_description,
        long_description: formData.long_description,
        price: {
          current: parseFloat(formData.current_price),
          original: parseFloat(formData.original_price),
          currency: 'INR'
        },
        images: imageUrls,
        specifications: formData.specifications.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== ''),
        stock_status: formData.stock_status,
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      await addDoc(collection(db, 'products'), {
        ...productData,
        average_rating: 0,
        review_count: 0,
        created_at: new Date()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product. Please try again.');
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
          <h2 className="text-2xl font-bold mb-2">Product Added Successfully!</h2>
          <p className="text-gray-600">Redirecting to products page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., LP-DEL-XPS-13"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Dell XPS 13 Ultrabook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category ID *
                    </label>
                    <input
                      type="text"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., cat_laptops"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Dell"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Descriptions</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief product description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long Description *
                    </label>
                    <textarea
                      name="long_description"
                      value={formData.long_description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed product description"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="current_price"
                      value={formData.current_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Product Images</h2>
                <p className="text-sm text-gray-600 mb-4">Upload images or provide URLs</p>
                <div className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex gap-2 mb-3">
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                            <span className="text-sm text-gray-600">
                              {formData.imageFiles[index] ? formData.imageFiles[index]!.name : 'Choose file or paste URL'}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(index, e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </label>
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                      {!formData.imageFiles[index] && (
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder="Or paste image URL here"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Image
                  </button>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        placeholder="Specification name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="Specification value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formData.specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecificationField(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpecificationField}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Specification
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Stock Status</h2>
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

              {/* Tags */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <div className="space-y-3">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="Tag"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTagField(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTagField}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={isLoading || showPreview}
                  whileTap={{ scale: 0.98 }}
                  className="btn-standard flex-1 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding Product...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload size={18} className="mr-2" />
                      Add Product
                    </div>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  whileTap={{ scale: 0.98 }}
                  className="btn-standard px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {showPreview ? (
                    <>
                      <Edit2 size={18} className="mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye size={18} className="mr-2" />
                      Show
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-standard px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            </motion.div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6 sticky top-24 h-fit"
            >
              <h2 className="text-2xl font-bold mb-6">Preview</h2>

              {formData.images[0] && (formData.imageFiles[0] || formData.images[0]) && (
                <div className="mb-6">
                  <img
                    src={
                      formData.imageFiles[0]
                        ? URL.createObjectURL(formData.imageFiles[0])
                        : formData.images[0]
                    }
                    alt={formData.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{formData.name || 'Product Name'}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formData.brand && `By ${formData.brand}`}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{formData.current_price || '0'}
                    </span>
                    {formData.original_price && formData.original_price !== formData.current_price && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{formData.original_price}
                      </span>
                    )}
                  </div>
                  {formData.original_price && formData.current_price && (
                    <p className="text-sm text-green-600 mt-2">
                      Save ₹{parseFloat(formData.original_price) - parseFloat(formData.current_price)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-gray-700 font-medium mb-1">Description</p>
                  <p className="text-sm text-gray-600">{formData.short_description || 'Short description will appear here'}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Stock Status</p>
                  <p className="text-sm font-medium text-gray-700 mt-1 capitalize">{formData.stock_status.replace('_', ' ')}</p>
                </div>

                {formData.specifications.some(s => s.key && s.value) && (
                  <div className="pt-4 border-t">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Specifications</p>
                    <div className="space-y-2">
                      {formData.specifications.map((spec, idx) => spec.key && spec.value && (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{spec.key}</span>
                          <span className="font-medium text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tags.some(t => t) && (
                  <div className="pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => tag && (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;