import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, useMediaQuery, CircularProgress, IconButton
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';

const StudentsTable = ({ searchValue }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                condicoes: Array.isArray(aluno.condicoes) ? aluno.condicoes : ['Ativo'],
            }));

            const filteredStudents = formattedStudents.filter(student =>
                student.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
                student.matricula.toString().includes(searchValue) ||
                student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                student.curso.toLowerCase().includes(searchValue.toLowerCase())
            );

            setStudents(filteredStudents);
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

    const handleEdit = (matricula) => {
        navigate(`/editar-aluno/${matricula}`);
    };

    useEffect(() => {
        fetchStudents();
    }, [searchValue]);

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: '100%', padding: '8px 0' }}>
                {loading ? (
                    <Typography align="center" sx={{ fontSize: '0.7rem' }}>Carregando...</Typography>
                ) : error ? (
                    <Typography align="center" color="error" sx={{ fontSize: '0.7rem' }}>{error}</Typography>
                ) : students.length > 0 ? (
                    students.map((student) => (
                        <Paper key={student.matricula} sx={{ p: '8px', boxShadow: 1 }}>
                            <Stack spacing={0.5}>
                                <Typography sx={{ fontSize: '0.7rem' }}><strong>Matrícula:</strong> {student.matricula}</Typography>
                                <Typography sx={{ fontSize: '0.7rem' }}><strong>Nome:</strong> {student.nome}</Typography>
                                <Typography sx={{ fontSize: '0.7rem' }}><strong>Email:</strong> {student.email}</Typography>
                                <Typography sx={{ fontSize: '0.7rem' }}><strong>Curso:</strong> {student.curso}</Typography>
                                <Typography sx={{ fontSize: '0.7rem' }}><strong>Condições:</strong></Typography>
                                {Array.isArray(student.condicoes) && student.condicoes.length > 0 ? (
                                    student.condicoes.map((condicao, index) => (
                                        <Typography key={index} sx={{ pl: 2, fontSize: '0.7rem' }}>
                                            - {condicao}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography sx={{ pl: 2, fontSize: '0.7rem' }}>- Nenhuma condição</Typography>
                                )}
                            </Stack>
                        </Paper>
                    ))
                ) : (
                    <Typography align="center" sx={{ fontSize: '0.7rem' }}>Nenhum estudante encontrado.</Typography>
                )}
            </Stack>
        );
    }

    return (
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '8px' }}>
            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress size={24} />
                    <Typography sx={{ fontSize: '0.7rem' }}>Carregando...</Typography>
                </Stack>
            ) : error ? (
                <Typography align="center" color="error" sx={{ fontSize: '0.7rem' }}>{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table sx={{ tableLayout: 'fixed', minWidth: '800px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ width: '10%', fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    Matrícula
                                </TableCell>
                                <TableCell align="center" sx={{ width: '20%', fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    Nome
                                </TableCell>
                                <TableCell align="center" sx={{ width: '25%', fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    Email
                                </TableCell>
                                <TableCell align="center" sx={{ width: '25%', fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    Curso
                                </TableCell>
                                <TableCell align="center" sx={{ width: '15%', fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    Condições
                                </TableCell>
                                <TableCell align="center" sx={{ width: '5%', fontWeight: 'bold', backgroundColor: '#2f9e41', color: '#fff', borderRight: '1px solid #fff', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <TableRow key={student.matricula}>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                            {student.matricula}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                            {student.nome}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                            {student.email}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                            {student.curso}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                            {Array.isArray(student.condicoes) && student.condicoes.length > 0 ? (
                                                student.condicoes.map((condicao, index) => (
                                                    <Typography key={index} component="div" sx={{ fontSize: '0.7rem', lineHeight: '1.2' }}>
                                                        {condicao}
                                                    </Typography>
                                                ))
                                            ) : (
                                                <Typography component="div" sx={{ fontSize: '0.7rem', lineHeight: '1.2' }}>
                                                    Não se aplica
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderRight: '1px solid #e0e0e0', padding: '4px' }}>
                                            <IconButton color="primary" onClick={() => handleEdit(student.matricula)} sx={{ padding: '2px' }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ padding: '4px', fontSize: '0.7rem', lineHeight: '1.2' }}>
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