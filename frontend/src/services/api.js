import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("studyai_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async ({ fullName, email, password, studyFocus }) => {
  const response = await api.post("/auth/register", {
    fullName,
    email,
    password,
    studyFocus,
  });
  if (response.data?.token) {
    localStorage.setItem("studyai_token", response.data.token);
    localStorage.setItem("studyai_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data?.token) {
    localStorage.setItem("studyai_token", response.data.token);
    localStorage.setItem("studyai_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const googleAuthUser = async (payload) => {
  const response = await api.post("/auth/google", payload);
  if (response.data?.token) {
    localStorage.setItem("studyai_token", response.data.token);
    localStorage.setItem("studyai_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("studyai_token");
  localStorage.removeItem("studyai_user");
};

export default api;
