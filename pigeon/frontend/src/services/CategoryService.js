import api from '../config/api';

export const CategoryService = {
    async getAll() {
        const response = await api.get('/categories');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    async create(name) {
        const response = await api.post('/categories', { name });
        return response.data;
    },

    async update(id, name) {
        const response = await api.put(`/categories/${id}`, { name });
        return response.data;
    },

    async delete(id) {
        return await api.delete(`/categories/${id}`);
    }
};