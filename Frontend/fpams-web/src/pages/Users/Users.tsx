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
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import departmentService from "../../services/departmentService";
import designationService from "../../services/designationService";
import roleService from "../../services/roleService";
import userService from "../../services/userService";
import type { Department } from "../../types/department";
import type { Designation } from "../../types/designation";
import type { Role } from "../../types/role";
import type {
    CreateUserRequest,
    User,
} from "../../types/user";
import UserDialog from "./UserDialog";

export default function Users() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [userData, departmentData, designationData, roleData] = await Promise.all([
                userService.getAll(),
                departmentService.getAll(),
                designationService.getAll(),
                roleService.getAll(),
            ]);

            setUsers(userData);
            setDepartments(departmentData);
            setDesignations(designationData);
            setRoles(roleData);
        } catch {
            setError("Unable to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const filteredUsers = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        if (!search) {
            return users;
        }

        return users.filter((user) =>
            user.employeeCode.toLowerCase().includes(search)
            || `${user.firstName} ${user.lastName}`.toLowerCase().includes(search)
            || user.email.toLowerCase().includes(search)
            || user.department.toLowerCase().includes(search)
            || user.designation.toLowerCase().includes(search)
            || user.role.toLowerCase().includes(search)
        );
    }, [searchText, users]);

    const handleAdd = () => {
        setSelectedUser(null);
        setDialogOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (data: CreateUserRequest & { isActive: boolean }) => {
        try {
            setSaving(true);

            if (selectedUser) {
                await userService.update({
                    id: selectedUser.id,
                    employeeCode: data.employeeCode,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    mobile: data.mobile,
                    departmentId: data.departmentId,
                    designationId: data.designationId,
                    roleId: data.roleId,
                    isActive: data.isActive,
                });
                setMessage("User updated.");
            } else {
                await userService.create(data);
                setMessage("User added.");
            }

            handleCloseDialog();
            await loadData();
        } catch {
            setError("Unable to save user.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) {
            return;
        }

        try {
            await userService.delete(userToDelete.id);
            setMessage("User deleted.");
            setUserToDelete(null);
            await loadData();
        } catch {
            setError("Unable to delete user.");
        }
    };

    const columns: GridColDef<User>[] = [
        {
            field: "employeeCode",
            headerName: "Code",
            flex: 0.7,
            minWidth: 110,
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 180,
            valueGetter: (_, row) => `${row.firstName} ${row.lastName}`.trim(),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.2,
            minWidth: 220,
        },
        {
            field: "department",
            headerName: "Department",
            flex: 1,
            minWidth: 180,
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 1,
            minWidth: 180,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 0.8,
            minWidth: 130,
        },
        {
            field: "isActive",
            headerName: "Status",
            flex: 0.6,
            minWidth: 110,
            renderCell: (params) => (
                <Chip
                    label={params.row.isActive ? "Active" : "Inactive"}
                    color={params.row.isActive ? "success" : "default"}
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                >
                    <Tooltip title="Edit user">
                        <IconButton
                            size="small"
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete user">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => setUserToDelete(params.row)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

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
                    title="Users"
                    subtitle="Manage faculty, reviewers, administrators, and their system roles."
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                >
                    Add User
                </Button>
            </Stack>

            <Paper
                variant="outlined"
                sx={{ p: 2 }}
            >
                <TextField
                    label="Search users"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 420 }}
                />

                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                />
            </Paper>

            <UserDialog
                departments={departments}
                designations={designations}
                open={dialogOpen}
                roles={roles}
                saving={saving}
                user={selectedUser}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={Boolean(userToDelete)}
                title="Delete User"
                message={`Delete ${userToDelete?.firstName ?? "this"} ${userToDelete?.lastName ?? "user"}?`}
                onCancel={() => setUserToDelete(null)}
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
}
