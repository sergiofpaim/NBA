import React from 'react';
import { Button as MUIButton } from '@mui/material';
import globalTheme from '../styles/GlobalTheme';

interface ButtonProps {
    text?: string;
    onClick: () => void;
    className?: string;
    color?: string;
    backgroundColor?: string;
    height?: string;
    width?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    textSize?: string;
    hoverColor?: string; // Optional hover color
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    className = '',
    color = globalTheme.palette.primary.main,
    backgroundColor = globalTheme.palette.secondary.main,
    height = '45px',
    width = '200px',
    icon = '',
    disabled = false,
    textSize = globalTheme.typography.h4,
    hoverColor = globalTheme.palette.background.default, // Default hover color
}) => {

    const buttonStyle = {
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'none',
        color: color,
        backgroundColor: backgroundColor,
        fontSize: textSize,
        cursor: 'pointer',
        opacity: disabled ? 0.6 : 1,
    };

    return (
        <MUIButton
            onClick={onClick}
            className={`btn ${className}`}
            sx={{
                ...buttonStyle,
                width: width,
                height: height,
                '&:hover': {
                    color: hoverColor,
                },
            }}
            disabled={disabled}
            startIcon={text ? icon : undefined}
        >
            {text ? text : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{icon}</div>}
        </MUIButton>
    );
};

export default Button;
