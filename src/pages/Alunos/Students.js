import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../../components/SearchBar";
import StudentsTable from './StudentsTable';

const Students = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate(); 
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleNewStudent = () => {
    navigate('/alunos/register'); 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        marginTop: 0,
        padding: { xs: '2% 5%', sm: '2% 0%' },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: '#333',
          mb: 1,
          textAlign: 'center',
          fontFamily: '"Open Sans", sans-serif',
          marginBottom: { xs: '16px', sm: '30px' },
        }}
      >
        Lista de Alunos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1, sm: 2 },
          mb: 2,
          width: { xs: '100%', sm: '90%' },
          maxWidth: '1200px',
          alignSelf: 'center',
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            width: { xs: '100%', sm: '40%' },
            flexGrow: 0,
            height: { xs: 'auto', sm: '35px' },
            '& .MuiInputBase-root': {
              height: '35px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: '#2f9e41',
            '&:hover': { bgcolor: '#287f36' },
            minWidth: { xs: '100%', sm: '150px', md: '150px' },
            px: 2,
            height: { xs: '35px', sm: '38px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            padding: { xs: '4px 8px', sm: '6px 12px' },
            textTransform: 'none',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={handleNewStudent}
        >
          Novo Aluno
        </Button>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', sm: '90%' },
          maxWidth: '1200px',
          alignSelf: 'center',
          mx: 'auto',
        }}
      >
        <StudentsTable searchValue={searchValue} />
      </Box>
    </Box>
  );
};

export default Students;