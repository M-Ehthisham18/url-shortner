import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8001"
      : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
export default axiosInstance;
