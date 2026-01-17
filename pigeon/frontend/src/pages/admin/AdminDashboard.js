import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserService } from '../../services/UserService';
import { OrderService } from '../../services/OrderService';
import { ProductService } from '../../services/ProductService';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [users, orders, products] = await Promise.all([
                UserService.getAll(),
                OrderService.getAllOrders(),
                ProductService.getAll(0, 1000)
            ]);

            setStats({
                totalUsers: users.length,
                totalOrders: orders.length,
                totalProducts: products.totalElements || products.content?.length || 0,
                pendingOrders: orders.filter(o => o.status === 'PENDING').length
            });
        } catch (error) {
            console.error('Failed to load stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-number">{stats.totalProducts}</p>
                </div>

                <div className="stat-card">
                    <h3>Pending Orders</h3>
                    <p className="stat-number">{stats.pendingOrders}</p>
                </div>
            </div>

            <div className="admin-links">
                <Link to="/admin/products" className="admin-link-card">
                    <h3>Manage Products</h3>
                    <p>Add, edit, or remove products</p>
                </Link>

                <Link to="/admin/users" className="admin-link-card">
                    <h3>Manage Users</h3>
                    <p>View and manage user accounts</p>
                </Link>

                <Link to="/admin/orders" className="admin-link-card">
                    <h3>Manage Orders</h3>
                    <p>View and update order status</p>
                </Link>

                <Link to="/admin/categories" className="admin-link-card">
                    <h3>Manage Categories</h3>
                    <p>Add, edit, or remove categories</p>
                </Link>
            </div>
        </div>
    );
}