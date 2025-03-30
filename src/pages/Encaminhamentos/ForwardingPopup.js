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
  MenuItem,
  ListItemText,
  Checkbox,
  Select,
  Typography,
  CircularProgress,
  Box,
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

  // Define os cargos obrigatórios com os nomes exatos do ENUM
  const mandatoryRoles = ["Diretor Geral", "Diretor Ensino", "Funcionario CTP"];
  const ctpKeyword = "CTP"; // Para capturar variações adicionais de CTP, se houver

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
      const fetchedUsuarios = response.data.usuarios;
      setUsuarios(fetchedUsuarios);

      // Pré-seleciona usuários com cargos obrigatórios
      const mandatoryUsers = fetchedUsuarios
        .filter((usuario) => {
          const cargoNome = usuario.Cargo?.nome || "";
          return (
            mandatoryRoles.includes(cargoNome) || // Diretor Geral, Diretor Ensino, Funcionario CTP
            cargoNome.includes(ctpKeyword) // Qualquer cargo que contenha "CTP"
          );
        })
        .map((usuario) => usuario.id);
      setDestinatarios(mandatoryUsers);
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
        .filter((u) => {
          const cargoNome = u.Cargo?.nome || "";
          return mandatoryRoles.includes(cargoNome) || cargoNome.includes(ctpKeyword);
        })
        .map((u) => u.id);

      // Combina os destinatários selecionados com os obrigatórios, evitando duplicatas
      const finalDestinatarios = [...new Set([...destinatarios, ...mandatoryIds])];

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

  const isFormValid = () => descricao.trim() && destinatarios.length > 0;

  const handleDestinatarioChange = (event) => {
    const selectedIds = event.target.value;
    const mandatoryIds = usuarios
      .filter((u) => {
        const cargoNome = u.Cargo?.nome || "";
        return mandatoryRoles.includes(cargoNome) || cargoNome.includes(ctpKeyword);
      })
      .map((u) => u.id);

    // Garante que os IDs obrigatórios estejam sempre incluídos
    const newDestinatarios = [
      ...mandatoryIds,
      ...selectedIds.filter((id) => !mandatoryIds.includes(id)),
    ];

    setDestinatarios(newDestinatarios);
  };

  const isMandatoryUser = (usuario) => {
    const cargoNome = usuario.Cargo?.nome || "";
    return mandatoryRoles.includes(cargoNome) || cargoNome.includes(ctpKeyword);
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
              onChange={handleDestinatarioChange}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const usuario = usuarios.find((u) => u.id === id);
                    return usuario?.nome || "Usuário não encontrado";
                  })
                  .join(", ")
              }
            >
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => {
                  const isMandatory = isMandatoryUser(usuario);
                  return (
                    <MenuItem
                      key={usuario.id}
                      value={usuario.id}
                      disabled={isMandatory} // Desabilita a opção de desmarcar os obrigatórios
                    >
                      <Checkbox
                        checked={destinatarios.includes(usuario.id)}
                        disabled={isMandatory} // Desabilita o checkbox para os obrigatórios
                      />
                      <ListItemText
                        primary={`${usuario.nome} (${usuario.Cargo?.nome || "Cargo não informado"})`}
                        secondary={isMandatory ? "Envio automático" : null}
                      />
                    </MenuItem>
                  );
                })
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