import {
    Box,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import type {
    AcademicYear,
    CreateAcademicYearRequest,
} from "../../types/academicYear";

interface Props {
    academicYear?: AcademicYear | null;
    formId: string;
    onSubmit: (data: CreateAcademicYearRequest & { isActive: boolean }) => void;
}

interface FormValues extends CreateAcademicYearRequest {
    isActive: boolean;
}

const toDateInputValue = (value: string) => value.substring(0, 10);

const defaultValues: FormValues = {
    yearName: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    isActive: true,
};

export default function AcademicYearForm({
    academicYear,
    formId,
    onSubmit,
}: Props) {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues,
    });

    const startDate = watch("startDate");

    useEffect(() => {
        reset(
            academicYear
                ? {
                    yearName: academicYear.yearName,
                    startDate: toDateInputValue(academicYear.startDate),
                    endDate: toDateInputValue(academicYear.endDate),
                    isCurrent: academicYear.isCurrent,
                    isActive: academicYear.isActive,
                }
                : defaultValues
        );
    }, [academicYear, reset]);

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
                name="yearName"
                control={control}
                rules={{
                    required: "Academic year name is required",
                    maxLength: {
                        value: 30,
                        message: "Name must be 30 characters or less",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Academic Year"
                        placeholder="2026-2027"
                        error={Boolean(errors.yearName)}
                        helperText={errors.yearName?.message}
                        fullWidth
                        autoFocus
                    />
                )}
            />

            <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Start Date"
                        type="date"
                        error={Boolean(errors.startDate)}
                        helperText={errors.startDate?.message}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="endDate"
                control={control}
                rules={{
                    required: "End date is required",
                    validate: (value) =>
                        !startDate || value >= startDate || "End date must be after start date",
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="End Date"
                        type="date"
                        error={Boolean(errors.endDate)}
                        helperText={errors.endDate?.message}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="isCurrent"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.value}
                                onChange={(_, checked) => field.onChange(checked)}
                            />
                        }
                        label="Current academic year"
                    />
                )}
            />

            {academicYear && (
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
