import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../utils/axiosConfig';

// Utility functions to safely retrieve stored values from localStorage
const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

const getStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  return storedToken && storedToken !== "undefined" ? storedToken : null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    token: getStoredToken(),
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Store user and token in localStorage if valid
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, loginStart, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

// Thunk function for logging in
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const { data } = await axiosInstance.post("/users/login", credentials);
    
    // Ensure we have both user and token
    if (!data.token || !data.user) {
      throw new Error("Invalid response format from server");
    }
    
    dispatch(loginSuccess(data));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Thunk function for signing up
export const signupUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const { data } = await axiosInstance.post("/users/register", userData);
    
    // Ensure we have both user and token
    if (!data.token || !data.user) {
      throw new Error("Invalid response format from server");
    }
    
    dispatch(loginSuccess(data));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
