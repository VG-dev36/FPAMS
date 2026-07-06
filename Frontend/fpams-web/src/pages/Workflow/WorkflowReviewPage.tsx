import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import appraisalFormService from "../../services/appraisalFormService";
import type { AppraisalForm, AppraisalStatus } from "../../types/appraisalForm";

interface Props {
    actionLabel: string;
    approveAction: "hod" | "principal" | "iqac";
    description: string;
    expectedStatus: AppraisalStatus;
    title: string;
}

export default function WorkflowReviewPage({
    actionLabel,
    approveAction,
    description,
    expectedStatus,
    title,
}: Props) {
    const [appraisals, setAppraisals] = useState<AppraisalForm[]>([]);
    const [selectedAppraisal, setSelectedAppraisal] = useState<AppraisalForm | null>(null);
    const [reviewerRemarks, setReviewerRemarks] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadAppraisals = async () => {
        try {
            setLoading(true);
            const data = await appraisalFormService.getAll();
            setAppraisals(data.filter((appraisal) => appraisal.status === expectedStatus));
        } catch {
            setError("Unable to load workflow queue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadAppraisals();
    }, [expectedStatus]);

    const filteredAppraisals = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return appraisals;
        }

        return appraisals.filter((appraisal) =>
            appraisal.employeeCode.toLowerCase().includes(search)
            || appraisal.facultyName.toLowerCase().includes(search)
            || appraisal.departmentName.toLowerCase().includes(search)
            || appraisal.academicYearName.toLowerCase().includes(search)
        );
    }, [appraisals, searchText]);

    const closeReviewDialog = () => {
        setSelectedAppraisal(null);
        setReviewerRemarks("");
    };

    const approveSelected = async () => {
        if (!selectedAppraisal) {
            return;
        }

        try {
            setSaving(true);

            if (approveAction === "hod") {
                await appraisalFormService.hodReview(selectedAppraisal.id, reviewerRemarks);
            } else if (approveAction === "principal") {
                await appraisalFormService.principalReview(selectedAppraisal.id, reviewerRemarks);
            } else {
                await appraisalFormService.iqacReview(selectedAppraisal.id, reviewerRemarks);
            }

            setMessage("Appraisal reviewed.");
            closeReviewDialog();
            await loadAppraisals();
        } catch {
            setError("Unable to review appraisal.");
        } finally {
            setSaving(false);
        }
    };

    const returnSelected = async () => {
        if (!selectedAppraisal) {
            return;
        }

        try {
            setSaving(true);
            await appraisalFormService.returnForCorrection(selectedAppraisal.id, reviewerRemarks);
            setMessage("Appraisal returned for correction.");
            closeReviewDialog();
            await loadAppraisals();
        } catch {
            setError("Unable to return appraisal.");
        } finally {
            setSaving(false);
        }
    };

    const columns: GridColDef[] = [
        {
            field: "employeeCode",
            headerName: "Code",
            width: 110,
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
            field: "academicYearName",
            headerName: "Year",
            flex: 1,
        },
        {
            field: "totalScore",
            headerName: "Score",
            width: 100,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color="primary"
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
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => setSelectedAppraisal(params.row)}
                >
                    Review
                </Button>
            ),
        },
    ];

    return (
        <Box>
            <PageHeader
                title={title}
                subtitle={description}
            />

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <TextField
                        label="Search queue"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 420 }}
                    />
                </Stack>

                <Box sx={{ height: 540, width: "100%" }}>
                    <DataGrid
                        rows={filteredAppraisals}
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
            </Paper>

            <Dialog
                open={Boolean(selectedAppraisal)}
                onClose={saving ? undefined : closeReviewDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{actionLabel}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Faculty"
                            value={selectedAppraisal?.facultyName ?? ""}
                            fullWidth
                            disabled
                        />
                        <TextField
                            label="Score"
                            value={selectedAppraisal?.totalScore ?? ""}
                            fullWidth
                            disabled
                        />
                        <TextField
                            label="Reviewer Remarks"
                            value={reviewerRemarks}
                            onChange={(event) => setReviewerRemarks(event.target.value)}
                            multiline
                            minRows={4}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeReviewDialog}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="warning"
                        onClick={returnSelected}
                        disabled={saving}
                    >
                        Return
                    </Button>
                    <Button
                        variant="contained"
                        onClick={approveSelected}
                        disabled={saving}
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={Boolean(message)}
                autoHideDuration={3000}
                onClose={() => setMessage(null)}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setMessage(null)}
                >
                    {message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() => setError(null)}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}
