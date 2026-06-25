import { createSlice } from "@reduxjs/toolkit";
const createErrorSlice = createSlice({
  name: "error",
  initialState: {
    message: null,
    type: null,
  },
  reducers: {
    clearError: (state) => {
      state.message = null;
    },
    setError: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});
export const { setError, clearError } = createErrorSlice.actions;
export default createErrorSlice.reducer;
