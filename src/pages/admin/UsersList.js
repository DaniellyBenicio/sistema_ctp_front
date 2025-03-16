import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useOutletContext} from "react-router-dom";
import api from "../../service/api";
import CustomAlert from "../../components/alert/CustomAlert";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";

export const UsersList = () => {
    const [ users, setUsers ] = useState([]);
    const { userRole } = useOutletContext();
    const [ alert, setAlert ] = useState({ show: false, message: '', type: '' })
    const navigate = useNavigate();

    useEffect(() => {
        if(userRole !== 'Admin'){
            navigate('/');
            return ;
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try{
            const response  = await api.get('usuarios');
            if(!response.data || !Array.isArray(response.data.usuarios)){
                throw new Error('Erro ao buscar usuários.')
            }
            setUsers(response.data.usuarios);
        } catch (error) {
            setAlert({
                    show: true,
                    message: 'Erro ao buscar usuários',
                    type: 'error'
                });
        }
    }

    const handleDeleteUser = async (id) => {
        if(window.confirm('Deseja excluir?')){
            try{
                await api.delete(`/usuarios/${id}`);
                fetchUsers();
            } catch (error){
                setAlert({
                    show: true,
                    message: 'Erro ao excluir usuário',
                    type: 'error'
                });

            }
        }
    }

    return (
        <div>
            { alert.show && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    />
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Cargo</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.nome}</TableCell>
                                <TableCell>{user.Cargo.nome}</TableCell>
                                <TableCell>
                                    <IconButton >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteUser(user.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                            )
                        )}

                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
};

export default UsersList;
