import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import type {
    CreateDesignationRequest,
    Designation,
} from "../../types/designation";
import DesignationForm from "./DesignationForm";

interface Props {
    open: boolean;
    designation?: Designation | null;
    saving: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDesignationRequest) => void;
}

const formId = "designation-form";

export default function DesignationDialog({
    open,
    designation,
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
                {designation ? "Edit Designation" : "Add Designation"}
            </DialogTitle>

            <DialogContent>
                <DesignationForm
                    formId={formId}
                    designation={designation}
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
