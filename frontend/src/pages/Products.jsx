import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id} className="p-2 border-b">
            <Link to={`/products/${product._id}`} className="text-blue-500 hover:underline">
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
