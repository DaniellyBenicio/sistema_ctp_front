import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, FormControl, FormHelperText, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { Email, Lock, Close } from '@mui/icons-material';
import api from '../service/api';

const UserRegisterPopup = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    email: '',
    senha: '',
    cargo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 
  const [cargos, setCargos] = useState([]);

  const fetchCargos = async () => {
    try {
      const response = await api.get('/cargos');
      const filteredCargos = response.data.filter(cargo => cargo.nome.toLowerCase() !== 'admin');
      setCargos(filteredCargos);
    } catch (err) {
      setError('Erro ao buscar os cargos');
      console.error('Erro ao buscar cargos:', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCargos();
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
      console.log('Dados enviados:', formData); 
      const response = await api.post('/auth/cadastro', formData);
      console.log('Resposta da API:', response.data); 
      setSuccess('Usuário cadastrado com sucesso!');
      onSave(response.data); 
      setFormData({ nome: '', matricula: '', email: '', senha: '', cargo: '' });
      setTimeout(() => {
        onClose(); 
      }, 2000);
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err.response || err); 
      setError(err.response?.data?.message || 'Erro ao cadastrar o usuário');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
          Cadastrar Usuário
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
          name="nome"
          label="Nome Completo"
          type="text"
          value={formData.nome}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!formData.email && !isEmailValid()}
          helperText={!!formData.email && !isEmailValid() ? 'Email inválido' : ''}
          InputProps={{
            startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          name="senha"
          label="Senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
          InputProps={{
            startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          name="matricula"
          label="Matrícula"
          type="number"
          value={formData.matricula}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <FormHelperText id="cargo">Tipo de Cargo</FormHelperText>
          <Select
            labelId="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
          >
            {cargos.map((cargoItem) => (
              <MenuItem key={cargoItem.id} value={cargoItem.id}>
                {cargoItem.nome}
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
          disabled={loading || !isEmailValid() || !formData.nome || !formData.senha}
          sx={{ 
            mt: 3, 
            mb: 2, 
            bgcolor: '#2f9e41',
            '&:hover': { 
              bgcolor: '#278735' // A slightly darker shade for hover effect
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

export default UserRegisterPopup;