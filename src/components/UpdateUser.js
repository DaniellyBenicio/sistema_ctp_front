import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Email, Close } from "@mui/icons-material";
import api from "../service/api";

const UpdateUser = ({ open, onClose, user, onUpdateSuccess, setAlert }) => {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    email: "",
    cargoId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchCargos = async () => {
    try {
      const response = await api.get("/cargos");
      const filteredCargos = response.data.filter(
        (cargo) => cargo.nome.toLowerCase() !== "admin"
      );
      setCargos(filteredCargos);
    } catch (err) {
      setError("Erro ao buscar os cargos");
      console.error("Erro ao buscar cargos:", err);
    }
  };

  useEffect(() => {
    if (open && user) {
      console.log("Dados do user recebidos:", user);
      setFormData({
        nome: user.nome || "",
        matricula: user.matricula || "",
        email: user.email || "",
        cargoId: user.cargo_id || "",
      });
      fetchCargos();
      setSuccess(null);
      setError(null);
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setConfirmOpen(false);

    const updatedData = {
      nome: formData.nome,
      email: formData.email,
      cargoId: formData.cargoId,
    };

    console.log("Dados enviados para atualização:", {
      id: user.id,
      ...updatedData,
    });

    try {
      const response = await api.put(`/usuario/${user.id}`, updatedData);

      console.log("Resposta da API:", response.data);

      if (response.status === 200) {
        setSuccess("Usuário atualizado com sucesso!");
        onUpdateSuccess();
        setAlert({
          show: true,
          message: "Usuário atualizado com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar usuário";
      console.error("Erro ao atualizar:", error.response || error);
      setError(errorMessage);
      setAlert({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleClose = () => {
    setSuccess(null);
    setError(null);
    onClose();
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Editar Usuário
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey.500",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            name="nome"
            label="Nome Completo"
            type="text"
            value={formData.nome}
            onChange={handleChange}
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
            error={!!formData.email && !isEmailValid()}
            helperText={
              !!formData.email && !isEmailValid() ? "Email inválido" : ""
            }
            InputProps={{
              startAdornment: <Email sx={{ color: "action.active", mr: 1 }} />,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="matricula"
            label="Matrícula"
            type="text"
            value={formData.matricula}
            disabled
          />
          <FormControl fullWidth margin="normal">
            <FormHelperText id="cargo">Tipo de Cargo</FormHelperText>
            <Select
              labelId="cargo"
              name="cargoId"
              value={formData.cargoId}
              onChange={handleChange}
              required
            >
              {cargos.map((cargoItem) => (
                <MenuItem key={cargoItem.id} value={cargoItem.id}>
                  {cargoItem.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
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
            disabled={
              loading || !isEmailValid() || !formData.nome || !formData.cargoId
            }
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#2f9e41",
              "&:hover": {
                bgcolor: "#278735",
              },
            }}
            onClick={handleSubmit}
          >
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelConfirm} maxWidth="xs">
        <DialogTitle>Confirmar Alterações</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja salvar as alterações no usuário?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateUser;
