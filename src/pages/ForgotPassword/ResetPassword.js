import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../service/api";
import ResetPasswordUI from "./ResetPasswordUI";

function ResetPassword() {
  const { token } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const expires = queryParams.get("expires");
  const email = queryParams.get("email");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !expires || !email) {
      setError("Link de redefinição inválido ou incompleto.");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [token, expires, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Token:", token);
      console.log("Expires:", expires);
      console.log("Email (bruto):", email);
      console.log("Body:", { novaSenha, confirmarSenha });
      const response = await api.post(
        `/redefinir-senha/${token}`,
        { novaSenha, confirmarSenha },
        { params: { expires, email } }
      );
      console.log("Resposta do backend:", response.data);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro na requisição:", err.response?.data || err);
      setError(err.response?.data?.message || "Erro ao redefinir senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCloseAlert = () => {
    setMessage("");
    setError("");
  };

  return (
    <ResetPasswordUI
      novaSenha={novaSenha}
      setNovaSenha={setNovaSenha}
      confirmarSenha={confirmarSenha}
      setConfirmarSenha={setConfirmarSenha}
      message={message}
      error={error}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onCloseAlert={onCloseAlert}
      navigate={navigate}
    />
  );
}

export default ResetPassword;
