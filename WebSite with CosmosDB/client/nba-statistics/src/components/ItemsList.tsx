import React from 'react';
import { Box, Typography } from '@mui/material';

interface ListItemProps<T> {
    item: T;
    handleItemClick: (item: T) => void;
    renderItem: (item: T) => React.ReactNode;
}

interface ListProps<T> {
    items: T[];
    label1: string;
    label2: string;
    handleItemClick: (item: T) => void;
    renderItem: (item: T) => React.ReactNode;
}

const List: React.FC<ListProps<any>> = ({ items, handleItemClick, renderItem, label1, label2 }) => (
    <Box
        sx={{
            width: '100%',
            maxWidth: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '600px',
            overflow: 'hidden',
        }}
    >
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                padding: '8px',
                position: 'sticky',
                top: 0,
                zIndex: 1,
            }}
        >
            <Typography
                sx={{
                    paddingLeft: '1rem',
                    textAlign: 'left',
                    fontSize: '1.5rem',
                    '@media (max-width: 400px)': {
                        fontSize: '1rem'
                    },
                }}
            >
                {label1}
            </Typography>
            <Typography
                sx={{
                    paddingRight: '1rem',
                    textAlign: 'right',
                    fontSize: '1.5rem',
                    '@media (max-width: 400px)': {
                        fontSize: '1rem'
                    },
                }}
            >
                {label2}
            </Typography>
        </Box>

        <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                marginTop: '8px',
                padding: '8px',
            }}
        >
            {items.map((item, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        },
                        '@media (max-width: 400px)': {
                            flexDirection: 'column',
                            textAlign: 'left',
                            fontSize: '1rem',
                        },
                    }}
                    onClick={() => handleItemClick(item)}
                >
                    {renderItem(item)}
                </Box>
            ))}
        </Box>
    </Box>
);

export default List;