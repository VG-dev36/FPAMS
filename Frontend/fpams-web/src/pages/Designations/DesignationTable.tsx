import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Designation } from "../../types/designation";

interface Props {
    designations: Designation[];
    loading?: boolean;
    onEdit: (designation: Designation) => void;
    onDelete: (designation: Designation) => void;
}

export default function DesignationTable({
    designations,
    loading = false,
    onEdit,
    onDelete,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "designationCode",
            headerName: "Code",
            flex: 1,
        },
        {
            field: "designationName",
            headerName: "Designation",
            flex: 2,
        },
        {
            field: "displayOrder",
            headerName: "Order",
            width: 100,
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
                rows={designations}
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
                        sortModel: [{ field: "displayOrder", sort: "asc" }],
                    },
                }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
