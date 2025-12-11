import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import PCBuilderModal from './PCBuilderModal';

const FloatingPCBuilderButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-30 btn-standard w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-2xl transition-shadow"
        aria-label="Open PC Builder"
      >
        <Zap size={24} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-24 right-8 z-30 bg-white rounded-lg shadow-lg p-3 pointer-events-none"
      >
        <p className="text-xs font-bold text-gray-900 whitespace-nowrap">Build Your PC</p>
      </motion.div>

      <PCBuilderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FloatingPCBuilderButton;
