import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, Chip, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import type { AppraisalForm } from "../../types/appraisalForm";

interface Props {
    appraisalForms: AppraisalForm[];
    loading?: boolean;
    onDelete: (appraisalForm: AppraisalForm) => void;
    onEdit: (appraisalForm: AppraisalForm) => void;
    onEvidence: (appraisalForm: AppraisalForm) => void;
    onSubmit: (appraisalForm: AppraisalForm) => void;
}

const statusColor = (status: string) => {
    if (status === "Draft") {
        return "default";
    }

    if (status === "Returned") {
        return "warning";
    }

    if (status === "IqacReviewed") {
        return "success";
    }

    return "primary";
};

export default function AppraisalTable({
    appraisalForms,
    loading = false,
    onDelete,
    onEdit,
    onEvidence,
    onSubmit,
}: Props) {
    const columns: GridColDef[] = [
        {
            field: "employeeCode",
            headerName: "Code",
            width: 110,
        },
        {
            field: "facultyName",
            headerName: "Faculty",
            flex: 1.4,
        },
        {
            field: "academicYearName",
            headerName: "Year",
            flex: 1,
        },
        {
            field: "departmentName",
            headerName: "Department",
            flex: 1.2,
        },
        {
            field: "totalScore",
            headerName: "Total",
            width: 100,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={statusColor(params.value)}
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 220,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                >
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="secondary"
                        onClick={() => onEvidence(params.row)}
                    >
                        <AttachFileIcon />
                    </IconButton>

                    {params.row.status === "Draft" && (
                        <Button
                            size="small"
                            startIcon={<SendIcon />}
                            onClick={() => onSubmit(params.row)}
                        >
                            Submit
                        </Button>
                    )}

                    <IconButton
                        color="error"
                        onClick={() => onDelete(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Box sx={{ height: 540, width: "100%" }}>
            <DataGrid
                rows={appraisalForms}
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
