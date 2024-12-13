import React from 'react';
import { Button as MUIButton } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
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
    sx?: SxProps<Theme>; // Add sx prop for custom styles
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
    sx = {}, // Default empty object
}) => {
    // Ensure all styles are type-safe for Material-UI's sx
    const buttonStyle: SxProps<Theme> = {
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'none',
        color: color,
        backgroundColor: backgroundColor,
        fontSize: textSize as unknown as string, // Ensure valid type
        cursor: 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: width,
        height: height,
        '&:hover': {
            color: hoverColor,
        },
        '&.Mui-disabled': {
            color: 'black',
            backgroundColor: globalTheme.palette.grey[700],
        },
    };

    return (
        <MUIButton
            onClick={onClick}
            className={`btn ${className}`}
            sx={{ ...buttonStyle, ...sx }} // Merge custom sx styles
            disabled={disabled}
            startIcon={text ? icon : undefined}
        >
            {text ? text : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{icon}</div>}
        </MUIButton>
    );
};

export default Button;
