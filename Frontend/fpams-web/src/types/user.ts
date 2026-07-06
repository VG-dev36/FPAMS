export interface User {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    departmentId: string | null;
    department: string;
    designationId: string | null;
    designation: string;
    roleId: string;
    role: string;
    isActive: boolean;
}

export interface CreateUserRequest {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    departmentId: string;
    designationId: string;
    roleId: string;
    password: string;
}

export interface UpdateUserRequest {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    departmentId: string;
    designationId: string;
    roleId: string;
    isActive: boolean;
}
