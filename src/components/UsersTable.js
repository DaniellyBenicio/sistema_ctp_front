import React from 'react';
import {
    IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, useMediaQuery
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const UsersTable = ({ users, onDelete }) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: '100%' }}>
                {users.map((user) => (
                    <Paper key={user.id} sx={{ p: 1 }}>
                        <Stack spacing={0.5}>
                            <Typography><strong>Nome:</strong> {user.nome}</Typography>
                            <Typography><strong>Matrícula:</strong> {user.matricula}</Typography>
                            <Typography><strong>Cargo:</strong> {user.Cargo.nome}</Typography>
                            <Typography><strong>Email:</strong> {user.email}</Typography>
                            <Stack direction="row" spacing={1} justifyContent="center">
                                <IconButton>
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(user.id)}
                                >
                                    <Delete />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#2f9e41',
                                color: '#fff',
                                borderRight: '1px solid #fff',
                                padding: { xs: '4px', sm: '6px' },
                                height: '30px',
                                lineHeight: '30px',
                            }}
                        >
                            Nome
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#2f9e41',
                                color: '#fff',
                                borderRight: '1px solid #fff',
                                padding: { xs: '4px', sm: '6px' },
                                height: '30px',
                                lineHeight: '30px',
                            }}
                        >
                            Matrícula
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#2f9e41',
                                color: '#fff',
                                borderRight: '1px solid #fff',
                                padding: { xs: '4px', sm: '6px' },
                                height: '30px',
                                lineHeight: '30px',
                            }}
                        >
                            Cargo
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#2f9e41',
                                color: '#fff',
                                borderRight: '1px solid #fff',
                                padding: { xs: '4px', sm: '6px' },
                                height: '30px',
                                lineHeight: '30px',
                            }}
                        >
                            Email
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#2f9e41',
                                color: '#fff',
                                padding: { xs: '4px', sm: '6px' },
                                height: '30px',
                                lineHeight: '30px',
                            }}
                        >
                            Ações
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                {user.nome}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                {user.matricula}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                {user.Cargo.nome}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                {user.email}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                <IconButton>
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(user.id)}
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;