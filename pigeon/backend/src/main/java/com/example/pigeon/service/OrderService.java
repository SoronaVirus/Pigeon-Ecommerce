package com.example.pigeon.service;

import com.example.pigeon.dto.OrderRequest;
import com.example.pigeon.model.Order;
import com.example.pigeon.model.OrderStatus;
import com.example.pigeon.model.Product;
import com.example.pigeon.model.User;
import com.example.pigeon.model.Role;
import com.example.pigeon.repository.OrderRepository;
import com.example.pigeon.repository.ProductRepository;
import com.example.pigeon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Order createOrder(OrderRequest orderRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(orderRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < orderRequest.getQuantite()) {
            throw new RuntimeException("Insufficient stock");
        }

        Order order = new Order();
        order.setUser(user);
        order.setProduit(product);
        order.setQuantite(orderRequest.getQuantite());
        order.setTotalAmount(product.getPrice() * orderRequest.getQuantite());
        order.setStatus(OrderStatus.PENDING);

        product.setStockQuantity(product.getStockQuantity() - orderRequest.getQuantite());
        productRepository.save(product);

        return orderRepository.save(order);
    }

    public List<Order> getMyOrders() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User currentUser = getCurrentUser();

        validateDeletePermission(currentUser, order);

        Product product = order.getProduit();
        if (product != null) {
            product.setStockQuantity(product.getStockQuantity() + order.getQuantite());
            productRepository.save(product);
        }

        orderRepository.delete(order);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean hasRole(User user, Role role) {
        if (user == null || user.getRoles() == null) {
            return false;
        }
        return user.getRoles().contains(role);
    }

    private void validateDeletePermission(User currentUser, Order order) {
        if (currentUser == null) {
            throw new RuntimeException("Current user is null");
        }

        if (order == null) {
            throw new RuntimeException("Order is null");
        }

        boolean isSuperAdmin = hasRole(currentUser, Role.SUPER_ADMIN);
        boolean isAdmin = hasRole(currentUser, Role.ADMIN);

        if (isSuperAdmin || isAdmin) {
            System.out.println("=== DELETE ORDER DEBUG ===");
            System.out.println("Current user: " + currentUser.getUsername());
            System.out.println("Current user roles: " + currentUser.getRoles());
            System.out.println("Order ID: " + order.getId());
            System.out.println("Order status: " + order.getStatus());
            System.out.println("isSuperAdmin: " + isSuperAdmin);
            System.out.println("isAdmin: " + isAdmin);
            System.out.println("AUTHORIZED: User is SUPER_ADMIN or ADMIN");
            System.out.println("========================");
            return;
        }

        if (order.getUser() == null) {
            throw new RuntimeException("Order has no owner and you are not an admin");
        }

        boolean isOwner = currentUser.getId() != null &&
                order.getUser().getId() != null &&
                currentUser.getId().equals(order.getUser().getId());

        System.out.println("=== DELETE ORDER DEBUG ===");
        System.out.println("Current user: " + currentUser.getUsername());
        System.out.println("Current user ID: " + currentUser.getId());
        System.out.println("Current user roles: " + currentUser.getRoles());
        System.out.println("Order ID: " + order.getId());
        System.out.println("Order owner: " + order.getUser().getUsername());
        System.out.println("Order owner ID: " + order.getUser().getId());
        System.out.println("Order status: " + order.getStatus());
        System.out.println("isSuperAdmin: " + isSuperAdmin);
        System.out.println("isAdmin: " + isAdmin);
        System.out.println("isOwner: " + isOwner);
        System.out.println("========================");

        if (isOwner && order.getStatus() == OrderStatus.PENDING) {
            System.out.println("AUTHORIZED: User is owner and order is PENDING");
            return;
        }

        if (isOwner && order.getStatus() != OrderStatus.PENDING) {
            System.out.println("DENIED: User is owner but order is not PENDING");
            throw new RuntimeException("Can only delete orders with PENDING status");
        }

        System.out.println("DENIED: User is not authorized");
        throw new RuntimeException("Not authorized to delete this order");
    }
}