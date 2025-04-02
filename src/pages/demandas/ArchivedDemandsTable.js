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
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ArchivedDemandsTable = ({ demands, onViewDetails, usuarioLogadoId }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

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
                <span style={{ color: "#D32F2F" }}>Fechada</span>
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
                <span style={{ color: "#D32F2F" }}>Fechada</span>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArchivedDemandsTable;
