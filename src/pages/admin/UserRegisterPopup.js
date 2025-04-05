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
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../service/api";

const INSTITUTIONAL_COLOR = "#307c34";

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
    "-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px white inset !important",
      WebkitTextFillColor: theme.palette.text.primary + " !important",
    },
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

const UserRegisterPopup = ({ open, onClose, user, onSave, onUpdate }) => {
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
      console.log("Cargos fetched:", filteredCargos);
    } catch (err) {
      setErrors({ general: "Erro ao buscar os cargos" });
      console.error("Erro ao buscar cargos:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCargos();
      if (user) {
        setFormData({
          nome: user.nome,
          matricula: user.matricula,
          email: user.email,
          senha: "",
          cargo: user.cargo,
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
      setErrors((prev) => ({ ...prev, cargo: "Selecione um cargo" }));
      setLoading(false);
      return;
    }

    console.log("Submitting:", formData);
    try {
      if (user) {
        const response = await api.put(`/auth/usuario/${user.id}`, formData);
        setSuccess("Usuário atualizado com sucesso!");
        onUpdate(response.data);
      } else {
        const response = await api.post("/auth/cadastro", formData);
        setSuccess("Usuário cadastrado com sucesso!");
        onSave(response.data);
      }
      setFormData({
        nome: "",
        matricula: "",
        email: "",
        senha: "",
        cargo: "",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.log("API Error:", err.response || err);
      const errorMsg =
        err.response?.data?.mensagem || "Erro no servidor. Tente novamente.";

      if (errorMsg.includes("Email já está em uso")) {
        setErrors({ email: errorMsg });
      } else if (errorMsg.includes("Matrícula já está em uso")) {
        setErrors({ matricula: errorMsg });
      } else if (errorMsg.includes("A senha deve ter no mínimo 8 caracteres")) {
        setErrors({ senha: errorMsg });
      } else if (errorMsg.includes("Cargo não encontrado")) {
        setErrors({ cargo: errorMsg });
      } else {
        setErrors({ general: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = () =>
    isEmailValid() &&
    formData.nome.trim() &&
    formData.senha.length >= 8 &&
    formData.matricula.trim() &&
    formData.cargo !== "";

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
          color: "#000000",
          padding: "16px 24px",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: "center", mb: 0, fontWeight: "bold" }}
        >
          {user ? "Editar Usuário" : "Cadastrar Usuário"}
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
          <Grid item xs={12} md={6} height={"90px"}>
            <TextField
              fullWidth
              margin="normal"
              label="Senha"
              name="senha"
              type={showPassword ? "text" : "password"}
              value={formData.senha}
              onChange={handleChange}
              error={
                !!formData.senha &&
                (formData.senha.length < 8 || !!errors.senha)
              }
              helperText={
                !!formData.senha && formData.senha.length < 8
                  ? "Mínimo 8 caracteres"
                  : errors.senha || ""
              }
              required
              variant="outlined"
              onFocus={() => setFocusedField("senha")}
              onBlur={() => setFocusedField(null)}
              InputLabelProps={{
                shrink: focusedField === "senha" || formData.senha !== "",
                sx: {
                  color:
                    focusedField === "senha" || formData.senha !== ""
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
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: "#27AE60" }}
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
          </Grid>
          <Grid item xs={12} md={6} height={"90px"}>
            <TextField
              fullWidth
              margin="normal"
              label="Matrícula"
              name="matricula"
              type="number"
              value={formData.matricula}
              onChange={handleChange}
              error={!!errors.matricula}
              helperText={errors.matricula}
              required
              variant="outlined"
              onFocus={() => setFocusedField("matricula")}
              onBlur={() => setFocusedField(null)}
              InputLabelProps={{
                shrink:
                  focusedField === "matricula" || formData.matricula !== "",
                sx: {
                  color:
                    focusedField === "matricula" || formData.matricula !== ""
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
          <Grid item xs={12}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.cargo}
              variant="outlined"
            >
              <InputLabel id="cargo-label" sx={{ fontSize: "0.9rem" }}>
                Cargo
              </InputLabel>
              <StyledSelect
                labelId="cargo-label"
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
                onFocus={() => setFocusedField("cargo")}
                onBlur={() => setFocusedField(null)}
                MenuProps={{
                  MenuListProps: {
                    sx: { fontSize: "0.875rem" },
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
              {errors.cargo && (
                <FormHelperText sx={{ fontSize: "0.875rem" }}>
                  {errors.cargo}
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
          gap: "20px",
        }}
      >
        <StyledButton
          onClick={onClose}
          color="error"
          variant="contained"
          startIcon={<CloseIcon />}
        >
          Cancelar
        </StyledButton>
        <StyledButton
          type="button"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || !isFormValid()}
          sx={{
            bgcolor:
              loading || !isFormValid() ? "#E0E0E0" : INSTITUTIONAL_COLOR,
            color: loading || !isFormValid() ? "#333333" : "#FFFFFF",
            "&:hover": {
              bgcolor: loading || !isFormValid() ? "#D0D0D0" : "#265b28",
            },
          }}
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : user ? (
            "Atualizar"
          ) : (
            "Cadastrar"
          )}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserRegisterPopup;
