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
  styled,
  Divider,
  Typography,
} from "@mui/material";
import { Search, Clear, ArrowDropDown } from "@mui/icons-material";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputBase-root': {
    padding: '0px',
    height: '40px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
    marginBottom: theme.spacing(0),
    transform: 'translate(0, 0) scale(1)',
    position: 'relative',
    transformOrigin: 'top left',
    pointerEvents: 'auto',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.MuiFormLabel-filled': {
      color: theme.palette.text.secondary,
    },
  },
  '& .MuiSelect-select': {
    paddingTop: '10px !important',
    paddingBottom: '10px !important',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ccc',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '1px !important',
  },
}));

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
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e0e0e0',
        transition: "all 0.3s ease",
        width: "100%",
        maxWidth: "1130px",
        margin: "0 auto",
        background: "#fff",
        marginBottom: "20px"
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
        <Typography variant="h6">
          Gerenciamento de Demandas
        </Typography>
        <Button
          variant="contained"
          className="btn btn-primary"
          sx={{
            bgcolor: "#349042",
            "&:hover": { bgcolor: "#257a33" },
            minWidth: "150px",
            px: 2,
            height: "40px",
            fontSize: "0.875rem",
            padding: "6px 12px",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
            textTransform: 'none',
          }}
          onClick={() => {
            navigate("/demands/register");
          }}
        >
          Abrir Demanda
        </Button>
      </Box>
      <Divider sx={{ mb: 3, mt: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5} sx={{ position: 'relative' }}>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="nomeAluno">Nome do Aluno</InputLabel>
            <TextField
              id="nomeAluno"
              name="nomeAluno"
              value={filters.nomeAluno}
              onChange={handleChange}
              onFocus={() => setShowStudentList(true)}
              inputRef={inputRef}
            />
          </StyledFormControl>
          {showStudentList && filters.nomeAluno && (
            <List
              sx={{
                position: "absolute",
                zIndex: 1000,
                bgcolor: "background.paper",
                width: "100%",
                maxHeight: filteredStudents.length > 5 ? 80 : 'fit-content',
                overflowY: filteredStudents.length > 5 ? "auto" : "hidden",
                marginTop: '-1px',
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: "2px",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              {filteredStudents.map((student) => (
                <ListItem
                  key={student.matricula}
                  button
                  onClick={() => handleStudentSelect(student.nome)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  {student.nome}
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="date">Data</InputLabel>
            <TextField
              id="date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </StyledFormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="cursoId">Curso</InputLabel>
            <Select
              id="cursoId"
              name="cursoId"
              value={filters.cursoId}
              onChange={handleChange}
              IconComponent={ArrowDropDown}
            >
              <MenuItem value="">Todas</MenuItem>
              {courses.map((curso) => (
                <MenuItem key={curso.id} value={curso.id}>
                  {curso.nome}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="tipoDemanda">Tipo de Demanda</InputLabel>
            <Select
              id="tipoDemanda"
              name="tipoDemanda"
              value={filters.tipoDemanda}
              onChange={handleChange}
              IconComponent={ArrowDropDown}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="criadaPorMim">Criada por Mim</MenuItem>
              <MenuItem value="recebidas">Recebidas</MenuItem>
            </Select>
          </StyledFormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
          <Tooltip>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={handleFilter}
              sx={{
                bgcolor: "#3E7145",
                color: "#fff",
                "&:hover": { bgcolor: "#2E52323" },
                boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
                textTransform: 'none',
                height: '40px',
              }}
            >
              <Search />
              <span className="ms-1">Filtrar</span>
            </Button>
          </Tooltip>
          <Tooltip>
            <Button
              variant="outlined"
              className="btn btn-outline-secondary"
              onClick={handleClearFilters}
              sx={{
                color: "#6c757d",
                borderColor: "#6c757d",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#6c757d",
                },
                boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
                textTransform: 'none',
                height: '40px',
              }}
            >
              <Clear />
              <span className="ms-1">Limpar</span>
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiltersSection;