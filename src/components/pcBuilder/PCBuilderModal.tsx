import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, Zap } from 'lucide-react';
import { getPCBuilds, getComponentsByType, generateCustomPC, PCComponent, PCBuild } from '../../services/pcBuilderService';

interface PCBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const USAGE_OPTIONS = [
  { id: 'gaming', label: 'Gaming', icon: '🎮', color: 'from-red-500 to-pink-500' },
  { id: 'office', label: 'Office', icon: '💼', color: 'from-blue-500 to-cyan-500' },
  { id: 'coding', label: 'Coding', icon: '💻', color: 'from-purple-500 to-indigo-500' },
  { id: 'aitraining', label: 'AI Training', icon: '🤖', color: 'from-green-500 to-emerald-500' },
];

const PCBuilderModal: React.FC<PCBuilderModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'usage' | 'customize' | 'review'>('usage');
  const [selectedUsage, setSelectedUsage] = useState('');
  const [suggestedBuild, setSuggestedBuild] = useState<PCBuild | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<PCComponent[]>([]);
  const [finalBuild, setFinalBuild] = useState<PCBuild | null>(null);

  const handleUsageSelect = async (usage: string) => {
    setSelectedUsage(usage);
    const build = await getPCBuilds(usage);
    setSuggestedBuild(build);
    setSelectedComponents(build.components);
    setStep('customize');
  };

  const handleComponentToggle = (component: PCComponent) => {
    setSelectedComponents(prev => {
      const exists = prev.find(c => c.id === component.id);
      if (exists) {
        return prev.filter(c => c.id !== component.id);
      } else {
        return [...prev, component];
      }
    });
  };

  const handleComponentReplace = (type: string) => {
    const availableComponents = getComponentsByType(selectedUsage, type);
    setStep('customize');
  };

  const handleGenerateBuild = () => {
    if (selectedComponents.length > 0) {
      const build = generateCustomPC(selectedComponents);
      setFinalBuild(build);
      setStep('review');
    }
  };

  const handleReset = () => {
    setStep('usage');
    setSelectedUsage('');
    setSuggestedBuild(null);
    setSelectedComponents([]);
    setFinalBuild(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const getTotalPrice = () => {
    return selectedComponents.reduce((sum, comp) => sum + comp.price, 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Zap className="text-white" size={28} />
                  <h2 className="text-2xl font-bold text-white">AI PC Builder</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="p-8">
                {/* Step 1: Usage Selection */}
                {step === 'usage' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">What's your primary use?</h3>
                      <p className="text-gray-600">Select a usage category to get AI-powered recommendations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {USAGE_OPTIONS.map(option => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUsageSelect(option.id)}
                          className={`relative p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all overflow-hidden group`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                          <div className="relative flex items-center gap-4">
                            <span className="text-4xl">{option.icon}</span>
                            <div className="text-left">
                              <h4 className="font-bold text-lg text-gray-900">{option.label}</h4>
                              <p className="text-sm text-gray-600">
                                {option.id === 'gaming' && 'High performance for games'}
                                {option.id === 'office' && 'Productivity focused'}
                                {option.id === 'coding' && 'Developer optimized'}
                                {option.id === 'aitraining' && 'ML & AI workloads'}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Customize */}
                {step === 'customize' && suggestedBuild && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Customize Your Build</h3>
                      <p className="text-gray-600">Suggested components for {suggestedBuild.title}</p>
                    </div>

                    {/* Suggested Build Image */}
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <img
                        src={suggestedBuild.image}
                        alt={suggestedBuild.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-4">
                        <div>
                          <h4 className="text-xl font-bold text-white">{suggestedBuild.title}</h4>
                          <p className="text-gray-200 text-sm">{suggestedBuild.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Components Grid */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg">Components</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedBuild.components.map(component => (
                          <motion.div
                            key={component.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleComponentToggle(component)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedComponents.find(c => c.id === component.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 uppercase">{component.type}</p>
                                <p className="font-bold text-gray-900 mt-1">{component.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{component.spec}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <p className="font-bold text-blue-600">₹{component.price}</p>
                                {selectedComponents.find(c => c.id === component.id) && (
                                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700 font-medium">Total Price</p>
                        <p className="text-2xl font-bold text-blue-600">₹{getTotalPrice().toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep('usage')}
                        className="btn-standard flex-1 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleGenerateBuild}
                        disabled={selectedComponents.length === 0}
                        className="btn-standard flex-1 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center"
                      >
                        <Zap size={18} className="mr-2" />
                        Generate Build
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 'review' && finalBuild && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Your Custom PC Build</h3>
                      <p className="text-gray-600">Ready to order these components</p>
                    </div>

                    {/* Build Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-xl mb-4">{finalBuild.title}</h4>

                      <div className="space-y-3">
                        {finalBuild.components.map(component => (
                          <div key={component.id} className="flex justify-between items-center pb-3 border-b last:border-b-0 last:pb-0">
                            <div>
                              <p className="font-medium text-gray-900">{component.name}</p>
                              <p className="text-xs text-gray-600">{component.spec}</p>
                            </div>
                            <p className="font-bold text-blue-600">₹{component.price}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t-2 border-blue-200 flex justify-between items-center">
                        <p className="font-bold text-lg text-gray-900">Total Build Cost</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          ₹{finalBuild.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep('customize')}
                        className="btn-standard flex-1 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Customize More
                      </button>
                      <button
                        onClick={handleClose}
                        className="btn-standard flex-1 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Close & Shop
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PCBuilderModal;
