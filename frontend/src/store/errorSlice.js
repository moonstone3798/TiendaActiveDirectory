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
      state.type = null;
    },
    setError: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      setTimeout(() => {
        createErrorSlice.actions.clearError();
      }, 3000);
    },
  },
});
export const { setError, clearError } = createErrorSlice.actions;
export default createErrorSlice.reducer;
