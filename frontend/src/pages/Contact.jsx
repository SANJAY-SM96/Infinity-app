import React, { useState, useEffect, useMemo } from 'react';
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
import { useSEO } from '../hooks/useSEO';
import toast from 'react-hot-toast';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

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

  // SEO metadata
  const seoData = useMemo(() => {
    const baseUrl = 'https://infinitywebtechnology.com';
    return {
      title: 'Contact Us | Get in Touch | Infinity IT Project Marketplace',
      description: 'Contact Infinity IT Project Marketplace for custom project requests, buying projects, or any queries. Reach us via WhatsApp, email, or contact form. We serve customers across India.',
      keywords: 'contact infinity, IT project support, custom project request, buy IT projects, WhatsApp contact, project inquiry',
      image: 'https://infinitywebtechnology.com/og-image.jpg',
      url: `${baseUrl}/contact`,
      type: 'website',
      breadcrumbs: [
        { name: 'Home', url: baseUrl },
        { name: 'Contact', url: `${baseUrl}/contact` }
      ],
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Infinity IT Project Marketplace',
        description: 'Get in touch with Infinity for custom project requests, buying projects, or any queries.',
        url: `${baseUrl}/contact`,
        mainEntity: {
          '@type': 'Organization',
          name: 'Infinity Web Technology',
          email: 'infinitywebtechnology1@gmail.com',
          telephone: '+91-93447-36773',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN'
          },
          sameAs: [
            'https://www.instagram.com/infiniitywebtechnology/'
          ]
        }
      }
    };
  }, []);

  useSEO(seoData);


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
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with us for any queries or custom project requests"
    >

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* WhatsApp Chat Button */}
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(commonClasses.cardHover(isDark), 'block text-center group')}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition">
                    <FiMessageCircle className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">WhatsApp Chat</h3>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 sm:mb-4`}>
                Chat directly with our admin
              </p>
              <span className="text-green-500 font-semibold text-sm sm:text-base">Click to Chat →</span>
            </motion.a>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(commonClasses.card(isDark), 'space-y-3 sm:space-y-4')}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMail className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold mb-1 text-sm sm:text-base">Email</h4>
                  <a href={`mailto:${email}`} className={`text-xs sm:text-sm break-all ${isDark ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition`}>
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold mb-1 text-sm sm:text-base">WhatsApp</h4>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={`text-xs sm:text-sm ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition`}>
                    +91 93447 36773
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold mb-1 text-sm sm:text-base">Address</h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiClock className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold mb-1 text-sm sm:text-base">Working Hours</h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Mon - Sat: 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Form Type Selector */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveForm('general')}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
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
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeForm === 'custom-project'
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-300'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Custom Project
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveForm('buy-project')}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeForm === 'buy-project'
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                    : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-300'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Buy Project
              </motion.button>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={commonClasses.card(isDark)}
            >
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                    />
                  </div>
                  <div>
                    <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                    />
                  </div>
                </div>

                <div>
                  <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                    placeholder="+91 98765 43210"
                  />
                </div>

                {activeForm === 'general' && (
                  <>
                    <div>
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                      />
                    </div>
                    <div>
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                      />
                    </div>
                  </>
                )}

                {activeForm === 'custom-project' && (
                  <>
                    <div>
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
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
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                      <div>
                        <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                          Budget (₹) *
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                          placeholder="5000"
                        />
                      </div>
                      <div>
                        <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                          Deadline *
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          required
                          className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Project Requirements / Description *
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                        placeholder="Describe your project requirements in detail..."
                      />
                    </div>
                    <div>
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Upload Documents (IEEE Format PDF, Requirements, etc.)
                      </label>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <label className={cn(commonClasses.input(isDark), 'flex-1 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer flex items-center gap-2 hover:bg-opacity-80 transition text-xs sm:text-sm')}>
                          <FiUpload className="w-4 h-4 sm:w-5 sm:h-5" />
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
                            <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-2 sm:px-3 py-1.5 sm:py-2 rounded flex items-center justify-between`}>
                              <span className="text-xs sm:text-sm truncate flex-1 mr-2">{doc.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newDocs = formData.documents.filter((_, i) => i !== index);
                                  setFormData({ ...formData, documents: newDocs });
                                }}
                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                              >
                                <FiFileText className="w-4 h-4 sm:w-5 sm:h-5" />
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
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Project Type / Technology *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
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
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Budget Range (₹) *
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        required
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
                        placeholder="5000 - 10000"
                      />
                    </div>
                    <div>
                      <label className={cn('block text-xs sm:text-sm font-semibold mb-2', commonClasses.textBody(isDark))}>
                        Requirements / What you need *
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className={cn(commonClasses.input(isDark), 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base')}
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
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
    </PageLayout>
  );
}

