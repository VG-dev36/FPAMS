export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    userId: string;
    employeeCode: string;
    fullName: string;
    role: string;
    email: string;
}

export interface AuthUser {
    userId: string;
    employeeCode: string;
    fullName: string;
    role: string;
    email: string;
}
