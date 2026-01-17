import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

export default function PrivateRoute({ children, adminOnly = false }) {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !AuthService.hasAdminPrivileges()) {
        return <Navigate to="/" replace />;
    }

    return children;
}