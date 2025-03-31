import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import api from "../../service/api";
import AmparoLegalList from "./AmparoLegalList";
import CondicaoList from "./CondicaoList";
import { jwtDecode } from "jwt-decode";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import CustomAlert from "../../components/alert/CustomAlert";

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    fontSize: "0.875rem",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    transform: "translate(14px, 10px) scale(1)",
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
}));

const DemandaRegisterPage = () => {
  const [formData, setFormData] = useState({
    descricao: "",
    status: true,
    disciplina: "",
    alunos: [],
    amparoLegal: [],
  });
  const [matriculaInputs, setMatriculaInputs] = useState([""]);
  const [studentsData, setStudentsData] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const getUserId = () => {
    const decoded = jwtDecode(token);
    setUserId(decoded.id);
  };

  useEffect(() => {
    getUserId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMatriculaChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newMatriculaInputs = [...matriculaInputs];
    newMatriculaInputs[index] = numericValue;
    setMatriculaInputs(newMatriculaInputs);
  };

  const handleAmparoChange = (newSelectedAmparos) => {
    setFormData((prev) => ({ ...prev, amparoLegal: newSelectedAmparos }));
  };

  const handleSearchByMatricula = async (index) => {
    const matriculaInput = matriculaInputs[index];
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/alunos/${matriculaInput}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const student = response.data;
      if (student?.nome) {
        const mappedStudent = {
          id: student.matricula || `temp-${Date.now()}-${index}`,
          nome: student.nome,
          email: student.email || "",
          curso: student.curso || "Curso não informado",
          condicoes: student.condicoes || [],
        };

        const isStudentAlreadyAdded = formData.alunos.some(a => a.id === mappedStudent.id);

        if (isStudentAlreadyAdded) {
          setError("Este aluno já foi adicionado.");
          setAlertOpen(true);
          return;
        }

        const newStudentsData = [...studentsData];
        newStudentsData[index] = mappedStudent;
        setStudentsData(newStudentsData);

        setFormData((prev) => {
          const newAlunos = [...prev.alunos];
          newAlunos[index] = mappedStudent;
          return { ...prev, alunos: newAlunos };
        });
      } else {
        setError("Aluno não encontrado.");
        setAlertOpen(true);
        const newStudentsData = [...studentsData];
        newStudentsData[index] = null;
        setStudentsData(newStudentsData);
      }
    } catch (err) {
      setError(
        "Erro ao buscar aluno. Verifique a matrícula e tente novamente."
      );
      setAlertOpen(true);
      console.error("Erro ao buscar aluno:", err.response?.data || err.message);
      const newStudentsData = [...studentsData];
      newStudentsData[index] = null;
      setStudentsData(newStudentsData);
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
  };

  const handleRemoveStudent = (index) => {
    setMatriculaInputs((prev) => prev.filter((_, i) => i !== index));
    setStudentsData((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      alunos: prev.alunos.filter((_, i) => i !== index),
    }));
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
      const response = await api.post("/criar-demanda", {
        usuario_id: userId,
        descricao: formData.descricao,
        status: formData.status,
        disciplina: formData.disciplina || null,
        alunos: formData.alunos
          .map((aluno) => ({
            id: aluno.id || null,
            condicoes: aluno.condicoes.map((c) => c.id),
          }))
          .filter((aluno) => aluno.id || aluno.nome),
        amparoLegal: formData.amparoLegal.map((amparo) => amparo.id),
      });
      setSuccess("Demanda cadastrada com sucesso!");
      setAlertOpen(true);
      setTimeout(() => navigate("/demands"), 2000);
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao cadastrar a demanda");
      setAlertOpen(true);
      console.error(
        "Erro ao criar demanda:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
    setError(null);
    setSuccess(null);
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
          Nova Demanda
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
                fullWidth
                label="Matrícula"
                value={matriculaInput}
                onChange={(e) => handleMatriculaChange(index, e.target.value)}
                variant="outlined"
                inputProps={{ maxLength: 14, pattern: "[0-9]*" }}
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
              />
              <StyledButton
                variant="contained"
                onClick={() => handleSearchByMatricula(index)}
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
                label="Nome"
                value={studentsData[index]?.nome || ""}
                variant="outlined"
                disabled
                onChange={(e) => {
                  const newStudentsData = [...studentsData];
                  newStudentsData[index] = {
                    ...newStudentsData[index],
                    nome: e.target.value,
                    id: `temp-${Date.now()}-${index}`,
                  };
                  setStudentsData(newStudentsData);
                  setFormData((prev) => {
                    const newAlunos = [...prev.alunos];
                    newAlunos[index] = {
                      ...newAlunos[index],
                      nome: e.target.value,
                      id: `temp-${Date.now()}-${index}`,
                    };
                    return { ...prev, alunos: newAlunos };
                  });
                }}
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
              />
              <StyledTextField
                label="Email"
                value={studentsData[index]?.email || ""}
                variant="outlined"
                disabled
                onChange={(e) => {
                  const newStudentsData = [...studentsData];
                  newStudentsData[index] = {
                    ...newStudentsData[index],
                    email: e.target.value,
                  };
                  setStudentsData(newStudentsData);
                  setFormData((prev) => {
                    const newAlunos = [...prev.alunos];
                    newAlunos[index] = {
                      ...newAlunos[index],
                      email: e.target.value,
                    };
                    return { ...prev, alunos: newAlunos };
                  });
                }}
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
              />
              <StyledTextField
                label="Curso"
                value={studentsData[index]?.curso || ""}
                variant="outlined"
                disabled
                onChange={(e) => {
                  const newStudentsData = [...studentsData];
                  newStudentsData[index] = {
                    ...newStudentsData[index],
                    curso: e.target.value,
                  };
                  setStudentsData(newStudentsData);
                  setFormData((prev) => {
                    const newAlunos = [...prev.alunos];
                    newAlunos[index] = {
                      ...newAlunos[index],
                      curso: e.target.value,
                    };
                    return { ...prev, alunos: newAlunos };
                  });
                }}
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
              />
              <Box sx={{ gridColumn: { xs: "1 / 2", sm: "2 / 3" } }}>
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
                    disabled
                    renderValue={(selected) =>
                      formData.alunos[index]?.condicoes
                        .map((c) => c.nome)
                        .join(", ") || "Nenhuma condição selecionada"
                    }
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
                >
                  Remover
                </StyledButton>
              )}
            </Box>
          </StyledPaper>
        ))}

        <Divider
          sx={{
            my: 4,
            borderColor: "#e0e0e0",
            width: "70%",
            mx: "auto",
            borderBottomWidth: 3,
          }}
        />

        <StyledPaper elevation={3} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "medium", color: INSTITUTIONAL_COLOR }}
          >
            Dados da Demanda
          </Typography>
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            required
            sx={{ mb: 3, bgcolor: "#fff", borderRadius: "8px" }}
          />
          <Box
            sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "100%" }}
          >
            <StyledTextField
              label="Disciplina (opcional)"
              name="disciplina"
              value={formData.disciplina}
              onChange={handleChange}
              variant="outlined"
              inputProps={{ maxLength: 100 }}
              sx={{
                bgcolor: "#fff",
                borderRadius: "8px",
                flex: "1 1 200px",
                minWidth: "200px",
              }}
            />
            <StyledTextField
              label="Status"
              value="Aberta"
              variant="outlined"
              disabled
              sx={{
                bgcolor: "#fff",
                borderRadius: "8px",
                flex: "1 1 200px",
                minWidth: "200px",
              }}
            />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 3,
              mb: 1,
              fontWeight: "medium",
              color: INSTITUTIONAL_COLOR,
            }}
          >
            Amparo Legal
          </Typography>
          <AmparoLegalList
            selectedAmparos={formData.amparoLegal}
            onAmparoChange={handleAmparoChange}
          />
        </StyledPaper>

        {alertOpen && (
          <CustomAlert
            message={success || error}
            type={success ? "success" : "error"}
            onClose={handleCloseAlert}
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.descricao ||
              formData.alunos.length === 0 ||
              formData.alunos.some((aluno) => !aluno.nome) ||
              formData.amparoLegal.length === 0
            }
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: INSTITUTIONAL_COLOR,
              "&:hover": { bgcolor: "#265b28" },
              minWidth: "150px",
              height: "40px",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Criar Demanda"
            )}
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => navigate("/demands")}
            startIcon={<CloseIcon />}
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
              minWidth: "150px",
              height: "40px",
            }}
          >
            Cancelar
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DemandaRegisterPage;
