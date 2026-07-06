import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import type { AcademicYear } from "../../types/academicYear";
import type {
    AppraisalForm,
    CreateAppraisalFormRequest,
} from "../../types/appraisalForm";
import type { FacultyProfile } from "../../types/facultyProfile";

interface Props {
    academicYears: AcademicYear[];
    appraisalForm?: AppraisalForm | null;
    facultyProfiles: FacultyProfile[];
    open: boolean;
    saving: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAppraisalFormRequest) => void;
}

type FormValues = CreateAppraisalFormRequest;

const formId = "appraisal-form";

const defaultValues: FormValues = {
    facultyProfileId: "",
    academicYearId: "",
    teachingScore: 0,
    researchScore: 0,
    administrationScore: 0,
    contributionScore: 0,
    evidenceSummary: "",
    facultyRemarks: "",
};

const scoreRule = {
    min: {
        value: 0,
        message: "Score cannot be negative",
    },
    max: {
        value: 100,
        message: "Score cannot exceed 100",
    },
};

export default function AppraisalFormDialog({
    academicYears,
    appraisalForm,
    facultyProfiles,
    open,
    saving,
    onClose,
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
            appraisalForm
                ? {
                    facultyProfileId: appraisalForm.facultyProfileId,
                    academicYearId: appraisalForm.academicYearId,
                    teachingScore: appraisalForm.teachingScore,
                    researchScore: appraisalForm.researchScore,
                    administrationScore: appraisalForm.administrationScore,
                    contributionScore: appraisalForm.contributionScore,
                    evidenceSummary: appraisalForm.evidenceSummary,
                    facultyRemarks: appraisalForm.facultyRemarks,
                }
                : defaultValues
        );
    }, [appraisalForm, reset]);

    return (
        <Dialog
            open={open}
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {appraisalForm ? "Edit Appraisal" : "Create Appraisal"}
            </DialogTitle>

            <DialogContent>
                <Box
                    id={formId}
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        pt: 1,
                    }}
                >
                    <Controller
                        name="facultyProfileId"
                        control={control}
                        rules={{ required: "Faculty is required" }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                error={Boolean(errors.facultyProfileId)}
                            >
                                <InputLabel>Faculty</InputLabel>
                                <Select
                                    {...field}
                                    label="Faculty"
                                >
                                    {facultyProfiles.map((profile) => (
                                        <MenuItem
                                            key={profile.id}
                                            value={profile.id}
                                        >
                                            {`${profile.employeeCode} - ${profile.facultyName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="academicYearId"
                        control={control}
                        rules={{ required: "Academic year is required" }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                error={Boolean(errors.academicYearId)}
                            >
                                <InputLabel>Academic Year</InputLabel>
                                <Select
                                    {...field}
                                    label="Academic Year"
                                >
                                    {academicYears.map((year) => (
                                        <MenuItem
                                            key={year.id}
                                            value={year.id}
                                        >
                                            {year.yearName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    {([
                        ["teachingScore", "Teaching Score"],
                        ["researchScore", "Research Score"],
                        ["administrationScore", "Administration Score"],
                        ["contributionScore", "Contribution Score"],
                    ] as const).map(([name, label]) => (
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            rules={scoreRule}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={label}
                                    type="number"
                                    error={Boolean(errors[name])}
                                    helperText={errors[name]?.message}
                                    fullWidth
                                    onChange={(event) => field.onChange(Number(event.target.value))}
                                />
                            )}
                        />
                    ))}

                    <Controller
                        name="evidenceSummary"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Evidence Summary"
                                multiline
                                minRows={3}
                                fullWidth
                                sx={{ gridColumn: "1 / -1" }}
                            />
                        )}
                    />

                    <Controller
                        name="facultyRemarks"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Faculty Remarks"
                                multiline
                                minRows={3}
                                fullWidth
                                sx={{ gridColumn: "1 / -1" }}
                            />
                        )}
                    />

                    {appraisalForm && (
                        <TextField
                            label="Current Status"
                            value={appraisalForm.status}
                            fullWidth
                            disabled
                        />
                    )}
                </Box>
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
