import { useState, useEffect } from 'react';
import { OrderService } from '../../services/OrderService';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await OrderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await OrderService.updateStatus(orderId, newStatus);
            loadOrders();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            await OrderService.deleteOrder(orderId);
            loadOrders();
        } catch (error) {
            console.error('Failed to delete order', error);
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            PENDING: 'status-pending',
            PROCESSING: 'status-processing',
            SHIPPED: 'status-shipped',
            DELIVERED: 'status-delivered'
        };
        return statusMap[status] || '';
    };

    if (loading) {
        return <div className="loading">Loading orders...</div>;
    }

    return (
        <div className="admin-orders-container">
            <h1>Manage Orders</h1>

            <div className="orders-table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id.substring(0, 8)}</td>
                            <td>{order.user?.username}</td>
                            <td>{order.produit?.name}</td>
                            <td>{order.quantite}</td>
                            <td>${order.totalAmount}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                            </td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}