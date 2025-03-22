import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress,
  FormControl, FormHelperText, Select, MenuItem, Typography, IconButton, Autocomplete
} from '@mui/material';
import { Close } from '@mui/icons-material';
import api from '../../service/api';
import UserListsDemands from './UserListsDemands';
import AmparoLegalList from './AmparoLegalList';

const DemandaRegisterPopup = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    status: true, 
    nivel: '',
    usuariosEncaminhados: [],
    alunos: [],
    amparoLegal: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nivelOptions, setNivelOptions] = useState([]);
  const [alunosOptions, setAlunosOptions] = useState([]);

  const fetchOptions = async () => {
    try {
      const nivelResponse = await api.get('/demandaniveis');
      const alunosResponse = await api.get('/aluno');

      setNivelOptions(nivelResponse.data);
      setAlunosOptions(alunosResponse.data);
    } catch (err) {
      setError('Erro ao buscar opções');
      console.error('Erro ao buscar opções:', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOptions();
      setFormData({
        descricao: '',
        status: true,
        nivel: '',
        usuariosEncaminhados: [],
        alunos: [],
        amparoLegal: [],
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (newSelectedUsers) => {
    setFormData((prev) => ({ ...prev, usuariosEncaminhados: newSelectedUsers }));
  };

  const handleAmparoChange = (newSelectedAmparos) => {
    setFormData((prev) => ({ ...prev, amparoLegal: newSelectedAmparos }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/demanda', {
        descricao: formData.descricao,
        status: formData.status,
        nivel: formData.nivel,
        usuariosEncaminhados: formData.usuariosEncaminhados.map(user => user.id),
        alunos: formData.alunos.map(aluno => aluno.id),
        amparoLegal: formData.amparoLegal.map(amparo => amparo.id),
      });
      setSuccess('Demanda cadastrada com sucesso!');
      onSave(response.data);
      setTimeout(() => onClose(), 2000);
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
          Criar Demanda
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
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
          inputProps={{ maxLength: 255 }}
          required
        />
        <FormControl fullWidth margin="normal">
          <FormHelperText id="status">Status</FormHelperText>
          <TextField
            disabled
            value="Aberto" 
            variant="outlined"
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormHelperText id="nivel">Nível</FormHelperText>
          <Select
            labelId="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            required
          >
            {nivelOptions.map((nivelItem) => (
              <MenuItem key={nivelItem.id} value={nivelItem.id}>
                {nivelItem.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <UserListsDemands
          selectedUsers={formData.usuariosEncaminhados}
          onUserChange={handleUserChange}
        />
        <Autocomplete
          multiple
          fullWidth
          options={alunosOptions}
          getOptionLabel={(option) => option.nome}
          value={formData.alunos}
          onChange={(e, value) => setFormData((prev) => ({ ...prev, alunos: value }))}
          renderInput={(params) => (
            <TextField {...params} label="Alunos Envolvidos" margin="normal" />
          )}
        />
        <AmparoLegalList
          selectedAmparos={formData.amparoLegal}
          onAmparoChange={handleAmparoChange}
        />
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
          disabled={
            loading ||
            !formData.descricao ||
            !formData.nivel ||
            formData.usuariosEncaminhados.length === 0
          }
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: '#2f9e41',
            '&:hover': { bgcolor: '#278735' },
          }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DemandaRegisterPopup;