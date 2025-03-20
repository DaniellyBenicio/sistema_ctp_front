import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import UsersTable from "../../components/UsersTable";
import UserRegisterPopup from "../../components/UserRegisterPopup";

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const { userRole } = useOutletContext();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();
    const [openPopup, setOpenPopup] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

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

    const confirmDeleteUser = async () => {
        try {
            await api.delete(`/usuario/${userIdToDelete}`);
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
        } finally {
            setOpenDeleteDialog(false);
            setUserIdToDelete(null);
        }
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

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        width: { xs: '90%', sm: '400px' },
                        maxWidth: '100%',
                        borderRadius: '5px',
                        backgroundColor: '#fff',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                    },
                }}
            >
                <DialogTitle
                    id="delete-dialog-title"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        py: 2,
                    }}
                >
                    Confirmação de Exclusão
                </DialogTitle>
                <DialogContent
                    sx={{
                        py: 3,
                        px: 2,
                    }}
                >
                    <DialogContentText
                        id="delete-dialog-description"
                        sx={{
                            textAlign: 'center',
                            color: '#333',
                            fontSize: '1rem',
                            fontFamily: '"Open Sans", sans-serif',
                        }}
                    >
                        Tem certeza que deseja excluir este usuário?
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        pb: 3,
                        gap: 2,
                    }}
                >
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        variant="contained"
                        sx={{
                            minWidth: '120px',
                            bgcolor: '#2f9e41',
                            color: '#fff',
                            borderRadius: '5px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: '8px 20px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#257a33',
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(47, 158, 65, 0.3)',
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmDeleteUser}
                        variant="contained"
                        sx={{
                            minWidth: '120px',
                            bgcolor: '#cd191e',
                            color: '#fff',
                            borderRadius: '5px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: '8px 20px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#a51419',
                                boxShadow: '0 4px 12px rgba(205, 25, 30, 0.3)',
                            },
                        }}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersList;