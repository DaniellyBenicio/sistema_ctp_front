import React from "react";
import { Modal, Box, Stack, Typography, IconButton, Fade } from "@mui/material";
import { Close, Email, Info } from "@mui/icons-material";

const StudentDetails = ({ open, onClose, student }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ fontSize: "1.1rem", textAlign: "center", flexGrow: 1 }}
            >
              Detalhes do Aluno
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "grey.600" }}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>
          {student && (
            <Stack spacing={1.5} alignItems="flex-start">
              <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                <strong>Nome:</strong> {student.nome}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                <strong>Email:</strong> {student.email}
              </Typography>
              {Array.isArray(student.condicoes) && student.condicoes.length > 0 && (
                <Stack alignItems="flex-start">
                  <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                    <strong>Condições:</strong>
                  </Typography>
                  {student.condicoes.map((condicao, index) => (
                    <Typography key={index} variant="body2" sx={{ pl: 1, fontSize: "0.9rem" }}>
                      - {condicao}
                    </Typography>
                  ))}
                </Stack>
              )}
              {Array.isArray(student.condicoes) && student.condicoes.length === 0 && (
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  <strong>Condições:</strong> Nenhuma condição
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default StudentDetails;
