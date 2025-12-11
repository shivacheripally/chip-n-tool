const PC_COMPONENTS = {
  gaming: {
    title: 'Gaming PC',
    description: 'High-performance PC for gaming',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    components: [
      { id: 'gpu_gaming', type: 'GPU', name: 'NVIDIA RTX 4060 Ti', spec: '8GB GDDR6', price: 35000 },
      { id: 'cpu_gaming', type: 'CPU', name: 'Intel i7-13700K', spec: '16 cores', price: 42000 },
      { id: 'ram_gaming', type: 'RAM', name: 'DDR5 32GB', spec: '6000 MHz', price: 18000 },
      { id: 'ssd_gaming', type: 'SSD', name: 'NVMe 1TB', spec: 'PCIe 4.0', price: 12000 },
      { id: 'psu_gaming', type: 'PSU', name: '850W Gold', spec: '80+ Gold', price: 8000 },
      { id: 'mobo_gaming', type: 'Motherboard', name: 'LGA1700', spec: 'DDR5 Support', price: 25000 },
    ],
  },
  office: {
    title: 'Office PC',
    description: 'Reliable PC for productivity and office work',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    components: [
      { id: 'cpu_office', type: 'CPU', name: 'Intel i5-13600K', spec: '14 cores', price: 25000 },
      { id: 'ram_office', type: 'RAM', name: 'DDR4 16GB', spec: '3200 MHz', price: 8000 },
      { id: 'ssd_office', type: 'SSD', name: 'SATA SSD 512GB', spec: 'SATA III', price: 5000 },
      { id: 'psu_office', type: 'PSU', name: '500W Bronze', spec: '80+ Bronze', price: 4000 },
      { id: 'mobo_office', type: 'Motherboard', name: 'LGA1700', spec: 'DDR4 Support', price: 12000 },
      { id: 'gpu_office', type: 'GPU', name: 'Integrated Graphics', spec: 'Intel UHD 770', price: 0 },
    ],
  },
  coding: {
    title: 'Developer PC',
    description: 'Powerful PC for software development',
    image: 'https://images.pexels.com/photos/577092/pexels-photo-577092.jpeg?auto=compress&cs=tinysrgb&w=400',
    components: [
      { id: 'cpu_coding', type: 'CPU', name: 'Ryzen 7 7700X', spec: '8 cores', price: 38000 },
      { id: 'ram_coding', type: 'RAM', name: 'DDR5 32GB', spec: '5600 MHz', price: 16000 },
      { id: 'ssd_coding', type: 'SSD', name: 'NVMe 2TB', spec: 'PCIe 4.0', price: 20000 },
      { id: 'psu_coding', type: 'PSU', name: '650W Gold', spec: '80+ Gold', price: 6000 },
      { id: 'mobo_coding', type: 'Motherboard', name: 'AM5', spec: 'DDR5 Support', price: 18000 },
      { id: 'gpu_coding', type: 'GPU', name: 'RTX 4050', spec: '6GB GDDR6', price: 22000 },
    ],
  },
  aitraining: {
    title: 'AI Training PC',
    description: 'Specialized PC for machine learning and AI',
    image: 'https://images.pexels.com/photos/373543/pharmacy-drug-researcher-pharmacy-research-373543.jpeg?auto=compress&cs=tinysrgb&w=400',
    components: [
      { id: 'gpu_ai', type: 'GPU', name: 'NVIDIA RTX 4090', spec: '24GB GDDR6X', price: 180000 },
      { id: 'cpu_ai', type: 'CPU', name: 'Threadripper 5995WX', spec: '64 cores', price: 85000 },
      { id: 'ram_ai', type: 'RAM', name: 'DDR5 128GB', spec: '5600 MHz', price: 60000 },
      { id: 'ssd_ai', type: 'SSD', name: 'NVMe 4TB', spec: 'PCIe 4.0', price: 40000 },
      { id: 'psu_ai', type: 'PSU', name: '1200W Platinum', spec: '80+ Platinum', price: 20000 },
      { id: 'mobo_ai', type: 'Motherboard', name: 'TRX50', spec: 'Multi GPU Support', price: 45000 },
    ],
  },
};

export interface PCComponent {
  id: string;
  type: 'CPU' | 'GPU' | 'RAM' | 'SSD' | 'PSU' | 'Motherboard' | 'Cooler' | 'Case';
  name: string;
  spec: string;
  price: number;
}

export interface PCBuild {
  id: string;
  title: string;
  description: string;
  image: string;
  components: PCComponent[];
  totalPrice: number;
}

export const getPCBuilds = async (usage: string): Promise<PCBuild> => {
  const buildData = PC_COMPONENTS[usage as keyof typeof PC_COMPONENTS];

  if (!buildData) {
    return PC_COMPONENTS.office as unknown as PCBuild;
  }

  const totalPrice = buildData.components.reduce((sum, comp) => sum + comp.price, 0);

  return {
    id: usage,
    title: buildData.title,
    description: buildData.description,
    image: buildData.image,
    components: buildData.components,
    totalPrice,
  };
};

export const getComponentsByType = (usage: string, type: string) => {
  const buildData = PC_COMPONENTS[usage as keyof typeof PC_COMPONENTS];
  if (!buildData) return [];
  return buildData.components.filter(comp => comp.type === type);
};

export const generateCustomPC = (selectedComponents: PCComponent[]): PCBuild => {
  const totalPrice = selectedComponents.reduce((sum, comp) => sum + comp.price, 0);

  return {
    id: `custom_${Date.now()}`,
    title: 'Custom PC Build',
    description: 'Your personalized PC configuration',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    components: selectedComponents,
    totalPrice,
  };
};
