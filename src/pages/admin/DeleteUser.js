import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import api from "../../service/api";

const DeleteUser = ({ open, onClose, userId, onDeleteSuccess, setAlert }) => {
  const confirmDeleteUser = async () => {
    try {
      await api.delete(`/usuario/${userId}`);
      onDeleteSuccess();
      setAlert({
        show: true,
        message: "Usuário excluído com sucesso!",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Erro ao excluir usuário!",
        type: "error",
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          width: { xs: "90%", sm: "400px" },
          maxWidth: "100%",
          borderRadius: "5px",
          backgroundColor: "#fff",
          boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.25rem",
          color: "#000000",
          backgroundColor: "#ffffff",
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
            textAlign: "center",
            color: "#333",
            fontSize: "1rem",
            fontFamily: '"Open Sans", sans-serif',
          }}
        >
          Tem certeza que deseja excluir este usuário?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 3,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            minWidth: "120px",
            bgcolor: "#2f9e41",
            color: "#fff",
            borderRadius: "5px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "8px 20px",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#257a33",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(47, 158, 65, 0.3)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={confirmDeleteUser}
          variant="contained"
          sx={{
            minWidth: "120px",
            bgcolor: "#cd191e",
            color: "#fff",
            borderRadius: "5px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "8px 20px",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#a51419",
              boxShadow: "0 4px 12px rgba(205, 25, 30, 0.3)",
            },
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
