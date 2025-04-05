import React, { useState } from "react";
import {
  TextField,
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/recuperar-senha", { email });
      setMessage(
        "Email de recuperação enviado com sucesso! Por favor, verifique sua caixa de entrada."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao enviar a solicitação de redefinição de senha. Por favor, verifique o email inserido."
      );
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCloseAlert = () => {
    setMessage("");
    setError("");
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "#FFFFFF",
        padding: 0,
        margin: 0,
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "85%", sm: "75%", md: "100%" },
          maxWidth: { xs: "100%", sm: 600, md: 800 },
          minHeight: { xs: "auto", md: 400 },
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          margin: { xs: "0 auto", sm: "0 auto" },
        }}
      >
        <Box
          sx={{
            flex: { xs: "none", md: 1 },
            background: "linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 3, md: 6 },
            color: "#FFFFFF",
            width: { xs: "100%", md: "auto" },
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              maxWidth: "90%",
              lineHeight: 1.4,
              fontWeight: "bold",
              fontSize: { xs: "1.25rem", md: "1.3rem" },
            }}
          >
            Esqueceu sua senha? <br /> Digite seu email para recuperá-la.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: { xs: "none", md: 1.5 },
            backgroundColor: "#FFFFFF",
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: { xs: "100%", md: "auto" },
            boxSizing: "border-box",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#000000",
              fontSize: { xs: "1.5rem", md: "1.75rem" },
            }}
          >
            Recuperar Senha
          </Typography>

          {(message || error) && (
            <CustomAlert
              message={message || error}
              type={message ? "success" : "error"}
              onClose={handleCloseAlert}
              sx={{ mb: 2 }}
            />
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              error={!!email && !isEmailValid()}
              helperText={!!email && !isEmailValid() ? "Email inválido" : ""}
              variant="outlined"
              InputLabelProps={{
                shrink: focusedField === "email" || email !== "",
                sx: {
                  color:
                    focusedField === "email" || email !== ""
                      ? "#27AE60"
                      : "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#27AE60",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#27AE60",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !isEmailValid()}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor: loading || !isEmailValid() ? "#E0E0E0" : "#27AE60",
                color: loading || !isEmailValid() ? "#333333" : "#FFFFFF",
                "&:hover": {
                  bgcolor: loading || !isEmailValid() ? "#D0D0D0" : "#2ECC71",
                },
                borderRadius: "8px",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {loading ? (
                <CircularProgress size={25} />
              ) : (
                "Enviar Email de Recuperação"
              )}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="button"
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  color: "#27AE60",
                  "&:hover": { textDecoration: "underline", color: "#2ECC71" },
                }}
                onClick={() => navigate("/login")}
              >
                Voltar ao Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
