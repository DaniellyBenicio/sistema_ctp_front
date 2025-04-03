import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Button, Typography } from "@mui/material";
import FiltersSection from "../../components/FiltersSection";
import DemandsTable from "./DemandsTable";

export const Demands = () => {
  const [demands, setDemands] = useState([]);
  const { userRole } = useOutletContext();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User Role:", userRole);
    fetchDemands();
  }, [navigate, userRole]);

  const fetchDemands = async (filterParams = {}) => {
    try {
      const response = await api.post("/minhas-demandas", filterParams);
      const demandsData = response.data.demandas;

      // Verifica se demandsData é um array válido
      if (!Array.isArray(demandsData)) {
        throw new Error("Erro ao buscar demandas: formato inválido.");
      }

      // Mesmo que o array esteja vazio, é um resultado válido, então apenas atualizamos o estado
      setDemands(demandsData);
      console.log("Demands atualizado:", demandsData);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setAlert({
        show: true,
        message: "Erro ao buscar demandas",
        type: "error",
      });
      setDemands([]); // Define como vazio em caso de erro real
    }
  };

  const handleFilterChange = (filters) => {
    const filterParams = {
      nomeAluno: filters.nomeAluno || "",
      cursoId: filters.cursoId || "",
      date: filters.date || "",
      tipoDemanda: filters.tipoDemanda || "",
    };
    fetchDemands(filterParams);
  };

  const handleSendDemand = async (id) => {
    try {
      setDemands((prev) => prev.filter((d) => d.id !== id));
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

  const openDemands = demands.filter((demand) => demand.status);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
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
        Lista de Demandas Abertas
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
        <FiltersSection
          onFilterChange={handleFilterChange}
          sx={{
            width: { xs: "100%", sm: "40%" },
            flexGrow: 0,
            height: { xs: "auto", sm: "35px" },
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
        {openDemands.length === 0 ? (
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
            Nenhuma demanda para o filtro informado
          </Typography>
        ) : (
          <DemandsTable
            demands={openDemands}
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
