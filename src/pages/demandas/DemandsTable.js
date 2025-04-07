import React, { useState, useEffect } from "react";
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
    Popover,
    TableFooter,
    styled,
    useTheme,
} from "@mui/material";
import { Send, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ForwardingPopup from "../Encaminhamentos/ForwardingPopup.js";
import Paginate from "../../components/paginate/Paginate.js";
import api from "../../service/api";

const StyledTableCellHead = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    backgroundColor: "#2f9e41",
    color: theme.palette.common.white,
    borderRight: `1px solid ${theme.palette.common.white}`,
    padding: theme.spacing(0.75),
    textAlign: "center",
    height: "auto",
    lineHeight: "normal",
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(0.75),
    textAlign: "center",
    height: "auto",
    lineHeight: "normal",
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRight: `1px solid ${theme.palette.divider}`,
}));

const DemandsTable = ({
    demands,
    onSend,
    onViewDetails,
    usuarioLogadoId,
    onDemandUpdated,
    count,
    page,
    onPageChange,
}) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:960px)");
    const navigate = useNavigate();
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedDemandId, setSelectedDemandId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDemand, setSelectedDemand] = useState(null);
    const [canForward, setCanForward] = useState({});
    const theme = useTheme();
    const smallPadding = theme.spacing(0.5);
    const smallFontSize = "0.8rem";

    const handleOpenPopup = (demandId) => {
        setSelectedDemandId(demandId);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedDemandId(null);
        if (onDemandUpdated) {
            onDemandUpdated();
            fetchCanForwardStatus();
        }
    };

    const handleOpenRecipients = (event, demand) => {
        setAnchorEl(event.currentTarget);
        setSelectedDemand(demand);
    };

    const handleCloseRecipients = () => {
        setAnchorEl(null);
        setSelectedDemand(null);
    };

    const handleViewDetails = (demandId) => {
        navigate(`/demands/${demandId}`);
    };

    const open = Boolean(anchorEl);

    const fetchCanForwardStatus = async () => {
        const token = localStorage.getItem("token");
        const updatedCanForward = {};

        try {
            for (const demand of demands) {
                const response = await api.get(`/demandas/${demand.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                updatedCanForward[demand.id] = response.data.podeIntervir;
            }
            setCanForward(updatedCanForward);
        } catch (err) {
            console.error(
                "Erro ao verificar se pode encaminhar:",
                err.response?.data || err
            );
        }
    };

    useEffect(() => {
        fetchCanForwardStatus();
    }, [demands]);

    const getUniqueRecipients = (destinatarios) => {
        if (!destinatarios || destinatarios.length === 0) return [];
        const uniqueNames = [...new Set(destinatarios.map((dest) => dest.nome))];
        return uniqueNames;
    };

    const formatDateTime = (dateString) => {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        return new Date(dateString)
            .toLocaleString("pt-BR", options)
            .replace("T", ", ")
            .replace(",", ", ");
    };

    if (isMobile) {
        return (
            <Stack spacing={1} sx={{ width: "100%" }}>
                {demands.map((demand) => (
                    <Paper
                        key={demand.id}
                        sx={{
                            p: 2,
                            background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">
                                <strong>Alunos:</strong>{" "}
                                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") || "Nenhum"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Status:</strong>{" "}
                                <span style={{ color: demand.status ? "#2E7D32" : "#D32F2F" }}>
                                    {demand.status ? "Aberta" : "Fechada"}
                                </span>
                            </Typography>
                            <Typography variant="body2">
                                <strong>Curso:</strong>{" "}
                                {demand.DemandaAlunos?.[0]?.Aluno?.Cursos?.nome || "Não informado"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Data/Hora:</strong> {formatDateTime(demand.createdAt) || "Não informada"}
                            </Typography>
                            <Stack direction="row" justifyContent="flex-end">
                                <IconButton color="primary" onClick={() => handleViewDetails(demand.id)} aria-label="ver detalhes">
                                    <Visibility />
                                </IconButton>
                                <Tooltip
                                    title={
                                        !demand.status
                                            ? "Você não pode enviar uma demanda que está fechada"
                                            : canForward[demand.id] === false
                                                ? "Você já encaminhou essa demanda"
                                                : "Encaminhar demanda"
                                    }
                                >
                                    <span>
                                        <IconButton
                                            color="success"
                                            onClick={() => handleOpenPopup(demand.id)}
                                            disabled={!demand.status || canForward[demand.id] === false}
                                        >
                                            <Send />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
                {count > 1 && (
                    <Paginate count={count} page={page} onChange={onPageChange} />
                )}
                <ForwardingPopup
                    open={openPopup}
                    onClose={handleClosePopup}
                    demandId={selectedDemandId}
                    usuarioLogadoId={usuarioLogadoId}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleCloseRecipients}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Stack sx={{ p: 2 }}>
                        <Typography variant="h6">Destinatários</Typography>
                        {selectedDemand && getUniqueRecipients(selectedDemand.destinatarios).length > 0 ? (
                            getUniqueRecipients(selectedDemand.destinatarios).map((nome, index) => (
                                <Typography key={index}>{nome}</Typography>
                            ))
                        ) : (
                            <Typography>Nenhum destinatário</Typography>
                        )}
                    </Stack>
                </Popover>
            </Stack>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                width: "100%",
                maxWidth: "1200px",
                margin: "25px auto",
                background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
            }}
        >
            <Table sx={{ minWidth: 600 }} aria-label="demandas">
                <TableHead>
                    <TableRow>
                        <StyledTableCellHead>Alunos Envolvidos</StyledTableCellHead>
                        <StyledTableCellHead align="center">Status</StyledTableCellHead>
                        {!isTablet && <StyledTableCellHead align="center">Curso</StyledTableCellHead>}
                        <StyledTableCellHead align="center">Data/Hora</StyledTableCellHead>
                        <StyledTableCellHead align="center">Ações</StyledTableCellHead>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {demands.map((demand) => (
                        <TableRow key={demand.id}>
                            <StyledTableCellBody>
                                {demand.DemandaAlunos?.map((da) => da.Aluno?.nome).join(", ") || "Nenhum"}
                            </StyledTableCellBody>
                            <StyledTableCellBody align="center">
                                <span style={{ color: demand.status ? "#2E7D32" : "#D32F2F" }}>
                                    {demand.status ? "Aberta" : "Fechada"}
                                </span>
                            </StyledTableCellBody>
                            {!isTablet && (
                                <StyledTableCellBody align="center">
                                    {demand.DemandaAlunos?.[0]?.Aluno?.Cursos?.nome || "Não informado"}
                                </StyledTableCellBody>
                            )}
                            <StyledTableCellBody align="center">
                                {formatDateTime(demand.createdAt) || "Não informada"}
                            </StyledTableCellBody>
                            <StyledTableCellBody align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    <IconButton color="primary" onClick={() => handleViewDetails(demand.id)} aria-label="ver detalhes">
                                        <Visibility />
                                    </IconButton>
                                    <Tooltip
                                        title={
                                            !demand.status
                                                ? "Você não pode enviar uma demanda que está fechada"
                                                : canForward[demand.id] === false
                                                    ? "Você já encaminhou essa demanda"
                                                    : "Encaminhar demanda"
                                        }
                                    >
                                        <span>
                                            <IconButton
                                                color="success"
                                                onClick={() => handleOpenPopup(demand.id)}
                                                disabled={!demand.status || canForward[demand.id] === false}
                                            >
                                                <Send />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Stack>
                            </StyledTableCellBody>
                        </TableRow>
                    ))}
                </TableBody>
                {count > 1 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} sx={{ borderBottom: "none" }}>
                                <Stack alignItems="center" mt={2}>
                                    <Paginate count={count} page={page} onChange={onPageChange} />
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
            <ForwardingPopup
                open={openPopup}
                onClose={handleClosePopup}
                demandId={selectedDemandId}
                usuarioLogadoId={usuarioLogadoId}
            />
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseRecipients}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Stack sx={{ p: 2 }}>
                    <Typography variant="h6">Destinatários</Typography>
                    {selectedDemand && getUniqueRecipients(selectedDemand.destinatarios).length > 0 ? (
                        getUniqueRecipients(selectedDemand.destinatarios).map((nome, index) => (
                            <Typography key={index}>{nome}</Typography>
                        ))
                    ) : (
                        <Typography>Nenhum destinatário</Typography>
                    )}
                </Stack>
            </Popover>
        </TableContainer>
    );
};

export default DemandsTable;