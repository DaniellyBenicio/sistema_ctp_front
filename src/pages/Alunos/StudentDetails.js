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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ fontSize: "1.1rem" }}
            >
              {student ? `Detalhes de ${student.nome}` : "Detalhes do Aluno"}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "grey.600" }}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>
          {student && (
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Email fontSize="small" color="info" />
                <Typography sx={{ fontSize: "0.9rem" }}>
                  <strong>Email:</strong> {student.email}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="flex-start" spacing={1}>
                <Info fontSize="small" color="info" />
                <Stack>
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    <strong>Condições:</strong>
                  </Typography>
                  {Array.isArray(student.condicoes) &&
                  student.condicoes.length > 0 ? (
                    student.condicoes.map((condicao, index) => (
                      <Typography
                        key={index}
                        sx={{ pl: 2, fontSize: "0.9rem" }}
                      >
                        - {condicao}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ pl: 2, fontSize: "0.9rem" }}>
                      - Nenhuma condição
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default StudentDetails;
