import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig"; // Replace axios with axiosInstance

const Products = () => {
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/products"); // Remove the duplicate /api prefix
        
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API response is not an array:", data);
          setProducts([]); // Set as empty array if data is invalid
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setProducts([]); // Ensure products is always an array
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Only attempt to group products if products is an array and not empty
  const productsByCategory = Array.isArray(products) && products.length > 0 
    ? products.reduce((acc, product) => {
        const category = product.category || "Other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {})
    : {}; // Default to empty object if products is not an array

  // Extract unique category names
  const categories = Object.keys(productsByCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Explore Our Products
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products available at the moment.
        </div>
      ) : (
        // Render product categories
        categories.map((category) => (
          <div key={category} className="mb-12">
            {/* Category Title */}
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              {category}
            </h3>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsByCategory[category].map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-black font-semibold text-lg">
                          ${product.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                        {product.name}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {product.category}
                        </span>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Product
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Products;
