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
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../service/api";
import { CustomAlert } from "../../components/alert/CustomAlert";

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

const formatDateToDisplay = (isoDate) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const ForwardingPopup = ({ open, onClose, demandId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatarios, setDestinatarios] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/usuarios-encaminhamento", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data || !Array.isArray(response.data.usuarios)) {
        throw new Error("Formato de resposta inválido");
      }
      setUsuarios(response.data.usuarios);
      setAlert(null);
    } catch (err) {
      setAlert({ message: "Erro ao carregar usuários", type: "error" });
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsuarios();
      setDestinatarios([]);
      setDescricao("");
      setData(new Date().toISOString().split("T")[0]);
      setAlert(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setAlert({ message: "Preencha todos os campos obrigatórios", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      const requests = destinatarios.map(async (destinatarioId) => {
        const payload = {
          destinatario_id: destinatarioId,
          demanda_id: demandId,
          descricao,
          data,
        };
        console.log("Payload enviado:", payload);
        return api.post("/encaminhamento", payload);
      });

      const responses = await Promise.all(requests);
      console.log("Encaminhamentos criados:", responses.map((res) => res.data));
      setAlert({ message: "Encaminhamento criado com sucesso!", type: "success" });
      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 2000);
    } catch (err) {
      setAlert({
        message: "Erro ao criar encaminhamento: " + (err.response?.data?.error || err.message),
        type: "error",
      });
      console.error("Erro na requisição:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => descricao.trim() && destinatarios.length > 0;

  const handleDeleteChip = (idToRemove) => {
    setDestinatarios(destinatarios.filter((id) => id !== idToRemove));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledPaper>
        <DialogTitle sx={{ p: 0, mb: 2, textAlign: "center" }}>
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
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const usuario = usuarios.find((u) => u.id === id);
                    return (
                      <Chip
                        key={id}
                        label={usuario?.nome || "Usuário não encontrado"}
                        onDelete={() => handleDeleteChip(id)}
                        onMouseDown={(e) => e.stopPropagation()}
                        sx={{ height: "24px", fontSize: "0.75rem" }}
                      />
                    );
                  })}
                </Box>
              )}
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
            required
          />
          <StyledTextField
            label="Data"
            value={formatDateToDisplay(data)}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
            disabled
            sx={{ input: { cursor: "default" } }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            p: 0,
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <StyledButton
            variant="contained"
            onClick={onClose}
            disabled={loading}
            sx={{
              bgcolor: "#d32f2f",
              color: "#fff",
              "&:hover": { bgcolor: "#b71c1c" },
            }}
            startIcon={<CloseIcon />}
          >
            Cancelar
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
            sx={{
              bgcolor: INSTITUTIONAL_COLOR,
              "&:hover": { bgcolor: "#265b28" },
            }}
            endIcon={<SendIcon />}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Encaminhar"}
          </StyledButton>
        </DialogActions>
      </StyledPaper>
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </Dialog>
  );
};

export default ForwardingPopup;