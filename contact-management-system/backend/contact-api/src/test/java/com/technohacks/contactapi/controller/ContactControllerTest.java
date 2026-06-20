package com.technohacks.contactapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.technohacks.contactapi.dto.ContactRequest;
import com.technohacks.contactapi.dto.ContactResponse;
import com.technohacks.contactapi.exception.ResourceNotFoundException;
import com.technohacks.contactapi.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Slice test for ContactController using @WebMvcTest.
 * Only the web layer is loaded; ContactService is mocked so
 * no database or service logic is exercised here -- just the
 * HTTP <-> JSON <-> controller wiring and validation.
 */
@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContactService contactService;

    @Test
    void createContact_validPayload_returns201() throws Exception {
        ContactRequest request = new ContactRequest(
                "Avishkar Sharma", "9876543210", "avishkar@example.com", "Mumbai", "Work");

        ContactResponse response = ContactResponse.builder()
                .id(1L)
                .name("Avishkar Sharma")
                .phoneNumber("9876543210")
                .email("avishkar@example.com")
                .address("Mumbai")
                .category("Work")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(contactService.createContact(any(ContactRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Avishkar Sharma"))
                .andExpect(jsonPath("$.phoneNumber").value("9876543210"));
    }

    @Test
    void createContact_blankName_returns400() throws Exception {
        ContactRequest invalidRequest = new ContactRequest("", "9876543210", null, null, null);

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void createContact_invalidPhoneNumber_returns400() throws Exception {
        ContactRequest invalidRequest = new ContactRequest("Test User", "abc123", null, null, null);

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllContacts_returnsList() throws Exception {
        ContactResponse c1 = ContactResponse.builder().id(1L).name("Alice").phoneNumber("1111111111").build();
        ContactResponse c2 = ContactResponse.builder().id(2L).name("Bob").phoneNumber("2222222222").build();

        when(contactService.getAllContacts()).thenReturn(List.of(c1, c2));

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Alice"));
    }

    @Test
    void getContactById_found_returns200() throws Exception {
        ContactResponse response = ContactResponse.builder().id(5L).name("Charlie").phoneNumber("3333333333").build();
        when(contactService.getContactById(5L)).thenReturn(response);

        mockMvc.perform(get("/api/contacts/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.name").value("Charlie"));
    }

    @Test
    void getContactById_notFound_returns404() throws Exception {
        when(contactService.getContactById(404L)).thenThrow(new ResourceNotFoundException(404L));

        mockMvc.perform(get("/api/contacts/404"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void deleteContact_existing_returns200() throws Exception {
        mockMvc.perform(delete("/api/contacts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void getContactById_nonNumericId_returns400NotServerError() throws Exception {
        // Regression test: GET /api/contacts/abc (or a trailing-slash request
        // like /api/contacts/ being misrouted to this {id} mapping with an
        // empty path variable) used to fall through to the generic Exception
        // handler and incorrectly return 500. It must return 400 instead.
        mockMvc.perform(get("/api/contacts/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void searchContacts_returnsMatchingList() throws Exception {
        ContactResponse response = ContactResponse.builder().id(1L).name("Avishkar Sharma").phoneNumber("9876543210").build();
        when(contactService.searchContacts(eq("avish"))).thenReturn(List.of(response));

        mockMvc.perform(get("/api/contacts/search").param("term", "avish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Avishkar Sharma"));
    }
}
