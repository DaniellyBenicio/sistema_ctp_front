import React, { useEffect, useState } from "react";
import {
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
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";
import StudentDetailsModal from "./StudentDetails";
import Paginate from "../../components/paginate//Paginate";

const StudentsTable = ({ searchValue }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/alunos");
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }
      const formattedStudents = response.data.map((aluno) => ({
        matricula: aluno.matricula,
        nome: aluno.nome,
        email: aluno.email,
        curso: aluno.curso,
        condicoes: Array.isArray(aluno.condicoes) ? aluno.condicoes : ["Ativo"],
      }));

      const filtered = formattedStudents.filter(
        (student) =>
          student.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
          student.matricula.toString().includes(searchValue) ||
          student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          student.curso.toLowerCase().includes(searchValue.toLowerCase())
      );

      setStudents(formattedStudents);
      setFilteredStudents(filtered);
      setPage(1);
    } catch (err) {
      setError("Erro ao carregar alunos");
      console.error("Erro ao buscar alunos:", err);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (matricula) => {
    navigate(`/editar-aluno/${matricula}`);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchStudents();
  }, [searchValue]);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  if (isMobile) {
    return (
      <Stack spacing={1} sx={{ width: "100%", padding: "8px 0" }}>
        {loading ? (
          <Typography align="center" sx={{ fontSize: "0.7rem" }}>
            Carregando...
          </Typography>
        ) : error ? (
          <Typography align="center" color="error" sx={{ fontSize: "0.7rem" }}>
            {error}
          </Typography>
        ) : paginatedStudents.length > 0 ? (
          paginatedStudents.map((student) => (
            <Paper
              key={student.matricula}
              sx={{
                p: 1,
                background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontSize: "0.7rem" }}>
                  <strong>Matrícula:</strong> {student.matricula}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem" }}>
                  <strong>Nome:</strong> {student.nome}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem" }}>
                  <strong>Curso:</strong> {student.curso}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem" }}>
                  <strong>Email:</strong> {student.email}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem" }}>
                  <strong>Condições:</strong>
                </Typography>
                {Array.isArray(student.condicoes) &&
                  student.condicoes.length > 0 ? (
                  student.condicoes.map((condicao, index) => (
                    <Typography key={index} sx={{ pl: 2, fontSize: "0.7rem" }}>
                      - {condicao}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ pl: 2, fontSize: "0.7rem" }}>
                    - Nenhuma condição
                  </Typography>
                )}
              </Stack>
            </Paper>
          ))
        ) : (
          <Typography align="center" sx={{ fontSize: "0.7rem" }}>
            Nenhum estudante encontrado.
          </Typography>
        )}
        {totalPages > 1 && (
          <Paginate
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </Stack>
    );
  }

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: 0,
        }}
      >
        {loading ? (
          <Stack alignItems="center">
            <CircularProgress size={24} />
            <Typography sx={{ fontSize: "0.7rem" }}>Carregando...</Typography>
          </Stack>
        ) : error ? (
          <Typography align="center" color="error" sx={{ fontSize: "0.7rem" }}>
            {error}
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
              overflowX: "auto",
            }}
          >
            <Table sx={{ tableLayout: "fixed", minWidth: "800px" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      width: "20%",
                      fontWeight: "bold",
                      backgroundColor: "#2f9e41",
                      color: "#fff",
                      borderRight: "1px solid #fff",
                      padding: { xs: "4px", sm: "6px" },
                      height: "30px",
                      lineHeight: "30px",
                    }}
                  >
                    Matrícula
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "40%",
                      fontWeight: "bold",
                      backgroundColor: "#2f9e41",
                      color: "#fff",
                      borderRight: "1px solid #fff",
                      padding: { xs: "4px", sm: "6px" },
                      height: "30px",
                      lineHeight: "30px",
                    }}
                  >
                    Nome
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "30%",
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
                      width: "10%",
                      fontWeight: "bold",
                      backgroundColor: "#2f9e41",
                      color: "#fff",
                      borderRight: "1px solid #fff",
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
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.matricula}>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: "1px solid #e0e0e0",
                          padding: { xs: "4px", sm: "6px" },
                          height: "30px",
                          lineHeight: "30px",
                        }}
                      >
                        {student.matricula}
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
                        {student.nome}
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
                        {student.curso}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: { xs: "4px", sm: "4px" },
                          height: "30px",
                          lineHeight: "30px",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <Tooltip title="Editar" arrow>
                            <IconButton
                              onClick={() => handleEdit(student.matricula)}
                              sx={{ padding: "2px" }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Ver detalhes" arrow>
                            <IconButton
                              color="info"
                              onClick={() => handleViewDetails(student)}
                              sx={{ padding: "2px" }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{
                        padding: { xs: "4px", sm: "6px" },
                        height: "30px",
                        lineHeight: "30px",
                      }}
                    >
                      Nenhum estudante encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {totalPages > 1 && (
          <Paginate
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </Stack>

      <StudentDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        student={selectedStudent}
      />
    </>
  );
};

export default StudentsTable;
