import React from 'react';
import { Button as MUIButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import globalTheme from '../styles/GlobalTheme';

interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '' }) => {
    const buttonStyle = {
        width: '200px',
        height: 45,
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        border: 'none',
        backgroundColor: globalTheme.palette.secondary.main,
        color: globalTheme.palette.primary.main,
        fontSize: globalTheme.typography.h4,
        cursor: 'pointer',
        alignItems: 'center'
    };

    return (
        <MUIButton
            onClick={onClick}
            className={`btn ${className}`}
            sx={{
                ...buttonStyle,
                '&:hover': {
                    color: globalTheme.palette.background.default
                },
            }}
            startIcon={<AddCircleOutlineIcon />}
        >
            {text}
        </MUIButton>
    );
};

export default Button;
