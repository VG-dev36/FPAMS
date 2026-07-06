import api from "../api/axios";
import type {
    CreateUserRequest,
    UpdateUserRequest,
    User,
} from "../types/user";

const endpoint = "/User";

const userService = {
    async getAll(): Promise<User[]> {
        const response = await api.get<User[]>(endpoint);

        return response.data;
    },

    async create(data: CreateUserRequest): Promise<User> {
        const response = await api.post<User>(endpoint, data);

        return response.data;
    },

    async update(data: UpdateUserRequest): Promise<User> {
        const response = await api.put<User>(endpoint, data);

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${endpoint}/${id}`);
    },
};

export default userService;
