import api from "../api/axios";
import type { EvidenceAttachment } from "../types/evidenceAttachment";

const endpoint = "/EvidenceAttachment";

const evidenceAttachmentService = {
    async getByAppraisal(appraisalFormId: string): Promise<EvidenceAttachment[]> {
        const response = await api.get<EvidenceAttachment[]>(
            `${endpoint}/appraisal/${appraisalFormId}`
        );

        return response.data;
    },

    async upload(
        appraisalFormId: string,
        file: File,
        description: string
    ): Promise<EvidenceAttachment> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", description);

        const response = await api.post<EvidenceAttachment>(
            `${endpoint}/appraisal/${appraisalFormId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    getDownloadUrl(id: string) {
        return `${api.defaults.baseURL}${endpoint}/${id}/download`;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default evidenceAttachmentService;
