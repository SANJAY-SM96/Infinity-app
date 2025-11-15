import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectRequestService } from '../api/projectRequestService';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiUpload,
  FiCalendar,
  FiDollarSign,
  FiSend,
  FiX,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    domain: '',
    budget: '',
    deadline: '',
    techStack: [],
    features: [],
    requirements: '',
    documents: []
  });
  const [techStackInput, setTechStackInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await projectRequestService.getMyRequests();
      setMyRequests(response.data.projectRequests || response.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load your project requests');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, documents: [...formData.documents, ...files] });
  };

  const removeDocument = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocs });
  };

  const addTechStack = () => {
    if (techStackInput.trim()) {
      setFormData({ 
        ...formData, 
        techStack: [...formData.techStack, techStackInput.trim()] 
      });
      setTechStackInput('');
    }
  };

  const removeTechStack = (index) => {
    setFormData({ 
      ...formData, 
      techStack: formData.techStack.filter((_, i) => i !== index) 
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ 
        ...formData, 
        features: [...formData.features, featureInput.trim()] 
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({ 
      ...formData, 
      features: formData.features.filter((_, i) => i !== index) 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.projectTitle || !formData.domain || !formData.budget || !formData.deadline || !formData.requirements) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('projectTitle', formData.projectTitle);
      formDataToSend.append('domain', formData.domain);
      formDataToSend.append('budget', formData.budget);
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('requirements', formData.requirements);
      formDataToSend.append('techStack', JSON.stringify(formData.techStack));
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('currency', 'INR');
      
      formData.documents.forEach((doc, index) => {
        formDataToSend.append(`documents`, doc);
      });

      await projectRequestService.createRequest(formDataToSend);
      toast.success('Custom project request submitted successfully!');
      setShowRequestForm(false);
      setFormData({
        projectTitle: '',
        domain: '',
        budget: '',
        deadline: '',
        techStack: [],
        features: [],
        requirements: '',
        documents: []
      });
      fetchMyRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} border rounded-2xl p-8 mb-8 bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-blue-50/50 to-indigo-50/50'}`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome, {user?.name || 'Student'}! 👋
                </span>
              </h1>
              <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Request custom-made IT projects for your college assignments and final year projects
              </p>
              <div className="flex flex-wrap gap-4">
                <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-white/80'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${textMuted} mb-1`}>Total Requests</p>
                  <p className={`text-2xl font-bold ${textClass}`}>{myRequests.length}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-white/80'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${textMuted} mb-1`}>In Progress</p>
                  <p className={`text-2xl font-bold text-blue-500`}>
                    {myRequests.filter(r => r.status === 'in-progress').length}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-white/80'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className={`text-xs ${textMuted} mb-1`}>Completed</p>
                  <p className={`text-2xl font-bold text-green-500`}>
                    {myRequests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequestForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 whitespace-nowrap"
            >
              <FiFileText size={24} />
              Request Custom Project
            </motion.button>
          </div>
        </motion.div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${cardBg} border rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Request Custom IT Project</h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Project Title * (e.g., E-Commerce Website, Student Management System)
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${inputBg} px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="Enter your project title"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Domain / Technology * (e.g., Web Development, Mobile App, AI/ML)
                  </label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${inputBg} px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="Web Development, Mobile App, AI/ML, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                      Budget (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className={`w-full ${inputBg} pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                      Deadline *
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full ${inputBg} pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Project Requirements / Description * (Detailed description of what you need)
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full ${inputBg} px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="Describe your project requirements in detail. Include features, functionality, and any specific requirements..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Tech Stack (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                      className={`flex-1 ${inputBg} px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      placeholder="React, Node.js, MongoDB..."
                    />
                    <button
                      type="button"
                      onClick={addTechStack}
                      className="px-4 py-2 bg-primary text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(index)}
                          className="hover:text-red-500"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Features (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className={`flex-1 ${inputBg} px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      placeholder="User authentication, Payment integration..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {formData.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 ml-2"
                        >
                          <FiX size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Upload Documents (IEEE Format PDF, Requirements Document, etc.) *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className={`flex-1 ${inputBg} px-4 py-3 rounded-xl border cursor-pointer flex items-center gap-2 hover:bg-opacity-80 transition`}>
                      <FiUpload />
                      <span>Choose Files (PDF, DOC, DOCX)</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.documents.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded flex items-center justify-between`}>
                          <span className="text-sm flex items-center gap-2">
                            <FiFileText />
                            {doc.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Upload your project requirements in IEEE format or any document with detailed specifications
                  </p>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSend />
                        Submit Request
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-bold rounded-xl"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* My Requests */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Project Requests</h2>
          {loading && myRequests.length === 0 ? (
            <Loader />
          ) : myRequests.length > 0 ? (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${cardBg} border rounded-xl p-6`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{request.projectTitle}</h3>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-semibold">Domain:</span> {request.domain}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FiDollarSign className="inline mr-1" />
                          Budget: ₹{request.budget?.toFixed(2) || '0.00'}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FiCalendar className="inline mr-1" />
                          Deadline: {new Date(request.deadline).toLocaleDateString()}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <FiClock className="inline mr-1" />
                          Submitted: {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(request.status)}`}>
                      {request.status || 'pending'}
                    </span>
                  </div>
                  
                  {request.requirements && (
                    <div className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-semibold">Requirements:</span> {request.requirements}
                      </p>
                    </div>
                  )}

                  {request.techStack && request.techStack.length > 0 && (
                    <div className="mb-4">
                      <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tech Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {request.techStack.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${cardBg} border rounded-xl`}>
              <FiFileText className="mx-auto mb-4 text-gray-400" size={48} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                No project requests yet. Click "Request Custom Project" to get started!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRequestForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl"
              >
                Request Custom Project
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
