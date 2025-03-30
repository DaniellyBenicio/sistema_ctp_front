import React from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import api from "../../service/api";

const Intervention = ({
  demanda,
  setDemanda,
  novaIntervencao,
  setNovaIntervencao,
  mostrarCampoIntervencao,
  setMostrarCampoIntervencao,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const handleAdicionarIntervencao = async () => {
    if (!demanda.status) {
      setError("Não é possível adicionar intervenções em uma demanda inativa");
      return;
    }

    if (!novaIntervencao.trim()) {
      setError("A descrição da intervenção é obrigatória");
      return;
    }
    try {
      setLoading(true);

      // 1. Criar a intervenção
      const intervencaoResponse = await api.post(
        "/intervencao",
        { descricao: novaIntervencao },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const intervencaoId = intervencaoResponse.data.intervencao.id;

      // 2. Verificar se há encaminhamento
      const encaminhamentoId = demanda.Encaminhamentos?.[0]?.id || null;
      if (!encaminhamentoId) {
        setError(
          "Nenhum encaminhamento encontrado para associar a intervenção"
        );
        setLoading(false);
        return;
      }

      // 3. Associar a intervenção à demanda
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

      // 4. Atualizar a demanda com a nova intervenção
      const updatedDemanda = await api.get(`/demandas/${demanda.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDemanda(updatedDemanda.data.demanda);
      setNovaIntervencao("");
      setMostrarCampoIntervencao(false);
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao adicionar intervenção");
      console.error("Erro ao adicionar intervenção:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: "12px",
        maxWidth: "1100px",
        mx: "auto",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <BuildIcon sx={{ color: "#2E7D32" }} />
        <Typography variant="h6" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
          Intervenções
        </Typography>
      </Stack>
      {demanda.IntervencoesDemandas?.length > 0 ? (
        <Stack spacing={3}>
          {demanda.IntervencoesDemandas.map((int) => (
            <Stack key={int.id} spacing={1}>
              <Typography sx={{ ml: 2 }}>
                <strong>Descrição da Intervenção:</strong>{" "}
                {int.Intervencao.descricao}
              </Typography>
              <Typography sx={{ ml: 2 }}>
                <strong>Data:</strong> {new Date(int.data).toLocaleString()}
              </Typography>
              <Typography sx={{ ml: 2 }}>
                <strong>Responsável:</strong>{" "}
                {int.Usuarios?.nome || "Usuário desconhecido"} (
                {int.Usuarios?.email || "Email não disponível"})
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography>Nenhuma intervenção registrada</Typography>
      )}

      {/* Botão Adicionar e Campo de Nova Intervenção - Só mostra se status for ativo */}
      {demanda.status && !mostrarCampoIntervencao && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
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
            sx={{ bgcolor: "white", borderRadius: "8px" }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setNovaIntervencao("");
                setMostrarCampoIntervencao(false);
              }}
              sx={{
                borderColor: "#2E7D32",
                color: "#2E7D32",
                borderRadius: "8px",
              }}
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