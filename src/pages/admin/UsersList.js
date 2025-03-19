import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import UsersTable from "../../components/UsersTable";

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const { userRole } = useOutletContext();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (userRole !== 'Admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [navigate, userRole]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('usuarios');
            console.log('Todos os usuários:', response.data);
            if (!response.data || !Array.isArray(response.data.usuarios)) {
                throw new Error('Erro ao buscar usuários.');
            }
            setUsers(response.data.usuarios);
            setFilteredUsers(response.data.usuarios);
        } catch (error) {
            setAlert({
                show: true,
                message: 'Erro ao buscar usuários',
                type: 'error'
            });
        }
    };

    const fetchUsersByTermo = async (termo) => {
        try {
            const response = await api.get(`/usuarios/busca/${termo}`);
            console.log('Resultado da busca por termo:', response.data);
            if (!response.data || !Array.isArray(response.data.usuarios)) {
                throw new Error('Erro ao buscar usuários por termo.');
            }
            return response.data.usuarios;
        } catch (error) {
            console.error('Erro ao buscar por termo:', error);
            return null;
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value.trim();
        setSearchValue(value);

        if (!value) {
            setFilteredUsers(users); 
            setAlert({ show: false, message: '', type: '' });
            return;
        }

        const usersByTermo = await fetchUsersByTermo(value);
        if (usersByTermo && usersByTermo.length > 0) {
            setFilteredUsers(usersByTermo);
            setAlert({ show: false, message: '', type: '' });
            return;
        }

        setFilteredUsers([]);
        setAlert({ show: false, message: '', type: '' });
    };

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

            <SearchBar value={searchValue} onChange={handleSearchChange} />

            {filteredUsers.length === 0 && searchValue ? (
                <Typography 
                variant="body2"
                color="textSecondary" 
                align="center" 
                sx={{ mt: 2, fontSize: '0.875rem', fontFamily: '"Open Sans", sans-serif' }}
            >
                Nenhum resultado encontrado
            </Typography>
            ) : (
                <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
            )}
        </Box>
    );
};

export default UsersList;