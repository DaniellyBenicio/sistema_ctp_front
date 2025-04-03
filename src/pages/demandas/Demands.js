import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Button, Typography, Stack } from "@mui/material";
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

      if (!Array.isArray(demandsData)) {
        throw new Error("Erro ao buscar demandas: formato inválido.");
      }

      setDemands(demandsData);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setDemands([]);
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
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            height: "auto",
          }}
        >
          <FiltersSection
            onFilterChange={handleFilterChange}
            sx={{
              flexGrow: 1,
              width: "100%",
              height: "auto",
            }}
          />


        </Stack>

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