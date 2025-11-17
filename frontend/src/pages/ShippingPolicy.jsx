import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { FiTruck, FiDownload, FiClock, FiGlobe, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export default function ShippingPolicy() {
  const { isDark } = useTheme();
  
  // SEO metadata
  useSEO({
    title: 'Shipping Policy | Infinity Web Technology - Digital Product Delivery',
    description: 'Learn about Infinity Web Technology\'s shipping and delivery policy for digital IT projects. Instant download access, delivery methods, download links, and product access information.',
    keywords: 'shipping policy, digital delivery, instant download, product delivery, download policy, digital products shipping, IT project delivery',
    url: 'https://infinitywebtechnology.com/shipping-policy',
    type: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Shipping Policy',
      description: 'Shipping and Delivery Policy for Infinity Web Technology - Digital IT Projects',
      url: 'https://infinitywebtechnology.com/shipping-policy',
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
      icon: FiDownload,
      title: 'Digital Product Delivery',
      content: [
        {
          subtitle: 'Instant Delivery',
          text: 'All products on Infinity Web Technology are digital downloads. Upon successful payment confirmation, you will receive immediate access to your purchased products through your account dashboard and via email.'
        },
        {
          subtitle: 'Delivery Method',
          text: 'Products are delivered as downloadable files including complete source code, documentation, database files, and installation guides. Download links are provided in your order confirmation email and are accessible from your account dashboard.'
        },
        {
          subtitle: 'Download Access',
          text: 'Download links are valid for 30 days from the date of purchase. We recommend downloading and securely storing your purchased files immediately after purchase. If you need to re-download after the expiration period, please contact our support team.'
        }
      ]
    },
    {
      icon: FiClock,
      title: 'Processing Time',
      content: [
        {
          subtitle: 'Order Processing',
          text: 'Orders are processed automatically upon successful payment. In most cases, you will receive access to your products within minutes of payment confirmation. During peak times or technical issues, processing may take up to 24 hours.'
        },
        {
          subtitle: 'Payment Verification',
          text: 'For certain payment methods, additional verification may be required, which could delay delivery by up to 48 hours. We will notify you via email if any verification is needed.'
        },
        {
          subtitle: 'Failed Payments',
          text: 'If payment fails or is declined, your order will not be processed and no products will be delivered. Please ensure your payment method is valid and has sufficient funds.'
        }
      ]
    },
    {
      icon: FiGlobe,
      title: 'Geographic Availability',
      content: [
        {
          subtitle: 'Worldwide Access',
          text: 'Our digital products are available for purchase and download worldwide. There are no geographic restrictions on who can purchase or download our products.'
        },
        {
          subtitle: 'Currency and Pricing',
          text: 'Prices are displayed in Indian Rupees (INR) by default. International customers may see prices converted to their local currency based on current exchange rates. Final charges are processed in INR.'
        },
        {
          subtitle: 'Regional Compliance',
          text: 'Customers are responsible for ensuring that purchased products comply with local laws and regulations in their jurisdiction. We are not responsible for any restrictions or requirements imposed by local authorities.'
        }
      ]
    },
    {
      icon: FiCheckCircle,
      title: 'Delivery Confirmation',
      content: [
        {
          subtitle: 'Order Confirmation',
          text: 'Upon successful purchase, you will receive an order confirmation email containing your order details, download links, and access instructions. Please check your spam folder if you do not receive the email within a few minutes.'
        },
        {
          subtitle: 'Account Dashboard',
          text: 'All purchased products are also accessible from your account dashboard under "My Orders" or "My Downloads" section. You can access your downloads at any time by logging into your account.'
        },
        {
          subtitle: 'Missing Downloads',
          text: 'If you do not receive your download links or encounter any issues accessing your products, please contact our support team immediately with your order number. We will resolve the issue within 24-48 hours.'
        }
      ]
    },
    {
      icon: FiTruck,
      title: 'Product Updates and Support',
      content: [
        {
          subtitle: 'Product Updates',
          text: 'When you purchase a product, you receive lifetime access to updates and bug fixes for that version. Major version upgrades may require a separate purchase, which will be offered at a discounted rate to existing customers.'
        },
        {
          subtitle: 'Technical Support',
          text: 'We provide technical support for all purchased products. Support includes assistance with installation, configuration, and troubleshooting. Support is provided via email and typically responds within 24-48 hours.'
        },
        {
          subtitle: 'Documentation',
          text: 'All products include comprehensive documentation, installation guides, and setup instructions. Documentation is provided in PDF format and is included with your download package.'
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
            <FiTruck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shipping Policy
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
            At Infinity Web Technology, we specialize in digital product delivery. Since all our products are digital downloads (source code, documentation, and related files), there is no physical shipping involved. This policy outlines how we deliver your purchased products and what you can expect.
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
          className={`${cardBg} border border-blue-500/30 bg-blue-500/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 mt-8`}
        >
          <div className="flex items-start gap-3">
            <FiCheckCircle className="text-blue-500 w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>
                Important Notes
              </h3>
              <ul className={`space-y-2 text-base leading-relaxed ${textMuted} list-disc list-inside`}>
                <li>All products are digital downloads - no physical items are shipped</li>
                <li>Download links expire after 30 days - please download and backup your files</li>
                <li>Contact support immediately if you experience any delivery issues</li>
                <li>Keep your order confirmation email for future reference</li>
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Need Help?</h2>
          <p className={`text-base leading-relaxed ${textMuted} mb-4`}>
            If you have any questions about product delivery or need assistance accessing your downloads, please contact us:
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

