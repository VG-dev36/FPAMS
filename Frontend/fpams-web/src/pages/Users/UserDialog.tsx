import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import type { Department } from "../../types/department";
import type { Designation } from "../../types/designation";
import type { Role } from "../../types/role";
import type {
    CreateUserRequest,
    User,
} from "../../types/user";
import UserForm from "./UserForm";

interface Props {
    departments: Department[];
    designations: Designation[];
    open: boolean;
    roles: Role[];
    saving: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (data: CreateUserRequest & { isActive: boolean }) => void;
}

const formId = "user-form";

export default function UserDialog({
    departments,
    designations,
    open,
    roles,
    saving,
    user,
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
            <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>

            <DialogContent>
                <UserForm
                    departments={departments}
                    designations={designations}
                    formId={formId}
                    roles={roles}
                    user={user}
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
