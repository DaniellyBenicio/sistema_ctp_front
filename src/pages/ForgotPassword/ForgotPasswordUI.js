import React from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import CustomAlert from "../../components/alert/CustomAlert";

const ForgotPasswordUI = ({
  email,
  setEmail,
  message,
  error,
  isSubmitting,
  handleSubmit,
  onCloseAlert,
  navigateToLogin,
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
          minHeight: { xs: "auto", md: "350px" },
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
            mb: 3,
            fontFamily: '"Open Sans", sans-serif',
          }}
        >
          Recuperar Senha
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            fullWidth
            required
            variant="outlined"
            sx={{
              mb: 3,
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
              height: "40px",
              fontSize: "0.875rem",
              textTransform: "none",
              fontFamily: '"Open Sans", sans-serif',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Enviar"
            )}
          </Button>
        </form>

        <Button
          variant="text"
          onClick={navigateToLogin}
          sx={{
            mt: 2,
            color: "#2f9e41",
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": { color: "#257a33" },
          }}
        >
          Voltar ao Login
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPasswordUI;
