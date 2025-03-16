import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, Divider, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setAuthenticated }) => {
  const [openDemandas, setOpenDemandas] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setAuthenticated(false);
    navigate('/login'); 
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#2E7D32', 
          color: 'white',
        },
      }}
    >
      <List>
        {/* Título */}
        <ListItem>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Sistema CTP
          </Typography>
        </ListItem>

        {/* Linha divisória */}
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

        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
