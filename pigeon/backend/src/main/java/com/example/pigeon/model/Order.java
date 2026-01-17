package com.example.pigeon.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Product produit;

    private Integer quantite;

    private LocalDateTime orderDate = LocalDateTime.now();

    private Double totalAmount;

    private OrderStatus status = OrderStatus.PENDING;
}