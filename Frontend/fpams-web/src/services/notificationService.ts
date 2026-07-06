import api from "../api/axios";
import type { Notification } from "../types/notification";

const endpoint = "/Notification";

const notificationService = {
    async getAll(): Promise<Notification[]> {
        const response = await api.get<Notification[]>(endpoint);

        return response.data;
    },

    async markRead(id: string): Promise<Notification> {
        const response = await api.post<Notification>(`${endpoint}/${id}/read`);

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default notificationService;
