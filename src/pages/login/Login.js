import React, { useState } from 'react';
import { TextField, Container, Button, Typography, Paper, Box, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {login} from "../../service/auth";


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
          maxWidth: 350
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
                color: focusedField === 'email' || email !== '',
                fontSize: focusedField === 'email' || email !== '' ? '0.85rem' : '1rem',
                transform: focusedField === 'email' || email !== '' ? 'translate(14px, -6px) scale(0.85)' : 'translate(14px, 16px) scale(1)',
                transition: 'transform 0.2s ease-out, font-size 0.2s ease-out, color 0.2s ease-out',
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Errors */}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 0 }}>
              {error}
            </Typography>
          )}

          {/* "Esqueceu a senha?" */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mt: 0.5,
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
            onClick={() => navigate('/MainScreen')}
            sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#387c34', '&:hover': { bgcolor: '#2e622b' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>

          {/* Ir para registro */}
          <Typography
            align="center"
            variant="body2"
            sx={{
              mt: 1,
              fontSize: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Não possui uma conta?{' '}
            <Button
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                fontSize: '1rem',
                fontWeight: 400,
                ml: 0.5,
                p: 0,
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate('/signUp')}
            >
              Cadastra-se
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;