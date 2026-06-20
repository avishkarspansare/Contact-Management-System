package com.technohacks.contactapi.service;

import com.technohacks.contactapi.dto.ContactRequest;
import com.technohacks.contactapi.dto.ContactResponse;
import com.technohacks.contactapi.exception.DuplicateContactException;
import com.technohacks.contactapi.exception.ResourceNotFoundException;
import com.technohacks.contactapi.model.Contact;
import com.technohacks.contactapi.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Concrete implementation of ContactService.
 * All write operations run inside a transaction so a failure midway
 * (e.g. a constraint violation) rolls back cleanly.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    @Transactional
    public ContactResponse createContact(ContactRequest request) {
        if (contactRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateContactException(
                    "A contact with phone number " + request.getPhoneNumber() + " already exists");
        }

        Contact contact = Contact.builder()
                .name(request.getName().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .email(request.getEmail())
                .address(request.getAddress())
                .category(StringUtils.hasText(request.getCategory()) ? request.getCategory() : "General")
                .build();

        Contact saved = contactRepository.save(contact);
        return toResponse(saved);
    }

    @Override
    public List<ContactResponse> getAllContacts() {
        return contactRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ContactResponse getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return toResponse(contact);
    }

    @Override
    @Transactional
    public ContactResponse updateContact(Long id, ContactRequest request) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        // If the phone number is changing, make sure the new one isn't already taken
        // by a *different* contact.
        if (!existing.getPhoneNumber().equals(request.getPhoneNumber())
                && contactRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateContactException(
                    "A contact with phone number " + request.getPhoneNumber() + " already exists");
        }

        existing.setName(request.getName().trim());
        existing.setPhoneNumber(request.getPhoneNumber().trim());
        existing.setEmail(request.getEmail());
        existing.setAddress(request.getAddress());
        existing.setCategory(StringUtils.hasText(request.getCategory()) ? request.getCategory() : "General");

        Contact updated = contactRepository.save(existing);
        return toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteContact(Long id) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        contactRepository.delete(existing);
    }

    @Override
    public List<ContactResponse> searchContacts(String term) {
        if (!StringUtils.hasText(term)) {
            return getAllContacts();
        }
        return contactRepository.searchContacts(term.trim())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<ContactResponse> getContactsByCategory(String category) {
        return contactRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Maps the persistence entity to the outward-facing DTO.
     * Centralized here so controllers never touch the entity directly.
     */
    private ContactResponse toResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .name(contact.getName())
                .phoneNumber(contact.getPhoneNumber())
                .email(contact.getEmail())
                .address(contact.getAddress())
                .category(contact.getCategory())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}
