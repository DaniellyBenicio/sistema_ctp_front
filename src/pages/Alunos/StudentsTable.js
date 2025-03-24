import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, useMediaQuery, CircularProgress, IconButton
} from "@mui/material";

import { Edit } from "@mui/icons-material";

const StudentsTable = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Função para buscar os alunos da API
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch('http://localhost:3000/api/alunos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar alunos');
            }

            const data = await response.json();
            // Formata os dados para corresponder ao esperado pelo StudentsTable
            const formattedStudents = data.map(aluno => ({
                matricula: aluno.matricula,
                nome: aluno.nome,
                email: aluno.email,
                curso: aluno.curso,
                condicao: aluno.condicoes || 'Ativo', // Define 'Ativo' como padrão se não houver condição
            }));
            setStudents(formattedStudents);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    // Busca os alunos ao montar o componente
    useEffect(() => {
        fetchStudents();
    }, []);

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: '100%' }}>
                {loading ? (
                    <Typography align="center">Carregando...</Typography>
                ) : students.length > 0 ? (
                    students.map((student) => (
                        <Paper key={student.matricula} sx={{ p: 1 }}>
                            <Stack spacing={0.5}>
                                <Typography><strong>Matrícula:</strong> {student.matricula}</Typography>
                                <Typography><strong>Nome:</strong> {student.nome}</Typography>
                                <Typography><strong>Email:</strong> {student.email}</Typography>
                                <Typography><strong>Curso:</strong> {student.curso}</Typography>
                                <Typography><strong>Condição:</strong> {student.condicao}</Typography>
                            </Stack>
                        </Paper>
                    ))
                ) : (
                    <Typography align="center">Nenhum estudante encontrado.</Typography>
                )}
            </Stack>
        );
    }

    return (
        <Stack spacing={3} sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            {/* Tabela */}
            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress />
                    <Typography>Carregando...</Typography>
                </Stack>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                    Matrícula
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                    Nome
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                    Email
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                    Curso
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                    Condição
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <TableRow key={student.matricula}>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            {student.matricula}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            {student.nome}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            {student.email}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            {student.curso}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            {student.condicao+" "}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            <IconButton color='primary' onClick={() =>{}}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Nenhum estudante encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Stack>
    );
};

export default StudentsTable;