import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.response.use(
  (response) => response.data.data, 
  (error) => {
    const message = error.response?.data?.message || "Lỗi hệ thống";
    alert(message); 
    return Promise.reject(error);
  }
);
export default axiosClient;