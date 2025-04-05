import React, { useState } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
  useMediaQuery,
  Tooltip,
  Popover,
  TableFooter,
} from "@mui/material";
import { Send, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ForwardingPopup from "../Encaminhamentos/ForwardingPopup.js";
import Paginate from "../../components/paginate/Paginate.js";

const DemandsTable = ({
  demands,
  onSend,
  onViewDetails,
  usuarioLogadoId,
  onDemandUpdated,
  count,
  page,
  onPageChange,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDemand, setSelectedDemand] = useState(null);

  const handleOpenPopup = (demandId) => {
    setSelectedDemandId(demandId);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedDemandId(null);
    if (onDemandUpdated) {
      onDemandUpdated();
    }
  };

  const handleOpenRecipients = (event, demand) => {
    setAnchorEl(event.currentTarget);
    setSelectedDemand(demand);
  };

  const handleCloseRecipients = () => {
    setAnchorEl(null);
    setSelectedDemand(null);
  };

  const handleViewDetails = (demandId) => {
    navigate(`/demands/${demandId}`);
  };

  const open = Boolean(anchorEl);

  const getUniqueRecipients = (destinatarios) => {
    if (!destinatarios || destinatarios.length === 0) return [];
    const uniqueNames = [...new Set(destinatarios.map((dest) => dest.nome))];
    return uniqueNames;
  };

  const formatDateTime = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return new Date(dateString)
      .toLocaleString("pt-BR", options)
      .replace("T", ", ")
      .replace(",", ", ");
  };

  if (isMobile) {
    return (
      <Stack spacing={1} sx={{ width: "100%" }}>
        {demands.map((demand) => (
          <Paper
            key={demand.id}
            sx={{
              p: 1,
              background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
            }}
          >
            <Stack spacing={0.5}>
              <Typography>
                <strong>Alunos Envolvidos:</strong>{" "}
                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") ||
                  "Nenhum aluno"}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                <span style={{ color: demand.status ? "#2E7D32" : "#D32F2F" }}>
                  {demand.status ? "Aberta" : "Fechada"}
                </span>
              </Typography>
              <Typography>
                <strong>Curso:</strong>{" "}
                {demand.DemandaAlunos?.[0]?.Aluno?.Cursos?.nome ||
                  "Não informado"}
              </Typography>
              <Typography>
                <strong>Data/Hora:</strong>{" "}
                {formatDateTime(demand.createdAt) || "Não informada"}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton
                  color="primary"
                  onClick={() => handleViewDetails(demand.id)}
                >
                  <Visibility />
                </IconButton>
                <Tooltip
                  title={
                    !demand.status
                      ? "Você não pode enviar uma demanda que está fechada"
                      : "Encaminhar demanda"
                  }
                >
                  <span>
                    <IconButton
                      color="success"
                      onClick={() => handleOpenPopup(demand.id)}
                      disabled={!demand.status}
                    >
                      <Send />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>
          </Paper>
        ))}
        {count > 1 && (
          <Paginate count={count} page={page} onChange={onPageChange} />
        )}
        <ForwardingPopup
          open={openPopup}
          onClose={handleClosePopup}
          demandId={selectedDemandId}
          usuarioLogadoId={usuarioLogadoId}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseRecipients}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Stack sx={{ p: 2 }}>
            <Typography variant="h6">Destinatários</Typography>
            {selectedDemand &&
              getUniqueRecipients(selectedDemand.destinatarios).length > 0 ? (
              getUniqueRecipients(selectedDemand.destinatarios).map(
                (nome, index) => <Typography key={index}>{nome}</Typography>
              )
            ) : (
              <Typography>Nenhum destinatário</Typography>
            )}
          </Stack>
        </Popover>
      </Stack>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        marginTop: "25px",
        background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2f9e41",
                color: "#fff",
                borderRight: "1px solid #fff",
                padding: { xs: "4px", sm: "6px" },
                height: "30px",
                lineHeight: "30px",
              }}
            >
              Alunos Envolvidos
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2f9e41",
                color: "#fff",
                borderRight: "1px solid #fff",
                padding: { xs: "4px", sm: "6px" },
                height: "30px",
                lineHeight: "30px",
              }}
            >
              Status
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2f9e41",
                color: "#fff",
                borderRight: "1px solid #fff",
                padding: { xs: "4px", sm: "6px" },
                height: "30px",
                lineHeight: "30px",
              }}
            >
              Curso
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2f9e41",
                color: "#fff",
                borderRight: "1px solid #fff",
                padding: { xs: "4px", sm: "6px" },
                height: "30px",
                lineHeight: "30px",
              }}
            >
              Data/Hora
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2f9e41",
                color: "#fff",
                padding: { xs: "4px", sm: "6px" },
                height: "30px",
                lineHeight: "30px",
              }}
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {demands.map((demand) => (
            <TableRow key={demand.id}>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid #e0e0e0",
                  padding: { xs: "4px", sm: "6px" },
                  height: "30px",
                  lineHeight: "30px",
                }}
              >
                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") ||
                  "Nenhum aluno"}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid #e0e0e0",
                  padding: { xs: "4px", sm: "6px" },
                  height: "30px",
                  lineHeight: "30px",
                }}
              >
                <span style={{ color: demand.status ? "#2E7D32" : "#D32F2F" }}>
                  {demand.status ? "Aberta" : "Fechada"}
                </span>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid #e0e0e0",
                  padding: { xs: "4px", sm: "6px" },
                  height: "30px",
                  lineHeight: "30px",
                }}
              >
                {demand.DemandaAlunos?.[0]?.Aluno?.Cursos?.nome ||
                  "Não informado"}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid #e0e0e0",
                  padding: { xs: "4px", sm: "6px" },
                  height: "30px",
                  lineHeight: "30px",
                }}
              >
                {formatDateTime(demand.createdAt) || "Não informada"}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  padding: { xs: "4px", sm: "6px" },
                  height: "30px",
                  lineHeight: "30px",
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => handleViewDetails(demand.id)}
                >
                  <Visibility />
                </IconButton>
                <Tooltip
                  title={
                    !demand.status
                      ? "Você não pode enviar uma demanda que está fechada"
                      : "Encaminhar demanda"
                  }
                >
                  <span>
                    <IconButton
                      color="success"
                      onClick={() => handleOpenPopup(demand.id)}
                      disabled={!demand.status}
                    >
                      <Send />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {count > 1 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} sx={{ borderBottom: "none" }}>
                <Stack alignItems="center" mt={2}>
                  <Paginate count={count} page={page} onChange={onPageChange} />
                </Stack>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
      <ForwardingPopup
        open={openPopup}
        onClose={handleClosePopup}
        demandId={selectedDemandId}
        usuarioLogadoId={usuarioLogadoId}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseRecipients}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Stack sx={{ p: 2 }}>
          <Typography variant="h6">Destinatários</Typography>
          {selectedDemand &&
            getUniqueRecipients(selectedDemand.destinatarios).length > 0 ? (
            getUniqueRecipients(selectedDemand.destinatarios).map(
              (nome, index) => <Typography key={index}>{nome}</Typography>
            )
          ) : (
            <Typography>Nenhum destinatário</Typography>
          )}
        </Stack>
      </Popover>
    </TableContainer>
  );
};

export default DemandsTable;
