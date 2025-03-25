import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const INSTITUTIONAL_COLOR = "#307c34";

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
  width: "100%",
  boxSizing: "border-box",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: "bold",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    fontSize: "0.875rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ced4da",
  },
  "& .MuiInputBase-multiline": {
    height: "auto",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
  backgroundColor: "#fff",
  borderRadius: "8px",
}));

const ForwardingPopup = ({ open, onClose, demandId, usuarioLogadoId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatarios, setDestinatarios] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchUsuarios();
    }
  }, [open]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/usuarios", {
        params: { usuarioLogadoId }, // Passa o ID do usuário logado
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(response.data.usuarios);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro na requisição:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!descricao || !data || destinatarios.length === 0) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        usuario_id: usuarioLogadoId,
        demanda_id: demandId,
        descricao,
        data,
        destinatariosManuais: destinatarios,
      };
      const response = await axios.post("http://localhost:3000/encaminhamento", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Encaminhamento criado:", response.data);
      setDescricao("");
      setData("");
      setDestinatarios([]);
      onClose();
    } catch (err) {
      setError("Erro ao criar encaminhamento");
      console.error("Erro na requisição:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledPaper>
        <DialogTitle sx={{ p: 0, mb: 2 }}>
          <Typography
            sx={{
              fontWeight: "bold",
              color: INSTITUTIONAL_COLOR,
              fontSize: "1.25rem",
            }}
          >
            Encaminhar Demanda #{demandId}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel
              sx={{
                fontSize: "0.875rem",
                transform: "translate(14px, 10px) scale(1)",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -6px) scale(0.75)",
                },
              }}
            >
              Destinatários
            </InputLabel>
            <StyledSelect
              multiple
              value={destinatarios}
              onChange={(e) => setDestinatarios(e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => usuarios.find((u) => u.id === id)?.nome || "Usuário não encontrado")
                  .join(", ")
              }
            >
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {usuario.nome} ({usuario.Cargo?.nome || "Cargo não informado"})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Nenhum usuário disponível</MenuItem>
              )}
            </StyledSelect>
          </FormControl>
          <StyledTextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <StyledTextField
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 1, display: "block" }}
          >
            *Os cargos padrão (CTP, Diretor Ensino, Diretor Geral) serão incluídos automaticamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0, mt: 3 }}>
          <StyledButton
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              borderColor: "#d32f2f",
              color: "#d32f2f",
              "&:hover": { borderColor: "#b71c1c", color: "#b71c1c" },
            }}
          >
            Cancelar
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: INSTITUTIONAL_COLOR,
              "&:hover": { bgcolor: "#265b28" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Encaminhar"}
          </StyledButton>
        </DialogActions>
      </StyledPaper>
    </Dialog>
  );
};

export default ForwardingPopup;