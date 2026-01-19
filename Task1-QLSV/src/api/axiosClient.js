import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    const res = error.response?.data;

    // validate lỗi BE trả về
    if (res?.data && typeof res.data === "object") {
      const firstError = Object.values(res.data)[0];
      alert(firstError);
    } else if (res?.message) {
      alert(res.message);
    } else {
      alert("Lỗi hệ thống");
    }

    return Promise.reject(error);
  }
);
export default axiosClient;