// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: JSON.parse(localStorage.getItem("user")) || null,
//     token: localStorage.getItem("token") || null,
//   },
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//       localStorage.setItem("token", action.payload.token);
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

// // Thunk function for logging in
// export const loginUser = (credentials) => async (dispatch) => {
//   try {
//     const { data } = await axios.post("/api/users/login", credentials);
//     dispatch(loginSuccess(data));
//   } catch (error) {
//     console.error("Login failed", error);
//   }
// };

// export const signupUser = (userData) => async (dispatch) => {
//   try {
//     const { data } = await axios.post("/api/users/register", userData);
//     dispatch(loginSuccess(data)); // Automatically log in after signup
//   } catch (error) {
//     console.error("Signup failed", error);
//   }
// };


// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: JSON.parse(localStorage.getItem("user")) || null,
//     token: localStorage.getItem("token") || null,
//   },
//   reducers: {
//     loginSuccess: (state, action) => {
//       console.log("User Data on Login:", action.payload.user); // Debugging
//       state.user = action.payload.user;
//       state.token = action.payload.token;

//       // Store user and token in localStorage
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//       localStorage.setItem("token", action.payload.token);
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

// // Thunk function for logging in
// export const loginUser = (credentials) => async (dispatch) => {
//   try {
//     const { data } = await axios.post("/api/users/login", credentials);
//     console.log("User Role on Login:", data.user?.isAdmin);

//     // Ensure the backend includes 'role' in response
//     if (!data.user?.role) {
//       console.error("User role is missing in response!");
//     }

//     dispatch(loginSuccess(data));
//   } catch (error) {
//     console.error("Login failed", error);
//   }
// };

// // Thunk function for signing up
// export const signupUser = (userData) => async (dispatch) => {
//   try {
//     const { data } = await axios.post("/api/users/register", userData);
//     dispatch(loginSuccess(data)); // Automatically log in after signup
//   } catch (error) {
//     console.error("Signup failed", error);
//   }
// };


import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Utility functions to safely retrieve stored values from localStorage
const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing stored user:", error);
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
  },
  reducers: {
    loginSuccess: (state, action) => {
      console.log("User Data on Login:", action.payload.user); // Debugging
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Store user and token in localStorage if valid
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

// Thunk function for logging in
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/api/users/login", credentials);
    console.log("User Role on Login:", data.user?.isAdmin);

    // Ensure the backend includes 'role' in response
    if (!data.user?.role) {
      console.error("User role is missing in response!");
    }

    dispatch(loginSuccess(data));
  } catch (error) {
    console.error("Login failed", error);
  }
};

// Thunk function for signing up
export const signupUser = (userData) => async (dispatch) => {
  try {
    const { data } = await axios.post("/api/users/register", userData);
    // Automatically log in after signup
    dispatch(loginSuccess(data));
  } catch (error) {
    console.error("Signup failed", error);
  }
};
