import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { RepairService } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface ServiceCardProps {
  service: RepairService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/services/${service.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden h-full"
      >
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img 
            src={service.image} 
            alt={service.service_name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2">{service.service_name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.short_description}</p>
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600">
              {formatPrice(service.base_price)}
            </span>
            
            {service.home_visit_available && (
              <span className="flex items-center text-xs text-green-600">
                <Home size={14} className="mr-1" />
                Home Visit Available
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ServiceCard;