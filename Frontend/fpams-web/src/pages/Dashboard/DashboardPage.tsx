import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import academicYearService from "../../services/academicYearService";
import appraisalFormService from "../../services/appraisalFormService";
import departmentService from "../../services/departmentService";
import facultyProfileService from "../../services/facultyProfileService";
import type { AppraisalForm } from "../../types/appraisalForm";

export default function DashboardPage() {
  const [appraisals, setAppraisals] = useState<AppraisalForm[]>([]);
  const [facultyCount, setFacultyCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [currentYear, setCurrentYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          appraisalData,
          facultyData,
          departmentData,
          yearData,
        ] = await Promise.all([
          appraisalFormService.getAll(),
          facultyProfileService.getAll(),
          departmentService.getAll(),
          academicYearService.getAll(),
        ]);

        setAppraisals(appraisalData);
        setFacultyCount(facultyData.filter((faculty) => faculty.isActive).length);
        setDepartmentCount(departmentData.filter((department) => department.isActive).length);
        setCurrentYear(yearData.find((year) => year.isCurrent)?.yearName ?? "Not set");
      } catch {
        setError("Unable to load dashboard metrics.");
      }
    };

    void loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const draft = appraisals.filter((appraisal) => appraisal.status === "Draft").length;
    const submitted = appraisals.filter((appraisal) => appraisal.status === "Submitted").length;
    const hodReviewed = appraisals.filter((appraisal) => appraisal.status === "HodReviewed").length;
    const principalReviewed = appraisals.filter((appraisal) => appraisal.status === "PrincipalReviewed").length;
    const finalized = appraisals.filter((appraisal) => appraisal.status === "IqacReviewed").length;
    const averageScore = appraisals.length
      ? Math.round(appraisals.reduce((sum, appraisal) => sum + appraisal.totalScore, 0) / appraisals.length)
      : 0;

    return {
      draft,
      submitted,
      hodReviewed,
      principalReviewed,
      finalized,
      averageScore,
    };
  }, [appraisals]);

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Faculty Performance Appraisal Management System"
      />

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        {[
          ["Faculty Profiles", facultyCount],
          ["Departments", departmentCount],
          ["Appraisal Forms", appraisals.length],
          ["Average Score", metrics.averageScore],
        ].map(([label, value]) => (
          <Grid
            key={label}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <Paper
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {label}
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
              >
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={2}
      >
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, height: "100%" }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Academic Year
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {currentYear}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Workflow Queue
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ flexWrap: "wrap" }}
            >
              <Chip label={`Draft: ${metrics.draft}`} />
              <Chip color="primary" label={`HOD Queue: ${metrics.submitted}`} />
              <Chip color="primary" label={`Principal Queue: ${metrics.hodReviewed}`} />
              <Chip color="primary" label={`IQAC Queue: ${metrics.principalReviewed}`} />
              <Chip color="success" label={`Finalized: ${metrics.finalized}`} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

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
