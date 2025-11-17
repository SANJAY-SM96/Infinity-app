import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiLoader, FiUser, FiMail, FiPhone, FiFileText, FiDollarSign, FiCode, FiLayers, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { projectRequestService } from '../api/projectRequestService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ProjectRequestForm({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    projectTitle: '',
    description: '',
    domain: '',
    budget: '',
    currency: 'INR',
    techStack: [],
    features: [],
    timeline: ''
  });

  const [techStackInput, setTechStackInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        projectTitle: '',
        description: '',
        domain: '',
        budget: '',
        currency: 'INR',
        techStack: [],
        features: [],
        timeline: ''
      });
      setCurrentStep(1);
      setErrors({});
      setTechStackInput('');
      setFeatureInput('');
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name?.trim()) newErrors.name = 'Name is required';
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    if (step === 2) {
      if (!formData.projectTitle?.trim()) newErrors.projectTitle = 'Project title is required';
      if (!formData.description?.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
      if (!formData.domain?.trim()) newErrors.domain = 'Domain is required';
      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        newErrors.budget = 'Valid budget is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    setLoading(true);

    try {
      const response = await projectRequestService.create(formData);
      
      toast.success('Project request submitted successfully! We will get back to you soon.');
      onClose();
      
      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        projectTitle: '',
        description: '',
        domain: '',
        budget: '',
        currency: 'INR',
        techStack: [],
        features: [],
        timeline: ''
      });
      setCurrentStep(1);
      setErrors({});
    } catch (error) {
      console.error('Failed to submit project request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit project request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark 
    ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700' 
    : 'bg-white/95 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`${cardBg} border rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4`}
        >
          {/* Header */}
          <div className={`sticky top-0 ${cardBg} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10`}>
            <div className="min-w-0 flex-1 pr-2">
              <h2 className={`text-xl sm:text-2xl font-bold ${textClass} truncate`}>
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Build My Project
                </span>
              </h2>
              <p className={`text-xs sm:text-sm ${textMuted} mt-1 line-clamp-1`}>
                Submit your project requirements and we'll get back to you
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition flex-shrink-0 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Close"
            >
              <FiX className={`w-5 h-5 sm:w-6 sm:h-6 ${textMuted}`} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center flex-shrink-0">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition ${
                      currentStep >= step
                        ? 'bg-primary border-primary text-white'
                        : isDark
                        ? 'border-gray-600 text-gray-400'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > step ? (
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <span className="font-semibold text-xs sm:text-sm">{step}</span>
                      )}
                    </div>
                    <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden md:block ${
                      currentStep >= step ? textClass : textMuted
                    }`}>
                      {step === 1 ? 'Personal Info' : step === 2 ? 'Project Details' : 'Additional Info'}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div className={`flex-1 h-0.5 mx-1 sm:mx-2 md:mx-4 ${
                      currentStep > step ? 'bg-primary' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-xl font-bold ${textClass} mb-2 flex items-center gap-2`}>
                      <FiUser className="text-primary" />
                      Personal Information
                    </h3>
                    <p className={textMuted}>Tell us about yourself</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                          className={`w-full pl-10 pr-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${errors.name ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="john@example.com"
                          className={`w-full pl-10 pr-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${errors.email ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 1234567890"
                          className={`w-full pl-10 pr-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Project Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-xl font-bold ${textClass} mb-2 flex items-center gap-2`}>
                      <FiFileText className="text-primary" />
                      Project Details
                    </h3>
                    <p className={textMuted}>Tell us about your project</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., E-commerce Website, Mobile App"
                        className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${errors.projectTitle ? 'border-red-500' : ''}`}
                      />
                      {errors.projectTitle && <p className="text-red-500 text-xs mt-1">{errors.projectTitle}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                        Project Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        placeholder="Describe your project in detail. What features do you need? What problems does it solve?"
                        className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none ${errors.description ? 'border-red-500' : ''}`}
                      />
                      <p className={`text-xs mt-1 ${textMuted}`}>
                        {formData.description.length}/20 minimum characters
                      </p>
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                          Domain/Industry <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="domain"
                          value={formData.domain}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${errors.domain ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Domain</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Finance">Finance</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Food & Restaurant">Food & Restaurant</option>
                          <option value="Travel & Tourism">Travel & Tourism</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain}</p>}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                          Budget <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className={`px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                          <div className="relative flex-1">
                            <FiDollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
                            <input
                              type="number"
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              required
                              min="0"
                              step="0.01"
                              placeholder="10000"
                              className={`w-full pl-10 pr-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${errors.budget ? 'border-red-500' : ''}`}
                            />
                          </div>
                        </div>
                        {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${textClass} flex items-center gap-2`}>
                        <FiClock className="text-primary" size={16} />
                        Timeline (Optional)
                      </label>
                      <input
                        type="text"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        placeholder="e.g., 2-4 weeks, 1 month, ASAP"
                        className={`w-full px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Information */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-xl font-bold ${textClass} mb-2 flex items-center gap-2`}>
                      <FiLayers className="text-primary" />
                      Additional Information
                    </h3>
                    <p className={textMuted}>Add technical details and features (optional)</p>
                  </div>
                  
                  {/* Tech Stack */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass} flex items-center gap-2`}>
                      <FiCode className="text-primary" size={16} />
                      Preferred Tech Stack
                    </label>
                    <div className="flex gap-2 mb-3">
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
                        className={`flex-1 px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                      />
                      <button
                        type="button"
                        onClick={handleAddTechStack}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    {formData.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleRemoveTechStack(index)}
                              className="hover:text-red-500 transition"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass} flex items-center gap-2`}>
                      <FiLayers className="text-primary" size={16} />
                      Required Features
                    </label>
                    <div className="flex gap-2 mb-3">
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
                        placeholder="e.g., User authentication, Payment gateway, Admin dashboard"
                        className={`flex-1 px-4 py-3 ${inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    {formData.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              className="hover:text-red-500 transition"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer with Navigation */}
          <div className={`sticky bottom-0 ${cardBg} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 border ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-xl ${textClass} hover:opacity-80 transition text-sm sm:text-base`}
            >
              Cancel
            </button>
            <div className="flex gap-2 sm:gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 border ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-xl ${textClass} hover:opacity-80 transition text-sm sm:text-base`}
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition text-sm sm:text-base"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="hidden sm:inline">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Submit Request</span>
                      <span className="sm:hidden">Submit</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

