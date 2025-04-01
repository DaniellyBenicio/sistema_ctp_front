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
  Person,
  ExitToApp,
  Menu as MenuIcon,
  Archive,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const Sidebar = ({ setAuthenticated, userRole, userName }) => {
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

  const drawerWidth = 240;

  const drawerContent = (
    <List>
      {!isMobile && (
        <ListItem sx={{ justifyContent: "center", py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Sistema CTP
          </Typography>
        </ListItem>
      )}
      <ListItem sx={{ justifyContent: "center", py: 1 }}>
        <Person sx={{ mr: 1 }} />
        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
          {userName || "Usuário"}
        </Typography>
      </ListItem>
      <Divider sx={{ backgroundColor: "white", marginBottom: 1 }} />

      {userRole === "Admin" ? (
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
      ) : userRole === "Funcionario CTP" ? (
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
            onClick={() => handleItemClick("/demandas-fechadas", "demandas-fechadas")}
            sx={getListItemStyle(selectedItem, "demandas-fechadas")}
          >
            <Archive sx={{ mr: 1 }} />
            <ListItemText primary="Fechadas" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("/alunos", "alunos")}
            sx={getListItemStyle(selectedItem, "alunos")}
          >
            <People sx={{ mr: 1 }} />
            <ListItemText primary="Alunos" />
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
            onClick={() => handleItemClick("/demandas-fechadas", "demandas-fechadas")}
            sx={getListItemStyle(selectedItem, "demandas-fechadas")}
          >
            <Archive sx={{ mr: 1 }} />
            <ListItemText primary="Fechadas" />
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
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#2E7D32",
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: isMobile ? "block" : "none",
          height: "48px",
          "& .MuiToolbar-root": { minHeight: "48px" },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontSize: "1.1rem" }}>
            Sistema CTP
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: isMobile ? "none" : "block",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#2E7D32",
            color: "white",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#2E7D32",
              color: "white",
              marginTop: "48px",
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