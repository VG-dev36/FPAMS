import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import type { Department } from "../../types/department";
import type { Designation } from "../../types/designation";
import type {
    CreateFacultyProfileRequest,
    FacultyProfile,
} from "../../types/facultyProfile";
import type { User } from "../../types/user";
import FacultyProfileForm from "./FacultyProfileForm";

interface Props {
    departments: Department[];
    designations: Designation[];
    facultyProfile?: FacultyProfile | null;
    open: boolean;
    saving: boolean;
    users: User[];
    onClose: () => void;
    onSubmit: (data: CreateFacultyProfileRequest & { isActive: boolean }) => void;
}

const formId = "faculty-profile-form";

export default function FacultyProfileDialog({
    departments,
    designations,
    facultyProfile,
    open,
    saving,
    users,
    onClose,
    onSubmit,
}: Props) {
    return (
        <Dialog
            open={open}
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {facultyProfile ? "Edit Faculty Profile" : "Add Faculty Profile"}
            </DialogTitle>

            <DialogContent>
                <FacultyProfileForm
                    departments={departments}
                    designations={designations}
                    facultyProfile={facultyProfile}
                    formId={formId}
                    users={users}
                    onSubmit={onSubmit}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form={formId}
                    variant="contained"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
