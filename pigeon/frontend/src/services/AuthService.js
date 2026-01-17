import api from '../config/api';

export const AuthService = {
    async login(username, password) {
        const response = await api.post('/auth/login', { username, password });
        const { token, ...user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
    },

    async register(username, email, password) {
        return await api.post('/auth/register', { username, email, password });
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');
    },

    isSuperAdmin() {
        const user = this.getCurrentUser();
        return user?.roles?.includes('ROLE_SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');
    },

    hasAdminPrivileges() {
        return this.isAdmin() || this.isSuperAdmin();
    }
};