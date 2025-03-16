import React, { useState } from 'react';
import {
  TextField,
  Container,
  Button,
  Typography,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setEmailError('O campo de e-mail é obrigatório.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('O campo de senha é obrigatório.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulação de requisição para o servidor
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Login realizado com:', { email, password });
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 4, width: '100%', maxWidth: 480 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          LOGIN
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Campo de Email */}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            variant="outlined"
          />

          {/* Campo de Senha */}
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            variant="outlined"
          />

          {/* Lembre-se de mim e Esqueceu a senha */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label={
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Lembre-se de mim
                </Typography>
              }
            />
            <Button
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Esqueceu a senha?
            </Button>
          </Box>

          {/* Botão de Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!email || !password || loading}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              py: 1.5,
              position: 'relative',
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Entrar'}
          </Button>

          {/* Link para cadastro → Substituído por botão com navigate */}
          <Typography align="center" variant="body2" sx={{ mt: 2, fontSize: '1rem' }}>
            Não tem uma conta?{' '}
            <Button
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                fontSize: '1rem',
                fontWeight: 400,
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate('/signUp')}
            >
              Cadastrar
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
