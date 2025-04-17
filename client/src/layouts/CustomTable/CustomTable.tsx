import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";

export interface Column {
    id: string;
    label: string;
    align?: "right" | "left" | "center";
    minWidth?: number;
    render?: (row: any) => React.ReactNode;
}

interface GenericTableProps {
    columns: Column[];
    rows: any[];
    emptyMessage?: string;
}

const CustomTable: React.FC<GenericTableProps> = ({
    columns,
    rows,
    emptyMessage = "No data available.",
}) => {
    return (
        <TableContainer
            variant="outlined"
            component={Paper}
            sx={{ maxHeight: 440, borderRadius: "5px" }}
        >
            <Table stickyHeader aria-label="custom table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align || "left"}
                                style={{
                                    minWidth: column.minWidth || 100,
                                    color: "white",
                                    backgroundColor: "#121212",
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <TableRow key={row.id || rowIndex} hover>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || "left"}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center">
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {emptyMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
