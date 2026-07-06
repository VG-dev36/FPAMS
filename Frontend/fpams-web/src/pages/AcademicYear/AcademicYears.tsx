import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Paper,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import academicYearService from "../../services/academicYearService";
import type {
    AcademicYear,
    CreateAcademicYearRequest,
} from "../../types/academicYear";
import AcademicYearDialog from "./AcademicYearDialog";
import AcademicYearTable from "./AcademicYearTable";

const AcademicYears = () => {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);
    const [academicYearToDelete, setAcademicYearToDelete] = useState<AcademicYear | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadAcademicYears = async () => {
        try {
            setLoading(true);
            const data = await academicYearService.getAll();
            setAcademicYears(data);
        } catch {
            setError("Unable to load academic years.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadAcademicYears();
    }, []);

    const filteredAcademicYears = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return academicYears;
        }

        return academicYears.filter((academicYear) =>
            academicYear.yearName.toLowerCase().includes(search)
        );
    }, [academicYears, searchText]);

    const handleAdd = () => {
        setSelectedAcademicYear(null);
        setDialogOpen(true);
    };

    const handleEdit = (academicYear: AcademicYear) => {
        setSelectedAcademicYear(academicYear);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedAcademicYear(null);
    };

    const handleSubmit = async (data: CreateAcademicYearRequest & { isActive: boolean }) => {
        try {
            setSaving(true);

            if (selectedAcademicYear) {
                await academicYearService.update({
                    ...data,
                    id: selectedAcademicYear.id,
                });
                setMessage("Academic year updated.");
            } else {
                await academicYearService.create({
                    yearName: data.yearName,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    isCurrent: data.isCurrent,
                });
                setMessage("Academic year added.");
            }

            handleCloseDialog();
            await loadAcademicYears();
        } catch {
            setError("Unable to save academic year.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!academicYearToDelete) {
            return;
        }

        try {
            await academicYearService.delete(academicYearToDelete.id);
            setMessage("Academic year deleted.");
            setAcademicYearToDelete(null);
            await loadAcademicYears();
        } catch {
            setError("Unable to delete academic year.");
        }
    };

    return (
        <Box>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                    alignItems: { xs: "stretch", sm: "flex-start" },
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <PageHeader
                    title="Academic Years"
                    subtitle="Manage appraisal periods and mark the current active academic year."
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                >
                    Add Academic Year
                </Button>
            </Stack>

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <TextField
                    label="Search academic years"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 420 }}
                />

                <AcademicYearTable
                    academicYears={filteredAcademicYears}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={setAcademicYearToDelete}
                />
            </Paper>

            <AcademicYearDialog
                open={dialogOpen}
                academicYear={selectedAcademicYear}
                saving={saving}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={Boolean(academicYearToDelete)}
                title="Delete Academic Year"
                message={`Delete ${academicYearToDelete?.yearName ?? "this academic year"}?`}
                onCancel={() => setAcademicYearToDelete(null)}
                onConfirm={handleDelete}
            />

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
};

export default AcademicYears;
