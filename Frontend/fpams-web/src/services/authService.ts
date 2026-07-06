import api from "../api/axios";
import type { AuthUser, LoginRequest, LoginResponse } from "../types/auth";

const tokenKey = "token";
const userKey = "fpams-user";

const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/Auth/login", data);

        if (response.data.success) {
            localStorage.setItem(tokenKey, response.data.token);
            localStorage.setItem(
                userKey,
                JSON.stringify({
                    userId: response.data.userId,
                    employeeCode: response.data.employeeCode,
                    fullName: response.data.fullName,
                    role: response.data.role,
                    email: response.data.email,
                } satisfies AuthUser)
            );
        }

        return response.data;
    },

    logout() {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
    },

    isAuthenticated() {
        return Boolean(localStorage.getItem(tokenKey));
    },

    getUser(): AuthUser | null {
        const user = localStorage.getItem(userKey);

        return user ? JSON.parse(user) as AuthUser : null;
    },
};

export default authService;
