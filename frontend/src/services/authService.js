import { API_URL } from "../config/api";
import axios from "axios";

export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("token", response.data.access_token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Usuario o contraseña incorrectos",
      { cause: error },
    );
  }
};
