import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const Faculty = lazy(() => import("../pages/Faculty/Faculty"));
const Users = lazy(() => import("../pages/Users/Users"));
const Departments = lazy(() => import("../pages/Departments/Departments"));
const Designations = lazy(() => import("../pages/Designations/Designations"));
const AcademicYears = lazy(() => import("../pages/AcademicYear/AcademicYears"));
const Appraisal = lazy(() => import("../pages/Appraisal/Appraisal"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const HodWorkflow = lazy(() => import("../pages/Workflow/HodWorkflow"));
const PrincipalWorkflow = lazy(() => import("../pages/Workflow/PrincipalWorkflow"));
const IqacWorkflow = lazy(() => import("../pages/Workflow/IqacWorkflow"));
const Notifications = lazy(() => import("../pages/Notifications/Notifications"));

const routeFallback = (
    <Box
        sx={{
            minHeight: 240,
            display: "grid",
            placeItems: "center",
        }}
    >
        <CircularProgress />
    </Box>
);

export default function AppRoutes() {
    return (
        <Suspense fallback={routeFallback}>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>

                        <Route path="/" element={<DashboardPage />} />

                        <Route path="/faculty" element={<Faculty />} />

                        <Route path="/users" element={<Users />} />

                        <Route path="/departments" element={<Departments />} />

                        <Route path="/designations" element={<Designations />} />

                        <Route path="/academic-years" element={<AcademicYears />} />

                        <Route path="/appraisal" element={<Appraisal />} />

                        <Route path="/hod-review" element={<HodWorkflow />} />

                        <Route path="/principal-review" element={<PrincipalWorkflow />} />

                        <Route path="/iqac-review" element={<IqacWorkflow />} />

                        <Route path="/reports" element={<Reports />} />

                        <Route path="/notifications" element={<Notifications />} />

                        <Route path="/settings" element={<Settings />} />

                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
}
