import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = "https://orgatic.in/api/";
// const API_URL = "http://localhost:5000/api/user/";





export const register = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {

    const response = await axios.post(`${API_URL}event/think-tank/register`, formData, { withCredentials: true });

    return response.data;

  } catch (err) {
    return rejectWithValue(err.response?.data || "Something went wrong");
  }
});

export const registerGroup = createAsyncThunk("auth/registerGroup", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}event/think-tank/group-register`, formData, { withCredentials: true });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Group registration failed");
  }
});



export const submitApplication = createAsyncThunk(
  "application/submit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}apply`, data, { withCredentials: true });
      return { status: response.status, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);



const initialState = {
  isAuthenticated: false,
  loading: false,
  message: null,
  bookingStatus: null,
  error: null,
  applicationStatus: null,
  errordata: null
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder





      //apply

      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.applicationStatus = null;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationStatus = action.payload.data.message; // "Application submitted successfully"
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.applicationStatus = null;
        state.error = action.payload;
      })



      .addCase(register.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // "Application submitted successfully"

      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload;
      })

      .addCase(registerGroup.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(registerGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerGroup.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload;
      })





  },
});






export default authSlice.reducer;

