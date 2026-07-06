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
import departmentService from "../../services/departmentService";
import designationService from "../../services/designationService";
import facultyProfileService from "../../services/facultyProfileService";
import userService from "../../services/userService";
import type { Department } from "../../types/department";
import type { Designation } from "../../types/designation";
import type {
    CreateFacultyProfileRequest,
    FacultyProfile,
} from "../../types/facultyProfile";
import type { User } from "../../types/user";
import FacultyProfileDialog from "./FacultyProfileDialog";
import FacultyProfileTable from "./FacultyProfileTable";

const Faculty = () => {
    const [facultyProfiles, setFacultyProfiles] = useState<FacultyProfile[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedFacultyProfile, setSelectedFacultyProfile] = useState<FacultyProfile | null>(null);
    const [facultyProfileToDelete, setFacultyProfileToDelete] = useState<FacultyProfile | null>(null);
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
                facultyProfileData,
                departmentData,
                designationData,
                userData,
            ] = await Promise.all([
                facultyProfileService.getAll(),
                departmentService.getAll(),
                designationService.getAll(),
                userService.getAll(),
            ]);

            setFacultyProfiles(facultyProfileData);
            setDepartments(departmentData.filter((department) => department.isActive));
            setDesignations(designationData.filter((designation) => designation.isActive));
            setUsers(userData.filter((user) => user.isActive));
        } catch {
            setError("Unable to load faculty profiles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadPageData();
    }, []);

    const filteredFacultyProfiles = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return facultyProfiles;
        }

        return facultyProfiles.filter((facultyProfile) =>
            facultyProfile.employeeCode.toLowerCase().includes(search)
            || facultyProfile.facultyName.toLowerCase().includes(search)
            || facultyProfile.departmentName.toLowerCase().includes(search)
            || facultyProfile.designationName.toLowerCase().includes(search)
        );
    }, [facultyProfiles, searchText]);

    const handleAdd = () => {
        setSelectedFacultyProfile(null);
        setDialogOpen(true);
    };

    const handleEdit = (facultyProfile: FacultyProfile) => {
        setSelectedFacultyProfile(facultyProfile);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedFacultyProfile(null);
    };

    const handleSubmit = async (data: CreateFacultyProfileRequest & { isActive: boolean }) => {
        try {
            setSaving(true);

            if (selectedFacultyProfile) {
                await facultyProfileService.update({
                    ...data,
                    id: selectedFacultyProfile.id,
                });
                setMessage("Faculty profile updated.");
            } else {
                await facultyProfileService.create({
                    userId: data.userId,
                    departmentId: data.departmentId,
                    designationId: data.designationId,
                    dateOfJoining: data.dateOfJoining,
                    highestQualification: data.highestQualification,
                    specialization: data.specialization,
                    teachingExperienceYears: data.teachingExperienceYears,
                    industryExperienceYears: data.industryExperienceYears,
                });
                setMessage("Faculty profile added.");
            }

            handleCloseDialog();
            await loadPageData();
        } catch {
            setError("Unable to save faculty profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!facultyProfileToDelete) {
            return;
        }

        try {
            await facultyProfileService.delete(facultyProfileToDelete.id);
            setMessage("Faculty profile deleted.");
            setFacultyProfileToDelete(null);
            await loadPageData();
        } catch {
            setError("Unable to delete faculty profile.");
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
                    title="Faculty Management"
                    subtitle="Maintain faculty profile records for appraisal workflows."
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                >
                    Add Faculty Profile
                </Button>
            </Stack>

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <TextField
                    label="Search faculty"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 420 }}
                />

                <FacultyProfileTable
                    facultyProfiles={filteredFacultyProfiles}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={setFacultyProfileToDelete}
                />
            </Paper>

            <FacultyProfileDialog
                departments={departments}
                designations={designations}
                facultyProfile={selectedFacultyProfile}
                open={dialogOpen}
                saving={saving}
                users={users}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={Boolean(facultyProfileToDelete)}
                title="Delete Faculty Profile"
                message={`Delete ${facultyProfileToDelete?.facultyName ?? "this faculty profile"}?`}
                onCancel={() => setFacultyProfileToDelete(null)}
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

export default Faculty;
