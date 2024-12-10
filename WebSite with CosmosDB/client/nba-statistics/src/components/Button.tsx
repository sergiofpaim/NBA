import React from 'react';
import { Button as MUIButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import globalTheme from '../styles/GlobalTheme';

interface ButtonProps {
    text?: string;
    onClick: () => void;
    className?: string;
    color?: 'primary' | 'secondary';
    backgroundColor?: 'primary' | 'secondary';
    height?: string;
    width?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    textSize?: string;
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    className = '',
    color = 'primary',
    backgroundColor = 'secondary',
    height = '45px',
    width = '200px',
    icon = '',
    disabled = false,
    textSize = globalTheme.typography.h4,
}) => {

    const buttonStyle = {
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        border: 'none',
        color: globalTheme.palette[color].main,
        backgroundColor: globalTheme.palette[backgroundColor].main,
        fontSize: textSize,
        cursor: 'pointer',
        alignItems: 'center',
        opacity: disabled ? 0.6 : 1
    };

    return (
        <MUIButton
            onClick={onClick}
            className={`btn ${className}`}
            sx={{
                ...buttonStyle,
                width: height,
                height: width,
                alignItems: 'center',
                '&:hover': {
                    color: globalTheme.palette.background.default,
                },
            }}
            startIcon={icon}
            disabled={disabled}
        >
            {text}
        </MUIButton>
    );
};

export default Button;
