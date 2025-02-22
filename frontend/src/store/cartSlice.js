// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Get user from localStorage if exists
// const userInfoFromStorage = localStorage.getItem("userInfo")
//   ? JSON.parse(localStorage.getItem("userInfo"))
//   : null;

// const authSlice = createSlice({
//   name: "auth",
//   initialState: { user: userInfoFromStorage },
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload;
//       localStorage.setItem("userInfo", JSON.stringify(action.payload));
//       console.log("User logged in successfully:", action.payload);

//       if (!action.payload.token) {
//         console.error("Login response is missing token!");
//       }
//     },
//     logout: (state) => {
//       state.user = null;
//       localStorage.removeItem("userInfo");
//       console.log("User logged out");
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;

// // Helper function to get Auth Token
// export const getAuthToken = (state) => {
//   console.log("Redux State in getAuthToken:", state); // Debugging

//   // Directly fetch the token from state.auth
//   const token = state?.auth?.token;

//   if (!token) {
//     console.error("No Auth Token Found. User might be logged out.");
//     return null;
//   }

//   console.log("Auth Token Sent:", token);
//   return `Bearer ${token}`;
// };

// // Fetch Cart Items
// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getAuthToken(getState());

//       if (!token) return rejectWithValue("User not authenticated");

//       const { data } = await axios.get("/api/cart", {
//         headers: { Authorization: token },
//       });

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to load cart");
//     }
//   }
// );




// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async ({ itemId, itemType, quantity }, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token; // Get auth token
//       console.log("🔹 Sending Add to Cart Request:", { itemId, itemType, quantity });

//       const response = await fetch("http://localhost:5000/api/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ itemId, itemType, quantity }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         console.error("❌ Add to Cart Failed:", data);
//         return rejectWithValue(data);
//       }

//       console.log("✅ Add to Cart Success:", data);
//       return data;
//     } catch (error) {
//       console.error("⚠️ Error in addToCart:", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Remove from Cart
// export const removeFromCart = createAsyncThunk(
//   "cart/removeFromCart",
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("User not authenticated");

//       const { data } = await axios.delete(`/api/cart/${id}`, {
//         headers: { Authorization: token },
//       });

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to remove item");
//     }
//   }
// );




// export const updateCartItem = createAsyncThunk(
//   "cart/updateCartItem",
//   async ({ id, quantity }, { getState, rejectWithValue }) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("User not authenticated");

//       console.log("🔹 Sending Update Request:", { id, quantity });

//       const response = await axios.put(
//         `http://localhost:5000/api/cart/${id}`,
//         { quantity },
//         { headers: { Authorization: token } }
//       );

//       console.log("✅ Cart Item Updated Successfully:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Failed to Update Cart:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to update cart item");
//     }
//   }
// );


// // Save Cart to Local Storage
// const saveCartToStorage = (cart) => {
//   localStorage.setItem("cart", JSON.stringify(cart));
// };

// // Cart Slice
// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     cartItems: [],
//     totalPrice: 0,
//     loading: false,
//     error: null,
//   },
//   reducers: {},

//   extraReducers: (builder) => {
//     builder
//       // Fetch Cart
//       .addCase(fetchCart.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.cartItems = action.payload.items;
//         state.totalPrice = action.payload.totalPrice;
//         state.loading = false;
//         saveCartToStorage(state.cartItems);
//       })
//       .addCase(fetchCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Add to Cart
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.cartItems = action.payload.items;
//         state.totalPrice = action.payload.totalPrice;
//         saveCartToStorage(state.cartItems);
//       })
//       .addCase(addToCart.rejected, (state, action) => {
//         state.error = action.payload;
//       })

//       // Remove from Cart
//       .addCase(removeFromCart.fulfilled, (state, action) => {
//         state.cartItems = action.payload.items;
//         state.totalPrice = action.payload.totalPrice;
//         saveCartToStorage(state.cartItems);
//       })
//       .addCase(removeFromCart.rejected, (state, action) => {
//         state.error = action.payload;
//       })

     
//       .addCase(updateCartItem.fulfilled, (state, action) => {
//         const updatedCart = action.payload;
      
//         // Ensure both products and courses objects are preserved after update
//         updatedCart.items = updatedCart.items.map((updatedItem) => {
//           const existingItem = state.cartItems.find(
//             (item) =>
//               (item.product?._id && item.product._id === updatedItem.product) ||
//               (item.product && item.product === updatedItem.product) ||
//               (item.course?._id && item.course._id === updatedItem.course) ||
//               (item.course && item.course === updatedItem.course)
//           );
      
//           return {
//             ...updatedItem,
//             product: existingItem?.product || updatedItem.product,
//             course: existingItem?.course || updatedItem.course,
//           };
//         });
      
//         state.cartItems = updatedCart.items;
//         state.totalPrice = updatedCart.totalPrice;
//       })
      
//       .addCase(updateCartItem.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export default cartSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get user from localStorage if exists
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: { user: userInfoFromStorage },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      console.log("User logged in successfully:", action.payload);
      if (!action.payload.token) {
        console.error("Login response is missing token!");
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
      console.log("User logged out");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

// Helper function to get Auth Token
export const getAuthToken = (state) => {
  console.log("Redux State in getAuthToken:", state);
  const token = state?.auth?.token;
  if (!token) {
    console.error("No Auth Token Found. User might be logged out.");
    return null;
  }
  console.log("Auth Token Sent:", token);
  return `Bearer ${token}`;
};

// Fetch Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("User not authenticated");
      const { data } = await axios.get("/api/cart", {
        headers: { Authorization: token },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load cart");
    }
  }
);

// Add to Cart (using axios)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ itemId, itemType, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("User not authenticated");

      console.log("🔹 Sending Add to Cart Request:", { itemId, itemType, quantity });
      const { data } = await axios.post(
        "/api/cart",
        { itemId, itemType, quantity },
        { headers: { Authorization: token } }
      );
      console.log("✅ Add to Cart Success:", data);
      return data;
    } catch (error) {
      console.error("⚠️ Error in addToCart:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("User not authenticated");
      const { data } = await axios.delete(`/api/cart/${id}`, {
        headers: { Authorization: token },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("User not authenticated");

      console.log("🔹 Sending Update Request:", { id, quantity });
      const { data } = await axios.put(
        `/api/cart/${id}`,
        { quantity },
        { headers: { Authorization: token } }
      );
      console.log("✅ Cart Item Updated Successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Failed to Update Cart:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item");
    }
  }
);

// Save Cart to Local Storage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.loading = false;
        saveCartToStorage(state.cartItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        saveCartToStorage(state.cartItems);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        saveCartToStorage(state.cartItems);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedCart = action.payload;
        // Ensure both product and course objects are preserved after update
        updatedCart.items = updatedCart.items.map((updatedItem) => {
          const existingItem = state.cartItems.find(
            (item) =>
              (item.product?._id && item.product._id === updatedItem.product) ||
              (item.product && item.product === updatedItem.product) ||
              (item.course?._id && item.course._id === updatedItem.course) ||
              (item.course && item.course === updatedItem.course)
          );
          return {
            ...updatedItem,
            product: existingItem?.product || updatedItem.product,
            course: existingItem?.course || updatedItem.course,
          };
        });
        state.cartItems = updatedCart.items;
        state.totalPrice = updatedCart.totalPrice;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
