import React from "react";
import UserFormDialog from "../../components/userForm/UserFormDialog";

const UserRegisterPopup = ({ open, onClose, user, onSave }) => {
  return (
    <UserFormDialog
      open={open}
      onClose={onClose}
      user={user}
      onSave={onSave}
      isUpdate={false}
    />
  );
};

export default UserRegisterPopup;
