import api from "../api/axios";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors: string[];
}

export interface ApiHealth {
    status: string;
    application: string;
    version: string;
    time: string;
}

export interface DatabaseHealth {
    status: string;
    pendingMigrations: string[];
    time: string;
}

const healthService = {
    async getApiHealth(): Promise<ApiResponse<ApiHealth>> {
        const response = await api.get<ApiResponse<ApiHealth>>("/Health");

        return response.data;
    },

    async getDatabaseHealth(): Promise<ApiResponse<DatabaseHealth>> {
        const response = await api.get<ApiResponse<DatabaseHealth>>("/Health/database");

        return response.data;
    },
};

export default healthService;
