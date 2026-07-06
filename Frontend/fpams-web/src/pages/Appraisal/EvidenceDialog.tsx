import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import evidenceAttachmentService from "../../services/evidenceAttachmentService";
import type { AppraisalForm } from "../../types/appraisalForm";
import type { EvidenceAttachment } from "../../types/evidenceAttachment";

interface Props {
    appraisalForm: AppraisalForm | null;
    open: boolean;
    onClose: () => void;
}

const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export default function EvidenceDialog({
    appraisalForm,
    open,
    onClose,
}: Props) {
    const [attachments, setAttachments] = useState<EvidenceAttachment[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadAttachments = async () => {
        if (!appraisalForm) {
            return;
        }

        try {
            setLoading(true);
            const data = await evidenceAttachmentService.getByAppraisal(appraisalForm.id);
            setAttachments(data);
        } catch {
            setError("Unable to load evidence attachments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            void loadAttachments();
        }
    }, [open, appraisalForm?.id]);

    const uploadAttachment = async () => {
        if (!appraisalForm || !selectedFile) {
            setError("Choose a file to upload.");
            return;
        }

        try {
            setSaving(true);
            await evidenceAttachmentService.upload(
                appraisalForm.id,
                selectedFile,
                description
            );
            setMessage("Evidence uploaded.");
            setSelectedFile(null);
            setDescription("");
            await loadAttachments();
        } catch {
            setError("Unable to upload evidence.");
        } finally {
            setSaving(false);
        }
    };

    const deleteAttachment = async (attachment: EvidenceAttachment) => {
        try {
            await evidenceAttachmentService.delete(attachment.id);
            setMessage("Evidence deleted.");
            await loadAttachments();
        } catch {
            setError("Unable to delete evidence.");
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={saving ? undefined : onClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Evidence Attachments
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {appraisalForm?.facultyName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {appraisalForm?.academicYearName} | {appraisalForm?.departmentName}
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            sx={{
                                alignItems: { xs: "stretch", md: "center" },
                            }}
                        >
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFileIcon />}
                            >
                                Choose File
                                <input
                                    type="file"
                                    hidden
                                    onChange={(event) => {
                                        setSelectedFile(event.target.files?.[0] ?? null);
                                    }}
                                />
                            </Button>

                            <TextField
                                label="Description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                size="small"
                                fullWidth
                            />

                            <Button
                                variant="contained"
                                onClick={uploadAttachment}
                                disabled={saving || !selectedFile}
                            >
                                Upload
                            </Button>
                        </Stack>

                        {selectedFile && (
                            <Typography variant="body2" color="text.secondary">
                                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                            </Typography>
                        )}

                        <List dense>
                            {attachments.map((attachment) => (
                                <ListItem
                                    key={attachment.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => void deleteAttachment(attachment)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Link
                                                href={evidenceAttachmentService.getDownloadUrl(attachment.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {attachment.fileName}
                                            </Link>
                                        }
                                        secondary={`${attachment.description || "No description"} | ${formatFileSize(attachment.fileSize)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {!loading && attachments.length === 0 && (
                            <Typography color="text.secondary">
                                No evidence uploaded yet.
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onClose}
                        disabled={saving}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

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
        </>
    );
}
