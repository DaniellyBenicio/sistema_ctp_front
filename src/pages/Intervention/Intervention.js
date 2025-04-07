import React, { useState } from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import CloseIcon from "@mui/icons-material/Close";

const Intervention = ({
  demanda,
  podeIntervir,
  setDemanda,
  novaIntervencao,
  setNovaIntervencao,
  mostrarCampoIntervencao,
  setMostrarCampoIntervencao,
  loading,
  setLoading,
}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleAdicionarIntervencao = async (event) => {
    event.preventDefault();

    if (!demanda.status) {
      setAlertMessage("Não é possível adicionar intervenções em uma demanda inativa");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (!novaIntervencao.trim()) {
      setAlertMessage("A descrição da intervenção é obrigatória");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      const intervencaoResponse = await api.post(
        "/intervencao",
        { descricao: novaIntervencao },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const intervencaoId = intervencaoResponse.data.intervencao.id;
      const encaminhamentoId = demanda.Encaminhamentos?.[0]?.id;

      if (!encaminhamentoId) {
        setAlertMessage("Nenhum encaminhamento encontrado para associar à intervenção");
        setAlertType("error");
        setShowAlert(true);
        return;
      }

      await api.post(
        "/intervencoesdemandas",
        {
          intervencao_id: intervencaoId,
          demanda_id: demanda.id,
          data: new Date().toISOString(),
          descricao: novaIntervencao,
          encaminhamento_id: encaminhamentoId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAlertMessage("Intervenção adicionada com sucesso!");
      setAlertType("success");
      setShowAlert(true);

      const updatedDemanda = await api.get(`/demandas/${demanda.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDemanda(updatedDemanda.data.demanda);
      setNovaIntervencao("");
      setMostrarCampoIntervencao(false);
    } catch (err) {
      setAlertMessage(err.response?.data?.mensagem || "Erro ao adicionar intervenção");
      setAlertType("error");
      setShowAlert(true);
      console.error("Erro ao adicionar intervenção:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", maxWidth: "1100px", mx: "auto" }}>
      {showAlert && (
        <CustomAlert message={alertMessage} type={alertType} onClose={handleCloseAlert} />
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <QuestionAnswerIcon sx={{ color: "#2E7D32" }} />
        <Typography variant="h6" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
          Intervenções
        </Typography>
      </Stack>

      {demanda.IntervencoesDemandas?.length > 0 ? (
        <Stack spacing={2}>
          {demanda.IntervencoesDemandas.map((int) => (
            <Card key={int.id} variant="outlined">
              <CardContent>
                <Typography fontSize={"0.9rem"} fontWeight="bold" borderColor={"red"}>
                  Descrição:
                </Typography>
                <Typography fontSize={"0.9rem"} sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap", mb: 1 }}>
                  {int.Intervencao.descricao}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <AccessTimeIcon sx={{ color: "#2E7D32" }} fontSize="small" />
                  <Typography variant="caption" color="gray" fontSize={"0.9rem"}>
                    {new Date(int.data).toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonIcon sx={{ color: "#2E7D32" }} fontSize="small" />
                  <Typography variant="caption" display="block" color="gray" fontSize={"0.9rem"}>
                    {int.Usuarios?.nome || "Usuário desconhecido"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography>Nenhuma intervenção registrada</Typography>
      )}

      {demanda.status && !mostrarCampoIntervencao && podeIntervir && (
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => setMostrarCampoIntervencao(true)}
          sx={{
            mt: 2,
            bgcolor: "#2E7D32",
            color: "white",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#1B5E20" },
          }}
        >
          Adicionar
        </Button>
      )}

      {demanda.status && mostrarCampoIntervencao && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={novaIntervencao}
            onChange={(e) => setNovaIntervencao(e.target.value)}
            placeholder="Descreva a intervenção"
            variant="outlined"
            sx={{
              bgcolor: "white",
              borderRadius: "8px",
              width: "100%",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#2E7D32",
                },
                "&:hover fieldset": {
                  borderColor: "#1B5E20",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1B5E20",
                },
              },
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setNovaIntervencao("");
                setMostrarCampoIntervencao(false);
              }}
              sx={{ borderColor: "#D32F2F", color: "#D32F2F", borderRadius: "8px" }}
              startIcon={<CloseIcon />}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleAdicionarIntervencao}
              disabled={loading}
              sx={{
                bgcolor: "#2E7D32",
                color: "white",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#1B5E20" },
              }}
            >
              Confirmar Intervenção
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

export default Intervention;