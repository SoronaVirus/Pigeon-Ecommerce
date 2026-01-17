import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import './App.css';

export default function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products/:id" element={<ProductDetail />} />

                        <Route path="/orders" element={
                            <PrivateRoute>
                                <MyOrders />
                            </PrivateRoute>
                        } />

                        <Route path="/admin" element={
                            <PrivateRoute adminOnly>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />

                        <Route path="/admin/products" element={
                            <PrivateRoute adminOnly>
                                <AdminProducts />
                            </PrivateRoute>
                        } />

                        <Route path="/admin/users" element={
                            <PrivateRoute adminOnly>
                                <AdminUsers />
                            </PrivateRoute>
                        } />

                        <Route path="/admin/orders" element={
                            <PrivateRoute adminOnly>
                                <AdminOrders />
                            </PrivateRoute>
                        } />

                        <Route path="/admin/categories" element={
                            <PrivateRoute adminOnly>
                                <AdminCategories />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}