import React, { useState, useEffect } from 'react';
import {
  Button, TextField, CircularProgress, FormControl, Select, MenuItem,
  Typography, Divider, Box, Paper, InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import api from '../../service/api';
import UserListsDemands from './UserListsDemands';
import AmparoLegalList from './AmparoLegalList';
import { jwtDecode } from 'jwt-decode';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

const INSTITUTIONAL_COLOR = '#307c34';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  width: '100%',
  boxSizing: 'border-box',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 'bold',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '40px',
    fontSize: '0.875rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    transform: 'translate(14px, 10px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: '40px',
  fontSize: '0.875rem',
  '& .MuiSelect-select': {
    padding: '8px 14px',
  },
}));

const DemandaRegisterPage = () => {
  const [formData, setFormData] = useState({
    descricao: '',
    status: true,
    nivel: '',
    disciplina: '',
    condicao: '',
    usuariosEncaminhados: [],
    alunos: [],
    amparoLegal: [],
  });
  const [matriculaInputs, setMatriculaInputs] = useState(['']);
  const [studentsData, setStudentsData] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nivelOptions, setNivelOptions] = useState([]);
  const token = localStorage.getItem('token');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const fetchOptions = async () => {
    try {
      const nivelResponse = await api.get('/demandaniveis');
      setNivelOptions(nivelResponse.data);
    } catch (err) {
      setError('Erro ao buscar opções de níveis');
      console.error('Erro ao buscar opções:', err);
    }
  };

  const getUserId = () => {
    const decoded = jwtDecode(token);
    setUserId(decoded.id);
  };

  useEffect(() => {
    fetchOptions();
    getUserId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMatriculaChange = (index, value) => {
    // Aceita apenas números
    const numericValue = value.replace(/[^0-9]/g, '');
    const newMatriculaInputs = [...matriculaInputs];
    newMatriculaInputs[index] = numericValue;
    setMatriculaInputs(newMatriculaInputs);
  };

  const handleUserChange = (newSelectedUsers) => {
    setFormData((prev) => ({ ...prev, usuariosEncaminhados: newSelectedUsers }));
  };

  const handleAmparoChange = (newSelectedAmparos) => {
    setFormData((prev) => ({ ...prev, amparoLegal: newSelectedAmparos }));
  };

  const handleSearchByMatricula = async (index) => {
    const matriculaInput = matriculaInputs[index];
    if (!matriculaInput) {
      setError('Por favor, insira um número de matrícula.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('Buscando matrícula:', matriculaInput);
      console.log('URL completa:', `${api.defaults.baseURL}/alunos/${matriculaInput}`);
      const response = await api.get(`/alunos/${matriculaInput}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      const student = response.data;
      console.log('Dados retornados do backend:', student); 

      if (student?.nome) {
        const mappedStudent = {
          id: student.matricula, 
          nome: student.nome,
          email: student.email,
          curso: student.curso,
          condicao: '',
        };
        const newStudentsData = [...studentsData];
        newStudentsData[index] = mappedStudent;
        setStudentsData(newStudentsData);

        setFormData((prev) => {
          const newAlunos = [...prev.alunos];
          const isAlreadyAdded = newAlunos.some((a) => a.id === mappedStudent.id);
          if (!isAlreadyAdded) {
            newAlunos[index] = mappedStudent;
          }
          return { ...prev, alunos: newAlunos };
        });
      } else {
        setError('Aluno não encontrado.');
        const newStudentsData = [...studentsData];
        newStudentsData[index] = null;
        setStudentsData(newStudentsData);
      }
    } catch (err) {
      setError('Erro ao buscar aluno. Verifique a matrícula e tente novamente.');
      console.error('Erro ao buscar aluno:', err.response?.data || err.message);
      const newStudentsData = [...studentsData];
      newStudentsData[index] = null;
      setStudentsData(newStudentsData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setMatriculaInputs([...matriculaInputs, '']);
    setStudentsData([...studentsData, null]);
    setFormData((prev) => ({
      ...prev,
      alunos: [...prev.alunos, { id: '', nome: '', email: '', curso: '', condicao: '' }],
    }));
  };

  const handleRemoveStudent = (index) => {
    setMatriculaInputs((prev) => prev.filter((_, i) => i !== index));
    setStudentsData((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      alunos: prev.alunos.filter((_, i) => i !== index),
    }));
  };

  const handleCondicaoChange = (index, value) => {
    const newAlunos = [...formData.alunos];
    newAlunos[index] = { ...newAlunos[index], condicao: value };
    setFormData((prev) => ({ ...prev, alunos: newAlunos }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post('/criar-demanda', {
        usuario_id: userId,
        descricao: formData.descricao,
        status: formData.status,
        nivel: formData.nivel,
        disciplina: formData.disciplina,
        condicao: formData.condicao,
        usuariosEncaminhados: formData.usuariosEncaminhados.map((user) => user.id),
        alunos: formData.alunos.map((aluno) => aluno.id).filter((id) => id),
        amparoLegal: formData.amparoLegal.map((amparo) => amparo.id),
      });
      setSuccess('Demanda cadastrada com sucesso!');
      setTimeout(() => navigate('/demands'), 2000);
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao cadastrar a demanda');
      console.error('Erro ao criar demanda:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      bgcolor: '#f0f2f5',
      p: { xs: 2, sm: 4 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
    }}>
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: INSTITUTIONAL_COLOR,
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.1)',
            mb: 4,
          }}
        >
          Nova Demanda
        </Typography>

        {/* Dados do Aluno - Múltiplos Alunos */}
        {matriculaInputs.map((matriculaInput, index) => (
          <StyledPaper key={index} elevation={3} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: INSTITUTIONAL_COLOR }}>
              Dados do Aluno
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '100%' }}>
              <StyledTextField
                fullWidth
                label="Matrícula"
                value={matriculaInput}
                onChange={(e) => handleMatriculaChange(index, e.target.value)}
                variant="outlined"
                inputProps={{ maxLength: 14, pattern: '[0-9]*' }} // Limita a 14 dígitos e só números
                sx={{ bgcolor: '#fff', borderRadius: '8px' }}
              />
              <StyledButton
                variant="contained"
                onClick={() => handleSearchByMatricula(index)}
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{ bgcolor: INSTITUTIONAL_COLOR, '&:hover': { bgcolor: '#265b28' }, minWidth: '120px', height: '40px' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
              </StyledButton>
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, width: '100%' }}>
              <StyledTextField
                label="Nome"
                value={studentsData[index]?.nome || ''}
                variant="outlined"
                disabled
                sx={{ bgcolor: '#fff', borderRadius: '8px' }}
              />
              <StyledTextField
                label="Email"
                value={studentsData[index]?.email || ''}
                variant="outlined"
                disabled
                sx={{ bgcolor: '#fff', borderRadius: '8px' }}
              />
              <StyledTextField
                label="Curso"
                value={studentsData[index]?.curso || ''}
                variant="outlined"
                disabled
                sx={{ bgcolor: '#fff', borderRadius: '8px' }}
              />
              <StyledTextField
                label="Condição"
                name="condicao"
                value={formData.alunos[index]?.condicao || ''}
                onChange={(e) => handleCondicaoChange(index, e.target.value)}
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                sx={{ bgcolor: '#fff', borderRadius: '8px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 2 }}>
              {index === matriculaInputs.length - 1 && (
                <StyledButton
                  variant="outlined"
                  onClick={handleAddStudent}
                  startIcon={<AddIcon />}
                  sx={{ borderColor: INSTITUTIONAL_COLOR, color: INSTITUTIONAL_COLOR, '&:hover': { borderColor: '#265b28', color: '#265b28' } }}
                >
                  Adicionar
                </StyledButton>
              )}
              {index > 0 && (
                <StyledButton
                  variant="outlined"
                  onClick={() => handleRemoveStudent(index)}
                  startIcon={<RemoveIcon />}
                  sx={{ borderColor: '#d32f2f', color: '#d32f2f', '&:hover': { borderColor: '#b71c1c', color: '#b71c1c' } }}
                >
                  Remover
                </StyledButton>
              )}
            </Box>
          </StyledPaper>
        ))}

        <Divider sx={{ my: 4, borderColor: '#e0e0e0', width: '100%' }} />

        {/* Dados da Demanda */}
        <StyledPaper elevation={3} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: INSTITUTIONAL_COLOR }}>
            Dados da Demanda
          </Typography>
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            required
            inputProps={{ maxLength: 255 }}
            sx={{ mb: 3, bgcolor: '#fff', borderRadius: '8px' }}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
            <StyledTextField
              label="Disciplina"
              name="disciplina"
              value={formData.disciplina}
              onChange={handleChange}
              variant="outlined"
              required
              inputProps={{ maxLength: 100 }}
              sx={{ bgcolor: '#fff', borderRadius: '8px', flex: '1 1 200px', minWidth: '200px' }}
            />
            <FormControl sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <InputLabel sx={{ fontSize: '0.875rem', color: formData.nivel ? INSTITUTIONAL_COLOR : 'rgba(0, 0, 0, 0.6)' }}>
                Nível *
              </InputLabel>
              <StyledSelect
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                required
                sx={{ bgcolor: '#fff', borderRadius: '8px' }}
              >
                {nivelOptions.map((nivelItem) => (
                  <MenuItem key={nivelItem.id} value={nivelItem.id}>
                    {nivelItem.nome}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            <StyledTextField
              label="Status"
              value="Aberta"
              variant="outlined"
              disabled
              sx={{ bgcolor: '#fff', borderRadius: '8px', flex: '1 1 200px', minWidth: '200px' }}
            />
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'medium', color: INSTITUTIONAL_COLOR }}>
            Amparo Legal
          </Typography>
          <AmparoLegalList selectedAmparos={formData.amparoLegal} onAmparoChange={handleAmparoChange} />
        </StyledPaper>

        <Divider sx={{ my: 4, borderColor: '#e0e0e0', width: '100%' }} />

        {/* Encaminhamento */}
        <StyledPaper elevation={3} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: INSTITUTIONAL_COLOR }}>
            Encaminhamento
          </Typography>
          <UserListsDemands selectedUsers={formData.usuariosEncaminhados} onUserChange={handleUserChange} />
        </StyledPaper>

        {/* Mensagens de feedback */}
        {error && (
          <Typography
            color="error"
            align="center"
            sx={{ my: 2, bgcolor: '#ffebee', p: 1, borderRadius: '8px', width: '100%' }}
          >
            {error}
          </Typography>
        )}
        {success && (
          <Typography
            color="success"
            align="center"
            sx={{ my: 2, bgcolor: '#e8f5e9', p: 1, borderRadius: '8px', width: '100%' }}
          >
            {success}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.descricao ||
              !formData.nivel ||
              !formData.disciplina ||
              formData.usuariosEncaminhados.length === 0 ||
              formData.alunos.length === 0 ||
              formData.alunos.some((aluno) => !aluno.id)
            }
            startIcon={<SaveIcon />}
            sx={{ bgcolor: INSTITUTIONAL_COLOR, '&:hover': { bgcolor: '#265b28' }, minWidth: '150px', height: '40px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Demanda'}
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={() => navigate('/demands')}
            startIcon={<CloseIcon />}
            sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' }, minWidth: '150px', height: '40px' }}
          >
            Cancelar
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DemandaRegisterPage;