import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress,
  FormControl, FormHelperText, Select, MenuItem, Typography, IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import api from '../../service/api';

const DemandaRegisterPopup = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    status: '',
    nivel: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [nivelOptions, setNivelOptions] = useState([]);

  const fetchOptions = async () => {
    try {
      const statusResponse = await api.get('/status');
      const nivelResponse = await api.get('/nivel');
      setStatusOptions(statusResponse.data);
      setNivelOptions(nivelResponse.data);
    } catch (err) {
      setError('Erro ao buscar as opções de status e nível');
      console.error('Erro ao buscar opções:', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOptions();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/demanda', formData);
      setSuccess('Demanda cadastrada com sucesso!');
      onSave(response.data);
      setFormData({ descricao: '', status: '', nivel: '' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao cadastrar a demanda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
          Cadastrar Demanda
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          fullWidth
          margin="normal"
          name="descricao"
          label="Descrição"
          type="text"
          value={formData.descricao}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <FormHelperText id="status">Status</FormHelperText>
          <Select
            labelId="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map((statusItem) => (
              <MenuItem key={statusItem.id} value={statusItem.id}>
                {statusItem.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormHelperText id="nivel">Nível</FormHelperText>
          <Select
            labelId="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
          >
            {nivelOptions.map((nivelItem) => (
              <MenuItem key={nivelItem.id} value={nivelItem.id}>
                {nivelItem.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
            {success}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          disabled={loading || !formData.descricao || !formData.status || !formData.nivel}
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: '#2f9e41',
            '&:hover': {
              bgcolor: '#278735',
            }
          }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DemandaRegisterPopup;
