import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import Faculty from "../pages/Faculty/Faculty";
import Departments from "../pages/Departments/Departments";
import Designations from "../pages/Designations/Designations";
import AcademicYears from "../pages/AcademicYear/AcademicYears";
import Appraisal from "../pages/Appraisal/Appraisal";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<DashboardLayout />}>

                <Route path="/" element={<DashboardPage />} />

                <Route path="/faculty" element={<Faculty />} />

                <Route path="/departments" element={<Departments />} />

                <Route path="/designations" element={<Designations />} />

                <Route path="/academic-years" element={<AcademicYears />} />

                <Route path="/appraisal" element={<Appraisal />} />

                <Route path="/reports" element={<Reports />} />

                <Route path="/settings" element={<Settings />} />

                
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}