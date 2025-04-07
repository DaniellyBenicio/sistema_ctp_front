import React from "react";
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
  styled,
  useTheme,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StyledTableCellHead = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#2f9e41",
  color: theme.palette.common.white,
  borderRight: `1px solid ${theme.palette.common.white}`,
  padding: theme.spacing(0.75),
  textAlign: "center",
  height: "auto",
  lineHeight: "normal",
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0.75),
  textAlign: "center",
  height: "auto",
  lineHeight: "normal",
}));

const ArchivedDemandsTable = ({ demands, onViewDetails, usuarioLogadoId }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewDetails = (demandId) => {
    navigate(`/demands/${demandId}`);
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
      <Stack spacing={1} sx={{ width: "90%" }}>
        {demands.map((demand) => (
          <Paper
            key={demand.id}
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                <strong>Alunos:</strong>{" "}
                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") ||
                  "Nenhum"}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> <span style={{ color: "#D32F2F" }}>Fechada</span>
              </Typography>
              <Typography variant="body2">
                <strong>Curso:</strong>{" "}
                {demand.DemandaAlunos?.[0]?.Aluno?.Cursos?.nome || "Não informado"}
              </Typography>
              <Typography variant="body2">
                <strong>Data/Hora:</strong> {formatDateTime(demand.createdAt) || "Não informada"}
              </Typography>
              <Stack direction="row" justifyContent="flex-end">
                <IconButton
                  color="primary"
                  onClick={() => handleViewDetails(demand.id)}
                  aria-label="ver detalhes"
                >
                  <Visibility />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        ))}
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
        background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="demandas arquivadas">
        <TableHead>
          <TableRow>
            <StyledTableCellHead>Alunos Envolvidos</StyledTableCellHead>
            <StyledTableCellHead align="center">Status</StyledTableCellHead>
            <StyledTableCellHead align="center">Curso</StyledTableCellHead>
            <StyledTableCellHead align="center">Data/Hora</StyledTableCellHead>
            <StyledTableCellHead align="center">Ações</StyledTableCellHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {demands.map((demand) => (
            <TableRow key={demand.id}>
              <StyledTableCellBody>
                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") || "Nenhum"}
              </StyledTableCellBody>
              <StyledTableCellBody align="center">
                <span style={{ color: "#D32F2F" }}>Fechada</span>
              </StyledTableCellBody>
              <StyledTableCellBody align="center">
                {demand.DemandaAlunos?.[0]?.Aluno?.Cursos?.nome || "Não informado"}
              </StyledTableCellBody>
              <StyledTableCellBody align="center">
                {formatDateTime(demand.createdAt) || "Não informada"}
              </StyledTableCellBody>
              <StyledTableCellBody align="center">
                <IconButton
                  color="primary"
                  onClick={() => handleViewDetails(demand.id)}
                  aria-label="ver detalhes"
                >
                  <Visibility />
                </IconButton>
              </StyledTableCellBody>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArchivedDemandsTable;