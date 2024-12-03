import React from 'react';
import globalTheme from '../styles/GlobalTheme';

interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '' }) => {
    const buttonStyle = {
        width: '200px',
        height: '50px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'none',
        backgroundColor: globalTheme.palette.secondary.main,
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3',
    };

    return (
        <button
            onClick={onClick}
            className={`btn ${className}`}
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
        >
            {text}
        </button>
    );
};

export default Button;