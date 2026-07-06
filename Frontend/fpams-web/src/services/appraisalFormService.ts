import api from "../api/axios";
import type {
    AppraisalForm,
    CreateAppraisalFormRequest,
    UpdateAppraisalFormRequest,
} from "../types/appraisalForm";

const endpoint = "/AppraisalForm";

const appraisalFormService = {
    async getAll(): Promise<AppraisalForm[]> {
        const response = await api.get<AppraisalForm[]>(endpoint);

        return response.data;
    },

    async create(data: CreateAppraisalFormRequest): Promise<AppraisalForm> {
        const response = await api.post<AppraisalForm>(endpoint, data);

        return response.data;
    },

    async update(data: UpdateAppraisalFormRequest): Promise<AppraisalForm> {
        const response = await api.put<AppraisalForm>(endpoint, data);

        return response.data;
    },

    async submit(id: string): Promise<AppraisalForm> {
        const response = await api.post<AppraisalForm>(`${endpoint}/${id}/submit`);

        return response.data;
    },

    async hodReview(id: string, reviewerRemarks: string): Promise<AppraisalForm> {
        const response = await api.post<AppraisalForm>(
            `${endpoint}/${id}/hod-review`,
            { reviewerRemarks }
        );

        return response.data;
    },

    async principalReview(id: string, reviewerRemarks: string): Promise<AppraisalForm> {
        const response = await api.post<AppraisalForm>(
            `${endpoint}/${id}/principal-review`,
            { reviewerRemarks }
        );

        return response.data;
    },

    async iqacReview(id: string, reviewerRemarks: string): Promise<AppraisalForm> {
        const response = await api.post<AppraisalForm>(
            `${endpoint}/${id}/iqac-review`,
            { reviewerRemarks }
        );

        return response.data;
    },

    async returnForCorrection(id: string, reviewerRemarks: string): Promise<AppraisalForm> {
        const response = await api.post<AppraisalForm>(
            `${endpoint}/${id}/return`,
            { reviewerRemarks }
        );

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default appraisalFormService;
