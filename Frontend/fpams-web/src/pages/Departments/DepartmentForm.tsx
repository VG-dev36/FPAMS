import {
    Box,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import type {
    CreateDepartmentRequest,
    Department,
} from "../../types/department";

interface Props {
    department?: Department | null;
    formId: string;
    onSubmit: (data: CreateDepartmentRequest) => void;
}

const defaultValues: CreateDepartmentRequest = {
    departmentCode: "",
    departmentName: "",
    isActive: true,
};

export default function DepartmentForm({
    department,
    formId,
    onSubmit,
}: Props) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateDepartmentRequest>({
        defaultValues,
    });

    useEffect(() => {
        reset(
            department
                ? {
                    departmentCode: department.departmentCode,
                    departmentName: department.departmentName,
                    isActive: department.isActive,
                }
                : defaultValues
        );
    }, [department, reset]);

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
                name="departmentCode"
                control={control}
                rules={{
                    required: "Department code is required",
                    maxLength: {
                        value: 20,
                        message: "Code must be 20 characters or less",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Department Code"
                        error={Boolean(errors.departmentCode)}
                        helperText={errors.departmentCode?.message}
                        fullWidth
                        autoFocus
                    />
                )}
            />

            <Controller
                name="departmentName"
                control={control}
                rules={{
                    required: "Department name is required",
                    maxLength: {
                        value: 150,
                        message: "Name must be 150 characters or less",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Department Name"
                        error={Boolean(errors.departmentName)}
                        helperText={errors.departmentName?.message}
                        fullWidth
                    />
                )}
            />

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
        </Box>
    );
}
