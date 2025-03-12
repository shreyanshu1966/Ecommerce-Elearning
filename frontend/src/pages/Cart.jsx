// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart, removeFromCart, updateCartItem } from "../store/cartSlice";
// import { Link } from "react-router-dom";

// const Cart = () => {
//   const dispatch = useDispatch();
//   const { cartItems, totalPrice, loading, error } = useSelector((state) => state.cart);
//   const { user, token } = useSelector((state) => state.auth);

//   // If the user is not logged in, show a friendly message with a link to /login
//   if (!user) {
//     return (
//       <div className="container mx-auto p-4 text-center">
//         <h2 className="text-2xl font-semibold mb-4">You&apos;re not logged in!</h2>
//         <p className="mb-4">
//           Please{" "}
//           <Link to="/login" className="text-blue-500 hover:underline">
//             log in
//           </Link>{" "}
//           to view your shopping cart.
//         </p>
//       </div>
//     );
//   }

//   // Fetch the cart only when both user and token are available
//   useEffect(() => {
//     if (user && token) {
//       dispatch(fetchCart());
//     }
//   }, [dispatch, user, token]);

//   const handleRemove = (item) => {
//     let idToRemove;
//     if (item.itemType === "Product") {
//       idToRemove = item.product?._id || item.product;
//     } else if (item.itemType === "Course") {
//       idToRemove = item.course?._id || item.course;
//     }
//     if (!idToRemove) {
//       console.error("❌ Unknown item – Cannot remove", item);
//       return;
//     }
//     dispatch(removeFromCart(idToRemove));
//   };

//   const handleQuantityChange = (item, newQuantity) => {
//     let idToUpdate;
//     if (item.itemType === "Product") {
//       idToUpdate = item.product?._id || item.product;
//     } else if (item.itemType === "Course") {
//       idToUpdate = item.course?._id || item.course;
//     }
//     if (!idToUpdate) {
//       console.error("❌ Unknown item – Cannot update quantity", item);
//       return;
//     }
//     dispatch(updateCartItem({ id: idToUpdate, quantity: newQuantity }));
//   };

//   useEffect(() => {
//     console.log("🛒 Debug Cart Items:", cartItems);
//   }, [cartItems]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
//       {loading ? (
//         <p>Loading cart...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : cartItems.length === 0 ? (
//         <p>
//           Your cart is empty. <Link to="/">Continue shopping</Link>
//         </p>
//       ) : (
//         <div className="bg-white shadow-md rounded-lg p-4">
//           {cartItems.map((item) => (
//             <div key={item._id} className="flex justify-between items-center border-b py-2">
//               <div>
//                 <p className="font-semibold">
//                   {item.itemType === "Product"
//                     ? item.product?.name || "Unknown Product"
//                     : item.itemType === "Course"
//                     ? item.course?.title || "Unknown Course"
//                     : "Unknown Item"}
//                 </p>
//                 <p>${item.price ? item.price.toFixed(2) : "0.00"}</p>
//               </div>
//               <div className="flex items-center">
//                 <button
//                   onClick={() => handleQuantityChange(item, item.quantity - 1)}
//                   className="px-2 bg-gray-200 rounded"
//                   disabled={item.quantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span className="mx-2">{item.quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(item, item.quantity + 1)}
//                   className="px-2 bg-gray-200 rounded"
//                 >
//                   +
//                 </button>
//                 <button
//                   onClick={() => handleRemove(item)}
//                   className="ml-4 text-red-500"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className="text-right mt-4">
//             <p className="text-lg font-semibold">
//               Total: ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
//             </p>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
//               Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateCartItem } from "../store/cartSlice";
import { Link } from "react-router-dom";
import { X, LogIn } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice, loading, error } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <LogIn className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Cart</h2>
            <p className="text-gray-600 mb-8">
              Sign in to view your saved items and start learning
            </p>
            <Link
              to="/login"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user && token) {
      dispatch(fetchCart());
    }
  }, [dispatch, user, token]);

  const handleRemove = (item) => {
    let idToRemove;
    if (item.itemType === "Product") {
      idToRemove = item.product?._id || item.product;
    } else if (item.itemType === "Course") {
      idToRemove = item.course?._id || item.course;
    }
    if (!idToRemove) {
      console.error("❌ Unknown item – Cannot remove", item);
      return;
    }
    dispatch(removeFromCart(idToRemove));
  };

  const handleQuantityChange = (item, newQuantity) => {
    let idToUpdate;
    if (item.itemType === "Product") {
      idToUpdate = item.product?._id || item.product;
    } else if (item.itemType === "Course") {
      idToUpdate = item.course?._id || item.course;
    }
    if (!idToUpdate) {
      console.error("❌ Unknown item – Cannot update quantity", item);
      return;
    }
    dispatch(updateCartItem({ id: idToUpdate, quantity: newQuantity }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Learning Cart</h2>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-blue-100 text-blue-600 hover:bg-blue-200 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Explore Courses & Products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {cartItems.map((item) => (
            <div key={item._id} className="border-b last:border-0 p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.itemType === "Product"
                      ? item.product?.name || "Unknown Product"
                      : item.itemType === "Course"
                      ? item.course?.title || "Unknown Course"
                      : "Unknown Item"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.itemType} • ${item.price?.toFixed(2) || "0.00"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg bg-white">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className={`px-3 py-1 text-gray-600 hover:bg-gray-100 ${
                        item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-gray-800 w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Total ({cartItems.length} items)</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${totalPrice?.toFixed(2) || "0.00"}
                </p>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;