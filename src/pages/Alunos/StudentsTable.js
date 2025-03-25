import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, useMediaQuery, CircularProgress, IconButton
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import api from '../../service/api';

const StudentsTable = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/alunos');
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Formato de resposta inválido');
            }
            const formattedStudents = response.data.map(aluno => ({
                matricula: aluno.matricula,
                nome: aluno.nome,
                email: aluno.email,
                curso: aluno.curso,
                condicao: aluno.condicoes.length > 0 ? aluno.condicoes[0] : 'Ativo',
            }));
            setStudents(formattedStudents);
        } catch (err) {
            setError('Erro ao carregar alunos');
            console.error('Erro ao buscar alunos:', err);
            if (err.response) {
                console.error('Status:', err.response.status);
                console.error('Dados do erro:', err.response.data);
            }
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: '100%' }}>
                {loading ? (
                    <Typography align="center">Carregando...</Typography>
                ) : error ? (
                    <Typography align="center" color="error">{error}</Typography>
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
            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress />
                    <Typography>Carregando...</Typography>
                </Stack>
            ) : error ? (
                <Typography align="center" color="error">{error}</Typography>
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
                                            {student.condicao}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: { xs: '4px', sm: '6px' }, height: '30px', lineHeight: '30px' }}>
                                            <IconButton color="primary" onClick={() => { }}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
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