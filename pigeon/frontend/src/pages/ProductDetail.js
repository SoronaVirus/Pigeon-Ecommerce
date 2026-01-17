import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { OrderService } from '../services/OrderService';
import { AuthService } from '../services/AuthService';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState(false);
    const [message, setMessage] = useState('');

    const loadProduct = useCallback(async () => {
        try {
            const data = await ProductService.getById(id);
            setProduct(data);
        } catch (error) {
            console.error('Failed to load product', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    const handleOrder = async () => {
        if (!AuthService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        setOrdering(true);
        setMessage('');

        try {
            await OrderService.create(id, quantity);
            setMessage('Order placed successfully!');
            setQuantity(1);
            loadProduct();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading product...</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail-card">
                {product.lienImage && (
                    <img src={product.lienImage} alt={product.name} className="product-detail-image" />
                )}

                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="product-category">{product.category?.name}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-detail-price">${product.price}</p>
                    <p className="product-detail-stock">
                        {product.stockQuantity > 0
                            ? `In stock: ${product.stockQuantity}`
                            : 'Out of stock'}
                    </p>

                    {product.stockQuantity > 0 && (
                        <div className="order-section">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stockQuantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            <button
                                onClick={handleOrder}
                                disabled={ordering}
                                className="btn-primary"
                            >
                                {ordering ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    )}

                    {message && (
                        <div className={message.includes('success') ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}