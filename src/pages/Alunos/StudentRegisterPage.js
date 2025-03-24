import React, { useState } from 'react';
import {
  Box, Button, Typography, FormControl, InputLabel, Select, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import api from '../../service/api';
import CondicaoList from '../demandas/CondicaoList';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const INSTITUTIONAL_COLOR = '#307c34';

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  width: '100%',
  boxSizing: 'border-box',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 'bold',
}));

const StyledTextField = styled('input')(({ theme }) => ({
  height: '40px',
  fontSize: '0.875rem',
  width: '100%',
  padding: '0 14px',
  borderRadius: '8px',
  border: '1px solid #ced4da',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: '40px',
  fontSize: '0.875rem',
  '& .MuiSelect-select': {
    padding: '8px 14px',
  },
}));

const StudentRegisterPage = () => {
  const [matriculaInputs, setMatriculaInputs] = useState(['']);
  const [studentsData, setStudentsData] = useState([null]);
  const [formData, setFormData] = useState({
    alunos: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMatriculaChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newMatriculaInputs = [...matriculaInputs];
    newMatriculaInputs[index] = numericValue;
    setMatriculaInputs(newMatriculaInputs);
  };

  const handleSearchByMatricula = async (index) => {
    const matriculaInput = matriculaInputs[index];
    if (!matriculaInput) {
      console.log('Por favor, insira um número de matrícula.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/alunos/${matriculaInput}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const student = response.data;
      const mappedStudent = {
        id: student.matricula,
        nome: student.nome,
        email: student.email,
        curso: student.curso,
        condicoes: student.condicoes || [], // Carrega condições existentes do backend
      };
      const newStudentsData = [...studentsData];
      newStudentsData[index] = mappedStudent;
      setStudentsData(newStudentsData);

      setFormData((prev) => {
        const newAlunos = [...prev.alunos];
        const isAlreadyAdded = newAlunos.some((a) => a.id === mappedStudent.id);
        if (!isAlreadyAdded || !newAlunos[index]) {
          newAlunos[index] = mappedStudent;
        }
        return { ...prev, alunos: newAlunos };
      });
    } catch (err) {
      console.error('Erro ao buscar aluno:', err);
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
      alunos: [...prev.alunos, { id: '', nome: '', email: '', curso: '', condicoes: [] }],
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

  const handleCondicaoChange = (index, newSelectedCondicoes) => {
    const newAlunos = [...formData.alunos];
    newAlunos[index] = { ...newAlunos[index], condicoes: newSelectedCondicoes };
    setFormData((prev) => ({ ...prev, alunos: newAlunos }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      for (const aluno of formData.alunos) {
        if (aluno.id) { // Só envia se o aluno foi buscado/cadastrado
          const condicoesIds = aluno.condicoes.map((condicao) => condicao.id);
          await api.post(
            '/alunos/condicoes',
            { matricula: aluno.id, condicoes: condicoesIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      alert('Condições salvas com sucesso!');
      navigate('/alunos');
    } catch (err) {
      console.error('Erro ao salvar condições:', err);
      alert('Erro ao salvar as condições. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/alunos');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto',
        p: 2,
        bgcolor: '#f0f2f5',
        borderRadius: '8px',
        minHeight: '100vh',
      }}
    >
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
        Registro de Aluno
      </Typography>

      {matriculaInputs.map((matriculaInput, index) => (
        <StyledPaper key={index} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: INSTITUTIONAL_COLOR }}>
            Dados do Aluno
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '100%' }}>
            <StyledTextField
              placeholder="Matrícula"
              value={matriculaInput}
              onChange={(e) => handleMatriculaChange(index, e.target.value)}
              maxLength={14}
              pattern="[0-9]*"
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
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              width: '100%',
            }}
          >
            <StyledTextField
              placeholder="Nome"
              value={studentsData[index]?.nome || ''}
              disabled
            />
            <StyledTextField
              placeholder="Email"
              value={studentsData[index]?.email || ''}
              disabled
            />
            <StyledTextField
              placeholder="Curso"
              value={studentsData[index]?.curso || ''}
              disabled
            />
            <Box sx={{ gridColumn: { xs: '1 / 2', sm: '2 / 3' } }}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: '0.875rem',
                    transform: 'translate(14px, 10px) scale(1)',
                    '&.MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' },
                  }}
                >
                  Condições
                </InputLabel>
                <StyledSelect
                  value={formData.alunos[index]?.condicoes.map((c) => c.id) || []}
                  multiple
                  renderValue={(selected) =>
                    formData.alunos[index]?.condicoes.map((c) => c.nome).join(', ') || 'Nenhuma condição selecionada'
                  }
                  sx={{ bgcolor: '#fff', borderRadius: '8px' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 'auto',
                      },
                    },
                  }}
                >
                  <CondicaoList
                    selectedCondicoes={formData.alunos[index]?.condicoes || []}
                    onCondicaoChange={(newCondicoes) => handleCondicaoChange(index, newCondicoes)}
                  />
                </StyledSelect>
              </FormControl>
            </Box>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || formData.alunos.length === 0 || !formData.alunos.some(aluno => aluno.id)}
          sx={{ bgcolor: INSTITUTIONAL_COLOR, '&:hover': { bgcolor: '#265b28' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
        </StyledButton>
        <Button
          variant="contained"
          color="error"
          onClick={handleClose}
          sx={{ maxWidth: '150px' }}
        >
          Fechar
       357      </Button>
      </Box>
    </Box>
  );
};

export default StudentRegisterPage;