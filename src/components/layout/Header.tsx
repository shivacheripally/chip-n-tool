import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  Heart,
  Laptop,
  Cpu,
  HardDrive,
  Divide as LucideIcon,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "../ui/SearchBar";
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

interface NavLink {
  name: string;
  path: string;
  icon?: typeof LucideIcon;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const adminEmails = adminEmail.split(",");
  const isAdmin = adminEmails.includes(user?.email || "");

  const mainNavLinks: NavLink[] = [
    { name: "Laptops", path: "/categories/laptops", icon: Laptop },
    { name: "CPUs", path: "/categories/cpus", icon: Cpu },
    { name: "Storage", path: "/categories/storage", icon: HardDrive },
    { name: "Repair Services", path: "/services" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    chip
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                </div>
                <span className="text-2xl font-black text-gray-800">n</span>
                <div className="relative">
                  <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    tool
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <Link
                to="/add-products"
                className="btn-standard px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Add Product
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="btn-standard px-3 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </motion.button>

            <Link
              to="/wishlist"
              className="btn-standard px-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Heart size={20} />
            </Link>

            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="btn-standard px-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <User size={20} />
            </Link>

            <Link
              to="/cart"
              className="btn-standard relative px-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              to="/cart"
              className="btn-standard relative px-3 text-gray-700"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-standard px-3 text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 px-4 bg-white shadow-lg border-t border-gray-200 py-4 z-10"
          >
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </motion.div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <SearchBar onClose={() => {}} mobileVersion />

              {isAdmin && (
                <Link
                  to="/add-products"
                  className="flex items-center py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Product
                </Link>
              )}

              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon size={18} className="mr-2" />}
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-2">
                <Link
                  to={isAuthenticated ? "/account" : "/login"}
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  {isAuthenticated ? "My Account" : "Sign In"}
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart size={18} className="mr-2" />
                  Wishlist
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
