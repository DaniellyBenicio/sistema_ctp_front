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
  (response) => response,
  (error) => {
    if (error.response) {
      // Resposta do servidor (ex.: 401)
      if (error.response.status === 401) {
        const event = new CustomEvent("sessionExpired", {
          detail: {
            message:
              "Sua sessão expirou por questões de segurança. Faça login novamente.",
            type: "error",
            position: "top",
          },
        });
        window.dispatchEvent(event);

        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }, 3000);
      }
    } else if (!error.response && error.request) {
      // Erro de rede (servidor offline)
      const event = new CustomEvent("sessionExpired", {
        detail: {
          message:
            "Servidor indisponível. Você será redirecionado para o login.",
          type: "error",
          position: "top",
        },
      });
      window.dispatchEvent(event);

      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 3000);
    }
    return Promise.reject(error);
  }
);

export default api;
