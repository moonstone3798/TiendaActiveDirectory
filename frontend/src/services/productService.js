import { API_URL } from "../config/api";
import axios from "axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/`, {
      headers: authHeaders(),
    });
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      error: error.response?.data?.detail || "Error al obtener los productos",
      type: "error",
    };
  }
};
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products/`, productData, {
      headers: authHeaders(),
    });
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      error: error.response?.data?.detail || "Error al crear el producto",
      type: "error",
    };
  }
};

export const uploadProductImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(
      `${API_URL}/products/upload-image/`,
      formData,
      {
        headers: authHeaders(),
      },
    );
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error uploading product image:", error);
    return {
      error:
        error.response?.data?.detail || "Error al subir la imagen del producto",
      type: "error",
    };
  }
};

export const editProduct = async (productId, productData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/products/${productId}`,
      productData,
      { headers: authHeaders() },
    );
    return { data: response.data, type: "success" };
  } catch (error) {
    console.error("Error editing product:", error);
    return {
      error: error.response?.data?.detail || "Error al editar el producto",
      type: "error",
    };
  }
};
export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_URL}/products/${productId}`, {
      headers: authHeaders(),
    });
    return { type: "success" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      error: error.response?.data?.detail || "Error al eliminar el producto",
      type: "error",
    };
  }
};
