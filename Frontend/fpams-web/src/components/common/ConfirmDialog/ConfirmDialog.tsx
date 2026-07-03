import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";

interface Props {
    open: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog = ({
    open,
    title,
    message,
    onCancel,
    onConfirm
}: Props) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                <Typography>
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;