package com.technohacks.contactapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Outgoing payload sent back to the client for a contact resource.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String address;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
