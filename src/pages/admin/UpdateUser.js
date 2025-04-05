import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Grid,
  Fade,
  InputLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../../service/api";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "0.875rem",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
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
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    transform: "translate(14px, 10px) scale(1)",
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
      fontWeight: "bold",
    },
  },
}));

const UpdateUser = ({ open, onClose, user, onUpdateSuccess, setAlert }) => {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    email: "",
    cargoId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  const fetchCargos = async () => {
    try {
      const response = await api.get("/cargos");
      const filteredCargos = response.data.filter(
        (cargo) => cargo.nome.toLowerCase() !== "admin"
      );
      setCargos(filteredCargos);
    } catch (err) {
      setErrors({ general: "Erro ao buscar os cargos" });
      console.error("Erro ao buscar cargos:", err);
    }
  };

  useEffect(() => {
    if (open && user) {
      setFormData({
        nome: user.nome || "",
        matricula: user.matricula || "",
        email: user.email || "",
        cargoId: user.cargo_id || "",
      });
      fetchCargos();
      setSuccess(null);
      setErrors({});
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setSuccess(null);

    if (formData.cargoId === "") {
      setErrors((prev) => ({ ...prev, cargoId: "Selecione um cargo" }));
      setLoading(false);
      return;
    }

    const updatedData = {
      nome: formData.nome,
      email: formData.email,
      cargo: formData.cargoId,
    };

    try {
      const response = await api.put(`/usuario/${user.id}`, updatedData);
      setSuccess("Usuário atualizado com sucesso!");
      onUpdateSuccess(response.data);
      setAlert({
        show: true,
        message: "Usuário atualizado com sucesso!",
        type: "success",
      });
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.mensagem || "Erro ao atualizar usuário";
      console.error("Erro ao atualizar:", error.response || error);
      setErrors({ general: errorMsg });
      setAlert({
        show: true,
        message: errorMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = () =>
    isEmailValid() && formData.nome.trim() && formData.cargoId !== "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#27AE60",
          color: "#FFFFFF",
          padding: "16px 24px",
          borderBottom: "1px solid #2ECC71",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: "center", mb: 0, fontWeight: "bold" }}
        >
          Editar Usuário
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#FFFFFF" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} height={"90px"}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome Completo"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              onFocus={() => setFocusedField("nome")}
              onBlur={() => setFocusedField(null)}
              error={!!errors.nome}
              helperText={errors.nome}
              required
              variant="outlined"
              InputLabelProps={{
                shrink: focusedField === "nome" || formData.nome !== "",
                sx: {
                  color:
                    focusedField === "nome" || formData.nome !== ""
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
          </Grid>
          <Grid item xs={12} height={"90px"}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              error={!!formData.email && (!isEmailValid() || !!errors.email)}
              helperText={
                !!formData.email && !isEmailValid()
                  ? "Email inválido"
                  : errors.email || ""
              }
              required
              variant="outlined"
              InputLabelProps={{
                shrink: focusedField === "email" || formData.email !== "",
                sx: {
                  color:
                    focusedField === "email" || formData.email !== ""
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
          </Grid>
          <Grid item xs={12} height={"90px"}>
            <TextField
              fullWidth
              margin="normal"
              label="Matrícula"
              name="matricula"
              type="text"
              value={formData.matricula}
              disabled
              variant="outlined"
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "#27AE60",
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
                  "&.Mui-disabled fieldset": {
                    borderColor: "#E0E0E0",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} height={"90px"}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.cargoId}
              variant="outlined"
            >
              <InputLabel id="cargo-label" sx={{ fontSize: "0.9rem" }}>
                Cargo
              </InputLabel>
              <StyledSelect
                labelId="cargo-label"
                id="cargoId"
                name="cargoId"
                value={formData.cargoId}
                onChange={handleChange}
                required
                onFocus={() => setFocusedField("cargoId")}
                onBlur={() => setFocusedField(null)}
                MenuProps={{
                  MenuListProps: {
                    sx: { fontSize: "0.875rem" },
                  },
                }}
                InputLabelProps={{
                  shrink: focusedField === "cargoId" || formData.cargoId !== "",
                  sx: {
                    color:
                      focusedField === "cargoId" || formData.cargoId !== ""
                        ? "#27AE60"
                        : "text.secondary",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  },
                }}
                sx={{
                  height: "50px",
                  "& .MuiSelect-select": {
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "60px",
                  },
                }}
              >
                {cargos.map((cargoItem) => (
                  <MenuItem
                    key={cargoItem.id}
                    value={cargoItem.id}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {cargoItem.nome}
                  </MenuItem>
                ))}
              </StyledSelect>
              {errors.cargoId && (
                <FormHelperText sx={{ fontSize: "0.875rem" }}>
                  {errors.cargoId}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {errors.general && (
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 2, fontSize: "0.875rem" }}
          >
            {errors.general}
          </Typography>
        )}
        {success && (
          <Typography
            color="success.main"
            variant="body2"
            sx={{ mt: 2, fontSize: "0.875rem" }}
          >
            {success}
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "16px 24px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <StyledButton onClick={onClose} color="error" variant="contained">
          Cancelar
        </StyledButton>
        <StyledButton
          type="button"
          variant="contained"
          disabled={loading || !isFormValid()}
          sx={{
            bgcolor: loading || !isFormValid() ? "#E0E0E0" : "#27AE60",
            color: loading || !isFormValid() ? "#333333" : "#FFFFFF",
            "&:hover": {
              bgcolor: loading || !isFormValid() ? "#D0D0D0" : "#2ECC71",
            },
          }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Salvar"}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUser;
