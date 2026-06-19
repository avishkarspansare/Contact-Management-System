package com.technohacks.contactapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a single contact record.
 * Maps to the "contacts" table in PostgreSQL.
 */
@Entity
@Table(name = "contacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[+]?[0-9]{7,15}$",
            message = "Phone number must be 7-15 digits, optionally starting with +"
    )
    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Email(message = "Email should be a valid email address")
    @Column(length = 150)
    private String email;

    @Size(max = 150, message = "Address must not exceed 150 characters")
    @Column(length = 150)
    private String address;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    @Column(length = 50)
    @Builder.Default
    private String category = "General";

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
