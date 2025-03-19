import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const { userRole } = useOutletContext();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

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
                await api.delete(`/usuarios/${id}`);
                fetchUsers();
            } catch (error) {
                setAlert({
                    show: true,
                    message: 'Erro ao excluir usuário',
                    type: 'error'
                });
            }
        }
    }

    return (
        <Box 
        sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',  
            flexDirection: 'column',
            width: '100%',   // Garantir que o Box ocupe 100% da largura
            paddingLeft: '5%',  // Espaçamento proporcional à esquerda
            paddingRight: '5%', // Espaçamento proporcional à direita
        }}
    >
        {alert.show && (
            <CustomAlert
                message={alert.message}
                type={alert.type}
            />
        )}
    
        <TableContainer component={Paper} sx={{ width: '100%' }}> {/* A tabela agora ocupa 100% da largura disponível */}
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
                            <TableCell align="center">{user.nome}</TableCell> {/* Centralizar dados */}
                            <TableCell align="center">{user.matricula}</TableCell> {/* Centralizar dados */}
                            <TableCell align="center">{user.Cargo.nome}</TableCell> {/* Centralizar dados */}
                            <TableCell align="center">{user.email}</TableCell> {/* Centralizar dados */}
                            <TableCell align="center">
                                <IconButton>
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteUser(user.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
    
    );
};

export default UsersList;
