import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { CheckCircle, Info, Warning, Error } from '@mui/icons-material';

export const CustomAlert = ({ message, type, onClose }) => {
    const validTypes = ['success', 'info', 'warning', 'error'];
    const alertType = validTypes.includes(type) ? type : 'info';

    // Add useEffect to handle auto-close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 3000); // 3000ms = 3 seconds

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [onClose]); // Dependency array includes onClose

    const getAlertIcon = () => {
        switch (alertType) {
            case 'success':
                return <CheckCircle style={{ color: '#4caf50' }} />;
            case 'info':
                return <Info style={{ color: '#2196f3' }} />;
            case 'warning':
                return <Warning style={{ color: '#ff9800' }} />;
            case 'error':
                return <Error style={{ color: '#f44336' }} />;
            default:
                return <Info style={{ color: '#2196f3' }} />;
        }
    };

    const borderColor = {
        success: '#4caf50',
        info: '#2196f3',
        warning: '#ff9800',
        error: '#f44336',
    }[alertType];

    return (
        <Alert
            variant="outlined"
            severity={alertType}
            icon={getAlertIcon()}
            sx={{
                position: 'fixed',
                bottom: '20px',
                right: '80px',
                width: '15%',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: 2,
                backgroundColor: 'transparent',
                borderColor: borderColor,
                borderWidth: '1px',
                color: borderColor,
                '& .MuiAlert-icon': {
                    marginRight: '8px',
                },
                transition: 'all 0.3s ease-in-out',
                zIndex: 1000,
            }}
        >
            {message}
        </Alert>
    );
};

export default CustomAlert;