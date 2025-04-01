import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Autocomplete,
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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    fontSize: "0.875rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ced4da",
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
}));

const ForwardingPopup = ({ open, onClose, demandId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatariosSelecionados, setDestinatariosSelecionados] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [encaminhamentos, setEncaminhamentos] = useState([]);
  const [podeEncaminhar, setPodeEncaminhar] = useState(true);

  const formatDateToDisplay = (isoDate) => {
    if (!isoDate) return "Gerada automaticamente";
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/usuarios-encaminhamento", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data.usuarios || []);
    } catch (err) {
      setAlert({ message: "Erro ao carregar usuários", type: "error" });
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEncaminhamentos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/encaminhamentos/demanda/${demandId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const encaminhamentosData = response.data.encaminhamentos || [];
      setEncaminhamentos(encaminhamentosData);

    
      const usuarioId = JSON.parse(atob(token.split(".")[1])).id; 
      const cargosAutomaticos = ["Funcionário CTP", "Diretor Geral", "Diretor Ensino"];
      const encaminhamentosManuais = encaminhamentosData.filter(
        (enc) =>
          enc.usuario_id === usuarioId &&
          !cargosAutomaticos.includes(enc.Destinatario?.Cargo?.nome)
      );

      setPodeEncaminhar(encaminhamentosManuais.length === 0);
    } catch (err) {
      setAlert({ message: "Erro ao carregar encaminhamentos", type: "error" });
      console.error("Erro ao buscar encaminhamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsuarios();
      fetchEncaminhamentos();
      setDestinatariosSelecionados([]);
      setDescricao("");
      setData(new Date().toISOString());
      setAlert(null);
    }
  }, [open, demandId]);

  const handleSubmit = async () => {
    if (!podeEncaminhar) {
      setAlert({
        message: "Você já encaminhou esta demanda manualmente e não pode encaminhar novamente.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        destinatario_id: destinatariosSelecionados,
        demanda_id: demandId,
        descricao,
      };
      const response = await api.post("/encaminhamento", payload);
      setAlert({ message: response.data.mensagem, type: "success" });
      setData(response.data.demanda.data);
      setPodeEncaminhar(false); 
      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 2000);
    } catch (err) {
      setAlert({
        message:
          "Erro ao criar encaminhamento: " +
          (err.response?.data?.error || err.message),
        type: "error",
      });
      console.error("Erro na requisição:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinatarioChange = (event, newValue) => {
    const selectedIds = newValue.map((usuario) => usuario.id);
    setDestinatariosSelecionados(selectedIds);
  };

  const filterOptions = (options, { inputValue }) => {
    if (!inputValue) return [];
    const normalizedInput = inputValue.toLowerCase();
    return options.filter((option) =>
      option.nome.toLowerCase().startsWith(normalizedInput)
    );
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
          <StyledAutocomplete
            multiple
            options={usuarios}
            getOptionLabel={(option) =>
              `${option.nome} (${option.Cargo?.nome || "Cargo não informado"})`
            }
            value={usuarios.filter((u) =>
              destinatariosSelecionados.includes(u.id)
            )}
            onChange={handleDestinatarioChange}
            filterOptions={filterOptions}
            openOnFocus={false}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Destinatários"
                placeholder="Digite para buscar..."
                margin="normal"
              />
            )}
            fullWidth
            noOptionsText="Nenhum usuário encontrado"
          />
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
            disabled={loading || !descricao.trim() || !podeEncaminhar}
            sx={{
              bgcolor: INSTITUTIONAL_COLOR,
              "&:hover": { bgcolor: "#265b28" },
            }}
            endIcon={<SendIcon />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Encaminhar"
            )}
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