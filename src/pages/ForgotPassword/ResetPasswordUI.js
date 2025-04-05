import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomAlert from "../../components/alert/CustomAlert";

const ResetPasswordUI = ({
  novaSenha,
  setNovaSenha,
  confirmarSenha,
  setConfirmarSenha,
  message,
  error,
  isSubmitting,
  handleSubmit,
  onCloseAlert,
  navigate,
}) => {
  const [focusedField, setFocusedField] = useState(null);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleToggleNovaSenha = () => setShowNovaSenha((prev) => !prev);
  const handleToggleConfirmarSenha = () =>
    setShowConfirmarSenha((prev) => !prev);

  return (
    <Box
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
            Insira sua nova senha e confirme-a para concluir o processo de
            redefinição.
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
            Redefinir Senha
          </Typography>

          {(message || error) && (
            <CustomAlert
              message={message || error}
              type={message ? "success" : "error"}
              onClose={onCloseAlert}
              sx={{ mb: 2 }}
            />
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              label="Nova Senha"
              type={showNovaSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              fullWidth
              required
              variant="outlined"
              onFocus={() => setFocusedField("novaSenha")}
              onBlur={() => setFocusedField(null)}
              InputLabelProps={{
                shrink: focusedField === "novaSenha" || novaSenha !== "",
                sx: {
                  color:
                    focusedField === "novaSenha" || novaSenha !== ""
                      ? "#27AE60"
                      : "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToggleNovaSenha}
                      edge="end"
                      sx={{ color: "#27AE60" }}
                    >
                      {showNovaSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
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
              label="Confirmar Senha"
              type={showConfirmarSenha ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              fullWidth
              required
              variant="outlined"
              onFocus={() => setFocusedField("confirmarSenha")}
              onBlur={() => setFocusedField(null)}
              InputLabelProps={{
                shrink:
                  focusedField === "confirmarSenha" || confirmarSenha !== "",
                sx: {
                  color:
                    focusedField === "confirmarSenha" || confirmarSenha !== ""
                      ? "#27AE60"
                      : "text.secondary",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToggleConfirmarSenha}
                      edge="end"
                      sx={{ color: "#27AE60" }}
                    >
                      {showConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
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
              disabled={isSubmitting || !novaSenha || !confirmarSenha}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor:
                  isSubmitting || !novaSenha || !confirmarSenha
                    ? "#E0E0E0"
                    : "#27AE60",
                color:
                  isSubmitting || !novaSenha || !confirmarSenha
                    ? "#333333"
                    : "#FFFFFF",
                "&:hover": {
                  bgcolor:
                    isSubmitting || !novaSenha || !confirmarSenha
                      ? "#D0D0D0"
                      : "#2ECC71",
                },
                borderRadius: "8px",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={25} sx={{ color: "#FFFFFF" }} />
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordUI;
