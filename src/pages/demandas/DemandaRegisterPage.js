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
  "& .MuiOutlinedInput-root": {
    height: "40px",
    fontSize: "0.875rem",
    width: "100%",
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#ced4da",
    },
    "&:hover fieldset": {
      borderColor: "#388E3C",
    },
    "&.Mui-focused fieldset": {
      borderColor: INSTITUTIONAL_COLOR,
    },
    "& .MuiInputBase-input": {
      padding: "8px 14px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    transform: "translate(14px, 10px) scale(1)",
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
      color: INSTITUTIONAL_COLOR,
    },
    "&.Mui-focused": {
      color: INSTITUTIONAL_COLOR,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: "40px",
  fontSize: "0.875rem",
  width: "100%",
  borderRadius: "8px",
  backgroundColor: "#fff",
  "& .MuiSelect-select": {
    padding: "8px 14px",
    "&.Mui-focused": {
      color: INSTITUTIONAL_COLOR,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ced4da",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#388E3C",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: INSTITUTIONAL_COLOR,
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
  const [allStudentsValidated, setAllStudentsValidated] = useState(false);

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
    if (!matriculaInput) {
      setError("Por favor, insira uma matrícula válida.");
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/local/alunos/${matriculaInput}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const student = response.data;
      if (student && student.matricula && student.nome) {
        const mappedStudent = {
          id: student.matricula,
          nome: student.nome,
          email: student.email || "",
          curso: student.curso || "Curso não informado",
          condicoes: student.condicoes || [],
        };

        const isStudentAlreadyAdded = formData.alunos.some(
          (a) => a.id === mappedStudent.id
        );

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

        const allValid = newStudentsData.every(
          (student) => student && student.id && student.nome
        );
        setAllStudentsValidated(allValid);
      } else {
        throw new Error("Dados inválidos retornados pela base local");
      }
    } catch (err) {
      console.error("Erro ao buscar aluno:", err.response?.data || err.message);
      let errorMessage = null;
      if (
        err.response?.data?.mensagem ===
        "Aluno não encontrado na base de dados local"
      ) {
        errorMessage = "Aluno não encontrado";
      } else if (err.response?.data?.mensagem) {
        errorMessage = err.response.data.mensagem;
      } else {
        errorMessage = "Erro ao buscar aluno.";
      }
      setError(errorMessage);
      setAlertOpen(true);
      const newStudentsData = [...studentsData];
      newStudentsData[index] = null;
      setStudentsData(newStudentsData);
      setAllStudentsValidated(false);
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
    setAllStudentsValidated(false);
  };

  const handleRemoveStudent = (index) => {
    setMatriculaInputs((prev) => prev.filter((_, i) => i !== index));
    setStudentsData((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      alunos: prev.alunos.filter((_, i) => i !== index),
    }));
    const allValid = studentsData
      .filter((_, i) => i !== index)
      .every((student) => student && student.id && student.nome);
    setAllStudentsValidated(allValid);
  };

  const handleCondicaoChange = (index, newSelectedCondicoes) => {
    const newAlunos = [...formData.alunos];
    newAlunos[index] = { ...newAlunos[index], condicoes: newSelectedCondicoes };
    setFormData((prev) => ({ ...prev, alunos: newAlunos }));
  };

  const handleSubmit = async () => {
    if (!allStudentsValidated) {
      setError("Valide todos os alunos antes de prosseguir.");
      setAlertOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post("/demandas", {
        usuario_id: userId,
        descricao: formData.descricao,
        status: formData.status,
        disciplina: formData.disciplina || null,
        alunos: formData.alunos
          .map((aluno) => ({
            id: aluno.id,
            condicoes: aluno.condicoes.map((c) => c.id),
          }))
          .filter((aluno) => aluno.id),
        amparoLegal: formData.amparoLegal.map((amparo) => amparo.id),
      });
      setSuccess("Demanda cadastrada com sucesso!");
      setAlertOpen(true);
      setTimeout(() => navigate("/demands"), 2000);
    } catch (err) {
      console.error(
        "Erro ao criar demanda:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Erro ao cadastrar a demanda"
      );
      setAlertOpen(true);
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
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ width: "140%", maxWidth: "1200px" }}>
        <Typography
          variable="h5"
          fontSize="25px"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#000000",
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
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
              />
              <StyledTextField
                label="Email"
                value={studentsData[index]?.email || ""}
                variant="outlined"
                disabled
                sx={{ bgcolor: "#fff", borderRadius: "8px" }}
              />
              <StyledTextField
                label="Curso"
                value={studentsData[index]?.curso || ""}
                variant="outlined"
                disabled
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
                        color: INSTITUTIONAL_COLOR,
                      },
                      "&.Mui-focused": {
                        color: INSTITUTIONAL_COLOR,
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
                    renderValue={(selected) => {
                      const condicoes = formData.alunos[index]?.condicoes || [];
                      if (condicoes.length === 0) {
                        return "Nenhuma condição selecionada";
                      }
                      const displayedCondicoes = condicoes.slice(0, 2);
                      const text = displayedCondicoes
                        .map((c) => c.nome)
                        .join(", ");
                      return condicoes.length > 2 ? `${text}...` : text;
                    }}
                    sx={{ bgcolor: "#fff", borderRadius: "8px" }}
                    MenuProps={{
                      PaperProps: {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& .MuiSelect-select": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
            disabled={!allStudentsValidated}
            sx={{
              mb: 3,
              bgcolor: "#fff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "grey",
                },
                "&:hover fieldset": {
                  borderColor: "#388E3C",
                },
                "&.Mui-focused fieldset": {
                  borderColor: INSTITUTIONAL_COLOR,
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: INSTITUTIONAL_COLOR,
                },
                "&.MuiInputLabel-shrink": {
                  color: INSTITUTIONAL_COLOR,
                },
              },
            }}
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
              disabled={!allStudentsValidated}
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
            disabled={!allStudentsValidated}
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
            gap: 5,
            width: "100%",
          }}
        >
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
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.descricao ||
              formData.alunos.length === 0 ||
              !allStudentsValidated ||
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
        </Box>
      </Box>
    </Box>
  );
};

export default DemandaRegisterPage;
