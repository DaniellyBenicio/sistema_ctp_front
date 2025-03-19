import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box } from "@mui/material";
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

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);

        const filtered = users.filter((user) =>
            user.nome.toLowerCase().includes(value.toLowerCase()) ||
            user.matricula.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.Cargo.nome.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
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

            <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
        </Box>
    );
};

export default UsersList;