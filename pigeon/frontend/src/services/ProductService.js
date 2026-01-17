import api from '../config/api';

export const ProductService = {
    async getAll(page = 0, size = 10) {
        const response = await api.get(`/products?page=${page}&size=${size}`);
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async search(keyword, page = 0, size = 10) {
        const response = await api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}`);
        return response.data;
    },

    async create(product) {
        const response = await api.post('/admin/products', product);
        return response.data;
    },

    async update(id, product) {
        const response = await api.put(`/admin/products/${id}`, product);
        return response.data;
    },

    async delete(id) {
        return await api.delete(`/admin/products/${id}`);
    }
};