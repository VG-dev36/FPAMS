import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Grid,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import appraisalFormService from "../../services/appraisalFormService";
import type { AppraisalForm } from "../../types/appraisalForm";

const escapeCsv = (value: string | number | null | undefined) => {
    const text = String(value ?? "");

    if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
        return `"${text.replaceAll("\"", "\"\"")}"`;
    }

    return text;
};

const downloadCsv = (rows: AppraisalForm[]) => {
    const headers = [
        "Employee Code",
        "Faculty",
        "Department",
        "Academic Year",
        "Teaching",
        "Research",
        "Administration",
        "Contribution",
        "Total",
        "Status",
    ];

    const csvRows = rows.map((row) => [
        row.employeeCode,
        row.facultyName,
        row.departmentName,
        row.academicYearName,
        row.teachingScore,
        row.researchScore,
        row.administrationScore,
        row.contributionScore,
        row.totalScore,
        row.status,
    ]);

    const csv = [
        headers.map(escapeCsv).join(","),
        ...csvRows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fpams-appraisal-report.csv";
    link.click();
    URL.revokeObjectURL(url);
};

const Reports = () => {
    const [appraisals, setAppraisals] = useState<AppraisalForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                const data = await appraisalFormService.getAll();
                setAppraisals(data);
            } catch {
                setError("Unable to load appraisal reports.");
            } finally {
                setLoading(false);
            }
        };

        void loadReports();
    }, []);

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
            || appraisal.status.toLowerCase().includes(search)
        );
    }, [appraisals, searchText]);

    const summary = useMemo(() => {
        const completed = appraisals.filter((appraisal) => appraisal.status === "IqacReviewed").length;
        const submitted = appraisals.filter((appraisal) => appraisal.status !== "Draft").length;
        const averageScore = appraisals.length
            ? Math.round(appraisals.reduce((sum, appraisal) => sum + appraisal.totalScore, 0) / appraisals.length)
            : 0;

        return {
            total: appraisals.length,
            submitted,
            completed,
            averageScore,
        };
    }, [appraisals]);

    const departmentRows = useMemo(() => {
        const grouped = new Map<string, {
            id: string;
            departmentName: string;
            count: number;
            totalScore: number;
            completed: number;
        }>();

        appraisals.forEach((appraisal) => {
            const existing = grouped.get(appraisal.departmentName) ?? {
                id: appraisal.departmentName,
                departmentName: appraisal.departmentName,
                count: 0,
                totalScore: 0,
                completed: 0,
            };

            existing.count += 1;
            existing.totalScore += appraisal.totalScore;
            existing.completed += appraisal.status === "IqacReviewed" ? 1 : 0;
            grouped.set(appraisal.departmentName, existing);
        });

        return Array.from(grouped.values()).map((row) => ({
            ...row,
            averageScore: row.count ? Math.round(row.totalScore / row.count) : 0,
        }));
    }, [appraisals]);

    const columns: GridColDef[] = [
        {
            field: "employeeCode",
            headerName: "Code",
            width: 110,
        },
        {
            field: "facultyName",
            headerName: "Faculty",
            flex: 1.3,
        },
        {
            field: "departmentName",
            headerName: "Department",
            flex: 1.1,
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
                    color={params.value === "IqacReviewed" ? "success" : "primary"}
                    size="small"
                />
            ),
        },
    ];

    const departmentColumns: GridColDef[] = [
        {
            field: "departmentName",
            headerName: "Department",
            flex: 1.5,
        },
        {
            field: "count",
            headerName: "Forms",
            width: 110,
        },
        {
            field: "averageScore",
            headerName: "Avg Score",
            width: 130,
        },
        {
            field: "completed",
            headerName: "Finalized",
            width: 130,
        },
    ];

    return (
        <Box>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                    alignItems: { xs: "stretch", md: "flex-start" },
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <PageHeader
                    title="Reports"
                    subtitle="Track appraisal progress, scores, and department-level completion."
                />

                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadCsv(filteredAppraisals)}
                    disabled={!filteredAppraisals.length}
                    sx={{ alignSelf: { xs: "stretch", md: "center" } }}
                >
                    Export CSV
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    disabled={!filteredAppraisals.length}
                    sx={{ alignSelf: { xs: "stretch", md: "center" } }}
                >
                    Print / PDF
                </Button>
            </Stack>

            <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}
            >
                {[
                    ["Total Forms", summary.total],
                    ["Submitted", summary.submitted],
                    ["Finalized", summary.completed],
                    ["Average Score", summary.averageScore],
                ].map(([label, value]) => (
                    <Grid
                        key={label}
                        size={{ xs: 12, sm: 6, md: 3 }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{ p: 2 }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {label}
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700 }}
                            >
                                {value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3 }}
            >
                <Typography
                    variant="h6"
                    sx={{ mb: 2 }}
                >
                    Department Summary
                </Typography>
                <Box sx={{ height: 320, width: "100%" }}>
                    <DataGrid
                        rows={departmentRows}
                        columns={departmentColumns}
                        loading={loading}
                        pageSizeOptions={[5, 10]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Paper>

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
                        label="Search reports"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 420 }}
                    />
                </Stack>

                <Box sx={{ height: 520, width: "100%" }}>
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
};

export default Reports;
