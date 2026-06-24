import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice.js";
import movementReducer from "./movementSlice.js";
import errorReducer from "./errorSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    movement: movementReducer,
    error: errorReducer,
  },
});
