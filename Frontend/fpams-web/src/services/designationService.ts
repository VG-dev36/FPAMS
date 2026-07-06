import api from "../api/axios";
import type {
    CreateDesignationRequest,
    Designation,
    UpdateDesignationRequest,
} from "../types/designation";

const endpoint = "/Designation";

const designationService = {
    async getAll(): Promise<Designation[]> {
        const response = await api.get<Designation[]>(endpoint);

        return response.data;
    },

    async create(data: CreateDesignationRequest): Promise<Designation> {
        const response = await api.post<Designation>(endpoint, data);

        return response.data;
    },

    async update(data: UpdateDesignationRequest): Promise<void> {
        await api.put(endpoint, data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default designationService;
