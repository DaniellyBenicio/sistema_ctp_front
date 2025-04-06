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
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
    "& .MuiInputBase-input": {
      color: INSTITUTIONAL_COLOR,
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ced4da", 
    },
    "&:hover fieldset": {
      borderColor: "#388E3C", 
    },
    "&.Mui-focused fieldset": {
      borderColor: INSTITUTIONAL_COLOR + " !important", 
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: INSTITUTIONAL_COLOR + " !important", 
    transform: "translate(14px, 10px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",
    color: INSTITUTIONAL_COLOR + " !important", 
  },
  "& .Mui-focused.MuiInputLabel-root": {
    color: INSTITUTIONAL_COLOR + " !important", 
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
    "& .MuiInputBase-input": {
      color: INSTITUTIONAL_COLOR, 
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ced4da", 
    },
    "&:hover fieldset": {
      borderColor: "#388E3C", 
    },
    "&.Mui-focused fieldset": {
      borderColor: INSTITUTIONAL_COLOR + " !important", 
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: INSTITUTIONAL_COLOR + " !important", 
    transform: "translate(14px, 10px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",
    color: INSTITUTIONAL_COLOR + " !important", 
  },
  "& .Mui-focused.MuiInputLabel-root": {
    color: INSTITUTIONAL_COLOR + " !important", 
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
}));

const ForwardingPopup = ({ open, onClose, demandId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatarioSelecionado, setDestinatarioSelecionado] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [encaminhamentos, setEncaminhamentos] = useState([]);
  const [podeEncaminhar, setPodeEncaminhar] = useState(true);

  const formatDateToDisplay = (isoDate) => {
    if (!isoDate) return "Gerada automaticamente";
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
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
      console.error("Erro ao buscar usuários:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEncaminhamentos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Buscando dados da demanda:", demandId);
      const response = await api.get(`/demandas/${demandId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Resposta do backend:", response.data);
      const { demanda, podeIntervir } = response.data;
      setEncaminhamentos(demanda.Encaminhamentos || []);
      setPodeEncaminhar(podeIntervir);
      console.log("Pode encaminhar inicial:", podeIntervir);
    } catch (err) {
      console.error(
        "Erro ao buscar dados da demanda:",
        err.response?.data || err
      );
      setAlert({ message: "Erro ao carregar dados da demanda", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsuarios();
      fetchEncaminhamentos();
      setDestinatarioSelecionado(null);
      setDescricao("");
      setData(new Date().toISOString());
      setAlert(null);
    }
  }, [open, demandId]);

  const handleSubmit = async () => {
    if (!podeEncaminhar) {
      setAlert({
        message: "Você não pode encaminhar essa demanda no momento",
        type: "warning",
      });
      return;
    }

    if (!destinatarioSelecionado || !descricao.trim()) {
      setAlert({
        message: "Preencha todos os campos obrigatórios.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        destinatario_id: destinatarioSelecionado.id,
        demanda_id: demandId,
        descricao,
      };
      const token = localStorage.getItem("token");
      const response = await api.post("/encaminhamento", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ message: response.data.mensagem, type: "success" });
      setData(response.data.demanda?.data || new Date().toISOString());
      setEncaminhamentos([
        ...encaminhamentos,
        ...(response.data.encaminhamentos || []),
      ]);

      setPodeEncaminhar(false);
      console.log("Pode encaminhar desabilitado imediatamente após envio");

      const updatedResponse = await api.get(`/demandas/${demandId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const novoPodeIntervir = updatedResponse.data.podeIntervir;
      setPodeEncaminhar(novoPodeIntervir);
      console.log(
        "Pode encaminhar após verificação no backend:",
        novoPodeIntervir
      );

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
      console.error("Erro na requisição:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinatarioChange = (event, newValue) => {
    setDestinatarioSelecionado(newValue);
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
              fontSize: "1.25rem",
            }}
          >
            Encaminhar Demanda
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <StyledAutocomplete
            options={usuarios}
            getOptionLabel={(option) =>
              `${option.nome} (${option.Cargo?.nome || "Cargo não informado"})`
            }
            value={destinatarioSelecionado}
            onChange={handleDestinatarioChange}
            filterOptions={filterOptions}
            openOnFocus={false}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Destinatário"
                placeholder="Digite para buscar..."
                margin="normal"
              />
            )}
            fullWidth
            noOptionsText="A demanda só pode ser enviada pra uma pessoa"
            disabled={!podeEncaminhar || loading}
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
            disabled={!podeEncaminhar || loading}
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
            disabled={
              loading ||
              !podeEncaminhar ||
              !descricao.trim() ||
              !destinatarioSelecionado
            }
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