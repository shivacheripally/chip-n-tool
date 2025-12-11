import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/categories/${category.slug}`} className="block">
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden"
      >
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-medium text-gray-800">{category.name}</h3>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;