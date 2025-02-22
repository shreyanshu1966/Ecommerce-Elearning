// import { useState, useEffect } from "react";
// import { Navigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { addToCart } from "../../store/cartSlice";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const { cartItems } = useSelector((state) => state.cart);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axios.get(`/api/products/${id}`);
//         setProduct(data);
//       } catch (err) {
//         setError("Failed to fetch product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!product) return; // Ensure product data exists
  
//     dispatch(addToCart({ itemId: product._id, itemType: "Product", quantity: 1 }));
//   };

//   const isInCart = cartItems.some((item) => item._id === product?._id);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
//       <img src={product.image} alt={product.name} className="w-full max-w-md mb-4" />
//       <p className="text-lg text-gray-700">{product.description}</p>
//       <p className="text-xl font-semibold mt-2">Price: ${product.price}</p>
      
//       <button
//         onClick={handleAddToCart}
//         disabled={isInCart}
//         className={`px-4 py-2 mt-4 rounded ${
//           isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
//         }`}
//       >
//         {isInCart ? "Already in Cart" : "Add to Cart"}
//       </button>
//     </div>
//   );
// };

// export default ProductDetail;


// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { addToCart } from "../../store/cartSlice";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const { cartItems } = useSelector((state) => state.cart);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axios.get(`/api/products/${id}`);
//         setProduct(data);
//       } catch (err) {
//         setError("Failed to fetch product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!product) return;
//     dispatch(addToCart({ itemId: product._id, itemType: "Product", quantity: 1 }));
//   };

//   // Check if the product is already in the cart based on its _id
//   const isInCart = cartItems.some(
//     (item) =>
//       item.itemType === "Product" &&
//       ((item.product && item.product._id === product?._id) ||
//        item.product === product?._id)
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
//       <img src={product.image} alt={product.name} className="w-full max-w-md mb-4" />
//       <p className="text-lg text-gray-700">{product.description}</p>
//       <p className="text-xl font-semibold mt-2">Price: ${product.price}</p>
//       <button
//         onClick={handleAddToCart}
//         disabled={isInCart}
//         className={`px-4 py-2 mt-4 rounded ${
//           isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
//         }`}
//       >
//         {isInCart ? "Already in Cart" : "Add to Cart"}
//       </button>
//     </div>
//   );
// };

// export default ProductDetail;



import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../../store/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // If user is not logged in, navigate to /login.
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    dispatch(addToCart({ itemId: product._id, itemType: "Product", quantity: 1 }));
  };

  // Check if the product is already in the cart based on its _id
  const isInCart = cartItems.some(
    (item) =>
      item.itemType === "Product" &&
      ((item.product && item.product._id === product?._id) ||
       item.product === product?._id)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <img src={product.image} alt={product.name} className="w-full max-w-md mb-4" />
      <p className="text-lg text-gray-700">{product.description}</p>
      <p className="text-xl font-semibold mt-2">Price: ${product.price}</p>
      <button
        onClick={handleAddToCart}
        disabled={isInCart}
        className={`px-4 py-2 mt-4 rounded ${
          isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
        }`}
      >
        {isInCart ? "Already in Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetail;

