import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import {
    IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, useMediaQuery,
    Stack
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const { userRole } = useOutletContext();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('usuarios');
            if (!response.data || !Array.isArray(response.data.usuarios)) {
                throw new Error('Erro ao buscar usuários.')
            }
            setUsers(response.data.usuarios);
        } catch (error) {
            setAlert({
                show: true,
                message: 'Erro ao buscar usuários',
                type: 'error'
            });
        }
    }

    const handleDeleteUser = async (id) => {
        if (window.confirm('Deseja excluir?')) {
            try {
                await api.delete(`/usuario/${id}`);
                fetchUsers();
                setAlert({
                    show: true,
                    message: 'Usuário excluído com sucesso!',
                    type: 'success'
                });
            } catch (error) {
                setAlert({
                    show: true,
                    message: 'Erro ao excluir usuário!',
                    type: 'error'
                });
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                marginTop: {
                    xs: '60px',
                    sm: '30px'
                },
                padding: {
                    xs: '5%',
                    sm: '5%'
                }
            }}
        >
            {alert.show && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            )}

            {isMobile ? (
                <Stack spacing={2} sx={{ width: '100%' }}>
                    {users.map((user) => (
                        <Paper key={user.id} sx={{ p: 2 }}>
                            <Stack spacing={1}>
                                <Typography><strong>Nome:</strong> {user.nome}</Typography>
                                <Typography><strong>Matrícula:</strong> {user.matricula}</Typography>
                                <Typography><strong>Cargo:</strong> {user.Cargo.nome}</Typography>
                                <Typography><strong>Email:</strong> {user.email}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    <IconButton>
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Matrícula</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell align="center">{user.nome}</TableCell>
                                    <TableCell align="center">{user.matricula}</TableCell>
                                    <TableCell align="center">{user.Cargo.nome}</TableCell>
                                    <TableCell align="center">{user.email}</TableCell>
                                    <TableCell align="center">
                                        <IconButton>
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UsersList;