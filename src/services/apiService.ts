import { Product, Category, RepairService, Review } from '../types';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, 'products');
    const querySnapshot = await getDocs(productsCollection);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });

    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return mockProducts;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', id);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by ID from Firestore:', error);
    return mockProducts.find(product => product.id === id) || null;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/data/categories.json');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data for demo purposes
    return mockCategories;
  }
};

export const fetchCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const categories = await fetchCategories();
    return categories.find(category => category.id === id) || null;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return null;
  }
};

export const fetchServices = async (): Promise<RepairService[]> => {
  try {
    const response = await fetch('/data/services.json');
    if (!response.ok) {
      throw new Error('Failed to fetch repair services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching repair services:', error);
    // Return mock data for demo purposes
    return mockServices;
  }
};

export const fetchServiceById = async (id: string): Promise<RepairService | null> => {
  try {
    const services = await fetchServices();
    return services.find(service => service.id === id) || null;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    return null;
  }
};

export const fetchReviews = async (productId: string): Promise<Review[]> => {
  try {
    const response = await fetch('/data/reviews.json');
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    const reviews = await response.json();
    return reviews.filter((review: Review) => review.product_id === productId);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return mock data for demo purposes
    return mockReviews.filter(review => review.product_id === productId);
  }
};

// Mock data for fallback/development
const mockProducts: Product[] = [
  {
    id: "prod_1",
    sku: "LP-DEL-XPS-13-I7",
    name: "Dell XPS 13 Ultrabook",
    category_id: "cat_laptops",
    brand: "Dell",
    short_description: "Premium ultrabook with 13.4-inch InfinityEdge display",
    long_description: "The Dell XPS 13 features a stunning 13.4-inch InfinityEdge display, 11th Gen Intel Core i7 processor, 16GB RAM, and 512GB SSD storage. With its compact design and long battery life, it's perfect for professionals on the go.",
    price: {
      current: 94999,
      original: 104999,
      currency: "INR"
    },
    images: [
      "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    ],
    specifications: [
      { key: "Processor", value: "Intel Core i7-1185G7" },
      { key: "RAM", value: "16GB LPDDR4x" },
      { key: "Storage", value: "512GB PCIe NVMe SSD" },
      { key: "Display", value: "13.4-inch FHD+ (1920 x 1200) InfinityEdge" },
      { key: "Graphics", value: "Intel Iris Xe Graphics" },
      { key: "Battery", value: "52WHr, up to 12 hours" },
      { key: "Operating System", value: "Windows 11 Pro" }
    ],
    stock_status: "in_stock",
    average_rating: 4.7,
    review_count: 128,
    tags: ["laptop", "ultrabook", "dell", "premium", "featured"]
  },
  {
    id: "prod_2",
    sku: "LP-LEN-THER-I5",
    name: "Lenovo ThinkPad E15",
    category_id: "cat_laptops",
    brand: "Lenovo",
    short_description: "Business laptop with exceptional performance and security features",
    long_description: "The Lenovo ThinkPad E15 is a business-class laptop featuring an Intel Core i5 processor, 8GB RAM, and 256GB SSD. Known for its reliable performance, excellent keyboard, and robust security features, it's an ideal choice for business professionals.",
    price: {
      current: 58999,
      original: 65999,
      currency: "INR"
    },
    images: [
      "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    ],
    specifications: [
      { key: "Processor", value: "Intel Core i5-1135G7" },
      { key: "RAM", value: "8GB DDR4" },
      { key: "Storage", value: "256GB SSD" },
      { key: "Display", value: "15.6-inch FHD (1920 x 1080)" },
      { key: "Graphics", value: "Intel Iris Xe Graphics" },
      { key: "Battery", value: "45WHr, up to 8 hours" },
      { key: "Operating System", value: "Windows 11 Pro" }
    ],
    stock_status: "in_stock",
    average_rating: 4.3,
    review_count: 85,
    tags: ["laptop", "business", "lenovo", "thinkpad", "featured"]
  },
  {
    id: "prod_3",
    sku: "CP-INT-I9-12900K",
    name: "Intel Core i9-12900K Processor",
    category_id: "cat_cpus",
    brand: "Intel",
    short_description: "High-performance desktop processor with 16 cores and 24 threads",
    long_description: "The Intel Core i9-12900K is a powerful desktop processor featuring 16 cores (8 Performance-cores and 8 Efficient-cores) and 24 threads. With a max turbo frequency of 5.2GHz, it delivers exceptional performance for gaming, content creation, and other demanding tasks.",
    price: {
      current: 44999,
      original: 52999,
      currency: "INR"
    },
    images: [
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    ],
    specifications: [
      { key: "Cores", value: "16 (8P+8E)" },
      { key: "Threads", value: "24" },
      { key: "Base Frequency", value: "3.2GHz (P-core), 2.4GHz (E-core)" },
      { key: "Max Turbo Frequency", value: "5.2GHz" },
      { key: "Cache", value: "30MB Intel Smart Cache" },
      { key: "TDP", value: "125W" },
      { key: "Socket", value: "LGA 1700" }
    ],
    stock_status: "in_stock",
    average_rating: 4.9,
    review_count: 73,
    tags: ["cpu", "processor", "intel", "gaming", "featured"]
  },
  {
    id: "prod_4",
    sku: "ST-SSD-1TB-SAM",
    name: "Samsung 970 EVO Plus NVMe SSD 1TB",
    category_id: "cat_storage",
    brand: "Samsung",
    short_description: "High-performance NVMe SSD for faster computing",
    long_description: "The Samsung 970 EVO Plus is a high-performance NVMe SSD that delivers exceptional speed for gaming, graphics, and data-intensive applications. With read speeds up to 3,500 MB/s and write speeds up to 3,300 MB/s, it significantly reduces load times and accelerates data transfers.",
    price: {
      current: 9999,
      original: 12999,
      currency: "INR"
    },
    images: [
      "https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
    ],
    specifications: [
      { key: "Capacity", value: "1TB" },
      { key: "Interface", value: "PCIe Gen 3.0 x4, NVMe 1.3" },
      { key: "Sequential Read", value: "Up to 3,500 MB/s" },
      { key: "Sequential Write", value: "Up to 3,300 MB/s" },
      { key: "Form Factor", value: "M.2 2280" },
      { key: "NAND Type", value: "Samsung V-NAND 3-bit MLC" },
      { key: "Warranty", value: "5 years limited" }
    ],
    stock_status: "in_stock",
    average_rating: 4.8,
    review_count: 112,
    tags: ["storage", "ssd", "nvme", "samsung", "featured"]
  }
];

const mockCategories: Category[] = [
  {
    id: "cat_laptops",
    name: "Laptops",
    slug: "laptops",
    description: "Portable computers for work and play",
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750",
    parent_id: null
  },
  {
    id: "cat_desktops",
    name: "Desktop PCs",
    slug: "desktops",
    description: "Powerful desktop computers for home and office",
    image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    parent_id: null
  },
  {
    id: "cat_cpus",
    name: "Processors",
    slug: "cpus",
    description: "CPUs for building or upgrading your PC",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    parent_id: null
  },
  {
    id: "cat_storage",
    name: "Storage",
    slug: "storage",
    description: "SSDs, HDDs, and external storage solutions",
    image: "https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    parent_id: null
  }
];

const mockServices: RepairService[] = [
  {
    id: "srv_1",
    service_name: "Laptop Screen Replacement",
    description: "Professional replacement of cracked or malfunctioning laptop screens with high-quality parts. Our technicians will carefully replace your damaged screen with a new one that matches your laptop's specifications. We use only genuine or high-quality compatible parts to ensure optimal display quality and longevity.",
    short_description: "Replace your cracked or malfunctioning laptop screen",
    base_price: 4999,
    duration_estimate: "1-2 hours",
    home_visit_available: true,
    image: "https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    popular: true
  },
  {
    id: "srv_2",
    service_name: "Virus Removal & System Protection",
    description: "Complete virus and malware removal service with installation of robust security software to protect your system from future threats. Our experts will scan your computer, remove all malicious software, and optimize your system's performance. We'll also set up reliable antivirus protection and educate you on best practices for online safety.",
    short_description: "Remove viruses and malware and secure your computer",
    base_price: 1499,
    duration_estimate: "2-3 hours",
    home_visit_available: true,
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    popular: true
  },
  {
    id: "srv_3",
    service_name: "Data Recovery",
    description: "Professional data recovery service for damaged or corrupted storage devices. Our specialists use advanced tools and techniques to recover your valuable data from failing hard drives, SSDs, memory cards, and USB drives. We prioritize the security and confidentiality of your data throughout the recovery process.",
    short_description: "Recover lost data from damaged storage devices",
    base_price: 3999,
    duration_estimate: "24-48 hours",
    home_visit_available: false,
    image: "https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    popular: true
  },
  {
    id: "srv_4",
    service_name: "PC Performance Optimization",
    description: "Comprehensive computer optimization service to significantly improve your system's speed and performance. We'll clean up unnecessary files, optimize startup programs, update drivers, check for hardware issues, and make appropriate adjustments to system settings. This service is ideal for computers that have slowed down over time.",
    short_description: "Speed up your slow computer with our optimization service",
    base_price: 1999,
    duration_estimate: "1-2 hours",
    home_visit_available: true,
    image: "https://images.pexels.com/photos/2582936/pexels-photo-2582936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    popular: true
  }
];

const mockReviews: Review[] = [
  {
    id: "rev_1",
    product_id: "prod_1",
    user_id: "user_1",
    user_name: "Rahul Sharma",
    rating: 5,
    title: "Excellent laptop for professionals",
    comment: "I've been using this laptop for three months now, and it exceeds all my expectations. The build quality is superb, performance is blazing fast, and the battery easily lasts a full workday. The display is absolutely gorgeous with vivid colors and excellent brightness. Highly recommended for professionals who need a reliable machine.",
    date: "2023-02-15",
    verified_purchase: true
  },
  {
    id: "rev_2",
    product_id: "prod_1",
    user_id: "user_2",
    user_name: "Priya Patel",
    rating: 4,
    title: "Great laptop with minor issues",
    comment: "This is an excellent laptop overall. The performance is outstanding, and the display is beautiful. My only complaint is that it tends to run a bit hot during intensive tasks, and the fan noise can be noticeable. Otherwise, it's perfect for my needs as a graphic designer.",
    date: "2023-03-20",
    verified_purchase: true
  },
  {
    id: "rev_3",
    product_id: "prod_2",
    user_id: "user_3",
    user_name: "Amit Kumar",
    rating: 5,
    title: "Best business laptop I've used",
    comment: "The ThinkPad E15 is a fantastic business laptop. The keyboard is a joy to type on, performance is snappy, and the build quality is solid. Battery life is excellent, lasting me through a full day of meetings and work. The security features give me peace of mind when handling sensitive client information.",
    date: "2023-01-10",
    verified_purchase: true
  }
];