import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  Select,
  Grid,
  Paper,
  Tooltip,
  List,
  ListItem,
  InputLabel,
  Button,
  Box,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";

const FiltersSection = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    nomeAluno: "",
    cursoId: "",
    date: "",
    tipoDemanda: "",
  });

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/cursos");
        setCourses(response.data);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/alunos");
        setStudents(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "nomeAluno") {
      const filtered = students.filter((student) =>
        student.nome.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStudents(filtered);
      setShowStudentList(true);
    }
  };

  const handleStudentSelect = (studentName) => {
    setFilters((prev) => ({ ...prev, nomeAluno: studentName }));
    setShowStudentList(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFilter = () => {
    console.log("Filtros enviados:", filters);
    onFilterChange && onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const newFilters = {
      nomeAluno: "",
      cursoId: "",
      date: "",
      tipoDemanda: "",
    };
    setFilters(newFilters);
    setFilteredStudents([]);
    setShowStudentList(false);
    onFilterChange && onFilterChange(newFilters);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowStudentList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Paper
      ref={wrapperRef}
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        transition: "all 0.3s ease",
        width: "100%",
        maxWidth: "1130px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Filtros */}
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={5} md={5}>
              <FormControl fullWidth sx={{ position: "relative" }}>
                <TextField
                  label="Nome do Aluno"
                  name="nomeAluno"
                  value={filters.nomeAluno}
                  onChange={handleChange}
                  onFocus={() => setShowStudentList(true)}
                  inputRef={inputRef}
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "0px",
                      height: "53px",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.9rem",
                    },
                  }}
                />
                {showStudentList && filters.nomeAluno && (
                  <List
                    sx={{
                      position: "absolute",
                      zIndex: 1000,
                      bgcolor: "background.paper",
                      width: "100%",
                      maxHeight: 200,
                      overflowY: "auto",
                      marginTop: "56px",
                      fontSize: "14px",
                      border: "1px solid rgba(0, 0, 0, 0.2)",
                      borderRadius: "4px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {filteredStudents.map((student) => (
                      <ListItem
                        key={student.matricula}
                        button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleStudentSelect(student.nome);
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#e0f7fa",
                          },
                        }}
                      >
                        {student.nome}
                      </ListItem>
                    ))}
                  </List>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2} md={1.5}>
              <TextField
                label="Data"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    padding: "0px",
                    height: "53px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <FormControl fullWidth sx={{ height: "0px" }}>
                <InputLabel sx={{ fontSize: "1rem" }}>Curso</InputLabel>
                <Select
                  name="cursoId"
                  value={filters.cursoId}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "0px",
                      height: "10px",
                    },
                    fontSize: "0.9rem",
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {courses.map((curso) => (
                    <MenuItem key={curso.id} value={curso.id}>
                      {curso.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2} md={2.5}>
              <FormControl fullWidth sx={{ height: "56px" }}>
                <InputLabel sx={{ fontSize: "1rem" }}>
                  Tipo de Demanda
                </InputLabel>
                <Select
                  name="tipoDemanda"
                  value={filters.tipoDemanda}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "0px",
                      height: "10px",
                    },
                    fontSize: "0.9rem",
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="criadaPorMim">Criada por Mim</MenuItem>
                  <MenuItem value="recebidas">Recebidas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Botões */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Filtrar">
                <Button
                  variant="contained"
                  onClick={handleFilter}
                  sx={{
                    bgcolor: "#2f9e41", // Mesma cor de "Abrir Demanda"
                    "&:hover": { bgcolor: "#257a33" }, // Mesma cor de hover
                    display: "flex",
                    gap: 1,
                    minWidth: "120px",
                    height: "40px",
                  }}
                >
                  <Search />
                  Filtrar
                </Button>
              </Tooltip>
              <Tooltip title="Limpar Filtros">
                <Button
                  variant="contained"
                  onClick={handleClearFilters}
                  sx={{
                    backgroundColor: "#F5F5F5",
                    color: "#000",
                    "&:hover": { backgroundColor: "#E0E0E0" },
                    display: "flex",
                    gap: 1,
                    minWidth: "120px",
                    height: "40px",
                  }}
                >
                  <Clear />
                  Limpar
                </Button>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#2f9e41",
                "&:hover": { bgcolor: "#257a33" },
                minWidth: "150px",
                px: 2,
                height: "40px",
                fontSize: "0.875rem",
                padding: "6px 12px",
                textTransform: "uppercase", // Caixa alta
                boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              }}
              onClick={() => navigate("/demands/register")}
            >
              Abrir Demanda
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiltersSection;
