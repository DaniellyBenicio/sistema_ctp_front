import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import api from "../../service/api";
import { jwtDecode } from "jwt-decode";

const DemandDetailsPopup = ({ open, onClose, demand }) => {
  const [amparosLegais, setAmparosLegais] = useState([]);
  const [alunosComCondicoes, setAlunosComCondicoes] = useState([]);
  const [intervencao, setIntervencao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role); 
        console.log("Usuário logado:", { id: decoded.id, role: decoded.role });
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    } else {
      console.log("Nenhum token encontrado no localStorage");
    }
  }, []);

  const fetchAmparosPorDemanda = async (demandaId) => {
    try {
      const response = await api.get(`/amparos-legais/demanda/${demandaId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAmparosLegais(response.data);
    } catch (err) {
      setError("Erro ao carregar amparos legais da demanda");
      console.error("Erro ao buscar amparos legais:", err);
    }
  };
  const fetchAlunoDetails = async (matricula) => {
    try {
      const response = await api.get(`/alunos/${matricula}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(`Dados do aluno ${matricula} retornados:`, response.data);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar aluno ${matricula}:`, err);
      return null;
    }
  };

  const handleFecharDemanda = async () => {
    if (!intervencao.trim()) {
      setError("A intervenção é obrigatória para fechar a demanda");
      return;
    }

    try {
      setLoading(true);

      const intervencaoResponse = await api.post(
        "/intervencoes",
        { descricao: intervencao },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const intervencaoId = intervencaoResponse.data.intervencao.id;
      console.log("Intervenção criada:", intervencaoResponse.data);

      const encaminhamentoId = demand.destinatarios[0]?.encaminhamento_id || 1;
      const intervencaoDemandaResponse = await api.post(
        "/intervencoes-demandas",
        {
          intervencao_id: intervencaoId,
          demanda_id: demand.id,
          data: new Date().toISOString(),
          descricao: intervencao,
          encaminhamento_id: encaminhamentoId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Intervenção associada à demanda:", intervencaoDemandaResponse.data);

      const demandaResponse = await api.put(
        `/demandas/${demand.id}`,
        { status: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Demanda fechada:", demandaResponse.data);

      onClose();
    } catch (err) {
      setError("Erro ao fechar a demanda ou salvar a intervenção");
      console.error("Erro ao fechar demanda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && demand?.id) {
      setLoading(true);
      setError(null);
      console.log("Demand recebida:", demand);

      fetchAmparosPorDemanda(demand.id);

      const fetchAlunos = async () => {
        const alunosPromises =
          demand.DemandaAlunos?.map(async (da) => {
            const matricula = da.Aluno?.matricula || da.matricula;
            if (!matricula) {
              console.error("Matrícula não encontrada para o aluno:", da);
              return { ...da.Aluno, condicoes: [] };
            }
            const alunoData = await fetchAlunoDetails(matricula);
            return {
              ...da.Aluno,
              matricula: alunoData?.matricula || matricula,
              nome: alunoData?.nome || da.Aluno?.nome,
              condicoes: alunoData?.condicoes || [],
            };
          }) || [];
        const alunosResult = await Promise.all(alunosPromises);
        console.log("Alunos com condições carregados:", alunosResult);
        setAlunosComCondicoes(alunosResult);
        setLoading(false);
      };

      fetchAlunos();
    }
  }, [open, demand]);

  const podeFecharDemanda = () => {
    if (!userId || !demand || !userRole) {
      console.log("Faltam dados para verificar permissão:", { userId, demand, userRole });
      return false;
    }

    const isCriador = demand.usuario_id === userId;
    const isDestinatario = demand.destinatarios?.some(
      (dest) => dest.id === userId || dest.usuario_id === userId
    );
    const isCtp = userRole === "ctp";

    console.log("Verificação de permissão:", {
      isCriador,
      isDestinatario,
      isCtp,
      userId,
      criadorDemanda: demand.usuario_id,
    });

    const podeFechar = (isCriador && isCtp) || (!isCriador && isDestinatario);
    console.log("Pode fechar demanda?", podeFechar);
    return podeFechar;
  };

  if (!demand) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes da Demanda</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography>
            <strong>Descrição:</strong> {demand.descricao || "Não informada"}
          </Typography>

          <Typography>
            <strong>Alunos Envolvidos:</strong>
          </Typography>
          {loading ? (
            <Typography sx={{ ml: 2 }}>Carregando alunos...</Typography>
          ) : error ? (
            <Typography sx={{ ml: 2, color: "error.main" }}>{error}</Typography>
          ) : alunosComCondicoes.length > 0 ? (
            alunosComCondicoes.map((aluno) => (
              <Stack key={aluno.matricula || aluno.id} sx={{ ml: 2 }}>
                <Typography>- {aluno.nome || "Nome não informado"}</Typography>
                <Typography sx={{ ml: 2 }}>
                  <strong>Condições:</strong>{" "}
                  {aluno.condicoes && aluno.condicoes.length > 0
                    ? aluno.condicoes
                        .map((c) => c.nome || "Nome não informado")
                        .join(", ")
                    : "Nenhuma condição associada"}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography sx={{ ml: 2 }}>Nenhum aluno associado</Typography>
          )}

          <Typography>
            <strong>Status:</strong> {demand.status ? "Ativo" : "Inativo"}
          </Typography>

          <Typography>
            <strong>Disciplina:</strong>{" "}
            {demand.disciplina || "Não informada"}
          </Typography>

          <Typography>
            <strong>Amparo Legal:</strong>
          </Typography>
          {loading ? (
            <Typography sx={{ ml: 2 }}>Carregando amparos...</Typography>
          ) : error ? (
            <Typography sx={{ ml: 2, color: "error.main" }}>{error}</Typography>
          ) : amparosLegais.length > 0 ? (
            amparosLegais.map((amparo) => (
              <Typography key={amparo.id} sx={{ ml: 2 }}>
                - {amparo.nome}
              </Typography>
            ))
          ) : (
            <Typography sx={{ ml: 2 }}>Nenhum amparo legal associado</Typography>
          )}

          <Typography>
            <strong>Intervenção:</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={intervencao}
            onChange={(e) => setIntervencao(e.target.value)}
            placeholder="Descreva a intervenção realizada"
            variant="outlined"
            disabled={loading}
          />

          <Typography>
            <strong>Total de Destinatários:</strong>{" "}
            {demand.destinatarios?.length || 0}
          </Typography>
          {demand.destinatarios && demand.destinatarios.length > 0 ? (
            <Stack>
              <Typography>
                <strong>Destinatários:</strong>
              </Typography>
              {demand.destinatarios.map((dest) => (
                <Typography key={dest.id} sx={{ ml: 2 }}>
                  - {dest.nome}
                </Typography>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ ml: 2 }}>Nenhum destinatário</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Fechar Popup
        </Button>
        <Button
          onClick={handleFecharDemanda}
          color="secondary"
          variant="contained"
          disabled={loading || !podeFecharDemanda() || !demand.status}
        >
          Fechar Demanda
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DemandDetailsPopup;