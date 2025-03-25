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
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError("Credenciais inválidas");
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
        height: "100vh",
        width: "100vw",
        background: "#FFFFFF",
        padding: 0,
        margin: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 800,
          height: 450,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 6,
            color: "#FFFFFF",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              maxWidth: "90%",
              lineHeight: 1.4,
              fontWeight: "bold",
            }}
          >
            Seja Bem-Vindo! Coordenação Técnica Pedagógica
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1.5,
            backgroundColor: "#FFFFFF",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
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
            }}
          >
            Login
          </Typography>

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
                  fontSize: "1rem",
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

            <TextField
              fullWidth
              margin="normal"
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              variant="outlined"
              InputLabelProps={{
                shrink: focusedField === "password" || password !== "",
                sx: {
                  color:
                    focusedField === "password" || password !== ""
                      ? "#27AE60"
                      : "text.secondary",
                  fontSize: "1rem",
                },
              }}
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

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 1, textAlign: "left" }}
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
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: "#27AE60",
                  "&:hover": { textDecoration: "underline", color: "#2ECC71" },
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Esqueceu a senha?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !isEmailValid() || !password}
              onClick={() => navigate("/MainScreen")}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor:
                  loading || !isEmailValid() || !password
                    ? "#E0E0E0"
                    : "#27AE60",
                color:
                  loading || !isEmailValid() || !password
                    ? "#333333"
                    : "#FFFFFF",
                "&:hover": {
                  bgcolor:
                    loading || !isEmailValid() || !password
                      ? "#D0D0D0"
                      : "#2ECC71",
                },
                borderRadius: "8px",
                textTransform: "uppercase",
                fontWeight: "bold",
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
