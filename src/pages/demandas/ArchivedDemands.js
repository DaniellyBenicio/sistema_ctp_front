import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Typography } from "@mui/material";
import ArchivedDemandsTable from "./ArchivedDemandsTable";

export const ArchivedDemands = () => {
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
      if (!demandsData || !Array.isArray(demandsData)) {
        throw new Error("Erro ao buscar demandas: formato inválido.");
      }
      const archivedDemands = demandsData.filter((demand) => !demand.status);
      setDemands(archivedDemands);
      console.log("Archived Demands atualizado:", archivedDemands);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setDemands([]);
    }
  };

  const handleViewDetails = (demand) => {
    console.log("Visualizar detalhes:", demand);
    navigate(`/demands/${demand.id}`);
  };

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
          marginBottom: { xs: "16px", sm: "30px" },
        }}
      >
        Lista de Demandas Fechadas
      </Typography>

      <Box
        sx={{
          width: { xs: "100%", sm: "90%" },
          maxWidth: "1200px",
          alignSelf: "center",
          mx: "auto",
        }}
      >
        {demands.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{
              mt: 2,
              fontSize: "0.875rem",
            }}
          >
            Nenhuma demanda fechada disponível
          </Typography>
        ) : (
          <ArchivedDemandsTable
            demands={demands}
            onViewDetails={handleViewDetails}
            usuarioLogadoId={userRole?.id}
          />
        )}
      </Box>
    </Box>
  );
};

export default ArchivedDemands;
