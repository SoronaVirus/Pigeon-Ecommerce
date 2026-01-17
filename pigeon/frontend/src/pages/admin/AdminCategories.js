import { useState, useEffect } from 'react';
import { CategoryService } from '../../services/CategoryService';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            await CategoryService.create(newCategoryName.trim());
            setNewCategoryName('');
            setError('');
            loadCategories();
        } catch (error) {
            console.error('Failed to create category', error);
            setError('Failed to create category');
        }
    };

    const handleStartEdit = (category) => {
        setEditingCategory(category.id);
        setEditName(category.name);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditName('');
    };

    const handleUpdate = async (categoryId) => {
        if (!editName.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            await CategoryService.update(categoryId, editName.trim());
            setEditingCategory(null);
            setEditName('');
            setError('');
            loadCategories();
        } catch (error) {
            console.error('Failed to update category', error);
            setError('Failed to update category');
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await CategoryService.delete(categoryId);
            loadCategories();
        } catch (error) {
            console.error('Failed to delete category', error);
            setError('Failed to delete category');
        }
    };

    if (loading) {
        return <div className="loading">Loading categories...</div>;
    }

    return (
        <div className="admin-categories-container">
            <h1>Manage Categories</h1>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleCreate} className="category-form">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="form-input"
                />
                <button type="submit" className="btn-primary">
                    Add Category
                </button>
            </form>

            <div className="categories-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>
                                    {editingCategory === category.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="form-input"
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td>
                                    {editingCategory === category.id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(category.id)}
                                                className="btn-primary"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleStartEdit(category)}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
