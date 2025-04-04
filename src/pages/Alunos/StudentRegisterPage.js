import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Paper,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import api from "../../service/api";
import CondicaoList from "../demandas/CondicaoList";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { CustomAlert } from "../../components/alert/CustomAlert";

const INSTITUTIONAL_COLOR = "#307c34";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
  width: "70%",
  boxSizing: "border-box",
  marginLeft: "auto",
  marginRight: "auto",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: "bold",
}));

const StyledTextField = styled("input")(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  width: "100%",
  padding: "0 14px",
  borderRadius: "8px",
  border: "1px solid #ced4da",
  backgroundColor: "#fff",
  boxSizing: "border-box",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  width: "100%",
  "& .MuiSelect-select": {
    padding: "8px 14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },
}));

const StudentRegisterPage = () => {
  const { matricula } = useParams();
  const isEditing = !!matricula;
  const [matriculaInputs, setMatriculaInputs] = useState([""]);
  const [studentsData, setStudentsData] = useState([null]);
  const [formData, setFormData] = useState({ alunos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isStudentRegistered, setIsStudentRegistered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchStudent = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          const response = await api.get(`/alunos/${matricula}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const student = response.data;
          const mappedStudent = {
            id: student.matricula,
            nome: student.nome,
            email: student.email,
            curso: student.curso || "Curso não informado",
            condicoes: student.condicoes || [],
          };
          setMatriculaInputs([student.matricula]);
          setStudentsData([mappedStudent]);
          setFormData({ alunos: [mappedStudent] });
          setIsStudentRegistered([false]);
        } catch (err) {
          setError("Erro ao carregar dados do aluno.");
          console.error(
            "Erro ao buscar aluno:",
            err.response?.data || err.message
          );
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [isEditing, matricula]);

  const handleMatriculaChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newMatriculaInputs = [...matriculaInputs];
    newMatriculaInputs[index] = numericValue;
    setMatriculaInputs(newMatriculaInputs);
  };

  const handleSearchByMatricula = async (index) => {
    const matriculaInput = matriculaInputs[index];
    if (!matriculaInput) {
      setError("Por favor, insira um número de matrícula.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/alunos/${matriculaInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const student = response.data;
      const mappedStudent = {
        id: student.matricula,
        nome: student.nome,
        email: student.email,
        curso: student.curso || "Curso não informado",
        condicoes: student.condicoes || [],
      };
      const newStudentsData = [...studentsData];
      newStudentsData[index] = mappedStudent;
      setStudentsData(newStudentsData);
      setFormData((prev) => {
        const newAlunos = [...prev.alunos];
        newAlunos[index] = mappedStudent;
        return { ...prev, alunos: newAlunos };
      });
      const newIsStudentRegistered = [...isStudentRegistered];
      newIsStudentRegistered[index] = false;
      setIsStudentRegistered(newIsStudentRegistered);
    } catch (err) {
      setError(
        "Aluno não encontrado. Verifique a matrícula e tente novamente."
      );
      console.error("Erro ao buscar aluno:", err.response?.data || err.message);
      const newStudentsData = [...studentsData];
      newStudentsData[index] = null;
      setStudentsData(newStudentsData);
      const newIsStudentRegistered = [...isStudentRegistered];
      newIsStudentRegistered[index] = false;
      setIsStudentRegistered(newIsStudentRegistered);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setMatriculaInputs([...matriculaInputs, ""]);
    setStudentsData([...studentsData, null]);
    setFormData((prev) => ({
      ...prev,
      alunos: [
        ...prev.alunos,
        { id: "", nome: "", email: "", curso: "", condicoes: [] },
      ],
    }));
    setIsStudentRegistered([...isStudentRegistered, false]);
  };

  const handleRemoveStudent = (index) => {
    setMatriculaInputs((prev) => prev.filter((_, i) => i !== index));
    setStudentsData((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      alunos: prev.alunos.filter((_, i) => i !== index),
    }));
    setIsStudentRegistered((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCondicaoChange = (index, newSelectedCondicoes) => {
    const newAlunos = [...formData.alunos];
    newAlunos[index] = { ...newAlunos[index], condicoes: newSelectedCondicoes };
    setFormData((prev) => ({ ...prev, alunos: newAlunos }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      for (const [index, aluno] of formData.alunos.entries()) {
        if (aluno.id) {
          const condicoesIds = aluno.condicoes.map((condicao) => condicao.id);
          if (isEditing) {
            const response = await api.put(
              `/editar-aluno/${aluno.id}`,
              {
                matricula: aluno.id,
                condicoes: condicoesIds,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Aluno atualizado:", response.data);
          } else {
            const response = await api.post(
              "/cadastrar-aluno",
              {
                matricula: aluno.id,
                nome: aluno.nome,
                email: aluno.email,
                curso: aluno.curso,
                condicoes: condicoesIds,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Aluno cadastrado:", response.data);
          }
        }
      }
      setSuccess(
        isEditing
          ? "Aluno atualizado com sucesso!"
          : "Alunos cadastrados com sucesso!"
      );
      localStorage.removeItem("alunos_draft");
      setTimeout(() => navigate("/alunos"), 2000);
    } catch (err) {
      if (err.response?.status === 409 && !isEditing) {
        const newIsStudentRegistered = [...isStudentRegistered];
        newIsStudentRegistered.forEach(
          (_, i) => (newIsStudentRegistered[i] = true)
        );
        setIsStudentRegistered(newIsStudentRegistered);
        setError("Aluno já cadastrado.");
      } else {
        setError(
          err.response?.data?.mensagem ||
            (isEditing ? "Erro ao atualizar aluno" : "Erro ao cadastrar alunos")
        );
      }
      console.error(
        isEditing ? "Erro ao atualizar aluno:" : "Erro ao cadastrar alunos:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/alunos");
  };

  const handleCloseAlert = (type) => {
    if (type === "error") setError(null);
    else if (type === "success") setSuccess(null);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#f0f2f5",
        p: { xs: 2, sm: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: INSTITUTIONAL_COLOR,
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
            mb: 4,
          }}
        >
          {isEditing ? "Editar Aluno" : "Cadastro de Aluno"}
        </Typography>

        {matriculaInputs.map((matriculaInput, index) => (
          <StyledPaper key={index} elevation={3} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "medium", color: INSTITUTIONAL_COLOR }}
            >
              Dados do Aluno
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2, width: "100%" }}>
              <StyledTextField
                placeholder="Matrícula"
                value={matriculaInput}
                onChange={(e) => handleMatriculaChange(index, e.target.value)}
                maxLength={14}
                pattern="[0-9]*"
                disabled={isEditing || isStudentRegistered[index]}
              />
              {!isEditing && (
                <StyledButton
                  variant="contained"
                  onClick={() => handleSearchByMatricula(index)}
                  disabled={loading || isStudentRegistered[index]}
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: INSTITUTIONAL_COLOR,
                    "&:hover": { bgcolor: "#265b28" },
                    minWidth: "120px",
                    height: "40px",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Buscar"
                  )}
                </StyledButton>
              )}
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                width: "100%",
              }}
            >
              <StyledTextField
                placeholder="Nome"
                value={studentsData[index]?.nome || ""}
                onChange={(e) => {
                  const newStudentsData = [...studentsData];
                  newStudentsData[index] = {
                    ...newStudentsData[index],
                    nome: e.target.value,
                  };
                  setStudentsData(newStudentsData);
                  const newAlunos = [...formData.alunos];
                  newAlunos[index] = {
                    ...newAlunos[index],
                    nome: e.target.value,
                  };
                  setFormData((prev) => ({ ...prev, alunos: newAlunos }));
                }}
                disabled={isEditing || isStudentRegistered[index]}
              />
              <StyledTextField
                placeholder="Email"
                value={studentsData[index]?.email || ""}
                onChange={(e) => {
                  const newStudentsData = [...studentsData];
                  newStudentsData[index] = {
                    ...newStudentsData[index],
                    email: e.target.value,
                  };
                  setStudentsData(newStudentsData);
                  const newAlunos = [...formData.alunos];
                  newAlunos[index] = {
                    ...newAlunos[index],
                    email: e.target.value,
                  };
                  setFormData((prev) => ({ ...prev, alunos: newAlunos }));
                }}
                disabled={isEditing || isStudentRegistered[index]}
              />
              <StyledTextField
                placeholder="Curso"
                value={studentsData[index]?.curso || ""}
                onChange={(e) => {
                  const newStudentsData = [...studentsData];
                  newStudentsData[index] = {
                    ...newStudentsData[index],
                    curso: e.target.value,
                  };
                  setStudentsData(newStudentsData);
                  const newAlunos = [...formData.alunos];
                  newAlunos[index] = {
                    ...newAlunos[index],
                    curso: e.target.value,
                  };
                  setFormData((prev) => ({ ...prev, alunos: newAlunos }));
                }}
                disabled={isEditing || isStudentRegistered[index]}
              />
              <Box
                sx={{
                  gridColumn: { xs: "1 / 2", sm: "2 / 3" },
                  maxWidth: "100%",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontSize: "0.875rem",
                      transform: "translate(14px, 10px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      },
                    }}
                  >
                    Condições
                  </InputLabel>
                  <StyledSelect
                    value={
                      formData.alunos[index]?.condicoes.map((c) => c.id) || []
                    }
                    multiple
                    onChange={(e) => {
                      const newCondicoes = e.target.value.map((id) =>
                        formData.alunos[index]?.condicoes.find(
                          (c) => c.id === id
                        )
                      );
                      handleCondicaoChange(index, newCondicoes);
                    }}
                    renderValue={(selected) => {
                      const condicoesText =
                        formData.alunos[index]?.condicoes
                          .map((c) => c.nome)
                          .join(", ") || "Nenhuma condição selecionada";
                      return truncateText(condicoesText, 50);
                    }}
                    sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          width: "auto",
                        },
                      },
                    }}
                  >
                    <CondicaoList
                      selectedCondicoes={
                        formData.alunos[index]?.condicoes || []
                      }
                      onCondicaoChange={(newCondicoes) =>
                        handleCondicaoChange(index, newCondicoes)
                      }
                    />
                  </StyledSelect>
                </FormControl>
              </Box>
            </Box>
            {!isEditing && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 2,
                  mt: 2,
                }}
              >
                {index === matriculaInputs.length - 1 && (
                  <StyledButton
                    variant="outlined"
                    onClick={handleAddStudent}
                    startIcon={<AddIcon />}
                    sx={{
                      borderColor: INSTITUTIONAL_COLOR,
                      color: INSTITUTIONAL_COLOR,
                      "&:hover": { borderColor: "#265b28", color: "#265b28" },
                    }}
                    disabled={isStudentRegistered[index]}
                  >
                    Adicionar
                  </StyledButton>
                )}
                {index > 0 && (
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleRemoveStudent(index)}
                    startIcon={<RemoveIcon />}
                    sx={{
                      borderColor: "#d32f2f",
                      color: "#d32f2f",
                      "&:hover": { borderColor: "#b71c1c", color: "#b71c1c" },
                    }}
                    disabled={isStudentRegistered[index]}
                  >
                    Remover
                  </StyledButton>
                )}
              </Box>
            )}
          </StyledPaper>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 2,
            mt: 2,
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: INSTITUTIONAL_COLOR,
              "&:hover": { bgcolor: "#265b28" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Salvar"
            )}
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleClose}
            startIcon={<CloseIcon />}
            sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
          >
            Cancelar
          </StyledButton>
        </Box>

        {error && (
          <CustomAlert
            message={error}
            type="error"
            onClose={() => handleCloseAlert("error")}
          />
        )}
        {success && (
          <CustomAlert
            message={success}
            type="success"
            onClose={() => handleCloseAlert("success")}
          />
        )}
      </Box>
    </Box>
  );
};

export default StudentRegisterPage;
