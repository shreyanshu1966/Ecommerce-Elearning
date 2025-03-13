import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../utils/axiosConfig'; // Replace api with axiosInstance

// Create order and get Razorpay order ID
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (shippingAddress, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/orders",
        { shippingAddress, paymentMethod: "Razorpay" }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create order");
    }
  }
);

// Verify payment after Razorpay success
export const verifyPayment = createAsyncThunk(
  "order/verifyPayment",
  async (paymentResult, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/orders/verify-payment",
        paymentResult
      );
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment verification failed");
    }
  }
);

// Get user's orders
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/orders/myorders");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Check order payment status
export const checkOrderStatus = createAsyncThunk(
  "order/checkOrderStatus",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/orders/${orderId}/status`);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to check order status");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    paymentResult: null,
    loading: false,
    success: false,
    error: null,
    paymentStatus: null,
    statusChecking: false,
    statusError: null,
    retryCount: 0,
  },
  reducers: {
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    resetOrderError: (state) => {
      state.error = null;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload;
        state.success = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check Order Status
      .addCase(checkOrderStatus.pending, (state) => {
        state.statusChecking = true;
        state.statusError = null;
      })
      .addCase(checkOrderStatus.fulfilled, (state, action) => {
        state.statusChecking = false;
        state.paymentStatus = action.payload;
      })
      .addCase(checkOrderStatus.rejected, (state, action) => {
        state.statusChecking = false;
        state.statusError = action.payload;
      });
  },
});

export const { resetOrderSuccess, resetOrderError, incrementRetryCount, resetRetryCount } = orderSlice.actions;
export default orderSlice.reducer;