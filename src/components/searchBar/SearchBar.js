import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

const INSTITUTIONAL_COLOR = "#307c34";

const SearchBar = ({ value, onChange }) => {
  const handleInputChange = (e) => {  // Função para lidar com a mudança no valor do input
    onChange(e);
  };

  return (
    <TextField
      variant="outlined"
      placeholder="Buscar..."
      value={value}
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      sx={{
        width: { xs: "100%", sm: "40%" },
        marginBottom: { xs: 1, sm: 2 },
        "& .MuiOutlinedInput-root": {
          height: { xs: "32px", sm: "40px" },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          padding: { xs: "0 6px", sm: "0 8px" },
          "& fieldset": {
            borderColor: "#ced4da",
          },
          "&:hover fieldset": {
            borderColor: "#388E3C",
          },
          "&.Mui-focused fieldset": {
            borderColor: INSTITUTIONAL_COLOR,
          },
        },
        "& .MuiInputBase-input": {
          padding: { xs: "0 0 0 6px", sm: "0 0 0 8px" },
        },
        "& .MuiInputAdornment-root": {
          height: { xs: "32px", sm: "40px" },
          display: "flex",
          alignItems: "center",
          "& .MuiSvgIcon-root": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        },
        "& .MuiInputBase-input::placeholder": {
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        },
      }}
    />
  );
};

export default SearchBar;