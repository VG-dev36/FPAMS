import type { AuthUser } from "../types/auth";

export interface NavigationItem {
    label: string;
    path: string;
    roles: string[];
}

export const navigationItems: NavigationItem[] = [
    { label: "Dashboard", path: "/", roles: ["SUPER_ADMIN", "PRINCIPAL", "HOD", "FACULTY", "APEC"] },
    { label: "Faculty", path: "/faculty", roles: ["SUPER_ADMIN", "PRINCIPAL", "HOD"] },
    { label: "Users", path: "/users", roles: ["SUPER_ADMIN"] },
    { label: "Departments", path: "/departments", roles: ["SUPER_ADMIN"] },
    { label: "Academic Years", path: "/academic-years", roles: ["SUPER_ADMIN"] },
    { label: "Designations", path: "/designations", roles: ["SUPER_ADMIN"] },
    { label: "Appraisal", path: "/appraisal", roles: ["SUPER_ADMIN", "FACULTY", "HOD"] },
    { label: "HOD Review", path: "/hod-review", roles: ["SUPER_ADMIN", "HOD"] },
    { label: "Principal Review", path: "/principal-review", roles: ["SUPER_ADMIN", "PRINCIPAL"] },
    { label: "IQAC/APEC Review", path: "/iqac-review", roles: ["SUPER_ADMIN", "APEC"] },
    { label: "Reports", path: "/reports", roles: ["SUPER_ADMIN", "PRINCIPAL", "HOD", "APEC"] },
    { label: "Notifications", path: "/notifications", roles: ["SUPER_ADMIN", "PRINCIPAL", "HOD", "FACULTY", "APEC"] },
    { label: "Settings", path: "/settings", roles: ["SUPER_ADMIN"] },
];

export const canAccessPath = (user: AuthUser | null, path: string) => {
    if (!user) {
        return false;
    }

    const item = navigationItems.find((navigationItem) => navigationItem.path === path);

    if (!item) {
        return true;
    }

    return item.roles.includes(user.role);
};

export const getNavigationForUser = (user: AuthUser | null) =>
    navigationItems.filter((item) => user && item.roles.includes(user.role));
