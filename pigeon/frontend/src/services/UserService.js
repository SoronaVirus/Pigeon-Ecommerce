import api from '../config/api';

export const UserService = {
    async getAll() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    async update(id, userData) {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    async updateRoles(id, roles) {
        const response = await api.put(`/admin/users/${id}/roles`, roles);
        return response.data;
    },

    async delete(id) {
        return await api.delete(`/admin/users/${id}`);
    }
};