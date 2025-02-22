import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const products = [
  {
    id: 1,
    name: 'Basic Robotics Kit',
    price: '$199',
    description: 'Perfect for beginners, includes all essential components to build your first robot.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    features: ['Step-by-step guide', '10+ projects included', 'Basic sensors', 'Programming tutorials']
  },
  {
    id: 2,
    name: 'Advanced Sensor Pack',
    price: '$299',
    description: 'Expand your robot\'s capabilities with our advanced sensor package.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    features: ['Advanced sensors', 'Wireless connectivity', 'Real-time data', 'Extended range']
  },
  {
    id: 3,
    name: 'AI Development Kit',
    price: '$399',
    description: 'Everything you need to build AI-powered robotics projects.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    features: ['AI processing unit', 'Machine learning models', 'Camera module', 'Cloud integration']
  },
];

const ProductCard = ({ product, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="group relative"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              <a href="#" className="hover:text-blue-600 transition-colors">
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </a>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
          </div>
          <p className="text-lg font-medium text-blue-600">{product.price}</p>
        </div>
        <ul className="mt-4 space-y-2">
          {product.features.map((feature, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
              {feature}
            </li>
          ))}
        </ul>
        <button className="mt-6 w-full bg-blue-600 text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg flex items-center justify-center group">
          <ShoppingCart className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="md:flex md:items-center md:justify-between"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <a href="#" className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block group">
            Shop the collection
            <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1"> &rarr;</span>
          </a>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 group">
            Shop the collection
            <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;