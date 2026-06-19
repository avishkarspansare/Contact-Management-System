package com.technohacks.contactapi.service;

import com.technohacks.contactapi.dto.ContactRequest;
import com.technohacks.contactapi.dto.ContactResponse;

import java.util.List;

/**
 * Service contract for contact business logic.
 * Kept as an interface so it can be mocked easily in unit tests
 * and so an alternate implementation could be swapped in later.
 */
public interface ContactService {

    ContactResponse createContact(ContactRequest request);

    List<ContactResponse> getAllContacts();

    ContactResponse getContactById(Long id);

    ContactResponse updateContact(Long id, ContactRequest request);

    void deleteContact(Long id);

    List<ContactResponse> searchContacts(String term);

    List<ContactResponse> getContactsByCategory(String category);
}
