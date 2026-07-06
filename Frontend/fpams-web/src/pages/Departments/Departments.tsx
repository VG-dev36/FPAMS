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
import type {
    CreateDepartmentRequest,
    Department,
} from "../../types/department";
import departmentService from "../../services/departmentService";
import DepartmentDialog from "./DepartmentDialog";
import DepartmentTable from "./DepartmentTable";

const Departments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const data = await departmentService.getAll();
            setDepartments(data);
        } catch {
            setError("Unable to load departments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadDepartments();
    }, []);

    const filteredDepartments = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return departments;
        }

        return departments.filter((department) =>
            department.departmentCode.toLowerCase().includes(search)
            || department.departmentName.toLowerCase().includes(search)
        );
    }, [departments, searchText]);

    const handleAdd = () => {
        setSelectedDepartment(null);
        setDialogOpen(true);
    };

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedDepartment(null);
    };

    const handleSubmit = async (data: CreateDepartmentRequest) => {
        try {
            setSaving(true);

            if (selectedDepartment) {
                await departmentService.update({
                    ...data,
                    id: selectedDepartment.id,
                });
                setMessage("Department updated.");
            } else {
                await departmentService.create(data);
                setMessage("Department added.");
            }

            handleCloseDialog();
            await loadDepartments();
        } catch {
            setError("Unable to save department.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!departmentToDelete) {
            return;
        }

        try {
            await departmentService.delete(departmentToDelete.id);
            setMessage("Department deleted.");
            setDepartmentToDelete(null);
            await loadDepartments();
        } catch {
            setError("Unable to delete department.");
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
                    title="Departments"
                    subtitle="Manage academic departments used across faculty profiles and appraisal workflows."
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                >
                    Add Department
                </Button>
            </Stack>

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <TextField
                    label="Search departments"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 420 }}
                />

                <DepartmentTable
                    departments={filteredDepartments}
                    onEdit={handleEdit}
                    onDelete={setDepartmentToDelete}
                    loading={loading}
                />
            </Paper>

            <DepartmentDialog
                open={dialogOpen}
                department={selectedDepartment}
                saving={saving}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={Boolean(departmentToDelete)}
                title="Delete Department"
                message={`Delete ${departmentToDelete?.departmentName ?? "this department"}?`}
                onCancel={() => setDepartmentToDelete(null)}
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

export default Departments;
