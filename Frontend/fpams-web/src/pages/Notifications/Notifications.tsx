import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import notificationService from "../../services/notificationService";
import type { Notification } from "../../types/notification";

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getAll();
            setNotifications(data);
        } catch {
            setError("Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadNotifications();
    }, []);

    const filteredNotifications = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return notifications;
        }

        return notifications.filter((notification) =>
            notification.title.toLowerCase().includes(search)
            || notification.message.toLowerCase().includes(search)
            || notification.category.toLowerCase().includes(search)
        );
    }, [notifications, searchText]);

    const markRead = async (notification: Notification) => {
        try {
            await notificationService.markRead(notification.id);
            setMessage("Notification marked as read.");
            await loadNotifications();
        } catch {
            setError("Unable to update notification.");
        }
    };

    const deleteNotification = async (notification: Notification) => {
        try {
            await notificationService.delete(notification.id);
            setMessage("Notification deleted.");
            await loadNotifications();
        } catch {
            setError("Unable to delete notification.");
        }
    };

    const columns: GridColDef[] = [
        {
            field: "title",
            headerName: "Title",
            flex: 1.2,
        },
        {
            field: "message",
            headerName: "Message",
            flex: 2,
        },
        {
            field: "category",
            headerName: "Category",
            width: 130,
        },
        {
            field: "createdOn",
            headerName: "Date",
            flex: 1,
            valueFormatter: (value) => formatDate(value),
        },
        {
            field: "isRead",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Read" : "Unread"}
                    color={params.value ? "default" : "primary"}
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        disabled={params.row.isRead}
                        onClick={() => void markRead(params.row)}
                    >
                        <DoneIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => void deleteNotification(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box>
            <PageHeader
                title="Notifications"
                subtitle="Track workflow events and appraisal review updates."
            />

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <TextField
                        label="Search notifications"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 420 }}
                    />

                    <Button
                        variant="outlined"
                        onClick={() => void loadNotifications()}
                    >
                        Refresh
                    </Button>
                </Stack>

                <Box sx={{ height: 540, width: "100%" }}>
                    <DataGrid
                        rows={filteredNotifications}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                    page: 0,
                                },
                            },
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Paper>

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
}
