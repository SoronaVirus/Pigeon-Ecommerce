package com.example.pigeon.service;

import com.example.pigeon.model.Role;
import com.example.pigeon.model.User;
import com.example.pigeon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(String id, User userDetails) {
        User currentUser = getCurrentUser();
        User targetUser = getUserById(id);

        validateUpdatePermission(currentUser, targetUser);

        targetUser.setUsername(userDetails.getUsername());
        targetUser.setEmail(userDetails.getEmail());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            targetUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(targetUser);
    }

    public User updateUserEnabled(String id, boolean enabled) {
        User currentUser = getCurrentUser();
        User targetUser = getUserById(id);

        validateUpdatePermission(currentUser, targetUser);

        targetUser.setEnabled(enabled);
        return userRepository.save(targetUser);
    }

    public User updateUserRoles(String id, Set<Role> roles) {
        User currentUser = getCurrentUser();
        User targetUser = getUserById(id);

        validateRoleUpdatePermission(currentUser, targetUser, roles);

        targetUser.setRoles(roles);
        return userRepository.save(targetUser);
    }

    public void deleteUser(String id) {
        User currentUser = getCurrentUser();
        User targetUser = getUserById(id);

        validateDeletePermission(currentUser, targetUser);

        userRepository.delete(targetUser);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean hasRole(User user, Role role) {
        return user.getRoles().contains(role);
    }

    private void validateUpdatePermission(User currentUser, User targetUser) {
        boolean isSuperAdmin = hasRole(currentUser, Role.SUPER_ADMIN);
        boolean isAdmin = hasRole(currentUser, Role.ADMIN);
        boolean targetIsSuperAdmin = hasRole(targetUser, Role.SUPER_ADMIN);
        boolean targetIsAdmin = hasRole(targetUser, Role.ADMIN);

        if (targetIsSuperAdmin && !currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Cannot modify SUPER_ADMIN accounts");
        }

        if (targetIsAdmin && !isSuperAdmin && !currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Only SUPER_ADMIN can modify ADMIN accounts");
        }
    }

    private void validateRoleUpdatePermission(User currentUser, User targetUser, Set<Role> newRoles) {
        boolean isSuperAdmin = hasRole(currentUser, Role.SUPER_ADMIN);
        boolean isAdmin = hasRole(currentUser, Role.ADMIN);
        boolean targetIsSuperAdmin = hasRole(targetUser, Role.SUPER_ADMIN);
        boolean targetIsAdmin = hasRole(targetUser, Role.ADMIN);

        if (newRoles.contains(Role.SUPER_ADMIN)) {
            throw new RuntimeException("Cannot assign SUPER_ADMIN role");
        }

        if (targetIsSuperAdmin) {
            throw new RuntimeException("Cannot modify SUPER_ADMIN roles");
        }

        if (newRoles.contains(Role.ADMIN) && !isSuperAdmin) {
            throw new RuntimeException("Only SUPER_ADMIN can assign ADMIN role");
        }

        if (targetIsAdmin && !isSuperAdmin) {
            throw new RuntimeException("Only SUPER_ADMIN can modify ADMIN roles");
        }
    }

    private void validateDeletePermission(User currentUser, User targetUser) {
        boolean isSuperAdmin = hasRole(currentUser, Role.SUPER_ADMIN);
        boolean isAdmin = hasRole(currentUser, Role.ADMIN);
        boolean targetIsSuperAdmin = hasRole(targetUser, Role.SUPER_ADMIN);
        boolean targetIsAdmin = hasRole(targetUser, Role.ADMIN);

        if (targetIsSuperAdmin) {
            throw new RuntimeException("Cannot delete SUPER_ADMIN accounts");
        }

        if (targetIsAdmin && !isSuperAdmin) {
            throw new RuntimeException("Only SUPER_ADMIN can delete ADMIN accounts");
        }

        if ((targetIsAdmin || targetIsSuperAdmin) && currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Cannot delete your own account");
        }
    }
}