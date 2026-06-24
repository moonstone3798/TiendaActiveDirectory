import { API_URL } from "../config/api";
import axios from "axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getMovements = async () => {
  try {
    const response = await axios.get(`${API_URL}/movements/`, {
      headers: authHeaders(),
    });
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error fetching movements:", error);
    return {
      error: error.response?.data?.detail || "Error al obtener los movimientos",
      type: "error",
    };
  }
};
export const createMovement = async (movementData) => {
  try {
    const response = await axios.post(`${API_URL}/movements/`, movementData, {
      headers: authHeaders(),
    });
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error creating movement:", error);
    return {
      error: error.response?.data?.detail || "Error al crear el movimiento",
      type: "error",
    };
  }
};
export const editMovement = async (movementId, movementData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/movements/${movementId}`,
      movementData,
      { headers: authHeaders() },
    );
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error editing movement:", error);
    return {
      error: error.response?.data?.detail || "Error al editar el movimiento",
      type: "error",
    };
  }
};
export const deleteMovement = async (movementId) => {
  try {
    await axios.delete(`${API_URL}/movements/${movementId}`, {
      headers: authHeaders(),
    });
    return { type: "success" };
  } catch (error) {
    console.error("Error deleting movement:", error);
    return {
      error: error.response?.data?.detail || "Error al eliminar el movimiento",
      type: "error",
    };
  }
};
export const getProductsWithMoreEgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/movements/top-egress/`, {
      headers: authHeaders(),
    });
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error fetching products with more egress:", error);
    return {
      error:
        error.response?.data?.detail ||
        "Error al obtener los productos con más egresos",
      type: "error",
    };
  }
};
export const getProductsWithLessEgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/movements/less-egress/`, {
      headers: authHeaders(),
    });
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error fetching products with less egress:", error);
    return {
      error:
        error.response?.data?.detail ||
        "Error al obtener los productos con menos egresos",
      type: "error",
    };
  }
};
export const getProductsWithLessEgressAndMoreExpensive = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/movements/less-egress-and-more-expensive/`,
      { headers: authHeaders() },
    );
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error(
      "Error fetching products with less egress and more expensive:",
      error,
    );
    return {
      error:
        error.response?.data?.detail ||
        "Error al obtener los productos con menos egresos y más caros",
      type: "error",
    };
  }
};
