import React from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Typography,
    Paper,
} from '@mui/material';
import globalTheme from '../styles/GlobalTheme';

interface TableProps<T> {
    items: T[];
    label: string;
    handleItemClick: (item: T) => void;
    renderItem: (item: T) => React.ReactNode[];
    height?: string;
    itemHeight?: string;
    isItemDisabled?: (item: T) => boolean;
    sx?: object;
}

const TableComponent: React.FC<TableProps<any>> = ({
    items,
    handleItemClick,
    renderItem,
    label,
    height,
    itemHeight,
    sx,
}) => (
    <Paper sx={{
        padding: 0,
        borderRadius: 0,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: globalTheme.palette.background.default
    }}>
        <TableContainer
            sx={{
                maxHeight: height || '600px',
                borderRadius: 0,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                ...sx,
            }}
        >
            <Table stickyHeader >
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            colSpan={items.length > 0 ? renderItem(items[0]).length : 1}
                            sx={{
                                backgroundColor: globalTheme.palette.background.default,
                                borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                                borderBottomWidth: "10px",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '1.5rem',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    '@media (max-width: 400px)': {
                                        fontSize: '1rem',
                                    },
                                }}
                            >
                                {label}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow
                            key={index}
                            onClick={() => handleItemClick(item)}
                            sx={{
                                cursor: 'pointer',
                                backgroundColor: globalTheme.palette.background.default,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                                },
                            }}
                        >
                            {renderItem(item).map((cellContent, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    sx={{
                                        borderBottomWidth: "0px",
                                        height: itemHeight,
                                        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                                        alignItems: 'center',
                                        padding: 0,
                                    }}
                                >
                                    {cellContent}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
);

export default TableComponent;