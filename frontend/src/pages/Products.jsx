// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Products = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get("/api/products").then((res) => setProducts(res.data));
//   }, []);

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Products</h2>
//       <ul>
//         {products.map((product) => (
//           <li key={product._id} className="p-2 border-b">
//             <Link to={`/products/${product._id}`} className="text-blue-500 hover:underline">
//               {product.name}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Products;


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Products = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get("/api/products").then((res) => setProducts(res.data));
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//         Robotics Products
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//           >
//             <Link to={`/products/${product._id}`}>
//               <div className="relative aspect-square">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="absolute inset-0 w-full h-full object-cover"
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4">
//                   <span className="text-black font-semibold text-lg">
//                     ${product.price}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
//                   {product.name}
//                 </h3>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">
//                     {product.category}
//                   </span>
//                   <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                     View Product
//                   </button>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Products;



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Extract unique category names
  const categories = Object.keys(productsByCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
       Explore Our Products
      </h2>

      {categories.map((category) => (
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
      ))}
    </div>
  );
};

export default Products;
