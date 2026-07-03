import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Department } from "../../types/department";

interface Props {
    departments: Department[];
    onEdit: (department: Department) => void;
    onDelete: (department: Department) => void;
}

export default function DepartmentTable({
    departments,
    onEdit,
    onDelete,
}: Props) {

    const columns: GridColDef[] = [

        {
            field: "departmentCode",
            headerName: "Code",
            flex: 1,
        },

        {
            field: "departmentName",
            headerName: "Department",
            flex: 2,
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

                rows={departments}

                columns={columns}

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