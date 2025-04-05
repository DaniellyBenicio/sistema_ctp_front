import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Typography, Stack } from "@mui/material";
import FiltersSection from "../../components/filtersSection/FiltersSection";
import DemandsTable from "./DemandsTable";

export const Demands = () => {
  const [allDemands, setAllDemands] = useState([]);
  const { userRole } = useOutletContext();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchDemands();
  }, [navigate, userRole]);

  const fetchDemands = async (filterParams = {}) => {
    try {
      const response = await api.post("/minhas-demandas", filterParams);
      const demandsData = response.data.demandas || [];

      if (!Array.isArray(demandsData)) {
        throw new Error("Erro ao buscar demandas: formato inválido.");
      }

      setAllDemands(demandsData);
    } catch (error) {
      console.error("Demands - Erro na requisição:", error);
      setAllDemands([]);
    }
  };

  const handleFilterChange = (filters) => {
    setPage(1);
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
      setAllDemands((prev) => prev.filter((d) => d.id !== id));
      setAlert({
        show: true,
        message: "Demanda enviada com sucesso",
        type: "success",
      });
    } catch (error) {
      console.error("Demands - Erro ao enviar demanda:", error);
      setAlert({
        show: true,
        message: "Erro ao enviar demanda",
        type: "error",
      });
    }
  };

  const handlePageChange = (event, value) => {
    console.log("Demands - handlePageChange chamado para página:", value);
    setPage(value);
  };

  const openDemands = allDemands.filter((demand) => demand.status);
  const count = Math.ceil(openDemands.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDemands = openDemands.slice(startIndex, endIndex);

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
          mb: -1,
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
            Nenhuma demanda encontrada
          </Typography>
        ) : (
          <DemandsTable
            demands={currentDemands}
            onSend={handleSendDemand}
            usuarioLogadoId={userRole?.id}
            onDemandUpdated={fetchDemands}
            count={count}
            page={page}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default Demands;
