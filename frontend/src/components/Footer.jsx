import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';

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
            <p className="text-gray-400 text-sm mb-4">
              Premium IT projects marketplace for students and customers. Buy ready-made projects or sell your own.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:infinitywebtechnology1@gmail.com" 
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
              >
                <FiMail size={16} />
                <span>infinitywebtechnology1@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/919344736773" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm"
              >
                <FiMessageCircle size={16} />
                <span>+91 93447 36773</span>
              </a>
            </div>
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
                href="https://www.instagram.com/infiniitywebtechnology/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 transition-colors ${isHomePage ? 'hover:text-pink-400' : 'hover:text-primary'}`}
                title="Follow us on Instagram"
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
