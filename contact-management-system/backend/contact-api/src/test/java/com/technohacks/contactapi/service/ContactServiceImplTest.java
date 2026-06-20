package com.technohacks.contactapi.service;

import com.technohacks.contactapi.dto.ContactRequest;
import com.technohacks.contactapi.dto.ContactResponse;
import com.technohacks.contactapi.exception.DuplicateContactException;
import com.technohacks.contactapi.exception.ResourceNotFoundException;
import com.technohacks.contactapi.model.Contact;
import com.technohacks.contactapi.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ContactServiceImpl using JUnit 5 + Mockito.
 * The repository is mocked so these tests run in isolation,
 * with no real database involved.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ContactServiceImpl unit tests")
class ContactServiceImplTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactServiceImpl contactService;

    private Contact sampleContact;
    private ContactRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleContact = Contact.builder()
                .id(1L)
                .name("Avishkar Sharma")
                .phoneNumber("9876543210")
                .email("avishkar@example.com")
                .address("Mumbai, India")
                .category("Work")
                .build();

        sampleRequest = new ContactRequest(
                "Avishkar Sharma",
                "9876543210",
                "avishkar@example.com",
                "Mumbai, India",
                "Work"
        );
    }

    @Test
    @DisplayName("createContact() saves and returns a contact when phone number is unique")
    void createContact_success() {
        when(contactRepository.existsByPhoneNumber(sampleRequest.getPhoneNumber())).thenReturn(false);
        when(contactRepository.save(any(Contact.class))).thenReturn(sampleContact);

        ContactResponse response = contactService.createContact(sampleRequest);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Avishkar Sharma");
        assertThat(response.getPhoneNumber()).isEqualTo("9876543210");
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    @DisplayName("createContact() throws DuplicateContactException when phone number already exists")
    void createContact_duplicatePhoneNumber_throws() {
        when(contactRepository.existsByPhoneNumber(sampleRequest.getPhoneNumber())).thenReturn(true);

        assertThatThrownBy(() -> contactService.createContact(sampleRequest))
                .isInstanceOf(DuplicateContactException.class)
                .hasMessageContaining(sampleRequest.getPhoneNumber());

        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    @DisplayName("getAllContacts() returns a list mapped to ContactResponse, sorted by name")
    void getAllContacts_returnsSortedList() {
        Contact second = Contact.builder()
                .id(2L).name("Bhavna Iyer").phoneNumber("9123456780").category("Personal").build();

        when(contactRepository.findAll()).thenReturn(List.of(second, sampleContact));

        List<ContactResponse> results = contactService.getAllContacts();

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getName()).isEqualTo("Avishkar Sharma");
        assertThat(results.get(1).getName()).isEqualTo("Bhavna Iyer");
    }

    @Test
    @DisplayName("getContactById() returns the contact when found")
    void getContactById_found() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(sampleContact));

        ContactResponse response = contactService.getContactById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("avishkar@example.com");
    }

    @Test
    @DisplayName("getContactById() throws ResourceNotFoundException when not found")
    void getContactById_notFound_throws() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.getContactById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("updateContact() updates fields and saves when contact exists")
    void updateContact_success() {
        ContactRequest updateRequest = new ContactRequest(
                "Avishkar S.", "9876543210", "new@example.com", "Pune, India", "Family"
        );

        when(contactRepository.findById(1L)).thenReturn(Optional.of(sampleContact));
        when(contactRepository.save(any(Contact.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContactResponse response = contactService.updateContact(1L, updateRequest);

        assertThat(response.getName()).isEqualTo("Avishkar S.");
        assertThat(response.getCategory()).isEqualTo("Family");
        verify(contactRepository).save(sampleContact);
    }

    @Test
    @DisplayName("updateContact() throws ResourceNotFoundException when contact does not exist")
    void updateContact_notFound_throws() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.updateContact(99L, sampleRequest))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    @DisplayName("deleteContact() removes the contact when it exists")
    void deleteContact_success() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(sampleContact));

        contactService.deleteContact(1L);

        verify(contactRepository, times(1)).delete(sampleContact);
    }

    @Test
    @DisplayName("deleteContact() throws ResourceNotFoundException when contact does not exist")
    void deleteContact_notFound_throws() {
        when(contactRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.deleteContact(42L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(contactRepository, never()).delete(any(Contact.class));
    }

    @Test
    @DisplayName("searchContacts() delegates to repository search query when a term is provided")
    void searchContacts_withTerm() {
        when(contactRepository.searchContacts("Avishkar")).thenReturn(List.of(sampleContact));

        List<ContactResponse> results = contactService.searchContacts("Avishkar");

        assertThat(results).hasSize(1);
        verify(contactRepository).searchContacts("Avishkar");
        verify(contactRepository, never()).findAll();
    }

    @Test
    @DisplayName("searchContacts() falls back to getAllContacts() when term is blank")
    void searchContacts_blankTerm_fallsBackToFindAll() {
        when(contactRepository.findAll()).thenReturn(List.of(sampleContact));

        List<ContactResponse> results = contactService.searchContacts("   ");

        assertThat(results).hasSize(1);
        verify(contactRepository, never()).searchContacts(anyString());
        verify(contactRepository).findAll();
    }
}
