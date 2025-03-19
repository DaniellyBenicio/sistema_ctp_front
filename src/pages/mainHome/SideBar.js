import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import { People, Assignment, Assessment, Person, Support, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setAuthenticated, useRole }) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // Estado para o item selecionado
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthenticated(false);
        navigate('/login');
    };

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleItemClick = (path, item) => {
        setSelectedItem(item); // Define o item selecionado
        navigate(path); // Navega para a rota correspondente
    };

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: 220,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        backgroundColor: '#2E7D32',
                        color: 'white',
                    },
                }}
            >
                <List>
                    <ListItem sx={{ justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Sistema CTP
                        </Typography>
                    </ListItem>

                    <Divider sx={{ backgroundColor: 'white', marginBottom: 1 }} />

                    {useRole === "Admin" ? (
                        <ListItem
                            button
                            onClick={() => handleItemClick('/users', 'users')}
                            sx={{
                                backgroundColor: selectedItem === 'users' ? '#4CAF50' : 'transparent', // Fundo mais claro quando selecionado
                                '&:hover': {
                                    backgroundColor: selectedItem === 'users' ? '#4CAF50' : '#388E3C', // Mantém o fundo ao passar o mouse
                                },
                            }}
                        >
                            <People sx={{ mr: 1 }} />
                            <ListItemText primary="Usuários" />
                        </ListItem>
                    ) : (
                        <>
                            <ListItem
                                button
                                onClick={() => handleItemClick('/demandas', 'demandas')}
                                sx={{
                                    backgroundColor: selectedItem === 'demandas' ? '#4CAF50' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: selectedItem === 'demandas' ? '#4CAF50' : '#388E3C',
                                    },
                                }}
                            >
                                <Assignment sx={{ mr: 1 }} />
                                <ListItemText primary="Demandas" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => handleItemClick('/relatorios', 'relatorios')}
                                sx={{
                                    backgroundColor: selectedItem === 'relatorios' ? '#4CAF50' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: selectedItem === 'relatorios' ? '#4CAF50' : '#388E3C',
                                    },
                                }}
                            >
                                <Assessment sx={{ mr: 1 }} />
                                <ListItemText primary="Relatórios" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => handleItemClick('/perfil', 'perfil')}
                                sx={{
                                    backgroundColor: selectedItem === 'perfil' ? '#4CAF50' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: selectedItem === 'perfil' ? '#4CAF50' : '#388E3C',
                                    },
                                }}
                            >
                                <Person sx={{ mr: 1 }} />
                                <ListItemText primary="Perfil" />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => handleItemClick('/suporte', 'suporte')}
                                sx={{
                                    backgroundColor: selectedItem === 'suporte' ? '#4CAF50' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: selectedItem === 'suporte' ? '#4CAF50' : '#388E3C',
                                    },
                                }}
                            >
                                <Support sx={{ mr: 1 }} />
                                <ListItemText primary="Suporte" />
                            </ListItem>
                        </>
                    )}

                    <ListItem
                        button
                        onClick={handleOpenConfirmDialog}
                        sx={{
                            backgroundColor: selectedItem === 'sair' ? '#4CAF50' : 'transparent',
                            '&:hover': {
                                backgroundColor: selectedItem === 'sair' ? '#4CAF50' : '#388E3C',
                            },
                        }}
                    >
                        <ExitToApp sx={{ mr: 1 }} />
                        <ListItemText primary="Sair" />
                    </ListItem>
                </List>
            </Drawer>

            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography>Tem certeza que deseja sair?</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleLogout}
                        sx={{ color: 'white', backgroundColor: '#388E3C', '&:hover': { backgroundColor: '#2C6E29' } }}
                    >
                        Sim
                    </Button>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        sx={{ color: 'white', backgroundColor: '#D32F2F', '&:hover': { backgroundColor: '#B71C1C' } }}
                    >
                        Não
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;