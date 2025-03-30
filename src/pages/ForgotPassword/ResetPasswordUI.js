import React from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
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
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#FFFFFF",
        padding: { xs: "2% 5%", sm: "2% 10%" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "500px" },
          maxWidth: "500px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: { xs: "20px", sm: "30px" },
          textAlign: "center",
          minHeight: { xs: "auto", md: "400px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mt: 1,
            mb: 3,
            fontFamily: '"Open Sans", sans-serif',
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

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nova Senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Digite a nova senha"
            fullWidth
            required
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                height: "40px",
                fontSize: "0.875rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.875rem",
                color: "#333",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#2f9e41",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2f9e41",
                },
              },
            }}
          />

          <TextField
            label="Confirmar Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirme a nova senha"
            fullWidth
            required
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                height: "40px",
                fontSize: "0.875rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.875rem",
                color: "#333",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#2f9e41",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2f9e41",
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth
            sx={{
              bgcolor: "#2f9e41",
              "&:hover": { bgcolor: "#257a33" },
              height: "34px",
              fontSize: "0.875rem",
              textTransform: "none",
              fontFamily: '"Open Sans", sans-serif',
              padding: "4px 12px",
              mb: 2,
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={16} sx={{ color: "#fff" }} />
            ) : (
              "Redefinir"
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPasswordUI;
