import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/Loader';
import { productService } from '../../api/productService';
import { useTheme } from '../../context/ThemeContext';
import { FiUpload, FiX, FiImage, FiVideo, FiSave, FiExternalLink } from 'react-icons/fi';
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
  const { isDark } = useTheme();
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
    demoUrl: '',
    sourceCode: '',
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
  const [sourceCodeFile, setSourceCodeFile] = useState(null);

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
        demoUrl: product.demoUrl || '',
        sourceCode: product.sourceCode || '',
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
      // Upload files to Cloudinary or use data URLs as fallback
      // Note: In production, implement proper Cloudinary upload via backend API
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          // Use data URL for now - backend should handle Cloudinary upload
          // This is a temporary solution until backend upload endpoint is implemented
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

  const handleSourceCodeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-zip'];
      const validExts = ['.zip', '.rar', '.7z'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(file.type) && !validExts.includes(fileExt)) {
        toast.error('Please upload a ZIP, RAR, or 7Z file');
        e.target.value = '';
        return;
      }
      
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        e.target.value = '';
        return;
      }
      
      setSourceCodeFile(file);
      // Clear link when file is selected
      setFormData(prev => ({ ...prev, sourceCode: '' }));
    }
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

      // Validate source code - either file or link required
      if (!sourceCodeFile && (!formData.sourceCode || formData.sourceCode.trim() === '')) {
        toast.error('Please upload a ZIP file or provide a source code link');
        setSaving(false);
        return;
      }

      const finalPrice = parseFloat(priceValue);
      const finalOriginalPrice = formData.originalPriceINR || formData.originalPrice 
        ? parseFloat(formData.originalPriceINR || formData.originalPrice) 
        : undefined;

      // Prepare data
      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: finalPrice,
        priceINR: finalPrice,
        originalPrice: finalOriginalPrice,
        originalPriceINR: finalOriginalPrice,
        currency: 'INR',
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
        demoUrl: formData.demoUrl?.trim() || undefined,
        sourceCode: sourceCodeFile ? undefined : formData.sourceCode?.trim() || undefined,
        productType: formData.productType || 'digital',
        deliveryType: formData.deliveryType || 'instant',
        deliveryTime: formData.deliveryTime || 'Instant Download',
        isFeatured: formData.isFeatured || false,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };

      // Use FormData if file is being uploaded
      if (sourceCodeFile) {
        const formDataToSend = new FormData();
        
        // Add simple fields
        formDataToSend.append('title', data.title);
        formDataToSend.append('description', data.description);
        formDataToSend.append('price', data.price);
        formDataToSend.append('priceINR', data.priceINR);
        formDataToSend.append('currency', data.currency);
        if (data.originalPrice) formDataToSend.append('originalPrice', data.originalPrice);
        if (data.originalPriceINR) formDataToSend.append('originalPriceINR', data.originalPriceINR);
        formDataToSend.append('category', data.category);
        if (data.brand) formDataToSend.append('brand', data.brand);
        formDataToSend.append('stock', data.stock);
        if (data.warranty) formDataToSend.append('warranty', data.warranty);
        if (data.returnsPolicy) formDataToSend.append('returnsPolicy', data.returnsPolicy);
        if (data.demoVideo) formDataToSend.append('demoVideo', data.demoVideo);
        if (data.demoUrl) formDataToSend.append('demoUrl', data.demoUrl);
        formDataToSend.append('productType', data.productType);
        formDataToSend.append('deliveryType', data.deliveryType);
        formDataToSend.append('deliveryTime', data.deliveryTime);
        formDataToSend.append('isFeatured', data.isFeatured);
        formDataToSend.append('isActive', data.isActive);
        
        // Add arrays
        if (data.images && data.images.length > 0) {
          data.images.forEach((img, index) => {
            formDataToSend.append(`images[${index}]`, img);
          });
        }
        if (data.techStack && data.techStack.length > 0) {
          data.techStack.forEach((tech, index) => {
            formDataToSend.append(`techStack[${index}]`, tech);
          });
        }
        if (data.features && data.features.length > 0) {
          data.features.forEach((feature, index) => {
            formDataToSend.append(`features[${index}]`, feature);
          });
        }
        
        // Add objects as JSON
        if (data.specifications && Object.keys(data.specifications).length > 0) {
          formDataToSend.append('specifications', JSON.stringify(data.specifications));
        }
        
        // Add the file
        formDataToSend.append('sourceCodeFile', sourceCodeFile);

        if (isEdit) {
          await productService.updateWithFile(id, formDataToSend);
          toast.success('Project updated successfully');
        } else {
          await productService.createWithFile(formDataToSend);
          toast.success('Project created successfully');
        }
      } else {
        if (isEdit) {
          await productService.update(id, data);
          toast.success('Project updated successfully');
        } else {
          await productService.create(data);
          toast.success('Project created successfully');
        }
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

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${textClass}`}>
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className={textMuted}>
            {isEdit ? 'Update project details' : 'Create a new project for your store'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBg} border rounded-xl p-6 space-y-6`}
          >
            {/* Basic Information */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textClass}`}>Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                  />
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className={isDark ? 'bg-gray-800' : 'bg-white'}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Currency *</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer`}
                  >
                    <option value="INR" className={isDark ? 'bg-gray-800' : 'bg-white'}>INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Price (₹) *</label>
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
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                    placeholder="Enter price in Indian Rupees"
                  />
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Original Price (₹) <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>(Optional)</span></label>
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
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                    placeholder="Enter original price if on discount"
                  />
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Product Type *</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer`}
                  >
                    <option value="digital" className={isDark ? 'bg-gray-800' : 'bg-white'}>Digital</option>
                    <option value="physical" className={isDark ? 'bg-gray-800' : 'bg-white'}>Physical</option>
                    <option value="both" className={isDark ? 'bg-gray-800' : 'bg-white'}>Both</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Delivery Type *</label>
                  <select
                    name="deliveryType"
                    value={formData.deliveryType}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer`}
                  >
                    <option value="instant" className={isDark ? 'bg-gray-800' : 'bg-white'}>Instant</option>
                    <option value="custom" className={isDark ? 'bg-gray-800' : 'bg-white'}>Custom</option>
                    <option value="both" className={isDark ? 'bg-gray-800' : 'bg-white'}>Both</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="e.g., Instant Download, 2-4 weeks"
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                  />
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                  />
                </div>
                <div>
                  <label className={`block ${textMuted} text-sm mb-2`}>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block ${textMuted} text-sm mb-2`}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition resize-none`}
              />
            </div>

            {/* Images */}
            <div>
              <label className={`block ${textMuted} text-sm font-semibold mb-3`}>
                Project Images * <span className="text-xs font-normal">(At least 1 image required)</span>
              </label>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative h-40 overflow-hidden rounded-xl border-2 border-primary/20 bg-gray-100 dark:bg-gray-700">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 rounded-full transition-all"
                          >
                            <FiX className="text-white" size={18} />
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-500">Image {index + 1}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              <label className={`flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-xl cursor-pointer hover:border-primary/50 transition ${isDark ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    <FiUpload className={`${uploading ? 'text-gray-400' : 'text-primary'}`} size={24} />
                  </div>
                  <div className="text-center">
                    <span className={`${textMuted} font-semibold block`}>
                      {uploading ? 'Uploading...' : 'Click to Upload Images'}
                    </span>
                    <span className={`${textMuted} text-xs mt-1 block`}>
                      PNG, JPG, WEBP up to 10MB
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {formData.images.length === 0 && (
                <p className={`text-xs mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  ⚠️ Please upload at least one image for your project
                </p>
              )}
            </div>

            {/* Demo Video */}
            <div>
              <label className={`block ${textMuted} text-sm mb-2`}>Demo Video URL</label>
              <input
                type="url"
                name="demoVideo"
                value={formData.demoVideo}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
              />
              {formData.demoVideo && (
                <div className={`mt-2 p-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
                  <FiVideo className="text-primary inline mr-2" size={16} />
                  <span className={textMuted} style={{ fontSize: '0.875rem' }}>{formData.demoVideo}</span>
                </div>
              )}
            </div>

            {/* Demo Site URL */}
            <div>
              <label className={`block ${textMuted} text-sm mb-2`}>Demo Site URL</label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                placeholder="https://demo.example.com or https://project-demo.vercel.app"
                className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
              />
              {formData.demoUrl && (
                <div className={`mt-2 p-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg flex items-center gap-2`}>
                  <FiExternalLink className="text-primary" size={16} />
                  <a 
                    href={formData.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline text-sm`}
                  >
                    {formData.demoUrl}
                  </a>
                </div>
              )}
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Enter the live demo site URL where users can preview the project
              </p>
            </div>

            {/* Source Code - Required */}
            <div>
              <label className={`block ${textMuted} text-sm font-semibold mb-3`}>
                Source Code * <span className="text-xs font-normal">(Upload ZIP file or provide link)</span>
              </label>
              
              {/* File Upload Option */}
              <div className="mb-4">
                <label className={`flex flex-col items-center justify-center gap-3 px-6 py-6 border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-xl cursor-pointer hover:border-primary/50 transition ${isDark ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                      <FiUpload className="text-primary" size={24} />
                    </div>
                    <div className="text-center">
                      <span className={`${textMuted} font-semibold block`}>
                        {sourceCodeFile ? sourceCodeFile.name : 'Click to Upload ZIP File'}
                      </span>
                      <span className={`${textMuted} text-xs mt-1 block`}>
                        ZIP, RAR, or 7Z up to 100MB
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".zip,.rar,.7z,application/zip,application/x-zip-compressed"
                    onChange={handleSourceCodeFileChange}
                    className="hidden"
                  />
                </label>
                {sourceCodeFile && (
                  <div className={`mt-2 p-2 ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border rounded-lg flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <FiUpload className="text-green-500" size={16} />
                      <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                        {sourceCodeFile.name} ({(sourceCodeFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSourceCodeFile(null);
                        const fileInput = document.querySelector('input[type="file"][accept*="zip"]');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <span className={`text-xs ${textMuted}`}>OR</span>
                <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              </div>

              {/* Link Option */}
              <div>
                <label className={`block ${textMuted} text-sm mb-2`}>
                  Source Code Link
                </label>
                <input
                  type="url"
                  name="sourceCode"
                  value={formData.sourceCode}
                  onChange={handleInputChange}
                  disabled={!!sourceCodeFile}
                  placeholder="https://github.com/user/repo or https://drive.google.com/... or https://example.com/project.zip"
                  className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition ${sourceCodeFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Enter a link to the source code (GitHub, Google Drive, ZIP file, or any other hosting service)
                </p>
                {formData.sourceCode && !sourceCodeFile && (
                  <div className={`mt-2 p-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
                    <FiUpload className="text-primary inline mr-2" size={16} />
                    <a 
                      href={formData.sourceCode} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline text-sm`}
                    >
                      {formData.sourceCode}
                    </a>
                  </div>
                )}
              </div>

              {!sourceCodeFile && !formData.sourceCode && (
                <p className={`text-xs mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  ⚠️ Please upload a ZIP file or provide a source code link
                </p>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <label className={`block ${textMuted} text-sm mb-2`}>Tech Stack</label>
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
                  className={`flex-1 px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
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
              <label className={`block ${textMuted} text-sm mb-2`}>Features</label>
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
                  className={`flex-1 px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
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
              <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>Specifications</h3>
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
                      className={`px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Value"
                        value={value}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        className={`flex-1 px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
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
                <label className={`block ${textMuted} text-sm mb-2`}>Warranty</label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 Year"
                  className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
                />
              </div>
              <div>
                <label className={`block ${textMuted} text-sm mb-2`}>Returns Policy</label>
                <input
                  type="text"
                  name="returnsPolicy"
                  value={formData.returnsPolicy}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 Days"
                  className={`w-full px-4 py-2 ${inputBg} rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition`}
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
                  className={`w-4 h-4 rounded border-primary/20 ${isDark ? 'bg-gray-700' : 'bg-white'} text-primary focus:ring-primary/20`}
                />
                <span className={textMuted}>Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className={`w-4 h-4 rounded border-primary/20 ${isDark ? 'bg-gray-700' : 'bg-white'} text-primary focus:ring-primary/20`}
                />
                <span className={textMuted}>Active</span>
              </label>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className={`flex-1 px-6 py-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border rounded-lg ${textClass} hover:opacity-80 transition`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

