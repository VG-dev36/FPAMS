import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Box,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
} from "@mui/material";

import type { Department } from "../../types/department";
import type { Designation } from "../../types/designation";
import type { Role } from "../../types/role";
import type {
    CreateUserRequest,
    User,
} from "../../types/user";

interface Props {
    departments: Department[];
    designations: Designation[];
    formId: string;
    roles: Role[];
    user?: User | null;
    onSubmit: (data: CreateUserRequest & { isActive: boolean }) => void;
}

interface FormValues extends CreateUserRequest {
    isActive: boolean;
}

const defaultValues: FormValues = {
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    departmentId: "",
    designationId: "",
    roleId: "",
    password: "",
    isActive: true,
};

export default function UserForm({
    departments,
    designations,
    formId,
    roles,
    user,
    onSubmit,
}: Props) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues,
    });

    useEffect(() => {
        reset(
            user
                ? {
                    employeeCode: user.employeeCode,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    mobile: user.mobile,
                    departmentId: user.departmentId ?? "",
                    designationId: user.designationId ?? "",
                    roleId: user.roleId,
                    password: "",
                    isActive: user.isActive,
                }
                : defaultValues
        );
    }, [reset, user]);

    return (
        <Box
            id={formId}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "grid",
                gap: 2,
                pt: 1,
            }}
        >
            <Controller
                name="employeeCode"
                control={control}
                rules={{ required: "Employee code is required" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Employee Code"
                        error={Boolean(errors.employeeCode)}
                        helperText={errors.employeeCode?.message}
                        autoFocus
                        fullWidth
                    />
                )}
            />

            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                }}
            >
                <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="First Name"
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Last Name"
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName?.message}
                            fullWidth
                        />
                    )}
                />
            </Box>

            <Controller
                name="email"
                control={control}
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Email"
                        type="email"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="mobile"
                control={control}
                rules={{ required: "Mobile number is required" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Mobile"
                        error={Boolean(errors.mobile)}
                        helperText={errors.mobile?.message}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="departmentId"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                    <FormControl
                        fullWidth
                        error={Boolean(errors.departmentId)}
                    >
                        <InputLabel>Department</InputLabel>
                        <Select
                            {...field}
                            label="Department"
                        >
                            {departments.map((department) => (
                                <MenuItem
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.departmentName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />

            <Controller
                name="designationId"
                control={control}
                rules={{ required: "Designation is required" }}
                render={({ field }) => (
                    <FormControl
                        fullWidth
                        error={Boolean(errors.designationId)}
                    >
                        <InputLabel>Designation</InputLabel>
                        <Select
                            {...field}
                            label="Designation"
                        >
                            {designations.map((designation) => (
                                <MenuItem
                                    key={designation.id}
                                    value={designation.id}
                                >
                                    {designation.designationName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />

            <Controller
                name="roleId"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                    <FormControl
                        fullWidth
                        error={Boolean(errors.roleId)}
                    >
                        <InputLabel>Role</InputLabel>
                        <Select
                            {...field}
                            label="Role"
                        >
                            {roles.map((role) => (
                                <MenuItem
                                    key={role.id}
                                    value={role.id}
                                >
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />

            {!user && (
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Password"
                            type="password"
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            fullWidth
                        />
                    )}
                />
            )}

            {user && (
                <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={field.value}
                                    onChange={(_, checked) => field.onChange(checked)}
                                />
                            }
                            label="Active"
                        />
                    )}
                />
            )}
        </Box>
    );
}
