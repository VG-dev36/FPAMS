import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { FacultyProfile } from "../../types/facultyProfile";

interface Props {
    facultyProfiles: FacultyProfile[];
    loading?: boolean;
    onEdit: (facultyProfile: FacultyProfile) => void;
    onDelete: (facultyProfile: FacultyProfile) => void;
}

export default function FacultyProfileTable({
    facultyProfiles,
    loading = false,
    onEdit,
    onDelete,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "employeeCode",
            headerName: "Code",
            width: 120,
        },
        {
            field: "facultyName",
            headerName: "Faculty",
            flex: 1.5,
        },
        {
            field: "departmentName",
            headerName: "Department",
            flex: 1.2,
        },
        {
            field: "designationName",
            headerName: "Designation",
            flex: 1.2,
        },
        {
            field: "highestQualification",
            headerName: "Qualification",
            flex: 1,
        },
        {
            field: "isActive",
            headerName: "Status",
            flex: 0.8,
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
        <Box sx={{ height: 540, width: "100%" }}>
            <DataGrid
                rows={facultyProfiles}
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
                }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
