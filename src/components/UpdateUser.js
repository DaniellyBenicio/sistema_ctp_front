import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    IconButton,
    CircularProgress,
    FormControl,
    Select,
    MenuItem,
    FormHelperText
} from "@mui/material";
import { Email, Lock, Close } from '@mui/icons-material';
import api from "../service/api";

const UpdateUser = ({ open, onClose, user, onUpdateSuccess, setAlert }) => {
    const [formData, setFormData] = useState({
        nome: '',
        matricula: '',
        email: '',
        senha: '',
        cargoId: '' // Este é o id do cargo, que será associado ao select
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [cargos, setCargos] = useState([]);

    // Função para buscar os cargos
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

    // Sincroniza formData com os dados do user quando o popup abre ou o user muda
    useEffect(() => {
        if (open && user) {
            console.log('Dados do user recebidos:', user); // Para depuração
            setFormData({
                nome: user.nome || '',
                matricula: user.matricula || '',
                email: user.email || '',
                senha: '', // Mantém vazio por padrão
                cargoId: user.cargo_id || '' // Atribui o id do cargo
            });
            fetchCargos();
        }
    }, [open, user]);

    // Função de alteração do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Função para enviar os dados de atualização
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        console.log('Dados enviados para atualização:', {
            id: user.id,
            ...formData
        });

        try {
            const response = await api.put(`/usuario/${user.id}`, {
                nome: formData.nome,
                matricula: formData.matricula,
                email: formData.email,
                senha: formData.senha || undefined, // Envia undefined se senha estiver vazia
                cargoId: formData.cargoId
            });

            console.log('Resposta da API:', response.data);

            if (response.status === 200) {
                setSuccess('Usuário atualizado com sucesso!');
                onUpdateSuccess();
                setAlert({
                    show: true,
                    message: 'Usuário atualizado com sucesso!',
                    type: 'success'
                });
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao atualizar usuário';
            console.error('Erro ao atualizar:', error.response || error);
            setError(errorMessage);
            setAlert({
                show: true,
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Função para validar email
    const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
                    Editar Usuário
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
                    placeholder="Digite uma nova senha (opcional)"
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
                        name="cargoId"
                        value={formData.cargoId} // Altere para 'cargoId' aqui
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
                    disabled={loading || !isEmailValid() || !formData.nome || !formData.matricula}
                    sx={{
                        mt: 3,
                        mb: 2,
                        bgcolor: '#2f9e41',
                        '&:hover': {
                            bgcolor: '#278735'
                        }
                    }}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateUser;
