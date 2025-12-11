import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onClose: () => void;
  mobileVersion?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose, mobileVersion = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // This would typically fetch from an API, using mock data for now
  useEffect(() => {
    if (searchTerm.length > 2) {
      // Mock suggestions based on search term
      const mockSuggestions = [
        `${searchTerm} laptops`,
        `${searchTerm} accessories`,
        `Dell ${searchTerm}`,
        `HP ${searchTerm}`,
        `Repair for ${searchTerm}`
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setSearchTerm('');
    onClose();
  };

  return (
    <div className={`w-full ${mobileVersion ? '' : 'px-4'}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products, brands, or services..."
            className="w-full p-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <Search size={16} className="text-gray-400 mr-2" />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;