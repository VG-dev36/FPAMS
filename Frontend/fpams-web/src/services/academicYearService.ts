import api from "../api/axios";
import type {
    AcademicYear,
    CreateAcademicYearRequest,
    UpdateAcademicYearRequest,
} from "../types/academicYear";

const endpoint = "/AcademicYear";

const academicYearService = {
    async getAll(): Promise<AcademicYear[]> {
        const response = await api.get<AcademicYear[]>(endpoint);

        return response.data;
    },

    async create(data: CreateAcademicYearRequest): Promise<AcademicYear> {
        const response = await api.post<AcademicYear>(endpoint, data);

        return response.data;
    },

    async update(data: UpdateAcademicYearRequest): Promise<AcademicYear> {
        const response = await api.put<AcademicYear>(endpoint, data);

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default academicYearService;
