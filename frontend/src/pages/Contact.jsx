import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMessageCircle, 
  FiSend,
  FiMapPin,
  FiClock,
  FiFileText,
  FiUpload
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Contact() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeForm, setActiveForm] = useState('general'); // 'general', 'custom-project', 'buy-project'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
    projectType: '',
    budget: '',
    deadline: '',
    requirements: '',
    documents: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const inputBg = isDark 
    ? 'bg-gray-700/50 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, documents: [...formData.documents, ...files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In production, this would send to backend
    setTimeout(() => {
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        subject: '',
        message: '',
        projectType: '',
        budget: '',
        deadline: '',
        requirements: '',
        documents: []
      });
      setLoading(false);
    }, 1000);
  };

  const whatsappNumber = '919344736773';
  const email = 'infinitywebtechnology1@gmail.com';
  const whatsappMessage = encodeURIComponent(
    activeForm === 'custom-project' 
      ? 'Hello! I need a custom IT project for my college.'
      : activeForm === 'buy-project'
      ? 'Hello! I want to buy a complete IT project.'
      : 'Hello! I have a query about your services.'
  );

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-hidden relative py-12`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Get in touch with us for any queries or custom project requests
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* WhatsApp Chat Button */}
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`${cardBg} border rounded-2xl p-6 block text-center group`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition">
                <FiMessageCircle className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp Chat</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Chat directly with our admin
              </p>
              <span className="text-green-500 font-semibold">Click to Chat →</span>
            </motion.a>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${cardBg} border rounded-2xl p-6 space-y-4`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <a href={`mailto:${email}`} className={`text-sm ${isDark ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition`}>
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">WhatsApp</h4>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={`text-sm ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition`}>
                    +91 93447 36773
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Address</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Working Hours</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Mon - Sat: 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Form Type Selector */}
            <div className="flex gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveForm('general')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeForm === 'general'
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-300'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                General Query
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveForm('custom-project')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeForm === 'custom-project'
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-300'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Custom Project Request
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveForm('buy-project')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeForm === 'buy-project'
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-300'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Buy Whole Project
              </motion.button>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardBg} border rounded-2xl p-8`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="+91 98765 43210"
                  />
                </div>

                {activeForm === 'general' && (
                  <>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      />
                    </div>
                  </>
                )}

                {activeForm === 'custom-project' && (
                  <>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      >
                        <option value="">Select Project Type</option>
                        <option value="React Projects">React Projects</option>
                        <option value="Python Projects">Python Projects</option>
                        <option value="AI/ML Projects">AI/ML Projects</option>
                        <option value="Full-Stack Web Apps">Full-Stack Web Apps</option>
                        <option value="Final-Year Projects">Final-Year Projects</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                          Budget (₹) *
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                          placeholder="5000"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                          Deadline *
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          required
                          className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Project Requirements / Description *
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Describe your project requirements in detail..."
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Upload Documents (IEEE Format PDF, Requirements, etc.)
                      </label>
                      <div className="flex items-center gap-4">
                        <label className={`flex-1 ${inputBg} px-4 py-3 rounded-xl border cursor-pointer flex items-center gap-2 hover:bg-opacity-80 transition`}>
                          <FiUpload />
                          <span>Choose Files</span>
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
                              <span className="text-sm">{doc.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newDocs = formData.documents.filter((_, i) => i !== index);
                                  setFormData({ ...formData, documents: newDocs });
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FiFileText />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeForm === 'buy-project' && (
                  <>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Project Type / Technology *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                      >
                        <option value="">Select Project Type</option>
                        <option value="React Projects">React Projects</option>
                        <option value="Python Projects">Python Projects</option>
                        <option value="AI/ML Projects">AI/ML Projects</option>
                        <option value="Full-Stack Web Apps">Full-Stack Web Apps</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Budget Range (₹) *
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="5000 - 10000"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
                        Requirements / What you need *
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className={`w-full ${inputBg} px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Describe what kind of project you want to buy..."
                      />
                    </div>
                  </>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

