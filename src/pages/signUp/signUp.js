import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Container, Button, Typography, Paper, Box, FormControl, FormHelperText, Select, MenuItem, CircularProgress } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { signUp } from '../../service/auth';
import api from '../../service/api';

export const SignUp = () => {
    const navigate = useNavigate();
    const [cargos, setCargos] = useState([]);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [matricula, setMatricula] = useState('');
    const [cargo, setCargo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCargos = async () => {
        try {
            const response = await api.get('/cargos');
            setCargos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os cargos:', error);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signUp(nome, email, senha, matricula, cargo);
        } catch (err) {
            setError('Falha na criação do usuário!');
        } finally {
            setLoading(false);
            navigate('/login');
        }
    }

    const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        fetchCargos();
    }, []);

    return (
        <Container component='main' maxWidth='sm'>
            <Paper elevation={3} sx={{ mt: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Cadastrar Usuário
                </Typography>
                <Box component="form" onSubmit={handleSignUp} sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="nome"
                        label="Nome Completo"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    {/* Campo de Email */}
                    <TextField
                        fullWidth
                        margin="normal"
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!email && !isEmailValid()}
                        helperText={!!email && !isEmailValid() ? 'Email inválido' : ''}
                        InputProps={{
                            startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                    />
                    {/* Campo de Senha */}
                    <TextField
                        fullWidth
                        margin="normal"
                        id="senha"
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        InputProps={{
                            startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                    />
                    <TextField
                        label="Matricula"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                    {/* Cargos */}
                    <FormControl fullWidth margin="normal" >
                        <FormHelperText id="cargo" >Tipo de Cargo</FormHelperText>
                        <Select
                            labelId="cargo"
                            id="cargo"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                        >
                            {cargos.map((cargosArray) => (
                                <MenuItem key={cargosArray.id} value={cargosArray.id}>
                                    {cargosArray.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Exibição de Erro */}
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {/* Botão de Cadastro */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || !isEmailValid() || !senha}
                        sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate('/login')}
                    >
                        Voltar
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default SignUp;
