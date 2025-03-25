import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import api from "../../service/api";

const CondicaoList = ({ selectedCondicoes, onCondicaoChange }) => {
  const [condicoes, setCondicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [novaCondicao, setNovaCondicao] = useState("");
  const [outraSelecionada, setOutraSelecionada] = useState(false);

  const fetchCondicoes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/condicoes");
      if (!Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }
      setCondicoes(response.data);
    } catch (err) {
      setError("Erro ao carregar condições");
      console.error("Erro ao buscar condições:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Dados do erro:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCondicoes();
  }, []);

  const handleToggle = (condicao) => {
    const isOutra = condicao.nome.toLowerCase() === "outra";
    let newSelectedCondicoes = [...selectedCondicoes];
    const currentIndex = newSelectedCondicoes.findIndex(
      (c) => c.nome === condicao.nome
    );

    if (isOutra) {
      if (currentIndex === -1) {
        newSelectedCondicoes.push(condicao);
        setOutraSelecionada(true);
      } else {
        newSelectedCondicoes = newSelectedCondicoes.filter(
          (c) => c.nome.toLowerCase() !== "outra"
        );
        setOutraSelecionada(false);
        setNovaCondicao("");
      }
    } else {
      if (currentIndex === -1) {
        newSelectedCondicoes.push(condicao);
      } else {
        newSelectedCondicoes.splice(currentIndex, 1);
      }
    }

    onCondicaoChange(newSelectedCondicoes);
  };

  const handleNovaCondicaoChange = (e) => {
    setNovaCondicao(e.target.value);
  };

  const handleSalvarCondicao = async (e) => {
    e.stopPropagation();
    if (!novaCondicao.trim()) {
      setError("Digite uma condição válida");
      return;
    }

    setLoading(true);
    try {
      await api.post("/condicoes", { nome: novaCondicao });
      setNovaCondicao("");
      setOutraSelecionada(false);
      await fetchCondicoes();
      setError(null);
      const updatedCondicoes = await api.get("/condicoes");
      const novaCondicaoAdicionada = updatedCondicoes.data.find(
        (c) => c.nome === novaCondicao
      );
      if (novaCondicaoAdicionada) {
        const newSelectedCondicoes = [
          ...selectedCondicoes.filter((c) => c.nome.toLowerCase() !== "outra"),
          novaCondicaoAdicionada,
        ];
        onCondicaoChange(newSelectedCondicoes);
      }
    } catch (err) {
      setError(
        err.response?.data?.mensagem || "Erro ao salvar a nova condição"
      );
      console.error("Erro ao salvar condição:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl fullWidth margin="normal">
      <FormHelperText id="condicoes">Condições do Aluno</FormHelperText>
      <Box
        sx={{
          maxHeight: 200,
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: 1,
          bgcolor: "#fff",
        }}
      >
        {loading ? (
          <Typography sx={{ p: 2 }}>Carregando condições...</Typography>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : condicoes.length === 0 ? (
          <Typography sx={{ p: 2 }}>Nenhuma condição disponível</Typography>
        ) : (
          <List>
            {condicoes.map((condicao) => {
              const labelId = `checkbox-list-label-${condicao.nome}`;
              const isSelected = selectedCondicoes.some(
                (c) => c.nome === condicao.nome
              );
              const isOutra = condicao.nome.toLowerCase() === "outra";

              return (
                <ListItem
                  key={condicao.nome}
                  dense
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(condicao);
                  }}
                  sx={{ padding: "0 8px" }}
                >
                  {isOutra && outraSelecionada ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 1,
                      }}
                    >
                      <TextField
                        fullWidth
                        value={novaCondicao}
                        onChange={handleNovaCondicaoChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Digite a nova condição"
                        variant="outlined"
                        size="small"
                        disabled={loading}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSalvarCondicao}
                        disabled={loading || !novaCondicao.trim()}
                        sx={{
                          bgcolor: "#2f9e41",
                          "&:hover": { bgcolor: "#278735" },
                          minWidth: "80px",
                        }}
                      >
                        Salvar
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                      <ListItemText id={labelId} primary={condicao.nome} />
                    </>
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </FormControl>
  );
};

export default CondicaoList;
