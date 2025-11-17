import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { FiShield, FiLock, FiEye, FiUser, FiMail, FiArrowLeft } from 'react-icons/fi';

export default function PrivacyPolicy() {
  const { isDark } = useTheme();
  
  // SEO metadata
  useSEO({
    title: 'Privacy Policy | Infinity Web Technology - Data Protection & Privacy',
    description: 'Read Infinity Web Technology\'s Privacy Policy. Learn how we collect, use, and protect your personal information. We are committed to safeguarding your data and ensuring transparency in our data practices.',
    keywords: 'privacy policy, data protection, personal information, data privacy, GDPR, user privacy, data security, Infinity Web Technology privacy',
    url: 'https://www.infinitywebtechnology.com/privacy-policy',
    type: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy',
      description: 'Privacy Policy for Infinity Web Technology - IT Project Marketplace',
      url: 'https://www.infinitywebtechnology.com/privacy-policy',
      publisher: {
        '@type': 'Organization',
        name: 'Infinity Web Technology',
        url: 'https://infinitywebtechnology.com'
      }
    }
  });
  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  const sections = [
    {
      icon: FiShield,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you register on our platform, we collect information such as your name, email address, phone number, and billing address. This information is necessary to process your orders and provide customer support.'
        },
        {
          subtitle: 'Payment Information',
          text: 'We collect payment information through secure third-party payment processors (Stripe, Razorpay). We do not store your complete credit card details on our servers. All payment transactions are encrypted and processed securely.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our website, including pages visited, time spent on pages, browser type, device information, and IP address. This helps us improve our services and user experience.'
        },
        {
          subtitle: 'Cookies and Tracking',
          text: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings.'
        }
      ]
    },
    {
      icon: FiLock,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Order Processing',
          text: 'We use your personal information to process and fulfill your orders, send order confirmations, and provide customer support.'
        },
        {
          subtitle: 'Communication',
          text: 'We may send you transactional emails related to your orders, account updates, and important service notifications. You can opt-out of marketing communications at any time.'
        },
        {
          subtitle: 'Service Improvement',
          text: 'We analyze usage data to improve our website functionality, user experience, and develop new features that benefit our users.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may use your information to comply with legal obligations, respond to legal requests, and protect our rights and the rights of our users.'
        }
      ]
    },
    {
      icon: FiEye,
      title: 'Information Sharing and Disclosure',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We share information with trusted third-party service providers who assist us in operating our website, processing payments, delivering products, and providing customer support. These providers are contractually obligated to protect your information.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety, or that of our users.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership.'
        },
        {
          subtitle: 'With Your Consent',
          text: 'We may share your information with third parties when you explicitly consent to such sharing.'
        }
      ]
    },
    {
      icon: FiUser,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.'
        },
        {
          subtitle: 'Your Responsibility',
          text: 'You are responsible for maintaining the confidentiality of your account credentials. Please notify us immediately if you suspect any unauthorized access to your account.'
        }
      ]
    },
    {
      icon: FiMail,
      title: 'Your Rights and Choices',
      content: [
        {
          subtitle: 'Access and Update',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You can request deletion of your personal information, subject to legal and contractual obligations. We will process your request within 30 days.'
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt-out of marketing communications by clicking the unsubscribe link in our emails or by updating your preferences in your account settings.'
        },
        {
          subtitle: 'Cookie Preferences',
          text: 'You can manage cookie preferences through your browser settings. Note that disabling cookies may affect website functionality.'
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} py-8 sm:py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className={`inline-flex items-center gap-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium`}
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            <FiShield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className={`text-base sm:text-lg ${textMuted} max-w-2xl mx-auto`}>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8`}
        >
          <p className={`text-base sm:text-lg leading-relaxed ${textMuted}`}>
            At Infinity Web Technology, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className={`text-base sm:text-lg leading-relaxed ${textMuted} mt-4`}>
            By using our website, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`${cardBg} border rounded-xl sm:rounded-2xl p-6 sm:p-8`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Icon className="text-white w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>
                        {item.subtitle}
                      </h3>
                      <p className={`text-base leading-relaxed ${textMuted}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-6 sm:p-8 mt-8`}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact Us</h2>
          <p className={`text-base leading-relaxed ${textMuted} mb-4`}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <div className={`space-y-2 ${textMuted}`}>
            <p><strong className={textClass}>Email:</strong> infinitywebtechnology1@gmail.com</p>
            <p><strong className={textClass}>Website:</strong> infinitywebtechnology.com</p>
          </div>
        </motion.div>

        {/* Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-6 sm:p-8 mt-6`}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Policy Updates</h2>
          <p className={`text-base leading-relaxed ${textMuted}`}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
          </p>
        </motion.div>
      </div>
    </div>
  );
}


