import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { AcademicYear } from "../../types/academicYear";

interface Props {
    academicYears: AcademicYear[];
    loading?: boolean;
    onEdit: (academicYear: AcademicYear) => void;
    onDelete: (academicYear: AcademicYear) => void;
}

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));

export default function AcademicYearTable({
    academicYears,
    loading = false,
    onEdit,
    onDelete,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "yearName",
            headerName: "Academic Year",
            flex: 1.5,
        },
        {
            field: "startDate",
            headerName: "Start Date",
            flex: 1,
            valueFormatter: (value) => formatDate(value),
        },
        {
            field: "endDate",
            headerName: "End Date",
            flex: 1,
            valueFormatter: (value) => formatDate(value),
        },
        {
            field: "isCurrent",
            headerName: "Current",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Current" : "No"}
                    color={params.value ? "primary" : "default"}
                    size="small"
                />
            ),
        },
        {
            field: "isActive",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Active" : "Inactive"}
                    color={params.value ? "success" : "default"}
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 140,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() => onDelete(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
                rows={academicYears}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                            page: 0,
                        },
                    },
                    sorting: {
                        sortModel: [{ field: "startDate", sort: "desc" }],
                    },
                }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
