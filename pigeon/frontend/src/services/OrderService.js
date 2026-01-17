import api from '../config/api';

export const OrderService = {
    async create(productId, quantite) {
        const response = await api.post('/orders', { productId, quantite });
        return response.data;
    },

    async getMyOrders() {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    async getAllOrders() {
        const response = await api.get('/admin/orders');
        return response.data;
    },

    async updateStatus(orderId, status) {
        const response = await api.put(`/admin/orders/${orderId}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    async deleteMyOrder(orderId) {
        return await api.delete(`/orders/${orderId}`);
    },

    async deleteOrder(orderId) {
        return await api.delete(`/admin/orders/${orderId}`);
    }
};