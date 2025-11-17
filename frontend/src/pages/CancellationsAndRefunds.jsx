import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { FiRefreshCw, FiXCircle, FiClock, FiCheckCircle, FiAlertCircle, FiDollarSign, FiArrowLeft } from 'react-icons/fi';

export default function CancellationsAndRefunds() {
  const { isDark } = useTheme();
  
  // SEO metadata
  useSEO({
    title: 'Cancellations and Refunds Policy | Infinity Web Technology',
    description: 'Read Infinity Web Technology\'s Cancellations and Refunds Policy. Learn about refund eligibility, cancellation procedures, money-back guarantee, and how to request refunds for digital IT projects.',
    keywords: 'refund policy, cancellation policy, money back guarantee, return policy, refund request, digital product refunds, IT project refunds',
    url: 'https://infinitywebtechnology.com/cancellations-and-refunds',
    type: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Cancellations and Refunds Policy',
      description: 'Cancellations and Refunds Policy for Infinity Web Technology - IT Project Marketplace',
      url: 'https://infinitywebtechnology.com/cancellations-and-refunds',
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
      icon: FiRefreshCw,
      title: 'Refund Policy',
      content: [
        {
          subtitle: 'Refund Eligibility',
          text: 'We offer refunds for digital products under specific circumstances. Refunds may be requested within 7 days of purchase if: (a) the product is defective or does not match the description, (b) you are unable to download or access the product due to technical issues on our end, or (c) you accidentally purchased the wrong product and have not downloaded it.'
        },
        {
          subtitle: 'Non-Refundable Items',
          text: 'Refunds are generally not available for: (a) products that have been downloaded or accessed, (b) change of mind after successful download, (c) products purchased more than 7 days ago, (d) custom or personalized products, or (e) products purchased during special promotions or sales (unless explicitly stated otherwise).'
        },
        {
          subtitle: 'Refund Processing',
          text: 'Approved refunds will be processed within 5-10 business days to the original payment method. The time it takes for the refund to appear in your account depends on your bank or payment provider, typically 3-5 business days after processing.'
        }
      ]
    },
    {
      icon: FiXCircle,
      title: 'Cancellation Policy',
      content: [
        {
          subtitle: 'Order Cancellation',
          text: 'You may cancel an order before the product is delivered (before download links are provided). Once you have downloaded or accessed the product, cancellation is not possible. To cancel an order, contact our support team immediately with your order number.'
        },
        {
          subtitle: 'Automatic Cancellation',
          text: 'Orders with failed payments are automatically cancelled. If payment fails after multiple attempts, your order will be cancelled and you will need to place a new order with a valid payment method.'
        },
        {
          subtitle: 'Cancellation by Us',
          text: 'We reserve the right to cancel orders in cases of: (a) suspected fraud or unauthorized payment, (b) technical errors in pricing or product availability, (c) violation of our terms of service, or (d) unavailability of the product. In such cases, you will receive a full refund.'
        }
      ]
    },
    {
      icon: FiClock,
      title: 'Refund Request Process',
      content: [
        {
          subtitle: 'How to Request a Refund',
          text: 'To request a refund, contact our support team at infinitywebtechnology1@gmail.com with: (a) your order number, (b) reason for refund request, (c) proof of issue (if applicable), and (d) your account email address. We will review your request within 2-3 business days.'
        },
        {
          subtitle: 'Review Process',
          text: 'Our team will review your refund request and may ask for additional information or clarification. We aim to respond to all refund requests within 48 hours and process approved refunds within 5-10 business days.'
        },
        {
          subtitle: 'Refund Decision',
          text: 'Refund decisions are made on a case-by-case basis. If your refund is approved, you will receive confirmation via email. If denied, we will provide a clear explanation of the reason. All decisions are final unless new information is provided.'
        }
      ]
    },
    {
      icon: FiDollarSign,
      title: 'Partial Refunds',
      content: [
        {
          subtitle: 'When Partial Refunds Apply',
          text: 'In certain situations, we may offer partial refunds instead of full refunds. This may occur when: (a) you have partially used or accessed the product, (b) the issue affects only a portion of the product, or (c) there are extenuating circumstances that warrant a partial refund.'
        },
        {
          subtitle: 'Partial Refund Amount',
          text: 'The partial refund amount is determined based on the specific circumstances and the extent of the issue. We will clearly communicate the refund amount and reasoning before processing any partial refund.'
        }
      ]
    },
    {
      icon: FiCheckCircle,
      title: 'Money-Back Guarantee',
      content: [
        {
          subtitle: 'Satisfaction Guarantee',
          text: 'We stand behind the quality of our products. If you are not satisfied with your purchase and meet the refund eligibility criteria, we offer a money-back guarantee. This guarantee applies to the product quality and functionality as described.'
        },
        {
          subtitle: 'Guarantee Terms',
          text: 'The money-back guarantee is valid for 7 days from the date of purchase. To be eligible, you must not have downloaded or accessed the product files, or if accessed, you must demonstrate that the product does not match its description or is defective.'
        }
      ]
    },
    {
      icon: FiAlertCircle,
      title: 'Special Circumstances',
      content: [
        {
          subtitle: 'Technical Issues',
          text: 'If you experience technical issues preventing you from accessing or using the product, contact our support team immediately. We will work to resolve the issue. If we cannot resolve it within a reasonable time, a full refund will be provided.'
        },
        {
          subtitle: 'Duplicate Purchases',
          text: 'If you accidentally purchase the same product twice, contact us immediately. We will process a refund for the duplicate purchase, provided you have not downloaded the product from the second order.'
        },
        {
          subtitle: 'Product Not as Described',
          text: 'If the product you receive significantly differs from its description, you may be eligible for a refund. Please provide evidence of the discrepancy, and we will review your case promptly.'
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
            <FiRefreshCw className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cancellations and Refunds
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
            At Infinity Web Technology, we want you to be completely satisfied with your purchase. This policy outlines our cancellation and refund procedures for digital products. Please read this policy carefully before making a purchase.
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

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`${cardBg} border border-amber-500/30 bg-amber-500/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 mt-8`}
        >
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-amber-500 w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>
                Important Information
              </h3>
              <ul className={`space-y-2 text-base leading-relaxed ${textMuted} list-disc list-inside`}>
                <li>Refund requests must be made within 7 days of purchase</li>
                <li>Products that have been downloaded are generally not eligible for refund</li>
                <li>Refund processing takes 5-10 business days</li>
                <li>Contact support immediately if you experience any issues</li>
                <li>All refund decisions are final unless new information is provided</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`${cardBg} border rounded-xl sm:rounded-2xl p-6 sm:p-8 mt-8`}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Request a Refund</h2>
          <p className={`text-base leading-relaxed ${textMuted} mb-4`}>
            To request a refund or cancellation, please contact our support team with your order details:
          </p>
          <div className={`space-y-2 ${textMuted} mb-4`}>
            <p><strong className={textClass}>Email:</strong> infinitywebtechnology1@gmail.com</p>
            <p><strong className={textClass}>Website:</strong> infinitywebtechnology.com</p>
          </div>
          <p className={`text-sm ${textMuted}`}>
            Please include your order number, reason for refund, and any relevant details to help us process your request quickly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

