import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Stack,
  Button,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import GavelIcon from "@mui/icons-material/Gavel";
import ForwardIcon from "@mui/icons-material/Forward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../service/api";
import { jwtDecode } from "jwt-decode";
import Intervention from "../Intervention/Intervention.js"; 

const DemandaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demanda, setDemanda] = useState(null);
  const [novaIntervencao, setNovaIntervencao] = useState("");
  const [mostrarCampoIntervencao, setMostrarCampoIntervencao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (err) {
        setError("Erro de autenticação");
        console.error("Erro ao decodificar token:", err);
      }
    } else {
      setError("Nenhum token encontrado. Faça login novamente.");
      navigate("/login");
    }

    const fetchDemanda = async () => {
      try {
        const response = await api.get(`/demandas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemanda(response.data.demanda);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os detalhes da demanda");
        console.error("Erro ao buscar demanda:", err);
        setLoading(false);
      }
    };

    if (token) fetchDemanda();
  }, [id, navigate]);

  const handleFecharDemanda = async () => {
    const confirmacao = window.confirm(
      "Deseja realmente fechar a demanda?\nAo confirmar, a demanda será fechada e ninguém poderá mais intervir. Sim ou Não"
    );
    if (!confirmacao) return;

    try {
      setLoading(true);
      await api.put(
        `/demandas/${demanda.id}`,
        { status: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/demands");
    } catch (err) {
      setError("Erro ao fechar a demanda");
      console.error("Erro ao fechar demanda:", err);
    } finally {
      setLoading(false);
    }
  };

  const podeFecharDemanda = () => {
    if (!userId || !demanda || !userRole) return false;
    const isCriador = demanda.usuario_id === userId;
    const isDestinatario = demanda.Encaminhamentos?.some(
      (enc) => enc.destinatario_id === userId
    );
    const isCtp = userRole === "ctp";
    return (isCriador && isCtp) || (!isCriador && isDestinatario);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#2E7D32" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Typography sx={{ color: "#D32F2F" }}>{error}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/demands")}
          sx={{
            mt: 2,
            borderColor: "#2E7D32",
            color: "#2E7D32",
            borderRadius: "8px",
          }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  if (!demanda) {
    return (
      <Box m={4}>
        <Typography>Demanda não encontrada</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/demands")}
          sx={{
            mt: 2,
            borderColor: "#2E7D32",
            color: "#2E7D32",
            borderRadius: "8px",
          }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box m={0} sx={{ bgcolor: "#F5F7FA" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "#2E7D32",
          fontWeight: "bold",
          textAlign: "center",
          paddingTop: "20px",
        }}
      >
        Detalhes da Demanda #{demanda.id}
      </Typography>

      {/* Seção: Informações Gerais */}
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
          <InfoIcon sx={{ color: "#2E7D32" }} />
          <Typography
            variant="h6"
            sx={{ color: "#2E7D32", fontWeight: "bold" }}
          >
            Informações Gerais
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography>
            <strong>Código da Demanda:</strong> {demanda.id || "Não informada"}
          </Typography>
          <Typography>
            <strong>Descrição:</strong> {demanda.descricao || "Não informada"}
          </Typography>
          <Typography>
            <strong>Status:</strong>{" "}
            <span style={{ color: demanda.status ? "#2E7D32" : "#D32F2F" }}>
              {demanda.status ? "Ativo" : "Inativo"}
            </span>
          </Typography>
          <Typography>
            <strong>Disciplina:</strong> {demanda.disciplina || "Não informada"}
          </Typography>
          <Typography>
            <strong>Criador:</strong> {demanda.Usuarios.nome}
          </Typography>
          <Typography>
            <strong>E-mail:</strong> {demanda.Usuarios.email}
          </Typography>
        </Stack>
      </Paper>

      {/* Seção: Alunos Envolvidos */}
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
          <PeopleIcon sx={{ color: "#2E7D32" }} />
          <Typography
            variant="h6"
            sx={{ color: "#2E7D32", fontWeight: "bold" }}
          >
            Alunos Envolvidos
          </Typography>
        </Stack>
        {demanda.DemandaAlunos?.length > 0 ? (
          <Stack spacing={4}>
            {demanda.DemandaAlunos.map((da) => (
              <Stack key={da.Aluno.matricula} spacing={1}>
                <Typography sx={{ ml: 2 }}>
                  <strong>Nome:</strong> {da.Aluno.nome}
                </Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Matrícula:</strong> {da.Aluno.matricula}
                </Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Curso:</strong>{" "}
                  {da.Aluno.Cursos && da.Aluno.Cursos.nome
                    ? da.Aluno.Cursos.nome
                    : "Curso não informado"}
                </Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Condições:</strong>{" "}
                  {da.Aluno.Condicaos?.length > 0
                    ? da.Aluno.Condicaos.map((c) => c.nome).join(", ")
                    : "Nenhuma condição associada"}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography>Nenhum aluno associado</Typography>
        )}
      </Paper>

      {/* Seção: Amparos Legais */}
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
          <GavelIcon sx={{ color: "#2E7D32" }} />
          <Typography
            variant="h6"
            sx={{ color: "#2E7D32", fontWeight: "bold" }}
          >
            Amparos Legais
          </Typography>
        </Stack>
        {demanda.AmparoLegals?.length > 0 ? (
          demanda.AmparoLegals.map((amparo, index) => (
            <Typography key={amparo.id}>
              {index + 1}. {amparo.nome}
            </Typography>
          ))
        ) : (
          <Typography>Nenhum amparo legal associado</Typography>
        )}
      </Paper>

      {/* Seção: Encaminhamentos */}
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
          <ForwardIcon sx={{ color: "#2E7D32" }} />
          <Typography
            variant="h6"
            sx={{ color: "#2E7D32", fontWeight: "bold" }}
          >
            Encaminhamentos
          </Typography>
        </Stack>
        {demanda.Encaminhamentos?.length > 0 ? (
          <Stack spacing={3}>
            {demanda.Encaminhamentos.map((enc) => (
              <Stack spacing={1}>
                <Typography sx={{ ml: 2 }}>
                  <strong>Assunto do Encaminhamento:</strong> {enc.descricao}
                </Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Remetente:</strong> {enc.Remetente.nome} (
                  {enc.Remetente.email})
                </Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Destinatário:</strong> {enc.Destinatario.nome} (
                  {enc.Destinatario.email})
                </Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Data/Hora:</strong>{" "}
                  {new Date(enc.data).toLocaleString()}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography>Nenhum encaminhamento</Typography>
        )}
      </Paper>

      {/* Seção: Intervenções */}
      <Intervention
        demanda={demanda}
        setDemanda={setDemanda}
        novaIntervencao={novaIntervencao}
        setNovaIntervencao={setNovaIntervencao}
        mostrarCampoIntervencao={mostrarCampoIntervencao}
        setMostrarCampoIntervencao={setMostrarCampoIntervencao}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />

      {/* Seção: Erros e Botões */}
      <Stack spacing={2} sx={{ maxWidth: "1145px", mx: "auto", mb: 3 }}>
        {error && (
          <Typography
            sx={{
              color: "#D32F2F",
              bgcolor: "#FFEBEE",
              p: 1,
              borderRadius: "8px",
            }}
          >
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/demands")}
            disabled={loading}
            sx={{
              borderColor: "#2E7D32",
              color: "#2E7D32",
              borderRadius: "8px",
            }}
          >
            Voltar
          </Button>
          {demanda.status && (
            <Button
              variant="contained"
              startIcon={<LockIcon />}
              onClick={handleFecharDemanda}
              disabled={loading || !podeFecharDemanda()}
              sx={{
                bgcolor: "#2E7D32",
                color: "white",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#1B5E20" },
              }}
            >
              Fechar Demanda
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DemandaDetailsPage;