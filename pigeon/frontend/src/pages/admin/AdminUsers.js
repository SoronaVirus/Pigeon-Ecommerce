import { useState, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { AuthService } from '../../services/AuthService';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = AuthService.getCurrentUser();
    const isSuperAdmin = AuthService.isSuperAdmin();

    const isUserAdmin = (user) => {
        return user.roles?.includes('ADMIN') || user.roles?.includes('ROLE_ADMIN');
    };

    const isUserSuperAdmin = (user) => {
        return user.roles?.includes('SUPER_ADMIN') || user.roles?.includes('ROLE_SUPER_ADMIN');
    };

    const canModifyUser = (targetUser) => {
        if (isUserSuperAdmin(targetUser)) {
            return false;
        }
        if (isSuperAdmin) {
            return true;
        }
        if (isUserAdmin(targetUser)) {
            return false;
        }
        return true;
    };

    const canToggleAdmin = (targetUser) => {
        if (isUserSuperAdmin(targetUser)) {
            return false;
        }
        return isSuperAdmin;
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await UserService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (user) => {
        const isAdmin = isUserAdmin(user);
        const newRoles = isAdmin ? ['USER'] : ['USER', 'ADMIN'];

        try {
            await UserService.updateRoles(user.id, newRoles);
            loadUsers();
        } catch (error) {
            console.error('Failed to update roles', error);
        }
    };

    const handleToggleEnabled = async (user) => {
        try {
            await UserService.update(user.id, {
                username: user.username,
                email: user.email,
                enabled: !user.enabled
            });
            loadUsers();
        } catch (error) {
            console.error('Failed to update user', error);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await UserService.delete(userId);
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="admin-users-container">
            <h1>Manage Users</h1>

            <div className="users-table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.roles?.map(role => (
                                    <span key={role} className="role-badge">
                      {role}
                    </span>
                                ))}
                            </td>
                            <td>
                  <span className={user.enabled ? 'status-active' : 'status-inactive'}>
                    {user.enabled ? 'Active' : 'Inactive'}
                  </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                {canToggleAdmin(user) && (
                                    <button
                                        onClick={() => handleToggleAdmin(user)}
                                        className="btn-edit"
                                    >
                                        {isUserAdmin(user) ? 'Remove Admin' : 'Make Admin'}
                                    </button>
                                )}
                                {canModifyUser(user) && (
                                    <>
                                        <button
                                            onClick={() => handleToggleEnabled(user)}
                                            className="btn-secondary"
                                        >
                                            {user.enabled ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {!canModifyUser(user) && !canToggleAdmin(user) && (
                                    <span className="no-action">No actions available</span>
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