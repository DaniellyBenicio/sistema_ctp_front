import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  Select,
  Grid,
  Paper,
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
  marginBottom: theme.spacing(1),
  "& .MuiInputBase-root": {
    padding: "0px",
    height: "36px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#307c34", 
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#307c34", 
      borderWidth: "1px !important",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
    transform: "translate(0, 0) scale(1)",
    position: "relative",
    transformOrigin: "top left",
    pointerEvents: "auto",
    color: theme.palette.text.secondary,
    textAlign: "left",
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#307c34", 
    },
  },
  "& .MuiSelect-select": {
    paddingTop: "8px !important",
    paddingBottom: "8px !important",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ccc", 
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

  const today = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayFormatted = today();

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
        p: 1,
        mb: 1,
        borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e0e0e0",
        width: "100%",
        maxWidth: "1130px",
        margin: "0 auto",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          style={{ fontWeight: "", fontSize: "18px", paddingTop: "8px" }}
        >
          Gerenciamento de Demandas
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#2e7d32",
            "&:hover": {
              bgcolor: "#1b5e20",
              transform: "scale(1.05)",
            },
            minWidth: "140px",
            height: "35px",
            fontSize: "0.9rem",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            transition: "all 0.2s ease",
          }}
          onClick={() => navigate("/demands/register")}
        >
          Abrir Demanda
        </Button>
      </Box>
      <Divider sx={{ mb: 3, mt: 0.5 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={4.3} sx={{ position: "relative" }}>
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
          {showStudentList && filteredStudents.length > 0 && (
            <List
              sx={{
                position: "absolute",
                zIndex: 1000,
                bgcolor: "background.paper",
                width: inputRef.current ? inputRef.current.offsetWidth : "100%",
                maxHeight: 200,
                overflowY: "auto",
                marginTop: "-7px",
                boxShadow: 3,
                borderRadius: 1,
                p: 0,
              }}
            >
              {filteredStudents.map((student) => (
                <ListItem
                  key={student.matricula}
                  button
                  onClick={() => handleStudentSelect(student.nome)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  {student.nome}
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
        <Grid item xs={6} sm={2} md={1.8}>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="date">Data</InputLabel>
            <TextField
              id="date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: todayFormatted,
              }}
            />
          </StyledFormControl>
        </Grid>
        <Grid item xs={6} sm={3} md={3.8}>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="cursoId">Curso</InputLabel>
            <Select
              id="cursoId"
              name="cursoId"
              value={filters.cursoId}
              onChange={handleChange}
              IconComponent={ArrowDropDown}
            >
              <MenuItem value="">Todos</MenuItem>
              {courses.map((curso) => (
                <MenuItem key={curso.id} value={curso.id}>
                  {curso.nome}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
        <Grid item xs={6} sm={2} md={2}>
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
              <MenuItem value="encaminhada">Recebidas</MenuItem>
            </Select>
          </StyledFormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", gap: 3, justifyContent: "flex-start", mt: 1 }}
        >
          <Button
            variant="contained"
            onClick={handleFilter}
            sx={{
              bgcolor: "#3E7145",
              "&:hover": { bgcolor: "#2E5233" },
              height: "36px",
              minWidth: "80px",
              fontSize: "0.9rem",
              textTransform: "none",
            }}
          >
            <Search fontSize="small" />
            <span>Filtrar</span>
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{
              color: "#6c757d",
              borderColor: "#6c757d",
              "&:hover": { backgroundColor: "#f8f9fa" },
              height: "36px",
              minWidth: "80px",
              fontSize: "0.9rem",
              textTransform: "none",
            }}
          >
            <Clear fontSize="small" />
            <span>Limpar</span>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiltersSection;