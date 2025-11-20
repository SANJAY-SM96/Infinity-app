import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { FiFileText, FiShield, FiShoppingBag, FiCreditCard, FiUser, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

export default function TermsAndConditions() {
  const { isDark } = useTheme();
  
  // SEO metadata
  useSEO({
    title: 'Terms and Conditions | Infinity Web Technology - User Agreement',
    description: 'Read Infinity Web Technology\'s Terms and Conditions. Understand your rights and responsibilities when using our IT project marketplace. Learn about product licenses, payment terms, and user obligations.',
    keywords: 'terms and conditions, user agreement, terms of service, legal terms, Infinity Web Technology terms, IT project marketplace terms',
    url: 'https://infinitywebtechnology.com/terms-and-conditions',
    type: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms and Conditions',
      description: 'Terms and Conditions for Infinity Web Technology - IT Project Marketplace',
      url: 'https://infinitywebtechnology.com/terms-and-conditions',
      publisher: {
        '@type': 'Organization',
        name: 'Infinity Web Technology',
        url: 'https://infinitywebtechnology.com'
      }
    }
  });
  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  const sections = [
    {
      icon: FiFileText,
      title: 'Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing and using the Infinity Web Technology website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify, update, or change these Terms and Conditions at any time. Continued use of our services after such modifications constitutes acceptance of the updated terms. We recommend reviewing these terms periodically.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old or have parental consent to use our services. By using our platform, you represent and warrant that you meet the age requirement and have the legal capacity to enter into these terms.'
        }
      ]
    },
    {
      icon: FiShoppingBag,
      title: 'Products and Services',
      content: [
        {
          subtitle: 'Product Availability',
          text: 'We strive to maintain accurate product listings and availability. However, we reserve the right to modify, discontinue, or limit the availability of any product at any time without prior notice. Prices are subject to change without notice.'
        },
        {
          subtitle: 'Digital Products',
          text: 'All IT projects sold on our platform are digital products delivered via download links. Upon successful payment, you will receive immediate access to the complete source code, documentation, and database files. Downloads are available for a limited time period as specified in your order confirmation.'
        },
        {
          subtitle: 'Product Quality',
          text: 'We ensure that all products meet our quality standards. However, we do not guarantee that products will meet your specific requirements or be error-free. We provide support and updates as outlined in our support policy.'
        },
        {
          subtitle: 'License and Usage Rights',
          text: 'Upon purchase, you receive a non-exclusive, non-transferable license to use the purchased project for personal, educational, or commercial purposes. You may not redistribute, resell, or claim ownership of the source code without our written permission.'
        }
      ]
    },
    {
      icon: FiCreditCard,
      title: 'Payment and Pricing',
      content: [
        {
          subtitle: 'Payment Methods',
          text: 'We accept various payment methods including credit cards, debit cards, UPI, net banking, and digital wallets through secure payment gateways. All payments are processed securely by third-party payment processors.'
        },
        {
          subtitle: 'Pricing',
          text: 'All prices are displayed in Indian Rupees (INR) unless otherwise stated. Prices include applicable taxes. We reserve the right to change prices at any time, but price changes will not affect orders already placed.'
        },
        {
          subtitle: 'Payment Processing',
          text: 'Payment must be completed before product delivery. In case of payment failure, your order will not be processed. We are not responsible for any additional charges imposed by your bank or payment provider.'
        },
        {
          subtitle: 'Refunds',
          text: 'Refund policies are outlined in our Cancellations and Refunds policy. Please review that policy for detailed information about refund eligibility and procedures.'
        }
      ]
    },
    {
      icon: FiUser,
      title: 'User Accounts and Responsibilities',
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To purchase products, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
        },
        {
          subtitle: 'Account Security',
          text: 'You must immediately notify us of any unauthorized use of your account or any breach of security. We are not liable for any loss or damage arising from your failure to protect your account information.'
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You agree not to: (a) use our services for any illegal purpose, (b) attempt to gain unauthorized access to our systems, (c) interfere with or disrupt our services, (d) copy, modify, or distribute our content without permission, (e) use automated systems to access our website, or (f) engage in any activity that violates these terms.'
        }
      ]
    },
    {
      icon: FiShield,
      title: 'Intellectual Property',
      content: [
        {
          subtitle: 'Our Intellectual Property',
          text: 'All content on our website, including but not limited to text, graphics, logos, images, software, and code, is the property of Infinity Web Technology or its licensors and is protected by copyright, trademark, and other intellectual property laws.'
        },
        {
          subtitle: 'User-Generated Content',
          text: 'If you submit content to our platform (reviews, comments, project submissions), you grant us a non-exclusive, royalty-free, perpetual license to use, modify, and display such content for our business purposes.'
        },
        {
          subtitle: 'Trademarks',
          text: 'The Infinity Web Technology name, logo, and related marks are trademarks of Infinity Web Technology. You may not use our trademarks without our prior written consent.'
        }
      ]
    },
    {
      icon: FiAlertCircle,
      title: 'Limitation of Liability',
      content: [
        {
          subtitle: 'Disclaimer of Warranties',
          text: 'Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.'
        },
        {
          subtitle: 'Limitation of Liability',
          text: 'To the maximum extent permitted by law, Infinity Web Technology shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.'
        },
        {
          subtitle: 'Maximum Liability',
          text: 'Our total liability for any claims arising from your use of our services shall not exceed the amount you paid to us in the 12 months preceding the claim.'
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
            <FiFileText className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Terms and Conditions
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
            Welcome to Infinity Web Technology. These Terms and Conditions govern your use of our website and services. Please read these terms carefully before using our platform. By accessing or using our services, you agree to be bound by these terms.
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
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className={`space-y-2 ${textMuted}`}>
            <p><strong className={textClass}>Email:</strong> infinitywebtechnology1@gmail.com</p>
            <p><strong className={textClass}>Website:</strong> infinitywebtechnology.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

