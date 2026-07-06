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
import designationService from "../../services/designationService";
import type {
    CreateDesignationRequest,
    Designation,
} from "../../types/designation";
import DesignationDialog from "./DesignationDialog";
import DesignationTable from "./DesignationTable";

const Designations = () => {
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
    const [designationToDelete, setDesignationToDelete] = useState<Designation | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadDesignations = async () => {
        try {
            setLoading(true);
            const data = await designationService.getAll();
            setDesignations(data);
        } catch {
            setError("Unable to load designations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadDesignations();
    }, []);

    const filteredDesignations = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return designations;
        }

        return designations.filter((designation) =>
            designation.designationCode.toLowerCase().includes(search)
            || designation.designationName.toLowerCase().includes(search)
            || (designation.description ?? "").toLowerCase().includes(search)
        );
    }, [designations, searchText]);

    const handleAdd = () => {
        setSelectedDesignation(null);
        setDialogOpen(true);
    };

    const handleEdit = (designation: Designation) => {
        setSelectedDesignation(designation);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedDesignation(null);
    };

    const handleSubmit = async (data: CreateDesignationRequest) => {
        try {
            setSaving(true);

            if (selectedDesignation) {
                await designationService.update({
                    ...data,
                    id: selectedDesignation.id,
                    isActive: selectedDesignation.isActive,
                });
                setMessage("Designation updated.");
            } else {
                await designationService.create(data);
                setMessage("Designation added.");
            }

            handleCloseDialog();
            await loadDesignations();
        } catch {
            setError("Unable to save designation.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!designationToDelete) {
            return;
        }

        try {
            await designationService.delete(designationToDelete.id);
            setMessage("Designation deleted.");
            setDesignationToDelete(null);
            await loadDesignations();
        } catch {
            setError("Unable to delete designation.");
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
                    title="Designations"
                    subtitle="Manage faculty designation levels used in profiles and appraisal routing."
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                >
                    Add Designation
                </Button>
            </Stack>

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <TextField
                    label="Search designations"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 420 }}
                />

                <DesignationTable
                    designations={filteredDesignations}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={setDesignationToDelete}
                />
            </Paper>

            <DesignationDialog
                open={dialogOpen}
                designation={selectedDesignation}
                saving={saving}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={Boolean(designationToDelete)}
                title="Delete Designation"
                message={`Delete ${designationToDelete?.designationName ?? "this designation"}?`}
                onCancel={() => setDesignationToDelete(null)}
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

export default Designations;
