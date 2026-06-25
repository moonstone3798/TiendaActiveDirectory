import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} from "../services/productService";
import { setError } from "./errorSlice";
import { logout } from "./authSlice";

const isInvalidTokenError = (message) => {
  if (!message) {
    return false;
  }
  const normalized = String(message).toLowerCase();
  return (
    normalized.includes("not authenticated") ||
    normalized.includes("could not validate credentials") ||
    normalized.includes("token") ||
    normalized.includes("unauthorized") ||
    normalized.includes("no autorizado") ||
    normalized.includes("credenciales")
  );
};

const handleAuthError = (thunkAPI, message) => {
  if (isInvalidTokenError(message)) {
    thunkAPI.dispatch(logout());
  }
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    const response = await getProducts();
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
      return thunkAPI.rejectWithValue(response.error);
    } else {
      return response;
    }
  },
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, thunkAPI) => {
    const response = await createProduct(productData);
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
      return thunkAPI.rejectWithValue(response.error);
    } else {
      thunkAPI.dispatch(
        setError({ message: "Producto creado exitosamente", type: "success" }),
      );
      return response;
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, thunkAPI) => {
    const response = await editProduct(productId, productData);
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
      return thunkAPI.rejectWithValue(response.error);
    } else {
      thunkAPI.dispatch(
        setError({
          message: "Producto actualizado exitosamente",
          type: "success",
        }),
      );
      return response;
    }
  },
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (productId, thunkAPI) => {
    const response = await deleteProduct(productId);
    if (response?.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
      return thunkAPI.rejectWithValue(response.error);
    } else {
      thunkAPI.dispatch(
        setError({
          message: "Producto eliminado exitosamente",
          type: "success",
        }),
      );
      return productId;
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.products = [...state.products, action.payload.data];
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.data.id,
      );
      if (index !== -1) {
        state.products[index] = action.payload.data;
      }
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
    });
  },
});

export default productSlice.reducer;
