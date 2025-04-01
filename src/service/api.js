import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  async response => {
    return response;
  }, function (error){
    const { response: {data, status}} = error;
    if(status === 401) {
      window.location.href = '/login';
    }
  }
);

export default api;
