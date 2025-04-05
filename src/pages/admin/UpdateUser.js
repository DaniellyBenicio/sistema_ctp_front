import React from "react";
import UserFormDialog from "../../components/userForm/UserFormDialog";

const UpdateUser = ({ open, onClose, user, onUpdateSuccess, setAlert }) => {
  return (
    <UserFormDialog
      open={open}
      onClose={onClose}
      user={user} // Usuário existente a ser editado
      onUpdate={onUpdateSuccess} // Callback para lidar com o sucesso da atualização
      isUpdate={true} // Define como modo de edição
      setAlert={setAlert} // Função para exibir alertas (usada na edição)
    />
  );
};

export default UpdateUser;
