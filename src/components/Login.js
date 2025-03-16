import React, { useState } from 'react';
import { login } from '../service/auth';
import { TextField, Container, Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { Email, Lock } from '@mui/icons-material'; // Ícones para os campos

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para o ícone de carregamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o ícone de carregamento
    setError(''); // Limpa erros anteriores

    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false); // Desativa o ícone de carregamento
    }
  };

  // Validação básica do email
  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Campo de Email */}
          <TextField
            fullWidth
            margin="normal"
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!email && !isEmailValid()} // Mostra erro se o email for inválido
            helperText={!!email && !isEmailValid() ? 'Email inválido' : ''}
            InputProps={{
              startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />, // Ícone de email
            }}
          />
          {/* Campo de Senha */}
          <TextField
            fullWidth
            margin="normal"
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />, // Ícone de senha
            }}
          />
          {/* Exibição de Erro */}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {/* Botão de Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !isEmailValid() || !password} // Desabilita o botão se estiver carregando ou os campos forem inválidos
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'} {/* Ícone de carregamento */}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;