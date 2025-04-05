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
  InputAdornment,
} from "@mui/material";
import {
  Close,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../../service/api";

const INSTITUTIONAL_COLOR = "#307c34";
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#27AE60" },
    "&.Mui-focused fieldset": { borderColor: "#27AE60" },
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

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#27AE60" },
    "&.Mui-focused fieldset": { borderColor: "#27AE60" },
  },
});

const UserFormDialog = ({
  open,
  onClose,
  user,
  onSave,
  onUpdate,
  isUpdate = false,
  setAlert,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    email: "",
    senha: "",
    cargo: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchCargos = async () => {
    try {
      const response = await api.get("/cargos");
      const filteredCargos = response.data.filter(
        (cargo) => cargo.nome.toLowerCase() !== "admin"
      );
      setCargos(filteredCargos);
    } catch (err) {
      console.error("Erro ao buscar cargos:", err);
      setErrors({ general: "Erro ao buscar os cargos" });
    }
  };

  useEffect(() => {
    if (open) {
      fetchCargos();
      if (user) {
        setFormData({
          nome: user.nome || "",
          matricula: user.matricula ? String(user.matricula) : "",
          email: user.email || "",
          senha: "",
          cargo: user.cargo_id || user.cargo || "",
        });
      } else {
        setFormData({
          nome: "",
          matricula: "",
          email: "",
          senha: "",
          cargo: "",
        });
      }
      setErrors({});
      setSuccess(null);
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "matricula") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setSuccess(null);

    if (formData.cargo === "") {
      setErrors({ cargo: "Selecione um cargo" });
      setLoading(false);
      return;
    }

    const matriculaNum = Number(formData.matricula);
    if (isNaN(matriculaNum) || formData.matricula.length < 6) {
      setErrors({
        matricula: "A matrícula deve ser um número com no mínimo 6 dígitos",
      });
      setLoading(false);
      return;
    }

    const apiData = isUpdate
      ? {
          nome: formData.nome,
          email: formData.email,
          cargo: formData.cargo,
        }
      : {
          nome: formData.nome,
          matricula: matriculaNum,
          email: formData.email,
          senha: formData.senha,
          cargo: formData.cargo,
        };

    try {
      const response = isUpdate
        ? await api.put(`/usuario/${user.id}`, apiData)
        : await api.post("/auth/cadastro", apiData);

      setSuccess(
        isUpdate
          ? "Usuário atualizado com sucesso!"
          : "Usuário cadastrado com sucesso!"
      );
      if (isUpdate) {
        onUpdate(response.data);
        setAlert?.({
          show: true,
          message: "Usuário atualizado com sucesso!",
          type: "success",
        });
      } else {
        onSave(response.data);
      }
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.mensagem || "Erro no servidor.";
      setErrors({
        general: errorMsg.includes("Email")
          ? { email: errorMsg }
          : errorMsg.includes("Matrícula")
          ? { matricula: errorMsg }
          : errorMsg.includes("senha")
          ? { senha: errorMsg }
          : errorMsg.includes("Cargo")
          ? { cargo: errorMsg }
          : { general: errorMsg },
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = () => {
    const matriculaNum = Number(formData.matricula);
    return (
      isEmailValid() &&
      formData.nome.trim() &&
      (isUpdate || formData.senha.length >= 8) &&
      !isNaN(matriculaNum) &&
      formData.matricula.length >= 6 &&
      formData.cargo !== ""
    );
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
          padding: "16px 24px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          {isUpdate ? "Editar Usuário" : "Cadastrar Usuário"}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#000000" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              margin="normal"
              label="Nome Completo"
              name="nome"
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
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
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
                formData.email && !isEmailValid()
                  ? "Email inválido"
                  : errors.email
              }
              required
              variant="outlined"
              InputLabelProps={{
                shrink: focusedField === "email" || formData.email !== "",
              }}
            />
          </Grid>
          {!isUpdate && (
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                margin="normal"
                label="Senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={handleChange}
                onFocus={() => setFocusedField("senha")}
                onBlur={() => setFocusedField(null)}
                error={
                  !!formData.senha &&
                  (formData.senha.length < 8 || !!errors.senha)
                }
                helperText={
                  formData.senha && formData.senha.length < 8
                    ? "Mínimo 8 caracteres"
                    : errors.senha
                }
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: focusedField === "senha" || formData.senha !== "",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} md={isUpdate ? 12 : 6}>
            <StyledTextField
              fullWidth
              margin="normal"
              label="Matrícula"
              name="matricula"
              type="text"
              value={formData.matricula}
              onChange={handleChange}
              disabled={isUpdate}
              error={!!errors.matricula}
              helperText={errors.matricula}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ pattern: "[0-9]*" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.cargo}
              variant="outlined"
            >
              <InputLabel id="cargo-label">Cargo</InputLabel>
              <StyledSelect
                labelId="cargo-label"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                onFocus={() => setFocusedField("cargo")}
                onBlur={() => setFocusedField(null)}
                required
              >
                {cargos.map((cargoItem) => (
                  <MenuItem key={cargoItem.id} value={cargoItem.id}>
                    {cargoItem.nome}
                  </MenuItem>
                ))}
              </StyledSelect>
              {errors.cargo && <FormHelperText>{errors.cargo}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
        {errors.general && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errors.general}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "16px 24px",
          backgroundColor: "#f9f9f9",
          gap: 3,
        }}
      >
        <StyledButton onClick={onClose} color="error" variant="contained">
          <Close sx={{ fontSize: 20 }} />
          Cancelar
        </StyledButton>
        <StyledButton
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isFormValid()}
          sx={{
            bgcolor:
              loading || !isFormValid() ? "#E0E0E0" : INSTITUTIONAL_COLOR,
          }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <SaveIcon sx={{ fontSize: 20 }} />
              {isUpdate ? "Atualizar" : "Cadastrar"}
            </>
          )}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
