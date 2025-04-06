import React, { useState } from "react";
import {
  TextField,
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/auth";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    localStorage.removeItem("token");

    try {
      await login(email, senha);
      onLogin();
    } catch (err) {
      setError(err.message || "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
          minHeight: { xs: "auto", md: 450 },
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
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            Seja Bem-Vindo! <br /> Coordenação Técnico Pedagógica
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
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              error={!!email && !isEmailValid()}
              helperText={!!email && !isEmailValid() ? "Email inválido" : ""}
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  transition: "color 0.3s ease, transform 0.3s ease",
                },
                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "#27AE60",
                },

                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  "& input": {
                    backgroundColor: "transparent !important",
                    WebkitBoxShadow: "0 0 0 1000px transparent inset",
                    WebkitTextFillColor: "#000",
                    transition: "background-color 5000s ease-in-out 0s",
                  },
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
            <TextField
              fullWidth
              margin="normal"
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setFocusedField("senha")}
              onBlur={() => setFocusedField(null)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  transition: "color 0.3s ease, transform 0.3s ease",
                },
                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "#27AE60",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  "& input": {
                    backgroundColor: "transparent !important",
                    WebkitBoxShadow: "0 0 0 1000px transparent inset",
                    WebkitTextFillColor: "#000",
                    transition: "background-color 5000s ease-in-out 0s",
                  },
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

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{
                  mt: 1,
                  textAlign: "left",
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                }}
              >
                {error}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mt: 1,
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
                onClick={() => {
                  console.log("Navegando para /recuperar-senha");
                  navigate("/recuperar-senha");
                }}
              >
                Esqueceu a senha?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !isEmailValid() || !senha}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor:
                  loading || !isEmailValid() || !senha ? "#E0E0E0" : "#27AE60",
                color:
                  loading || !isEmailValid() || !senha ? "#333333" : "#FFFFFF",
                "&:hover": {
                  bgcolor:
                    loading || !isEmailValid() || !senha
                      ? "#D0D0D0"
                      : "#2ECC71",
                },
                borderRadius: "8px",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {loading ? <CircularProgress size={25} /> : "Entrar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
