import api from "../api/axios";
import type {
    Department,
    CreateDepartmentRequest,
    UpdateDepartmentRequest
} from "../types/department";

const endpoint = "/Department";

const departmentService = {

    async getAll(): Promise<Department[]> {

        const response = await api.get<Department[]>(endpoint);

        return response.data;
    },

    async getById(id: string): Promise<Department> {

        const response = await api.get<Department>(`${endpoint}/${id}`);

        return response.data;
    },

    async create(data: CreateDepartmentRequest): Promise<Department> {

        const response = await api.post<Department>(endpoint, data);

        return response.data;
    },

    async update(data: UpdateDepartmentRequest): Promise<void> {

        await api.put(endpoint, data);

    },

    async delete(id: string): Promise<void> {

        await api.delete(`${endpoint}/${id}`);

    }

};

export default departmentService;
