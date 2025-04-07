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
import { styled, useTheme } from "@mui/material/styles"; 
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

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderColor: "#2E7D32",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1), 
  },
}));

const DemandaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); 
  const [demanda, setDemanda] = useState(null);
  const [podeIntervir, setPodeIntervir] = useState(null);
  const [novaIntervencao, setNovaIntervencao] = useState("");
  const [mostrarCampoIntervencao, setMostrarCampoIntervencao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEncaminhamentosModal, setOpenEncaminhamentosModal] =
    useState(false);

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
        setPodeIntervir(response.data.podeIntervir);
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
      setPodeIntervir(false);
      setAlert({
        show: true,
        message: response.data.mensagem,
        type: "success",
      });
      setOpenConfirmModal(false);
      setTimeout(() => {
        navigate("/demands");
      }, 2000);
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.mensagem || "Erro ao fechar a demanda",
        type: "error",
      });
      console.error("Erro ao fechar demanda:", err);
      setOpenConfirmModal(false);
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
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
        variant="h6"
        gutterBottom
        sx={{
          color: "#000000",
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
              {demanda.status ? "Aberta" : "Fechada"}
            </span>
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Data/Hora:</strong> {formatDateTime(demanda.createdAt)}
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Disciplina:</strong> {demanda.disciplina || "Não informada"}
          </Typography>
          <Typography sx={{ fontSize: "0.9rem" }}>
            <strong>Criador:</strong> {demanda.Usuarios.nome} - (
            {demanda.Usuarios.Cargo.nome})
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
          <Stack spacing={2}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              <strong>Total de Alunos:</strong> {demanda.DemandaAlunos.length}
            </Typography>
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
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <ForwardIcon sx={{ color: "#2E7D32" }} />
          <Typography
            variant="h6"
            sx={{ color: "#2E7D32", fontWeight: "bold" }}
          >
            Encaminhamentos
          </Typography>
        </Stack>

        <Typography sx={{ fontSize: "0.9rem", mb: 0 }}>
          <strong>Total de Encaminhamentos:</strong>{" "}
          {demanda.Encaminhamentos?.length || 0}
        </Typography>
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
            width: { xs: "90%", sm: 600, md: 800 }, 
            maxHeight: "80vh",
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 }, 
            overflowY: "auto",
          }}
        >
          <Typography
            id="encaminhamentos-modal-title"
            variant="h5"
            sx={{
              color: "#2E7D32",
              fontWeight: "bold",
              mb: 2,
              textAlign: "center",
              fontSize: { xs: "1.25rem", sm: "1.5rem" }, 
            }}
          >
            Detalhes dos Encaminhamentos
          </Typography>

          {demanda.Encaminhamentos?.length > 0 ? (
            <Stack spacing={2}>
              {demanda.Encaminhamentos.map((enc) => (
                <StyledCard key={enc.id} variant="outlined">
                  <Stack
                    spacing={1}
                    sx={{
                      flexDirection: { xs: "column", sm: "column" }, 
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ flexWrap: "wrap" }} 
                    >
                      <SubjectIcon
                        sx={{
                          color: "#2E7D32",
                          fontSize: { xs: "0.9rem", sm: "1rem" }, 
                          mr: 1,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" }, 
                          whiteSpace: "pre-line",
                          wordBreak: "break-word", 
                        }}
                      >
                        <strong>Assunto do Encaminhamento:</strong>{" "}
                        {enc.descricao || "Descrição não disponível"}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ flexWrap: "wrap" }}
                    >
                      <PersonIcon
                        sx={{
                          color: "#2E7D32",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          mr: 1,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        <strong>Remetente:</strong>{" "}
                        {enc.Remetente?.nome || "Nome não disponível"}
                        {enc.Remetente?.Cargo?.nome
                          ? ` - ${enc.Remetente.Cargo.nome}`
                          : " - Cargo não disponível"}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ flexWrap: "wrap" }}
                    >
                      <PersonIcon
                        sx={{
                          color: "#2E7D32",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          mr: 1,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        <strong>Destinatário:</strong>{" "}
                        {enc.Destinatario?.nome || "Nome não disponível"}
                        {enc.Destinatario?.Cargo?.nome
                          ? ` - ${enc.Destinatario.Cargo.nome}`
                          : " - Cargo não disponível"}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ flexWrap: "wrap" }}
                    >
                      <AccessTimeIcon
                        sx={{
                          color: "#2E7D32",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          mr: 1,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        <strong>Data/Hora:</strong>{" "}
                        {new Date(enc.data).toLocaleString() ||
                          "Data não disponível"}
                      </Typography>
                    </Stack>
                  </Stack>
                </StyledCard>
              ))}
            </Stack>
          ) : (
            <Typography
              sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, textAlign: "center" }}
            >
              Nenhum encaminhamento
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleCloseEncaminhamentosModal}
            sx={{
              mt: 2,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              bgcolor: "#2E7D32",
              "&:hover": { bgcolor: "#1B5E20" },
              width: { xs: "100%", sm: "auto" }, 
            }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>

      <Intervention
        demanda={demanda}
        podeIntervir={podeIntervir}
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
            width: { xs: "90%", sm: 330 }, 
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: { xs: 2, sm: 4 }, 
          }}
        >
          <Typography
            id="confirm-close-modal"
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Fechar Demanda
          </Typography>
          <Typography
            id="confirm-close-description"
            sx={{
              mb: 3,
              textAlign: "center",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            Deseja realmente fechar a demanda?
            <br /> Ao confirmar, ela será fechada e ninguém poderá mais intervir.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }} 
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              onClick={handleCancelCloseDemanda}
              disabled={loading}
              sx={{
                bgcolor: "#D32F2F",
                "&:hover": { bgcolor: "#B71C1C" },
                borderRadius: "8px",
                color: "white",
                borderColor: "transparent",
                width: { xs: "100%", sm: "auto" },
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
                width: { xs: "100%", sm: "auto" },
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
            onClick={() => navigate(-1)}
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
                !podeIntervir
                  ? "Você não tem permissão para fechar esta demanda no momento"
                  : !temIntervencoes()
                    ? "É necessário pelo menos uma intervenção para fechar a demanda"
                    : ""
              }
            >
              <span>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={handleFecharDemanda}
                  disabled={loading || !podeIntervir || !temIntervencoes()}
                  sx={{
                    bgcolor: "#D32F2F",
                    color: "white",
                    borderRadius: "8px",
                    "&:hover": { bgcolor: "#B71C1C" },
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