import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer({ isHomePage = false }) {
  return (
    <footer className={`${isHomePage ? 'bg-gray-900 border-t border-gray-800' : 'bg-dark-lighter border-t border-primary/20'} mt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${isHomePage ? 'text-white' : 'text-primary'}`}>
              ∞ INFINITY
            </h3>
            <p className="text-gray-400 text-sm">
              Premium IT products and solutions for tech enthusiasts and professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/products" 
                  className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
                >
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
              >
                <FiFacebook size={20} />
              </a>
              <a 
                href="#" 
                className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="#" 
                className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="#" 
                className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={`border-t ${isHomePage ? 'border-gray-800' : 'border-primary/20'} pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm`}>
          <p>&copy; 2025 Infinity. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className={`transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className={`transition-colors ${isHomePage ? 'hover:text-blue-400' : 'hover:text-primary'}`}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
