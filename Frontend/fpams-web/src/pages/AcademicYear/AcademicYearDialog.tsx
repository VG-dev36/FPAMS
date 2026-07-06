import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import type {
    AcademicYear,
    CreateAcademicYearRequest,
} from "../../types/academicYear";
import AcademicYearForm from "./AcademicYearForm";

interface Props {
    open: boolean;
    academicYear?: AcademicYear | null;
    saving: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAcademicYearRequest & { isActive: boolean }) => void;
}

const formId = "academic-year-form";

export default function AcademicYearDialog({
    open,
    academicYear,
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
                {academicYear ? "Edit Academic Year" : "Add Academic Year"}
            </DialogTitle>

            <DialogContent>
                <AcademicYearForm
                    formId={formId}
                    academicYear={academicYear}
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
