import api from "../api/axios";
import type { Role } from "../types/role";

const endpoint = "/Role";

const roleService = {
    async getAll(): Promise<Role[]> {
        const response = await api.get<Role[]>(endpoint);

        return response.data;
    },
};

export default roleService;
