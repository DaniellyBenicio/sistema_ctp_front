import React, { useState, useEffect } from 'react';
import {
  FormControl, FormHelperText, List, ListItem, ListItemText, Checkbox, Typography, Box,
  TextField, Button
} from '@mui/material';
import api from '../../service/api';

const AmparoLegalList = ({ selectedAmparos, onAmparoChange }) => {
  const [amparos, setAmparos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [novoAmparo, setNovoAmparo] = useState('');
  const [outraSelecionada, setOutraSelecionada] = useState(false);

  const fetchAmparos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/amparos-legais');
      if (!Array.isArray(response.data)) {
        throw new Error('Formato de resposta inválido');
      }
      setAmparos(response.data);
    } catch (err) {
      setError('Erro ao carregar amparos legais');
      console.error('Erro ao buscar amparos:', err);
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Dados do erro:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmparos();
  }, []);

  const handleToggle = (amparo) => {
    const isOutra = amparo.nome.toLowerCase() === 'outra';
    let newSelectedAmparos = [...selectedAmparos];
    // Usa 'id' se existir, senão usa 'nome' como fallback
    const identifier = amparo.id !== undefined ? 'id' : 'nome';
    const currentIndex = newSelectedAmparos.findIndex(a => a[identifier] === amparo[identifier]);

    if (isOutra) {
      if (currentIndex === -1) {
        newSelectedAmparos = [amparo]; // Apenas "Outra"
        setOutraSelecionada(true);
      } else {
        newSelectedAmparos = []; // Remove "Outra"
        setOutraSelecionada(false);
        setNovoAmparo('');
      }
    } else {
      if (currentIndex === -1) {
        newSelectedAmparos.push(amparo); // Adiciona o item clicado
      } else {
        newSelectedAmparos.splice(currentIndex, 1); // Remove o item clicado
      }
      // Remove "Outra" se estiver presente
      newSelectedAmparos = newSelectedAmparos.filter(a => a.nome.toLowerCase() !== 'outra');
      setOutraSelecionada(false);
      setNovoAmparo('');
    }

    console.log('Novo selectedAmparos:', newSelectedAmparos); // Para depuração
    onAmparoChange(newSelectedAmparos);
  };

  const handleNovoAmparoChange = (e) => {
    setNovoAmparo(e.target.value);
  };

  const handleSalvarAmparo = async (e) => {
    e.stopPropagation();
    if (!novoAmparo.trim()) {
      setError('Digite um amparo legal válido');
      return;
    }

    setLoading(true);
    try {
      await api.post('/amparos-legais', { nome: novoAmparo });
      setNovoAmparo('');
      setOutraSelecionada(false);
      await fetchAmparos();
      setError(null);
      const updatedAmparos = await api.get('/amparos-legais');
      const novoAmparoAdicionado = updatedAmparos.data.find(a => a.nome === novoAmparo);
      if (novoAmparoAdicionado) {
        onAmparoChange([...selectedAmparos.filter(a => a.nome.toLowerCase() !== 'outra'), novoAmparoAdicionado]);
      }
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao salvar o novo amparo');
      console.error('Erro ao salvar amparo:', err);
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Dados do erro:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl fullWidth margin="normal">
      <FormHelperText id="amparos">Amparo Legal</FormHelperText>
      <Box
        sx={{
          maxHeight: 200,
          overflow: 'auto',
          border: '1px solid #ccc',
          borderRadius: 1,
          bgcolor: '#fff',
        }}
      >
        {loading ? (
          <Typography sx={{ p: 2 }}>Carregando amparos...</Typography>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : amparos.length === 0 ? (
          <Typography sx={{ p: 2 }}>Nenhum amparo disponível</Typography>
        ) : (
          <List>
            {amparos.map((amparo) => {
              const labelId = `checkbox-list-label-${amparo.id || amparo.nome}`;
              const identifier = amparo.id !== undefined ? 'id' : 'nome';
              const isSelected = selectedAmparos.some(a => a[identifier] === amparo[identifier]);
              const isOutra = amparo.nome.toLowerCase() === 'outra';

              return (
                <ListItem
                  key={amparo.id || amparo.nome}
                  dense
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(amparo);
                  }}
                  sx={{ padding: '0 8px' }}
                >
                  {isOutra && outraSelecionada ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                      <TextField
                        fullWidth
                        value={novoAmparo}
                        onChange={handleNovoAmparoChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Digite o novo amparo"
                        variant="outlined"
                        size="small"
                        disabled={loading}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSalvarAmparo}
                        disabled={loading || !novoAmparo.trim()}
                        sx={{
                          bgcolor: '#2f9e41',
                          '&:hover': { bgcolor: '#278735' },
                          minWidth: '80px',
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
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                      <ListItemText id={labelId} primary={amparo.nome} />
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

export default AmparoLegalList;