import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

export default function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = AuthService.isAuthenticated();
    const isAdmin = AuthService.isAdmin();
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">Pigeon Store</Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/orders">My Orders</Link>
                            {isAdmin && <Link to="/admin">Admin</Link>}
                            <span className="nav-user">{user?.username}</span>
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}