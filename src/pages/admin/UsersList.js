import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Button, Typography } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import UsersTable from "../../components/UsersTable";
import UserRegisterPopup from "../../components/UserRegisterPopup";
import DeleteUser from "../../components/DeleteUser";
import UpdateUser from "../../components/UpdateUser";

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const { userRole } = useOutletContext();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();
    const [openPopup, setOpenPopup] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userToUpdate, setUserToUpdate] = useState(null);

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

    const fetchUsersByTermo = async (termo) => {
        try {
            const response = await api.get(`/usuarios/busca/${termo}`);
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

    const handleDeleteUser = (id) => {
        setUserIdToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleUpdateUser = (user) => {
        setUserToUpdate(user);
        setOpenUpdateDialog(true);
    };

    const handleSaveUser = async (newUser) => {
        setOpenPopup(false);
        fetchUsers();
        setAlert({
            show: true,
            message: 'Usuário cadastrado com sucesso!',
            type: 'success'
        });
    };

    const handleDeleteSuccess = () => {
        fetchUsers();
        setOpenDeleteDialog(false);
        setUserIdToDelete(null);
    };

    const handleUpdateSuccess = () => {
        fetchUsers();
        setOpenUpdateDialog(false);
        setUserToUpdate(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                marginTop: 0,
                padding: { xs: '2% 5%', sm: '2% 0%' },
            }}
        >
            {alert.show && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            )}

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    mb: 1,
                    textAlign: 'center',
                    fontFamily: '"Open Sans", sans-serif',
                    marginBottom: { xs: '16px', sm: '30px' },
                }}
            >
                Lista de Usuários
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 1, sm: 2 },
                    mb: 2,
                    width: { xs: '100%', sm: '90%' },
                    maxWidth: '1200px',
                    alignSelf: 'center',
                }}
            >
                <SearchBar
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{
                        width: { xs: '100%', sm: '40%' },
                        flexGrow: 0,
                        height: { xs: 'auto', sm: '35px' },
                        '& .MuiInputBase-root': {
                            height: '35px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#2f9e41',
                        '&:hover': { bgcolor: '#257a33' },
                        minWidth: { xs: '100%', sm: '150px', md: '150px' },
                        px: 2,
                        height: { xs: '35px', sm: '38px' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        padding: { xs: '4px 8px', sm: '6px 12px' },
                        textTransform: 'none',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    onClick={() => setOpenPopup(true)}
                >
                    Cadastrar Usuário
                </Button>
            </Box>

            <Box
                sx={{
                    width: { xs: '100%', sm: '90%' },
                    maxWidth: '1200px',
                    alignSelf: 'center',
                    mx: 'auto',
                }}
            >
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
                    <UsersTable
                        users={filteredUsers}
                        onDelete={handleDeleteUser}
                        onUpdate={handleUpdateUser}
                        sx={{
                            '& .MuiTable-root': {
                                minWidth: '100%',
                                tableLayout: 'fixed',
                            },
                            '& .MuiTableCell-root': {
                                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                padding: { xs: '6px 4px', sm: '8px 8px', md: '12px 16px' },
                                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                            '& .MuiTableHead-root .MuiTableCell-root': {
                                height: { xs: '30px', sm: '35px', md: '40px' },
                                padding: { xs: '4px 4px', sm: '6px 8px', md: '8px 16px' },
                                lineHeight: { xs: '1.2', sm: '1.5' },
                                fontWeight: 'bold',
                                backgroundColor: '#f5f5f5',
                            },
                            '& .MuiTableBody-root .MuiTableCell-root': {
                                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                            },
                        }}
                    />
                )}
            </Box>

            <UserRegisterPopup
                open={openPopup}
                onClose={() => setOpenPopup(false)}
                onSave={handleSaveUser}
            />

            <DeleteUser
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                userId={userIdToDelete}
                onDeleteSuccess={handleDeleteSuccess}
                setAlert={setAlert}
            />

            <UpdateUser
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                user={userToUpdate}
                onUpdateSuccess={handleUpdateSuccess}
                setAlert={setAlert}
            />
        </Box>
    );
};

export default UsersList;