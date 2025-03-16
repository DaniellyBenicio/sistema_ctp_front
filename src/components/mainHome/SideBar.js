import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, Divider, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setAuthenticated }) => {
    const [openDemandas, setOpenDemandas] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
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

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    width: 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        backgroundColor: '#2E7D32',
                        color: 'white',
                    },
                }}
            >
                <List>
                    <ListItem>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Sistema CTP
                        </Typography>
                    </ListItem>

                    <Divider sx={{ backgroundColor: 'white', marginBottom: 1 }} />

                    <ListItem button onClick={() => setOpenDemandas(!openDemandas)}>
                        <ListItemText primary="Demandas" />
                        {openDemandas ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse in={openDemandas} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/demandas/criadas')}>
                                <ListItemText primary="Criadas" />
                            </ListItem>
                            <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/demandas/recebidas')}>
                                <ListItemText primary="Recebidas" />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem button onClick={() => navigate('/relatorios')}>
                        <ListItemText primary="Relatórios" />
                    </ListItem>

                    <ListItem button onClick={() => navigate('/perfil')}>
                        <ListItemText primary="Perfil" />
                    </ListItem>

                    <ListItem button onClick={() => navigate('/suporte')}>
                        <ListItemText primary="Suporte" />
                    </ListItem>

                    <ListItem button onClick={handleOpenConfirmDialog}>
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
