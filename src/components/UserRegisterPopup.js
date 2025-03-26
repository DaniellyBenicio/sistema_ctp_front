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
} from "@mui/material";
import { Email, Lock, Close } from "@mui/icons-material";
import api from "../service/api";

const UserRegisterPopup = ({ open, onClose, onSave }) => {
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
      setFormData({ nome: "", matricula: "", email: "", senha: "", cargo: "" });
      setErrors({});
      setSuccess(null);
    }
  }, [open]);

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

    console.log("Submitting:", formData);
    try {
      const response = await api.post("/auth/cadastro", formData);
      setSuccess("Usuário cadastrado com sucesso!");
      onSave(response.data);
      setFormData({ nome: "", matricula: "", email: "", senha: "", cargo: "" });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.log("API Error:", err.response || err);
      const errorMsg = err.response?.data?.mensagem || "Erro no servidor. Tente novamente.";

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
    formData.cargo;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center", mb: 2 }}>
          Cadastrar Usuário
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TextField
          fullWidth
          margin="normal"
          name="nome"
          label="Nome Completo"
          type="text"
          value={formData.nome}
          onChange={handleChange}
          error={!!errors.nome}
          helperText={errors.nome}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!formData.email && (!isEmailValid() || !!errors.email)}
          helperText={
            !!formData.email && !isEmailValid() ? "Email inválido" : errors.email || ""
          }
          InputProps={{ startAdornment: <Email sx={{ color: "action.active", mr: 1 }} /> }}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="senha"
          label="Senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
          error={!!formData.senha && (formData.senha.length < 8 || !!errors.senha)}
          helperText={
            !!formData.senha && formData.senha.length < 8
              ? "Mínimo 8 caracteres"
              : errors.senha || ""
          }
          InputProps={{ startAdornment: <Lock sx={{ color: "action.active", mr: 1 }} /> }}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="matricula"
          label="Matrícula"
          type="number"
          value={formData.matricula}
          onChange={handleChange}
          error={!!errors.matricula}
          helperText={errors.matricula}
          required
        />
        <FormControl fullWidth margin="normal" error={!!errors.cargo}>
          <FormHelperText id="cargo">Tipo de Cargo</FormHelperText>
          <Select
            labelId="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
          >
            <MenuItem value="" disabled>
              Selecione um cargo
            </MenuItem>
            {cargos.map((cargoItem) => (
              <MenuItem key={cargoItem.id} value={cargoItem.id}>
                {cargoItem.nome}
              </MenuItem>
            ))}
          </Select>
          {errors.cargo && <FormHelperText>{errors.cargo}</FormHelperText>}
        </FormControl>

        {errors.general && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errors.general}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
            {success}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          disabled={loading || !isFormValid()}
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: "#2f9e41",
            "&:hover": { bgcolor: "#278735" },
          }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : "Cadastrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserRegisterPopup;