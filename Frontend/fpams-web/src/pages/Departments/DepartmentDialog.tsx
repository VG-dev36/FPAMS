import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import type {
    CreateDepartmentRequest,
    Department,
} from "../../types/department";
import DepartmentForm from "./DepartmentForm";

interface Props {
    open: boolean;
    department?: Department | null;
    saving: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDepartmentRequest) => void;
}

const formId = "department-form";

export default function DepartmentDialog({
    open,
    department,
    saving,
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
                {department ? "Edit Department" : "Add Department"}
            </DialogTitle>

            <DialogContent>
                <DepartmentForm
                    formId={formId}
                    department={department}
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
