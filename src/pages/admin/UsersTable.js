import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Paginate from '../../components/paginate/Paginate.js';

const UsersTable = ({ users, onDelete, onUpdate }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const visibleUsers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, page, rowsPerPage]);

  const tableHeadStyle = {
    fontWeight: "bold",
    backgroundColor: "#2f9e41",
    color: "#fff",
    borderRight: "1px solid #fff",
    padding: { xs: "4px", sm: "6px" },
    height: "30px",
    lineHeight: "30px",
  };

  const tableBodyCellStyle = {
    borderRight: "1px solid #e0e0e0",
    padding: { xs: "4px", sm: "6px" },
    height: "30px",
    lineHeight: "30px",
  };

  if (isMobile) {
    return (
      <Stack spacing={1} sx={{ width: "100%" }}>
        {visibleUsers.map((user) => (
          <Paper key={user.id} sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              <Typography>
                <strong>Nome:</strong> {user.nome}
              </Typography>
              <Typography>
                <strong>Matrícula:</strong> {user.matricula}
              </Typography>
              <Typography>
                <strong>Cargo:</strong> {user.Cargo.nome}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton color="primary" onClick={() => onUpdate(user)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(user.id)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        ))}
        <Paginate
          count={Math.ceil(users.length / rowsPerPage)}
          page={page}
          onChange={(event, newPage) => {
            handleChangePage(newPage);
          }}
        />
      </Stack>
    );
  }

  return (
    <>
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
              <TableCell align="center" sx={tableHeadStyle}>
                Nome
              </TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Matrícula
              </TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Cargo
              </TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Email
              </TableCell>
              <TableCell align="center" sx={tableHeadStyle}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="center" sx={tableBodyCellStyle}>
                  {user.nome}
                </TableCell>
                <TableCell align="center" sx={tableBodyCellStyle}>
                  {user.matricula}
                </TableCell>
                <TableCell align="center" sx={tableBodyCellStyle}>
                  {user.Cargo.nome}
                </TableCell>
                <TableCell align="center" sx={tableBodyCellStyle}>
                  {user.email}
                </TableCell>
                <TableCell align="center" sx={tableBodyCellStyle}>
                  <IconButton color="primary" onClick={() => onUpdate(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paginate
        count={Math.ceil(users.length / rowsPerPage)}
        page={page}
        onChange={(event, newPage) => {
          handleChangePage(newPage);
        }}
      />
    </>
  );
};

export default UsersTable;