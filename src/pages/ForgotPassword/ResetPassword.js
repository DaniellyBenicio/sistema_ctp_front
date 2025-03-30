import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!email) {
      setError("Email não encontrado no link.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/redefinir-senha/${token}`,
        { novaSenha, confirmarSenha },
        { params: { expires, email } }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
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
    />
  );
}
export default ResetPassword;
