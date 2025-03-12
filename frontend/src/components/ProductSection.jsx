import React, { useEffect, useState } from "react";
import { ShoppingCart, View } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import axios from "axios";


const ProductCard = ({ product, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!product) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="group relative"
    >
      {/* Make Image Clickable */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              <Link to={`/products/${product._id}`} className="hover:text-blue-600 transition-colors">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
          </div>
          <p className="text-lg font-medium text-blue-600">₹{product.price}</p>
        </div>
        <ul className="mt-4 space-y-2">
          {product.features?.map((feature, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
              {feature}
            </li>
          ))}
        </ul>

        {/* View Details Button */}
        <Link to={`/products/${product._id}`} className="block mt-6">
          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg flex items-center justify-center group">
            <View className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data.slice(0, 6)); // Show only 6 products
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
        </motion.div>

        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
            {/* Explore More Button */}
            <div className="mt-12 text-center">
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
              >
                Explore More Products
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
