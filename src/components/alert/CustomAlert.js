import React from 'react';
import Alert from '@mui/material/Alert';

export const CustomAlert = ({ message, type }) => {
    // Validando se o tipo é válido, caso contrário usa 'info' como default
    const validTypes = ['success', 'info', 'warning', 'error'];
    const alertType = validTypes.includes(type) ? type : 'info';

    return (
        <Alert variant="filled" severity={alertType}>
            {message}
        </Alert>
    );
};

export default CustomAlert;