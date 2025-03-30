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
    height: "40px", // Tamanho original, igual aos outros campos
    fontSize: "0.875rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ced4da",
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none", // Remove a seta
  },
}));

const formatDateToDisplay = (isoDate) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const ForwardingPopup = ({ open, onClose, demandId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatariosSelecionados, setDestinatariosSelecionados] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Define os cargos obrigatórios com base nos índices 2, 3 e 4 (ajuste conforme seu ENUM)
  const mandatoryRoleIndices = [2, 3, 4]; // "Diretor Geral", "Diretor Ensino", "Funcionario CTP"

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
      setDestinatariosSelecionados([]);
      setDescricao("");
      setData(new Date().toISOString().split("T")[0]);
      setAlert(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setAlert({
        message: "Preencha todos os campos obrigatórios",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      // Garante que todos os usuários obrigatórios sejam incluídos no envio
      const mandatoryIds = usuarios
        .filter((u) => mandatoryRoleIndices.includes(u.Cargo?.id))
        .map((u) => u.id);

      // Combina os destinatários selecionados com os obrigatórios, evitando duplicatas
      const finalDestinatarios = [...new Set([...destinatariosSelecionados, ...mandatoryIds])];

      const requests = finalDestinatarios.map(async (destinatarioId) => {
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

  const isFormValid = () => descricao.trim();

  const handleDestinatarioChange = (event, newValue) => {
    const selectedIds = newValue.map((usuario) => usuario.id);
    setDestinatariosSelecionados(selectedIds);
  };

  const isMandatoryUser = (usuario) => mandatoryRoleIndices.includes(usuario.Cargo?.id);

  // Função de filtragem personalizada para buscar apenas nomes que começam com o texto digitado
  const filterOptions = (options, { inputValue }) => {
    if (!inputValue) return []; // Não mostra nada se o campo estiver vazio
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
            getOptionLabel={(option) => `${option.nome} (${option.Cargo?.nome || "Cargo não informado"})`}
            value={usuarios.filter((u) => destinatariosSelecionados.includes(u.id))}
            onChange={handleDestinatarioChange}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Destinatários"
                placeholder="Digite para buscar..."
                margin="normal"
                inputProps={{
                  ...params.inputProps,
                  readOnly: false, // Permite digitar
                  style: { cursor: "text" }, // Cursor de texto
                }}
                InputProps={{
                  ...params.InputProps,
                  readOnly: false,
                  disableUnderline: true, // Remove sublinhado ou interação extra
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                {option.nome} ({option.Cargo?.nome || "Cargo não informado"})
                {isMandatoryUser(option) && " (Envio automático)"}
              </li>
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            fullWidth
            freeSolo={false}
            openOnFocus={false} // Não abre ao focar
            disableOpenOnFocus // Impede abertura ao clicar
            popupIcon={null} // Remove ícone de popup
            noOptionsText="" // Remove mensagem "Nenhum usuário encontrado"
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