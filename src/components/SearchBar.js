import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ value, onChange }) => {
    return (
        <TextField
            variant="outlined"
            placeholder="Buscar usuários..."
            value={value}
            onChange={onChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
            }}
            sx={{
                width: { xs: '100%', sm: '66.67%' },
                marginBottom: 2,
            }}
        />
    );
};

export default SearchBar;