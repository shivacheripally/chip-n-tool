import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Laptop className="mr-2 text-blue-500" />
              <span className="font-bold text-xl text-white">TechHub</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Your one-stop destination for premium computer hardware and expert repair services. 
              We bring technology to your doorstep with our home visit repair options.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-blue-500 transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-blue-500 transition-colors">Repair Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-500 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-blue-500 transition-colors">Tech Blog</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/laptops" className="text-gray-400 hover:text-blue-500 transition-colors">Laptops</Link>
              </li>
              <li>
                <Link to="/categories/desktops" className="text-gray-400 hover:text-blue-500 transition-colors">Desktops</Link>
              </li>
              <li>
                <Link to="/categories/components" className="text-gray-400 hover:text-blue-500 transition-colors">Computer Components</Link>
              </li>
              <li>
                <Link to="/categories/peripherals" className="text-gray-400 hover:text-blue-500 transition-colors">Peripherals</Link>
              </li>
              <li>
                <Link to="/categories/accessories" className="text-gray-400 hover:text-blue-500 transition-colors">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <span>123 Tech Street, Electronic City, Bangalore, India - 560100</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-blue-500 mr-2 flex-shrink-0" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-blue-500 mr-2 flex-shrink-0" />
                <span>support@techhub.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-lg text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-sm text-gray-400 mb-4">Stay updated with our latest products, services, and tech tips</p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                  required
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors text-white"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 TechHub. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
              <Link to="/shipping" className="hover:text-blue-500 transition-colors">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;