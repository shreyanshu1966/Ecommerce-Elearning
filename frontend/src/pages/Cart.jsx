
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart, removeFromCart, updateCartItem } from "../store/cartSlice";
// import { Link } from "react-router-dom";

// const Cart = () => {
//   const dispatch = useDispatch();
//   const { cartItems, totalPrice, loading, error } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.auth);



//   useEffect(() => {
//     if (user) dispatch(fetchCart());
//   }, [dispatch, user]);

//   const handleRemove = (item) => {
//     // Determine which ID to use based on itemType
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
//     // Determine which ID to use based on itemType
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
//         <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
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



// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart, removeFromCart, updateCartItem } from "../store/cartSlice";
// import { Link } from "react-router-dom";

// const Cart = () => {
//   const dispatch = useDispatch();
//   const { cartItems, totalPrice, loading, error } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.auth);

//   // If the user is not logged in, show a friendly message with a link to /login
//   if (!user) {
//     return (
//       <div className="container mx-auto p-4 text-center">
//         <h2 className="text-2xl font-semibold mb-4">You're not logged in!</h2>
//         <p className="mb-4">
//           Please <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to view your shopping cart.
//         </p>
//       </div>
//     );
//   }
  

//   // Fetch the cart if the user is logged in
//   useEffect(() => {
//     if (user) dispatch(fetchCart());
//   }, [dispatch, user]);

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

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice, loading, error } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);

  // If the user is not logged in, show a friendly message with a link to /login
  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">You're not logged in!</h2>
        <p className="mb-4">
          Please{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            log in
          </Link>{" "}
          to view your shopping cart.
        </p>
      </div>
    );
  }

  // Fetch the cart only when both user and token are available
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

  useEffect(() => {
    console.log("🛒 Debug Cart Items:", cartItems);
  }, [cartItems]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {loading ? (
        <p>Loading cart...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">
                  {item.itemType === "Product"
                    ? item.product?.name || "Unknown Product"
                    : item.itemType === "Course"
                    ? item.course?.title || "Unknown Course"
                    : "Unknown Item"}
                </p>
                <p>${item.price ? item.price.toFixed(2) : "0.00"}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  className="px-2 bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  className="ml-4 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4">
            <p className="text-lg font-semibold">
              Total: ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
