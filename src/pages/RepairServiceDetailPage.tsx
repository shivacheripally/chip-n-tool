import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Home, Star, Calendar, Phone, Mail } from 'lucide-react';
import { RepairService } from '../types';
import { fetchServiceById } from '../services/apiService';
import { formatPrice } from '../utils/formatters';

const RepairServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<RepairService | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isHomeVisit, setIsHomeVisit] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) return;
      
      try {
        setLoading(true);
        const serviceData = await fetchServiceById(serviceId);
        if (serviceData) {
          setService(serviceData);
          setIsHomeVisit(serviceData.home_visit_available);
        }
      } catch (error) {
        console.error('Error loading service:', error);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const handleBookService = () => {
    // In a real app, this would handle the booking process
    alert('Service booking functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Link to="/services" className="text-blue-600 hover:text-blue-800">
            Browse all services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/services"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-64 bg-gray-100 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.service_name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{service.service_name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-blue-600">
                    <Clock size={18} className="mr-1" />
                    <span className="text-sm">{service.duration_estimate}</span>
                  </div>
                  
                  {service.home_visit_available && (
                    <div className="flex items-center text-green-600">
                      <Home size={18} className="mr-1" />
                      <span className="text-sm">Home Visit Available</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Service Description</h2>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">What's Included</h2>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Professional diagnosis and assessment</li>
                    <li>High-quality replacement parts (if needed)</li>
                    <li>Expert technician service</li>
                    <li>Post-service testing and quality assurance</li>
                    <li>90-day service warranty</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Why Choose Our Service?</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Certified and experienced technicians</li>
                    <li>• Transparent pricing with no hidden costs</li>
                    <li>• Quick turnaround time</li>
                    <li>• Quality guarantee on all repairs</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Starting from {formatPrice(service.base_price)}
                </h3>
                <p className="text-sm text-gray-600">
                  Final price may vary based on specific requirements
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {service.home_visit_available && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Location
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          value="home"
                          checked={isHomeVisit}
                          onChange={() => setIsHomeVisit(true)}
                          className="mr-2"
                        />
                        <span className="text-sm">Home Visit (+₹500)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          value="center"
                          checked={!isHomeVisit}
                          onChange={() => setIsHomeVisit(false)}
                          className="mr-2"
                        />
                        <span className="text-sm">Service Center</span>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select time slot</option>
                    <option value="09:00">9:00 AM - 11:00 AM</option>
                    <option value="11:00">11:00 AM - 1:00 PM</option>
                    <option value="14:00">2:00 PM - 4:00 PM</option>
                    <option value="16:00">4:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBookService}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Calendar size={18} className="mr-2" />
                Book This Service
              </motion.button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>support@techhub.in</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Customer Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          <div className="space-y-6">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">Excellent Service</span>
                </div>
                <p className="text-gray-600 mb-2">
                  The technician was very professional and fixed my laptop quickly. 
                  Great service and reasonable pricing. Highly recommended!
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Rajesh K.</span>
                  <span className="mx-2">•</span>
                  <span>2 weeks ago</span>
                  <span className="mx-2">•</span>
                  <span className="text-green-600">Verified Customer</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RepairServiceDetailPage;