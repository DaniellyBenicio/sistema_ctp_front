import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Button, Typography } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import DemandsTable from "./DemandsTable";

export const Demands = () => {
  const [demands, setDemands] = useState([]);
  const [filteredDemands, setFilteredDemands] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { userRole } = useOutletContext();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User Role:", userRole);
    fetchDemands();
  }, [navigate, userRole]);

  const fetchDemands = async () => {
    try {
      const response = await api.get("/minhas-demandas");
      console.log("Dados da API:", response.data);
      const demandsData = response.data.demandas;
      if (!demandsData || !Array.isArray(demandsData)) {
        throw new Error("Erro ao buscar demandas: formato inválido.");
      }
      setDemands(demandsData);
      setFilteredDemands(demandsData);
      console.log("Demands atualizado:", demandsData);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setAlert({
        show: true,
        message: "Erro ao buscar demandas",
        type: "error",
      });
      setDemands([]);
      setFilteredDemands([]);
    }
  };

  const fetchDemandsByTermo = async (termo) => {
    try {
      const response = await api.get(`/demanda/busca/${termo}`);
      console.log("Dados da busca:", response.data);
      const demandsData = response.data.demandas || response.data;
      if (!demandsData || !Array.isArray(demandsData)) {
        throw new Error("Erro ao buscar demandas por termo.");
      }
      return demandsData;
    } catch (error) {
      console.error("Erro ao buscar por termo:", error);
      return [];
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value.trim();
    setSearchValue(value);

    if (!value) {
      setFilteredDemands(demands);
      console.log("FilteredDemands resetado para demands:", demands);
      setAlert({ show: false, message: "", type: "" });
      return;
    }

    const demandsByTermo = await fetchDemandsByTermo(value);
    if (demandsByTermo && demandsByTermo.length > 0) {
      setFilteredDemands(demandsByTermo);
      console.log("FilteredDemands atualizado com busca:", demandsByTermo);
      setAlert({ show: false, message: "", type: "" });
      return;
    }

    setFilteredDemands([]);
    console.log("FilteredDemands zerado por falta de resultados");
    setAlert({ show: false, message: "", type: "" });
  };

  const handleSendDemand = async (id) => {
    try {
      setDemands((prev) => prev.filter((d) => d.id !== id));
      setFilteredDemands((prev) => prev.filter((d) => d.id !== id));
      setAlert({
        show: true,
        message: "Demanda enviada com sucesso",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao enviar demanda:", error);
      setAlert({
        show: true,
        message: "Erro ao enviar demanda",
        type: "error",
      });
    }
  };

  const handleUpdateDemand = (demand) => {
    console.log("Atualizar demanda:", demand);
  };

  const handleViewDetails = (demand) => {
    console.log("Visualizar detalhes:", demand);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        marginTop: 0,
        padding: { xs: "2% 5%", sm: "2% 0%" },
      }}
    >
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#333",
          mb: 1,
          textAlign: "center",
          fontFamily: '"Open Sans", sans-serif',
          marginBottom: { xs: "16px", sm: "30px" },
        }}
      >
        Lista de Demandas
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1, sm: 2 },
          mb: 2,
          width: { xs: "100%", sm: "90%" },
          maxWidth: "1200px",
          alignSelf: "center",
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "100%", sm: "40%" },
            flexGrow: 0,
            height: { xs: "auto", sm: "35px" },
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
            bgcolor: "#2f9e41",
            "&:hover": { bgcolor: "#257a33" },
            minWidth: { xs: "100%", sm: "150px", md: "150px" },
            px: 2,
            height: { xs: "35px", sm: "38px" },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "4px 8px", sm: "6px 12px" },
            textTransform: "none",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate("/demands/register")}
        >
          Abrir Demanda
        </Button>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "90%" },
          maxWidth: "1200px",
          alignSelf: "center",
          mx: "auto",
        }}
      >
        {filteredDemands.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{
              mt: 2,
              fontSize: "0.875rem",
              fontFamily: '"Open Sans", sans-serif',
            }}
          >
            {searchValue
              ? "Nenhum resultado encontrado"
              : "Nenhuma demanda disponível"}
          </Typography>
        ) : (
          <DemandsTable
            demands={filteredDemands}
            onSend={handleSendDemand}
            onUpdate={handleUpdateDemand}
            usuarioLogadoId={userRole?.id}
            onDemandUpdated={fetchDemands}
            onViewDetails={handleViewDetails}
          />
        )}
      </Box>
    </Box>
  );
};

export default Demands;
