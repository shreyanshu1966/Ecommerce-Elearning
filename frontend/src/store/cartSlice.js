import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../utils/axiosConfig'; // Replace api with axiosInstance

// Helper function to get Auth Token
export const getAuthToken = (state) => {
  const token = state?.auth?.token || localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

// Fetch Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if user is authenticated before making the request
      const isAuthenticated = Boolean(getState().auth.user && getState().auth.token);
      
      if (!isAuthenticated) {
        return { items: [], totalPrice: 0 }; // Return empty cart for unauthenticated users
      }
      
      const { data } = await axiosInstance.get("/cart"); // Remove /api prefix
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load cart");
    }
  }
);

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ itemId, itemType, quantity }, { rejectWithValue }) => {
    try {
      console.log("🔹 Sending Add to Cart Request:", { itemId, itemType, quantity });
      const { data } = await axiosInstance.post("/cart", { itemId, itemType, quantity }); // Remove /api prefix
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
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/cart/${id}`); // Remove /api prefix
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      console.log("🔹 Sending Update Request:", { id, quantity });
      const { data } = await axiosInstance.put(`/cart/${id}`, { quantity }); // Remove /api prefix
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
