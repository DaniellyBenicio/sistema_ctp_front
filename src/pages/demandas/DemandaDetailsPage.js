import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Stack,
  Button,
  Card,
  Paper,
  Box,
  CircularProgress,
  Modal,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import GavelIcon from "@mui/icons-material/Gavel";
import ForwardIcon from "@mui/icons-material/Forward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SubjectIcon from "@mui/icons-material/Subject";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../service/api";
import { jwtDecode } from "jwt-decode";
import Intervention from "../Intervention/Intervention.js";
import CustomAlert from "../../components/alert/CustomAlert";

const DemandaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demanda, setDemanda] = useState(null);
  const [novaIntervencao, setNovaIntervencao] = useState("");
  const [mostrarCampoIntervencao, setMostrarCampoIntervencao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEncaminhamentosModal, setOpenEncaminhamentosModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (err) {
        setAlert({
          show: true,
          message: "Erro de autenticação",
          type: "error",
        });
        console.error("Erro ao decodificar token:", err);
      }
    } else {
      setAlert({
        show: true,
        message: "Nenhum token encontrado. Faça login novamente.",
        type: "error",
      });
      navigate("/login");
    }

    const fetchDemanda = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/demandas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemanda(response.data.demanda);
        setLoading(false);
      } catch (err) {
        setAlert({
          show: true,
          message: "Erro ao carregar os detalhes da demanda",
          type: "error",
        });
        console.error("Erro ao buscar demanda:", err);
        setLoading(false);
      }
    };

    if (token) fetchDemanda();
  }, [id, navigate]);

  const handleFecharDemanda = () => {
    setOpenConfirmModal(true);
  };

  const handleConfirmCloseDemanda = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/${id}/fechar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDemanda((prev) => ({ ...prev, status: false }));
      setOpenConfirmModal(false);
      navigate("/demands");
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.mensagem || "Erro ao fechar a demanda",
        type: "error",
      });
      console.error("Erro ao fechar demanda:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCloseDemanda = () => {
    setOpenConfirmModal(false);
    setAlert({ show: false, message: "", type: "" });
  };

  const temIntervencoes = () =>
    demanda?.IntervencoesDemandas && demanda.IntervencoesDemandas.length > 0;

  const handleOpenEncaminhamentosModal = () => {
    setOpenEncaminhamentosModal(true);
  };

  const handleCloseEncaminhamentosModal = () => {
    setOpenEncaminhamentosModal(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#2E7D32" }} />
      </Box>
    );
  }

  if (alert.show && !demanda) {
    return (
      <Box m={4}>
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
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
        Detalhes da Demanda
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
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Descrição:</strong> {demanda.descricao || "Não informada"}
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Status:</strong>{" "}
            <span style={{ color: demanda.status ? "#2E7D32" : "#D32F2F" }}>
              {demanda.status ? "Ativo" : "Inativo"}
            </span>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Disciplina:</strong> {demanda.disciplina || "Não informada"}
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Criador:</strong> {demanda.Usuarios.nome}
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>E-mail:</strong> {demanda.Usuarios.email}
          </Typography>
        </Stack>
      </Paper>

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
                <Typography sx={{ fontSize: "0.9rem" }}>
                  <strong>Nome:</strong> {da.Aluno.nome}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  <strong>Matrícula:</strong> {da.Aluno.matricula}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  <strong>Curso:</strong>{" "}
                  {da.Aluno.Cursos && da.Aluno.Cursos.nome
                    ? da.Aluno.Cursos.nome
                    : "Curso não informado"}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>
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
            <Typography key={amparo.id} sx={{ fontSize: "0.9rem" }}>
              {index + 1}. {amparo.nome}
            </Typography>
          ))
        ) : (
          <Typography>Nenhum amparo legal associado</Typography>
        )}
      </Paper>

      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "12px",
          maxWidth: "1100px",
          mx: "auto",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0 }}>
          <ForwardIcon sx={{ color: "#2E7D32" }} />
          <Typography
            variant="h6"
            sx={{ color: "#2E7D32", fontWeight: "bold" }}
          >
            Encaminhamentos
          </Typography>
        </Stack>
        <Button
          variant="contained"
          onClick={handleOpenEncaminhamentosModal}
          sx={{
            bgcolor: "#2E7D32",
            color: "white",
            "&:hover": { bgcolor: "#1B5E20" },
            fontSize: "0.9rem",
            mt: 2,
          }}
        >
          Ver Encaminhamentos
        </Button>
      </Paper>

      { }
      <Modal
        open={openEncaminhamentosModal}
        onClose={handleCloseEncaminhamentosModal}
        aria-labelledby="encaminhamentos-modal-title"
        aria-describedby="encaminhamentos-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            maxHeight: '80vh',
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography
            id="encaminhamentos-modal-title"
            variant="h5"
            sx={{ color: "#2E7D32", fontWeight: "bold", mb: 2, textAlign: 'center' }}
          >
            Detalhes dos Encaminhamentos
          </Typography>
          {demanda.Encaminhamentos?.length > 0 ? (
            <Stack spacing={2}>
              {demanda.Encaminhamentos.map((enc) => (
                <Card key={enc.id} variant="outlined" sx={{ p: 2, borderColor: "#2E7D32" }}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center">
                      <SubjectIcon sx={{ color: "#2E7D32", fontSize: "1rem", mr: 1 }} />
                      <Typography sx={{ fontSize: "0.9rem", whiteSpace: "pre-line" }}>
                        <strong>Assunto do Encaminhamento:</strong>  {enc.descricao}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <PersonIcon sx={{ color: "#2E7D32", fontSize: "1rem", mr: 1 }} />
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        <strong>Remetente:</strong> {enc.Remetente.nome}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <PersonIcon sx={{ color: "#2E7D32", fontSize: "1rem", mr: 1 }} />
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        <strong>Destinatário:</strong> {enc.Destinatario.nome}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <AccessTimeIcon sx={{ color: "#2E7D32", fontSize: "1rem", mr: 1 }} />
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        <strong>Data/Hora:</strong> {new Date(enc.data).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography>Nenhum encaminhamento</Typography>
          )}
          <Button
            variant="contained"
            onClick={handleCloseEncaminhamentosModal}
            sx={{ mt: 2, fontSize: "0.9rem", bgcolor: "#2E7D32", "&:hover": { bgcolor: "#1B5E20" } }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>

      <Intervention
        demanda={demanda}
        setDemanda={setDemanda}
        novaIntervencao={novaIntervencao}
        setNovaIntervencao={setNovaIntervencao}
        mostrarCampoIntervencao={mostrarCampoIntervencao}
        setMostrarCampoIntervencao={setMostrarCampoIntervencao}
        loading={loading}
        setLoading={setLoading}
        error={alert.message}
        setError={(message) => setAlert({ show: true, message, type: "error" })}
      />

      <Modal
        open={openConfirmModal}
        onClose={handleCancelCloseDemanda}
        aria-labelledby="confirm-close-modal"
        aria-describedby="confirm-close-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="confirm-close-modal"
            variant="h6"
            sx={{
              color: "#2E7D32",
              fontWeight: "bold",
              mb: 2,
              textAlign: "center",
            }}
          >
            Fechar Demanda
          </Typography>
          <Typography id="confirm-close-description" sx={{ mb: 3 }}>
            Deseja realmente fechar a demanda? Ao confirmar, ela será fechada e
            ninguém poderá mais intervir.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={handleCancelCloseDemanda}
              disabled={loading}
              sx={{
                borderColor: "#D32F2F",
                color: "#D32F2F",
                borderRadius: "8px",
                "&:hover": { borderColor: "#B71C1C", color: "#B71C1C" },
              }}
            >
              Não
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmCloseDemanda}
              disabled={loading}
              sx={{
                bgcolor: "#2E7D32",
                "&:hover": { bgcolor: "#1B5E20" },
                borderRadius: "8px",
                color: "white",
              }}
            >
              Sim
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack spacing={2} sx={{ maxWidth: "1145px", mx: "auto", mb: 3 }}>
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
            <Tooltip
              title={
                !temIntervencoes()
                  ? "É necessário pelo menos uma intervenção para fechar a demanda"
                  : ""
              }
            >
              <span>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={handleFecharDemanda}
                  disabled={loading || !temIntervencoes()}
                  sx={{
                    bgcolor: "#2E7D32",
                    color: "white",
                    borderRadius: "8px",
                    "&:hover": { bgcolor: "#1B5E20" },
                    "&.Mui-disabled": {
                      bgcolor: "#B0BEC5",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  Fechar Demanda
                </Button>
              </span>
            </Tooltip>
          )}
        </Stack>
      </Stack>
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}
    </Box>
  );
};

export default DemandaDetailsPage;