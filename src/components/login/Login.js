import React, { useState } from 'react';
import { login } from '../../service/auth';
import { TextField, Container, Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 4,
          width: '100%',
          maxWidth: 480
        }}
      >
        {/* Título */}
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Login
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
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            error={!!email && !isEmailValid()}
            helperText={!!email && !isEmailValid() ? 'Email inválido' : ''}
            variant="outlined"
            InputLabelProps={{
              shrink: focusedField === 'email' || email !== '',
              sx: {
                color: focusedField === 'email' || email !== '' ? 'primary.main' : 'text.secondary',
                fontSize: focusedField === 'email' || email !== '' ? '0.85rem' : '1rem',
                transform: focusedField === 'email' || email !== '' ? 'translate(14px, -6px) scale(0.85)' : 'translate(14px, 16px) scale(1)',
                transition: 'transform 0.2s ease-out, font-size 0.2s ease-out, color 0.2s ease-out'
              }
            }}
          />

          {/* Campo de Senha */}
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            variant="outlined"
            InputLabelProps={{
              shrink: focusedField === 'password' || password !== '',
              sx: {
                color: focusedField === 'password' || password !== '' ? 'primary.main' : 'text.secondary',
                fontSize: focusedField === 'password' || password !== '' ? '0.85rem' : '1rem',
                transform: focusedField === 'password' || password !== '' ? 'translate(14px, -6px) scale(0.85)' : 'translate(14px, 16px) scale(1)',
                transition: 'transform 0.2s ease-out, font-size 0.2s ease-out, color 0.2s ease-out'
              }
            }}
          />

          {/* Errors*/}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {/*"Esqueceu a senha?" */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2
            }}
          >
            <Button
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Esqueceu a senha?
            </Button>
          </Box>

          {/* Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !isEmailValid() || !password}
            sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }}}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>

          {/*Ir para registro */}
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
