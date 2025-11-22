import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiMessageCircle } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ isHomePage = false }) {
  const { isDark } = useTheme();
  
  const footerBg = isDark 
    ? (isHomePage ? 'bg-slate-900 border-t border-slate-800' : 'bg-slate-900 border-t border-slate-700')
    : (isHomePage ? 'bg-slate-900 border-t border-slate-800' : 'bg-slate-800 border-t border-slate-700');
  
  const hoverColor = isHomePage ? 'hover:text-primary-light' : 'hover:text-primary';

  return (
    <footer className={`${footerBg} mt-16 sm:mt-20 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <img 
                src="/player.svg" 
                alt="Infinity Logo - IT Project Marketplace" 
                className="w-8 h-8 sm:w-10 sm:h-10"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
              />
              <h3 className={`text-lg sm:text-xl font-bold ${isHomePage ? 'text-slate-100' : 'text-primary'}`}>
                INFINITY
              </h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              Infinity Web Technology - India's leading IT project marketplace. Browse and publish IT projects with complete source code. Trusted by 10K+ customers. 500+ verified projects in React, Python, AI/ML, Full-Stack, and MERN stack. Instant downloads. Lifetime support. All in Indian Rupees.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <a 
                href="mailto:infinitywebtechnology1@gmail.com" 
                className={`flex items-center gap-2 text-slate-400 ${hoverColor} transition-colors text-xs sm:text-sm break-all`}
              >
                <FiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">infinitywebtechnology1@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/919344736773" 
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-xs sm:text-sm`}
              >
                <FiMessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>+91 93447 36773</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link 
                  to="/products" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Browse all IT projects"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?filter=react" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="React projects"
                >
                  React Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?filter=python" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Python projects"
                >
                  Python Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?filter=ai-ml" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="AI ML projects"
                >
                  AI/ML Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?filter=full-stack" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Full stack projects"
                >
                  Full-Stack Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="About Infinity IT Project Marketplace"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Contact us"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link 
                  to="/shipping-policy" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Shipping Policy"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/cancellations-and-refunds" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Cancellations and Refunds"
                >
                  Cancellations & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  to="/#faq" 
                  className={`text-slate-400 transition-colors ${hoverColor} block`}
                  aria-label="Frequently Asked Questions"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">Follow Us</h4>
            <div className="flex gap-3 sm:gap-4">
              <a 
                href="https://www.facebook.com/infiniitywebtechnology" 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors hover:text-primary-light p-2 rounded-lg hover:bg-white/10`}
                aria-label="Follow us on Facebook"
                title="Follow us on Facebook"
              >
                <FiFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://twitter.com/infiniitywebtechnology" 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors hover:text-primary-light p-2 rounded-lg hover:bg-white/10`}
                aria-label="Follow us on Twitter"
                title="Follow us on Twitter"
              >
                <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.instagram.com/infiniitywebtechnology/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors hover:text-accent p-2 rounded-lg hover:bg-white/10`}
                title="Follow us on Instagram"
                aria-label="Follow us on Instagram"
              >
                <FiInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/infiniitywebtechnology" 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors hover:text-primary-light p-2 rounded-lg hover:bg-white/10`}
                aria-label="Follow us on LinkedIn"
                title="Follow us on LinkedIn"
              >
                <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={`border-t ${isHomePage ? 'border-slate-800' : 'border-slate-700'} pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-xs sm:text-sm`}>
          <p className="text-center sm:text-left">&copy; 2025 Infinity. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
            <Link 
              to="/privacy-policy" 
              className={`transition-colors ${hoverColor}`}
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-and-conditions" 
              className={`transition-colors ${hoverColor}`}
              aria-label="Terms and Conditions"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
