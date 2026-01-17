import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../services/ProductService';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadProducts = useCallback(async () => {
        try {
            const data = await ProductService.getAll(page, 12);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to load products', error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            loadProducts();
            return;
        }

        try {
            const data = await ProductService.search(searchTerm, page, 12);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Search failed', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="home-container">
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">Search</button>
                </form>
            </div>

            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        {product.lienImage && (
                            <img src={product.lienImage} alt={product.name} className="product-image" />
                        )}
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="product-price">${product.price}</p>
                            <p className="product-stock">Stock: {product.stockQuantity}</p>
                            <Link to={`/products/${product.id}`} className="btn-primary">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="btn-pagination"
                    >
                        Previous
                    </button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="btn-pagination"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}