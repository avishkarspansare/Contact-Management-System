package com.technohacks.contactapi.controller;

import com.technohacks.contactapi.dto.ContactRequest;
import com.technohacks.contactapi.dto.ContactResponse;
import com.technohacks.contactapi.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing the Contact Management API.
 *
 * Base path: /api/contacts
 *
 *   GET    /api/contacts            -> list all contacts
 *   GET    /api/contacts/{id}       -> get one contact
 *   POST   /api/contacts            -> create a contact
 *   PUT    /api/contacts/{id}       -> update a contact
 *   DELETE /api/contacts/{id}       -> delete a contact
 *   GET    /api/contacts/search?term=   -> search by name/phone/email
 *   GET    /api/contacts/category/{category} -> filter by category
 */
@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.createContact(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(contactService.updateContact(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(Map.of("message", "Contact with id " + id + " deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContactResponse>> searchContacts(@RequestParam String term) {
        return ResponseEntity.ok(contactService.searchContacts(term));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ContactResponse>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(contactService.getContactsByCategory(category));
    }
}
