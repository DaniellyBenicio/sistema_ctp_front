import React, { useState, useEffect } from 'react';
import {
  FormControl, FormHelperText, List, ListItem, ListItemText, Checkbox, Typography, Box
} from '@mui/material';
import api from '../../service/api';

const UserListsDemands = ({ selectedUsers, onUserChange }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      if (!response.data || !Array.isArray(response.data.usuarios)) {
        throw new Error('Formato de resposta inválido');
      }
      const filteredUsers = response.data.usuarios.filter(user => user.role !== 'admin' && user.perfil !== 'admin');
      setUsuarios(filteredUsers);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Erro ao buscar usuários:', err);
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Dados do erro:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = (user) => {
    const currentIndex = selectedUsers.findIndex(u => u.id === user.id);
    const newSelectedUsers = [...selectedUsers];

    if (currentIndex === -1) {
      newSelectedUsers.push(user);
    } else {
      newSelectedUsers.splice(currentIndex, 1);
    }

    onUserChange(newSelectedUsers);
  };

  return (
    <FormControl fullWidth margin="normal">
      <FormHelperText id="usuarios">Encaminhar para</FormHelperText>
      <Box
        sx={{
          maxHeight: 200,
          overflow: 'auto',
          border: '1px solid #ccc',
          borderRadius: 1,
          bgcolor: '#fff',
        }}
      >
        {loading ? (
          <Typography sx={{ p: 2 }}>Carregando usuários...</Typography>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : usuarios.length === 0 ? (
          <Typography sx={{ p: 2 }}>Nenhum usuário disponível</Typography>
        ) : (
          <List>
            {usuarios.map((user) => {
              const labelId = `checkbox-list-label-${user.id}`;
              const isSelected = selectedUsers.some(u => u.id === user.id);

              return (
                <ListItem
                  key={user.id}
                  dense
                  button
                  onClick={() => handleToggle(user)}
                  sx={{ padding: '0 8px' }}
                >
                  <Checkbox
                    edge="start"
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                  <ListItemText id={labelId} primary={user.nome} />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </FormControl>
  );
};

export default UserListsDemands;