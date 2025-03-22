import React from 'react';
import {
    IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, useMediaQuery
} from "@mui/material";
import { Send, Edit } from "@mui/icons-material";

const DemandsTable = ({ demands, onSend, onUpdate }) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: '100%' }}>
                {demands.map((demand) => (
                    <Paper key={demand.id} sx={{ p: 1 }}>
                        <Stack spacing={0.5}>
                            <Typography><strong>Descrição:</strong> {demand.descricao}</Typography>
                            <Typography><strong>Status:</strong> {demand.status ? 'Ativo' : 'Inativo'}</Typography>
                            <Typography><strong>Nível:</strong> {demand.nivel}</Typography>
                            <Typography><strong>Usuário ID:</strong> {demand.usuario_id}</Typography>
                            <Stack direction="row" spacing={1} justifyContent="center">
                                <IconButton
                                    color="primary"
                                    onClick={() => onUpdate(demand)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    onClick={() => onSend(demand.id)}
                                >
                                    <Send />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        );
    }

    // Caso não seja mobile, exibe os dados em uma tabela
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
                            Descrição
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
                            Status
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
                            Nível
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
                            Usuário ID
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
                    {demands.map((demand) => (
                        <TableRow key={demand.id}>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                {demand.descricao}
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
                                {demand.status ? 'Ativo' : 'Inativo'}
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
                                {demand.nivel}
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
                                {demand.usuario_id}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    padding: { xs: '4px', sm: '6px' },
                                    height: '30px',
                                    lineHeight: '30px',
                                }}
                            >
                                <IconButton
                                    color="primary"
                                    onClick={() => onUpdate(demand)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="sucess"
                                    onClick={() => onSend(demand.id)}
                                >
                                    <Send />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DemandsTable;
