import { useState, useEffect } from 'react';
import { OrderService } from '../services/OrderService';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await OrderService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await OrderService.deleteMyOrder(orderId);
            loadOrders();
        } catch (error) {
            console.error('Failed to cancel order', error);
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

    if (orders.length === 0) {
        return <div className="empty-state">No orders yet</div>;
    }

    return (
        <div className="orders-container">
            <h1>My Orders</h1>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                            <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
                        </div>

                        <div className="order-details">
                            <p><strong>Product:</strong> {order.produit?.name}</p>
                            <p><strong>Quantity:</strong> {order.quantite}</p>
                            <p><strong>Total:</strong> ${order.totalAmount}</p>
                            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>

                        {order.status === 'PENDING' && (
                            <div className="order-actions">
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="btn-delete"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}