import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import ForgotPasswordUI from "./ForgotPasswordUI";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    setIsSubmitting(true);

    try {
      const response = await api.post("/recuperar-senha", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao enviar solicitação. Verifique se o servidor está rodando."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCloseAlert = () => {
    setMessage("");
    setError("");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <ForgotPasswordUI
      email={email}
      setEmail={setEmail}
      message={message}
      error={error}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onCloseAlert={onCloseAlert}
      navigateToLogin={navigateToLogin}
    />
  );
}

export default ForgotPassword;
