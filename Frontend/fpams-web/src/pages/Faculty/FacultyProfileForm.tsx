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
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import type { Department } from "../../types/department";
import type { Designation } from "../../types/designation";
import type {
    CreateFacultyProfileRequest,
    FacultyProfile,
} from "../../types/facultyProfile";
import type { User } from "../../types/user";

interface Props {
    departments: Department[];
    designations: Designation[];
    facultyProfile?: FacultyProfile | null;
    formId: string;
    users: User[];
    onSubmit: (data: CreateFacultyProfileRequest & { isActive: boolean }) => void;
}

interface FormValues extends CreateFacultyProfileRequest {
    isActive: boolean;
}

const toDateInputValue = (value: string) => value.substring(0, 10);

const defaultValues: FormValues = {
    userId: "",
    departmentId: "",
    designationId: "",
    dateOfJoining: "",
    highestQualification: "",
    specialization: "",
    teachingExperienceYears: 0,
    industryExperienceYears: 0,
    isActive: true,
};

export default function FacultyProfileForm({
    departments,
    designations,
    facultyProfile,
    formId,
    users,
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
            facultyProfile
                ? {
                    userId: facultyProfile.userId,
                    departmentId: facultyProfile.departmentId,
                    designationId: facultyProfile.designationId,
                    dateOfJoining: toDateInputValue(facultyProfile.dateOfJoining),
                    highestQualification: facultyProfile.highestQualification,
                    specialization: facultyProfile.specialization,
                    teachingExperienceYears: facultyProfile.teachingExperienceYears,
                    industryExperienceYears: facultyProfile.industryExperienceYears,
                    isActive: facultyProfile.isActive,
                }
                : defaultValues
        );
    }, [facultyProfile, reset]);

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
                name="userId"
                control={control}
                rules={{ required: "Faculty user is required" }}
                render={({ field }) => (
                    <FormControl
                        fullWidth
                        error={Boolean(errors.userId)}
                    >
                        <InputLabel>Faculty User</InputLabel>
                        <Select
                            {...field}
                            label="Faculty User"
                        >
                            {users.map((user) => (
                                <MenuItem
                                    key={user.id}
                                    value={user.id}
                                >
                                    {`${user.employeeCode} - ${user.firstName} ${user.lastName}`.trim()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                name="dateOfJoining"
                control={control}
                rules={{ required: "Date of joining is required" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Date of Joining"
                        type="date"
                        error={Boolean(errors.dateOfJoining)}
                        helperText={errors.dateOfJoining?.message}
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
                name="highestQualification"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Highest Qualification"
                        fullWidth
                    />
                )}
            />

            <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Specialization"
                        fullWidth
                    />
                )}
            />

            <Controller
                name="teachingExperienceYears"
                control={control}
                rules={{
                    min: {
                        value: 0,
                        message: "Experience cannot be negative",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Teaching Experience"
                        type="number"
                        error={Boolean(errors.teachingExperienceYears)}
                        helperText={errors.teachingExperienceYears?.message}
                        fullWidth
                        onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                )}
            />

            <Controller
                name="industryExperienceYears"
                control={control}
                rules={{
                    min: {
                        value: 0,
                        message: "Experience cannot be negative",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Industry Experience"
                        type="number"
                        error={Boolean(errors.industryExperienceYears)}
                        helperText={errors.industryExperienceYears?.message}
                        fullWidth
                        onChange={(event) => field.onChange(Number(event.target.value))}
                    />
                )}
            />

            {facultyProfile && (
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
