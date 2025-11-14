import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { productService } from '../../api/productService';
import { FiUpload, FiX, FiImage, FiVideo, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const categories = [
  'React Projects',
  'Python Projects',
  'AI/ML Projects',
  'Full-Stack Web Apps',
  'Mini Projects',
  'Final-Year Projects',
  'SaaS Tools',
  'Node.js Projects',
  'Vue.js Projects',
  'Angular Projects',
  'Django Projects',
  'Flask Projects',
  'MERN Stack',
  'MEAN Stack',
  'Mobile Apps',
  'Other'
];

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceINR: '',
    currency: 'INR',
    originalPrice: '',
    originalPriceINR: '',
    category: 'React Projects',
    brand: '',
    stock: '',
    images: [],
    demoVideo: '',
    techStack: [],
    features: [],
    productType: 'digital',
    deliveryType: 'instant',
    deliveryTime: 'Instant Download',
    specifications: {},
    warranty: '',
    returnsPolicy: '',
    isFeatured: false,
    isActive: true
  });

  const [uploading, setUploading] = useState(false);
  const [techStackInput, setTechStackInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
      const product = response.data.product;
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        priceINR: product.priceINR || '',
        currency: product.currency || 'INR',
        originalPrice: product.originalPrice || '',
        originalPriceINR: product.originalPriceINR || '',
        category: product.category || 'React Projects',
        brand: product.brand || '',
        stock: product.stock || '',
        images: product.images || [],
        demoVideo: product.demoVideo || '',
        techStack: product.techStack || [],
        features: product.features || [],
        productType: product.productType || 'digital',
        deliveryType: product.deliveryType || 'instant',
        deliveryTime: product.deliveryTime || 'Instant Download',
        specifications: product.specifications || {},
        warranty: product.warranty || '',
        returnsPolicy: product.returnsPolicy || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // For now, we'll use a placeholder. In production, you'll upload to Cloudinary
      // This is a simplified version - you'll need to implement Cloudinary upload
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          // TODO: Implement Cloudinary upload
          // For now, create a data URL
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleAddTechStack = () => {
    if (techStackInput.trim()) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techStackInput.trim()]
      }));
      setTechStackInput('');
    }
  };

  const handleRemoveTechStack = (index) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      const priceValue = formData.priceINR || formData.price;
      if (!formData.title || !formData.description || !priceValue || !formData.category) {
        toast.error('Please fill in all required fields');
        setSaving(false);
        return;
      }

      if (!formData.images || formData.images.length === 0) {
        toast.error('Please add at least one image');
        setSaving(false);
        return;
      }

      const finalPrice = parseFloat(priceValue);
      const finalOriginalPrice = formData.originalPriceINR || formData.originalPrice 
        ? parseFloat(formData.originalPriceINR || formData.originalPrice) 
        : undefined;

      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: finalPrice, // Use INR price as main price
        priceINR: finalPrice,
        originalPrice: finalOriginalPrice,
        originalPriceINR: finalOriginalPrice,
        currency: 'INR', // Always INR
        images: formData.images || [],
        category: formData.category,
        brand: formData.brand?.trim() || undefined,
        stock: parseInt(formData.stock) || 0,
        specifications: formData.specifications || undefined,
        warranty: formData.warranty?.trim() || undefined,
        returnsPolicy: formData.returnsPolicy?.trim() || undefined,
        techStack: formData.techStack || [],
        features: formData.features || [],
        demoVideo: formData.demoVideo || undefined,
        productType: formData.productType || 'digital',
        deliveryType: formData.deliveryType || 'instant',
        deliveryTime: formData.deliveryTime || 'Instant Download',
        isFeatured: formData.isFeatured || false,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };

      if (isEdit) {
        await productService.update(id, data);
        toast.success('Project updated successfully');
      } else {
        await productService.create(data);
        toast.success('Project created successfully');
      }

      navigate('/admin/projects');
    } catch (error) {
      console.error('Failed to save product:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || `Failed to ${isEdit ? 'update' : 'create'} project`;
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className="text-white/60">
            {isEdit ? 'Update project details' : 'Create a new project for your store'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-dark-light to-dark-lighter rounded-xl p-6 border border-primary/20 space-y-6"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-dark-light">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Currency *</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
                  >
                    <option value="INR" className="bg-dark-light">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="priceINR"
                    value={formData.priceINR || formData.price}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        priceINR: e.target.value,
                        price: e.target.value // Keep price in sync for backend
                      });
                    }}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                    placeholder="Enter price in Indian Rupees"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Original Price (₹) <span className="text-white/40">(Optional)</span></label>
                  <input
                    type="number"
                    name="originalPriceINR"
                    value={formData.originalPriceINR || formData.originalPrice}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        originalPriceINR: e.target.value,
                        originalPrice: e.target.value // Keep in sync for backend
                      });
                    }}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                    placeholder="Enter original price if on discount"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Product Type *</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
                  >
                    <option value="digital" className="bg-dark-light">Digital</option>
                    <option value="physical" className="bg-dark-light">Physical</option>
                    <option value="both" className="bg-dark-light">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Delivery Type *</label>
                  <select
                    name="deliveryType"
                    value={formData.deliveryType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
                  >
                    <option value="instant" className="bg-dark-light">Instant</option>
                    <option value="custom" className="bg-dark-light">Custom</option>
                    <option value="both" className="bg-dark-light">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="e.g., Instant Download, 2-4 weeks"
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Images *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="text-white" size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition">
                <FiUpload className="text-primary" size={20} />
                <span className="text-white/60">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Demo Video */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Demo Video URL</label>
              <input
                type="url"
                name="demoVideo"
                value={formData.demoVideo}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              />
              {formData.demoVideo && (
                <div className="mt-2 p-2 bg-dark/50 rounded-lg">
                  <FiVideo className="text-primary inline mr-2" size={16} />
                  <span className="text-white/60 text-sm">{formData.demoVideo}</span>
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechStack();
                    }
                  }}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="flex-1 px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                />
                <button
                  type="button"
                  onClick={handleAddTechStack}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechStack(index)}
                      className="hover:text-red-500"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Features</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g., User authentication, Payment gateway"
                  className="flex-1 px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="hover:text-red-500"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Specification name"
                      value={key}
                      onChange={(e) => {
                        const newSpecs = { ...formData.specifications };
                        delete newSpecs[key];
                        newSpecs[e.target.value] = value;
                        setFormData(prev => ({ ...prev, specifications: newSpecs }));
                      }}
                      className="px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Value"
                        value={value}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        className="flex-1 px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSpecs = { ...formData.specifications };
                          delete newSpecs[key];
                          setFormData(prev => ({ ...prev, specifications: newSpecs }));
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleSpecificationChange('', '')}
                  className="px-4 py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition"
                >
                  + Add Specification
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Warranty</label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 Year"
                  className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Returns Policy</label>
                <input
                  type="text"
                  name="returnsPolicy"
                  value={formData.returnsPolicy}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 Days"
                  className="w-full px-4 py-2 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-primary/20 bg-dark text-primary focus:ring-primary/20"
                />
                <span className="text-white/60">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-primary/20 bg-dark text-primary focus:ring-primary/20"
                />
                <span className="text-white/60">Active</span>
              </label>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="flex-1 px-6 py-3 bg-dark-light border border-primary/20 rounded-lg text-white hover:bg-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <FiSave size={20} />
                  {isEdit ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

