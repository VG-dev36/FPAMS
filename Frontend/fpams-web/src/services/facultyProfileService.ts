import api from "../api/axios";
import type {
    CreateFacultyProfileRequest,
    FacultyProfile,
    UpdateFacultyProfileRequest,
} from "../types/facultyProfile";

const endpoint = "/FacultyProfile";

const facultyProfileService = {
    async getAll(): Promise<FacultyProfile[]> {
        const response = await api.get<FacultyProfile[]>(endpoint);

        return response.data;
    },

    async create(data: CreateFacultyProfileRequest): Promise<FacultyProfile> {
        const response = await api.post<FacultyProfile>(endpoint, data);

        return response.data;
    },

    async update(data: UpdateFacultyProfileRequest): Promise<FacultyProfile> {
        const response = await api.put<FacultyProfile>(endpoint, data);

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default facultyProfileService;
