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
import appraisalFormService from "../../services/appraisalFormService";
import facultyProfileService from "../../services/facultyProfileService";
import type { AcademicYear } from "../../types/academicYear";
import type {
    AppraisalForm as AppraisalFormType,
    CreateAppraisalFormRequest,
} from "../../types/appraisalForm";
import type { FacultyProfile } from "../../types/facultyProfile";
import AppraisalFormDialog from "./AppraisalFormDialog";
import AppraisalTable from "./AppraisalTable";
import EvidenceDialog from "./EvidenceDialog";

const Appraisal = () => {
    const [appraisalForms, setAppraisalForms] = useState<AppraisalFormType[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [facultyProfiles, setFacultyProfiles] = useState<FacultyProfile[]>([]);
    const [selectedAppraisalForm, setSelectedAppraisalForm] = useState<AppraisalFormType | null>(null);
    const [evidenceAppraisalForm, setEvidenceAppraisalForm] = useState<AppraisalFormType | null>(null);
    const [appraisalFormToDelete, setAppraisalFormToDelete] = useState<AppraisalFormType | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadPageData = async () => {
        try {
            setLoading(true);
            const [
                formData,
                yearData,
                profileData,
            ] = await Promise.all([
                appraisalFormService.getAll(),
                academicYearService.getAll(),
                facultyProfileService.getAll(),
            ]);

            setAppraisalForms(formData);
            setAcademicYears(yearData.filter((year) => year.isActive));
            setFacultyProfiles(profileData.filter((profile) => profile.isActive));
        } catch {
            setError("Unable to load appraisal forms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadPageData();
    }, []);

    const filteredAppraisalForms = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return appraisalForms;
        }

        return appraisalForms.filter((form) =>
            form.employeeCode.toLowerCase().includes(search)
            || form.facultyName.toLowerCase().includes(search)
            || form.academicYearName.toLowerCase().includes(search)
            || form.departmentName.toLowerCase().includes(search)
            || form.status.toLowerCase().includes(search)
        );
    }, [appraisalForms, searchText]);

    const handleAdd = () => {
        setSelectedAppraisalForm(null);
        setDialogOpen(true);
    };

    const handleEdit = (appraisalForm: AppraisalFormType) => {
        setSelectedAppraisalForm(appraisalForm);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedAppraisalForm(null);
    };

    const handleSubmitForm = async (data: CreateAppraisalFormRequest) => {
        try {
            setSaving(true);

            if (selectedAppraisalForm) {
                await appraisalFormService.update({
                    ...data,
                    id: selectedAppraisalForm.id,
                });
                setMessage("Appraisal updated.");
            } else {
                await appraisalFormService.create({
                    facultyProfileId: data.facultyProfileId,
                    academicYearId: data.academicYearId,
                    teachingScore: data.teachingScore,
                    researchScore: data.researchScore,
                    administrationScore: data.administrationScore,
                    contributionScore: data.contributionScore,
                    evidenceSummary: data.evidenceSummary,
                    facultyRemarks: data.facultyRemarks,
                });
                setMessage("Appraisal draft created.");
            }

            handleCloseDialog();
            await loadPageData();
        } catch {
            setError("Unable to save appraisal.");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitAppraisal = async (appraisalForm: AppraisalFormType) => {
        try {
            await appraisalFormService.submit(appraisalForm.id);
            setMessage("Appraisal submitted.");
            await loadPageData();
        } catch {
            setError("Unable to submit appraisal.");
        }
    };

    const handleDelete = async () => {
        if (!appraisalFormToDelete) {
            return;
        }

        try {
            await appraisalFormService.delete(appraisalFormToDelete.id);
            setMessage("Appraisal deleted.");
            setAppraisalFormToDelete(null);
            await loadPageData();
        } catch {
            setError("Unable to delete appraisal.");
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
                    title="Faculty Appraisal"
                    subtitle="Create, score, submit, and review faculty appraisal forms."
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                >
                    New Appraisal
                </Button>
            </Stack>

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <TextField
                    label="Search appraisals"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 420 }}
                />

                <AppraisalTable
                    appraisalForms={filteredAppraisalForms}
                    loading={loading}
                    onDelete={setAppraisalFormToDelete}
                    onEdit={handleEdit}
                    onEvidence={setEvidenceAppraisalForm}
                    onSubmit={handleSubmitAppraisal}
                />
            </Paper>

            <AppraisalFormDialog
                academicYears={academicYears}
                appraisalForm={selectedAppraisalForm}
                facultyProfiles={facultyProfiles}
                open={dialogOpen}
                saving={saving}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitForm}
            />

            <EvidenceDialog
                appraisalForm={evidenceAppraisalForm}
                open={Boolean(evidenceAppraisalForm)}
                onClose={() => setEvidenceAppraisalForm(null)}
            />

            <ConfirmDialog
                open={Boolean(appraisalFormToDelete)}
                title="Delete Appraisal"
                message={`Delete appraisal for ${appraisalFormToDelete?.facultyName ?? "this faculty"}?`}
                onCancel={() => setAppraisalFormToDelete(null)}
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

export default Appraisal;
