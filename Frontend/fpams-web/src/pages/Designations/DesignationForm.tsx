import {
    Box,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import type {
    CreateDesignationRequest,
    Designation,
} from "../../types/designation";

interface Props {
    designation?: Designation | null;
    formId: string;
    onSubmit: (data: CreateDesignationRequest) => void;
}

interface FormValues extends CreateDesignationRequest {
    isActive: boolean;
}

const defaultValues: FormValues = {
    designationCode: "",
    designationName: "",
    description: "",
    displayOrder: 0,
    isActive: true,
};

export default function DesignationForm({
    designation,
    formId,
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
            designation
                ? {
                    designationCode: designation.designationCode,
                    designationName: designation.designationName,
                    description: designation.description ?? "",
                    displayOrder: designation.displayOrder,
                    isActive: designation.isActive,
                }
                : defaultValues
        );
    }, [designation, reset]);

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
                name="designationCode"
                control={control}
                rules={{
                    required: "Designation code is required",
                    maxLength: {
                        value: 20,
                        message: "Code must be 20 characters or less",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Designation Code"
                        error={Boolean(errors.designationCode)}
                        helperText={errors.designationCode?.message}
                        fullWidth
                        autoFocus
                    />
                )}
            />

            <Controller
                name="designationName"
                control={control}
                rules={{
                    required: "Designation name is required",
                    maxLength: {
                        value: 100,
                        message: "Name must be 100 characters or less",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Designation Name"
                        error={Boolean(errors.designationName)}
                        helperText={errors.designationName?.message}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Description"
                        multiline
                        minRows={3}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="displayOrder"
                control={control}
                rules={{
                    min: {
                        value: 0,
                        message: "Display order cannot be negative",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Display Order"
                        type="number"
                        error={Boolean(errors.displayOrder)}
                        helperText={errors.displayOrder?.message}
                        fullWidth
                        onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                )}
            />

            {designation && (
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
