import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  TextField,
  MenuItem,
  Select,
  Box,
  Button,
  Grid,
  Paper,
  Tooltip,
  List,
  ListItem,
  InputLabel,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import api from "../service/api";

const FiltersSection = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    date: "",
    studentName: "",
    course: "",
    createdBy: "",
  });

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const inputRef = useRef(null);

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

    if (name === "studentName") {
      const filtered = students.filter((student) =>
        student.nome.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredStudents(filtered);
      setShowStudentList(true);
    }
  };

  const handleStudentSelect = (studentName) => {
    setFilters((prev) => ({ ...prev, studentName: studentName }));
    setShowStudentList(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFilter = () => {
    onFilterChange && onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const newFilters = { date: "", studentName: "", course: "", createdBy: "" };
    setFilters(newFilters);
    setFilteredStudents([]);
    setShowStudentList(false);
    onFilterChange && onFilterChange(newFilters);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2, transition: "all 0.3s ease" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ position: "relative" }}>
            <TextField
              label="Nome do Aluno"
              name="studentName"
              value={filters.studentName}
              onChange={handleChange}
              onBlur={() => setTimeout(() => setShowStudentList(false), 200)}
              onFocus={() => setShowStudentList(true)}
              inputRef={inputRef}
            />
            {showStudentList && filters.studentName && (
              <List
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  bgcolor: "background.paper",
                  width: "100%",
                  maxHeight: 200,
                  overflowY: "auto",
                  marginTop: "50px",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >

                {filteredStudents.map((student) => (
                  <ListItem
                    key={student.matricula}
                    button
                    onClick={() => handleStudentSelect(student.nome)}
                  >
                    {student.nome}
                  </ListItem>
                ))}
              </List>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Data"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#4CAF50" },
                "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Cursos</InputLabel>
            <Select
              name="course"
              value={filters.course}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
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

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Criadas por</InputLabel>
            <Select
              name="createdBy"
              value={filters.createdBy}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
              }}
            >
              <MenuItem value="me">Por mim</MenuItem>
              <MenuItem value="forwarded">Encaminhadas</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Tooltip title="Filtrar">
            <Button
              variant="contained"
              onClick={handleFilter}
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#388E3C" },
                display: "flex",
                gap: 1,
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
              }}
            >
              <Clear />
              Limpar
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FiltersSection;