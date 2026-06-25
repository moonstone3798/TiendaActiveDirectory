import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMovements,
  createMovement,
  editMovement,
  deleteMovement,
  getProductsWithMoreEgress,
  getProductsWithLessEgress,
  getProductsWithLessEgressAndMoreExpensive,
} from "../services/movementService";
import { setError } from "./errorSlice";
import { logout } from "./authSlice";

const normalizeMovement = (movement) => {
  if (!movement) {
    return movement;
  }
  return {
    ...movement,
    product: movement.product || movement.title || "",
  };
};

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

export const fetchMovements = createAsyncThunk(
  "movements/fetchMovements",
  async (_, thunkAPI) => {
    const response = await getMovements();
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      return response;
    }
  },
);

export const addMovement = createAsyncThunk(
  "movements/addMovement",
  async (movementData, thunkAPI) => {
    const response = await createMovement(movementData);
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      thunkAPI.dispatch(
        setError({
          message: "Movimiento creado exitosamente",
          type: "success",
        }),
      );
      return response;
    }
  },
);
export const updateMovement = createAsyncThunk(
  "movements/updateMovement",
  async ({ movementId, movementData }, thunkAPI) => {
    const response = await editMovement(movementId, movementData);
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      thunkAPI.dispatch(
        setError({
          message: "Movimiento actualizado exitosamente",
          type: "success",
        }),
      );
      return response;
    }
  },
);
export const removeMovement = createAsyncThunk(
  "movements/removeMovement",
  async (movementId, thunkAPI) => {
    const response = await deleteMovement(movementId);
    if (response?.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      thunkAPI.dispatch(
        setError({
          message: "Movimiento eliminado exitosamente",
          type: "success",
        }),
      );
      return movementId;
    }
  },
);
export const fetchProductsWithMoreEgress = createAsyncThunk(
  "movements/fetchProductsWithMoreEgress",
  async (_, thunkAPI) => {
    const response = await getProductsWithMoreEgress();
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      return response;
    }
  },
);
export const fetchProductsWithLessEgress = createAsyncThunk(
  "movements/fetchProductsWithLessEgress",
  async (_, thunkAPI) => {
    const response = await getProductsWithLessEgress();
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      return response;
    }
  },
);
export const fetchProductsWithLessEgressAndMoreExpensive = createAsyncThunk(
  "movements/fetchProductsWithLessEgressAndMoreExpensive",
  async (_, thunkAPI) => {
    const response = await getProductsWithLessEgressAndMoreExpensive();
    if (response.error) {
      handleAuthError(thunkAPI, response.error);
      thunkAPI.dispatch(setError({ message: response.error, type: "error" }));
    } else {
      return response;
    }
  },
);

const movementSlice = createSlice({
  name: "movements",
  initialState: {
    movements: [],
    loading: false,
    loadingReports: false,
    productsWithMoreEgress: [],
    productsWithLessEgress: [],
    productsWithLessEgressAndMoreExpensive: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMovements.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMovements.fulfilled, (state, action) => {
      state.loading = false;
      state.movements = (action.payload?.data || []).map(normalizeMovement);
    });
    builder.addCase(fetchMovements.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(addMovement.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.movements = [
          normalizeMovement(action.payload.data),
          ...state.movements,
        ];
      }
    });
    builder.addCase(updateMovement.fulfilled, (state, action) => {
      if (!action.payload?.data) {
        return;
      }
      const index = state.movements.findIndex(
        (movement) => movement.id === action.payload.data.id,
      );
      if (index !== -1) {
        state.movements[index] = normalizeMovement(action.payload.data);
      }
    });
    builder.addCase(removeMovement.fulfilled, (state, action) => {
      state.movements = state.movements.filter(
        (movement) => movement.id !== action.payload,
      );
    });
    builder.addCase(fetchProductsWithMoreEgress.pending, (state) => {
      state.loadingReports = true;
    });
    builder.addCase(fetchProductsWithMoreEgress.fulfilled, (state, action) => {
      state.loadingReports = false;
      state.productsWithMoreEgress = action.payload?.data || [];
    });
    builder.addCase(fetchProductsWithMoreEgress.rejected, (state) => {
      state.loadingReports = false;
    });
    builder.addCase(fetchProductsWithLessEgress.pending, (state) => {
      state.loadingReports = true;
    });
    builder.addCase(fetchProductsWithLessEgress.fulfilled, (state, action) => {
      state.loadingReports = false;
      state.productsWithLessEgress = action.payload?.data || [];
    });
    builder.addCase(fetchProductsWithLessEgress.rejected, (state) => {
      state.loadingReports = false;
    });
    builder.addCase(
      fetchProductsWithLessEgressAndMoreExpensive.pending,
      (state) => {
        state.loadingReports = true;
      },
    );
    builder.addCase(
      fetchProductsWithLessEgressAndMoreExpensive.fulfilled,
      (state, action) => {
        state.loadingReports = false;
        state.productsWithLessEgressAndMoreExpensive =
          action.payload?.data || [];
      },
    );
    builder.addCase(
      fetchProductsWithLessEgressAndMoreExpensive.rejected,
      (state) => {
        state.loadingReports = false;
      },
    );
  },
});

export default movementSlice.reducer;
