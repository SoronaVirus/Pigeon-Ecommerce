import { useState, useEffect } from 'react';
import { ProductService } from '../../services/ProductService';
import { CategoryService } from '../../services/CategoryService';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        stockQuantity: '',
        lienImage: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                ProductService.getAll(0, 100),
                CategoryService.getAll()
            ]);
            setProducts(productsData.content || productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: { id: formData.categoryId },
            stockQuantity: parseInt(formData.stockQuantity),
            lienImage: formData.lienImage
        };

        try {
            if (editingProduct) {
                await ProductService.update(editingProduct.id, productData);
            } else {
                await ProductService.create(productData);
            }
            resetForm();
            loadData();
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.category?.id || '',
            stockQuantity: product.stockQuantity,
            lienImage: product.lienImage || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await ProductService.delete(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            categoryId: '',
            stockQuantity: '',
            lienImage: ''
        });
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="admin-products-container">
            <h1>Manage Products</h1>

            <div className="product-form-card">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            name="lienImage"
                            value={formData.lienImage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingProduct ? 'Update' : 'Create'}
                        </button>
                        {editingProduct && (
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="products-table-container">
                <h2>Products List</h2>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category?.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stockQuantity}</td>
                            <td>
                                <button onClick={() => handleEdit(product)} className="btn-edit">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="btn-delete">
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