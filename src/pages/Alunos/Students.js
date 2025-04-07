import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import StudentsTable from "./StudentsTable";

const Students = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleNewStudent = () => {
    navigate("/alunos/register");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        marginTop: { xs: 0, sm: 4 },
        padding: { xs: "16px 2px", sm: "0px 0" },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#333",
          mb: { xs: 4, sm: 5 },
          textAlign: "center",
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Lista de Alunos
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1, sm: 2 },
          width: { xs: "90%", sm: "90%" },
          maxWidth: "1200px",
          alignSelf: "center",
          px: { xs: 0, sm: 1 },
          mb: { xs: 2, sm: 1 },
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "100%", sm: "35%" },
            maxWidth: { sm: "400px" },
            flexGrow: 0,
            height: { xs: "auto", sm: "35px" },
            ml: 0,
            "& .MuiInputBase-root": {
              height: "35px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: "#2e7d32",
            "&:hover": {
              bgcolor: "#1b5e20",
              transform: "scale(1.05)",
            },
            minWidth: { xs: "100%", sm: "140px" },
            height: { xs: "36px", sm: "40px" },
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleNewStudent}
        >
          Novo Aluno
        </Button>
      </Box>

      <Box
        sx={{
          width: { xs: "90%", sm: "90%" },
          maxWidth: "1200px",
          alignSelf: "center",
          mx: "auto",
          px: 0,
          mt: { xs: 0.5, sm: 1 },
        }}
      >
        <StudentsTable searchValue={searchValue} />
      </Box>
    </Box>
  );
};

export default Students;
