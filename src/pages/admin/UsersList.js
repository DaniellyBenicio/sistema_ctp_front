import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import SearchBar from "../../components/searchBar/SearchBar";
import UsersTable from "./UsersTable";
import UserRegisterPopup from "./UserRegisterPopup";
import DeleteUser from "./DeleteUser";
import UpdateUser from "./UpdateUser";

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { userRole } = useOutletContext();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (userRole !== "Admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [navigate, userRole]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("usuarios");
      if (!response.data || !Array.isArray(response.data.usuarios)) {
        throw new Error("Erro ao buscar usuários.");
      }
      setUsers(response.data.usuarios);
      setFilteredUsers(response.data.usuarios);
    } catch (error) {
      setAlert({
        show: true,
        message: "Erro ao buscar usuários",
        type: "error",
      });
    }
  };

  const fetchUsersByTermo = async (termo) => {
    try {
      const encodedTermo = encodeURIComponent(termo);
      const response = await api.get(`/usuarios/busca/${encodedTermo}`);
      if (!response.data || !Array.isArray(response.data.usuarios)) {
        throw new Error("Erro ao buscar usuários por termo.");
      }
      return response.data.usuarios;
    } catch (error) {
      return null;
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value) {
      setFilteredUsers(users);
      setAlert({ show: false, message: "", type: "" });
      return;
    }

    const usersByTermo = await fetchUsersByTermo(value);
    if (usersByTermo && usersByTermo.length > 0) {
      setFilteredUsers(usersByTermo);
      setAlert({ show: false, message: "", type: "" });
      return;
    }
    setFilteredUsers([]);
    setAlert({ show: false, message: "", type: "" });
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
      message: "Usuário cadastrado com sucesso!",
      type: "success",
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
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "90%",
        marginTop: 0,
        padding: { xs: "3% 0%", sm: "2% 0%" },
        marginLeft: { xs: 'auto', sm: 'auto' },
        marginRight: { xs: 'auto', sm: 'auto' },
      }}
    >
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#333",
          mb: 1,
          textAlign: "center",
          marginBottom: { xs: "16px", sm: "30px" },
        }}
      >
        Lista de Usuários
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1, sm: 2 },
          mb: 2,
          width: "100%",
          maxWidth: "1200px",
          alignSelf: "center",
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "100%", sm: "40%" },
            flexGrow: 0,
            height: { xs: "auto", sm: "35px" },
            "& .MuiInputBase-root": {
              height: "35px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#2e7d32",
            "&:hover": {
              bgcolor: "#1b5e20",
              transform: "scale(1.05)",
            },
            minWidth: "140px",
            height: "35px",
            fontSize: "0.9rem",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            transition: "all 0.2s ease",
          }}
          onClick={() => setOpenPopup(true)}
        >
          Cadastrar Usuário
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          alignSelf: "center",
          mx: "auto",
          overflowX: 'auto',
        }}
      >
        {filteredUsers.length === 0 && searchValue ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{
              mt: 2,
              fontSize: "0.875rem",
            }}
          >
            Nenhum resultado encontrado
          </Typography>
        ) : (
          <UsersTable
            users={filteredUsers}
            onDelete={handleDeleteUser}
            onUpdate={handleUpdateUser}
            isMobileWidth={isMobile}
            sx={{
              "& .MuiTable-root": {
                minWidth: "100%",
                tableLayout: "fixed",
              },
              "& .MuiTableCell-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                padding: { xs: "6px 4px", sm: "8px 8px", md: "12px 16px" },
                whiteSpace: { xs: "normal", sm: "nowrap" },
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                height: { xs: "30px", sm: "35px", md: "40px" },
                padding: { xs: "4px 4px", sm: "6px 8px", md: "8px 16px" },
                lineHeight: { xs: "1.2", sm: "1.5" },
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              },
              "& .MuiTableBody-root .MuiTableCell-root": {
                borderBottom: "1px solid rgba(224, 224, 224, 1)",
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