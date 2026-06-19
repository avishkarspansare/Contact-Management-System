package com.technohacks.contactapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Incoming payload for creating or updating a contact.
 * Kept separate from the entity so the API contract doesn't leak persistence details.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[+]?[0-9]{7,15}$",
            message = "Phone number must be 7-15 digits, optionally starting with +"
    )
    private String phoneNumber;

    @Email(message = "Email should be a valid email address")
    private String email;

    @Size(max = 150, message = "Address must not exceed 150 characters")
    private String address;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;
}
