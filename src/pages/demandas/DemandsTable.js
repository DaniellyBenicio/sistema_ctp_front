import React, { useState } from "react";
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Typography,
    useMediaQuery,
    Tooltip,
} from "@mui/material";
import { Send, Visibility, Group } from "@mui/icons-material";
import ForwardingPopup from "../Encaminhamentos/ForwardingPopup";

const DemandsTable = ({ demands, onSend, onViewDetails, usuarioLogadoId }) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedDemandId, setSelectedDemandId] = useState(null);

    const handleOpenPopup = (demandId) => {
        setSelectedDemandId(demandId);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedDemandId(null);
    };

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: "100%" }}>
                {demands.map((demand) => (
                    <Paper key={demand.id} sx={{ p: 1 }}>
                        <Stack spacing={0.5}>
                            <Typography>
                                <strong>Alunos Envolvidos:</strong>{" "}
                                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") ||
                                    "Nenhum aluno"}
                            </Typography>
                            <Typography>
                                <strong>Status:</strong> {demand.status ? "Ativo" : "Inativo"}
                            </Typography>
                            <Typography>
                                <strong>Disciplina:</strong> {demand.disciplina}
                            </Typography>
                            <Typography>
                                <strong>Destinatários:</strong>
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        alert(
                                            `Destinatários da demanda ${demand.id}: [Lógica a ser implementada]`
                                        )
                                    }
                                >
                                    <Group fontSize="small" />
                                </IconButton>
                                <span>{demand.destinatarios?.length || 0}</span>
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="center">
                                <IconButton
                                    color="primary"
                                    onClick={() => onViewDetails(demand)}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="success"
                                    onClick={() => handleOpenPopup(demand.id)}
                                >
                                    <Send />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
                <ForwardingPopup
                    open={openPopup}
                    onClose={handleClosePopup}
                    demandId={selectedDemandId}
                    usuarioLogadoId={usuarioLogadoId}
                />
            </Stack>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: "#2f9e41",
                                color: "#fff",
                                borderRight: "1px solid #fff",
                                padding: { xs: "4px", sm: "6px" },
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            Alunos Envolvidos
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: "#2f9e41",
                                color: "#fff",
                                borderRight: "1px solid #fff",
                                padding: { xs: "4px", sm: "6px" },
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            Status
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: "#2f9e41",
                                color: "#fff",
                                borderRight: "1px solid #fff",
                                padding: { xs: "4px", sm: "6px" },
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            Disciplina
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: "#2f9e41",
                                color: "#fff",
                                borderRight: "1px solid #fff",
                                padding: { xs: "4px", sm: "6px" },
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            Destinatários
                        </TableCell>
                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: "#2f9e41",
                                color: "#fff",
                                padding: { xs: "4px", sm: "6px" },
                                height: "30px",
                                lineHeight: "30px",
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
                                    borderRight: "1px solid #e0e0e0",
                                    padding: { xs: "4px", sm: "6px" },
                                    height: "30px",
                                    lineHeight: "30px",
                                }}
                            >
                                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") ||
                                    "Nenhum aluno"}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: "1px solid #e0e0e0",
                                    padding: { xs: "4px", sm: "6px" },
                                    height: "30px",
                                    lineHeight: "30px",
                                }}
                            >
                                {demand.status ? "Ativo" : "Inativo"}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: "1px solid #e0e0e0",
                                    padding: { xs: "4px", sm: "6px" },
                                    height: "30px",
                                    lineHeight: "30px",
                                }}
                            >
                                {demand.disciplina}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    borderRight: "1px solid #e0e0e0",
                                    padding: { xs: "4px", sm: "6px" },
                                    height: "30px",
                                    lineHeight: "30px",
                                }}
                            >
                                <Tooltip title="Ver destinatários">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            alert(
                                                `Destinatários da demanda ${demand.id}: [Lógica a ser implementada]`
                                            )
                                        }
                                    >
                                        <Group fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <span>{demand.destinatarios?.length || 0}</span>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    padding: { xs: "4px", sm: "6px" },
                                    height: "30px",
                                    lineHeight: "30px",
                                }}
                            >
                                <IconButton
                                    color="primary"
                                    onClick={() => onViewDetails(demand)}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    color="success"
                                    onClick={() => handleOpenPopup(demand.id)}
                                >
                                    <Send />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ForwardingPopup
                open={openPopup}
                onClose={handleClosePopup}
                demandId={selectedDemandId}
                usuarioLogadoId={usuarioLogadoId}
            />
        </TableContainer>
    );
};

export default DemandsTable;