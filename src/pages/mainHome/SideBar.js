import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  Toolbar,
  AppBar,
} from "@mui/material";
import {
  People,
  Assignment,
  Assessment,
  Person,
  Support,
  ExitToApp,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const Sidebar = ({ setAuthenticated, useRole }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    navigate("/login");
  };

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleItemClick = (path, item) => {
    setSelectedItem(item);
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const getListItemStyle = (selectedItem, itemKey) => ({
    backgroundColor: selectedItem === itemKey ? "#4CAF50" : "transparent",
    "&:hover": {
      backgroundColor: selectedItem === itemKey ? "#4CAF50" : "#388E3C",
    },
  });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <List>
      <ListItem sx={{ justifyContent: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Sistema CTP
        </Typography>
      </ListItem>
      <Divider sx={{ backgroundColor: "white", marginBottom: 1 }} />

      {useRole === "Admin" ? (
        <>
          <ListItem
            button
            onClick={() => handleItemClick("/users", "users")}
            sx={getListItemStyle(selectedItem, "users")}
          >
            <People sx={{ mr: 1 }} />
            <ListItemText primary="Usuários" />
          </ListItem>
        </>
      ) : useRole === "Funcionario CTP" ? (
        <>
          <ListItem
            button
            onClick={() => handleItemClick("/demands", "demands")}
            sx={getListItemStyle(selectedItem, "demands")}
          >
            <Assignment sx={{ mr: 1 }} />
            <ListItemText primary="Demandas" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/alunos", "alunos")}
            sx={getListItemStyle(selectedItem, "alunos")}
          >
            <People sx={{ mr: 1 }} />
            <ListItemText primary="Alunos" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/relatorios", "relatorios")}
            sx={getListItemStyle(selectedItem, "relatorios")}
          >
            <Assessment sx={{ mr: 1 }} />
            <ListItemText primary="Relatórios" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/perfil", "perfil")}
            sx={getListItemStyle(selectedItem, "perfil")}
          >
            <Person sx={{ mr: 1 }} />
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/suporte", "suporte")}
            sx={getListItemStyle(selectedItem, "suporte")}
          >
            <Support sx={{ mr: 1 }} />
            <ListItemText primary="Suporte" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem
            button
            onClick={() => handleItemClick("/demands", "demands")}
            sx={getListItemStyle(selectedItem, "demands")}
          >
            <Assignment sx={{ mr: 1 }} />
            <ListItemText primary="Demandas" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/perfil", "perfil")}
            sx={getListItemStyle(selectedItem, "perfil")}
          >
            <Person sx={{ mr: 1 }} />
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/suporte", "suporte")}
            sx={getListItemStyle(selectedItem, "suporte")}
          >
            <Support sx={{ mr: 1 }} />
            <ListItemText primary="Suporte" />
          </ListItem>
        </>
      )}

      <ListItem
        button
        onClick={handleOpenConfirmDialog}
        sx={getListItemStyle(selectedItem, "sair")}
      >
        <ExitToApp sx={{ mr: 1 }} />
        <ListItemText primary="Sair" />
      </ListItem>
    </List>
  );

  return (
    <>
      {isMobile ? (
        <>
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: "#2E7D32",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Sistema CTP
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 240,
                backgroundColor: "#2E7D32",
                color: "white",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 220,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              backgroundColor: "#2E7D32",
              color: "white",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography>Tem certeza que deseja sair?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleLogout}
            sx={{
              color: "white",
              backgroundColor: "#388E3C",
              "&:hover": { backgroundColor: "#2C6E29" },
            }}
          >
            Sim
          </Button>
          <Button
            onClick={handleCloseConfirmDialog}
            sx={{
              color: "white",
              backgroundColor: "#D32F2F",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
