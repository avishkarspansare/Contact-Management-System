package com.technohacks.contactapi.repository;

import com.technohacks.contactapi.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for Contact persistence.
 * Method names below are derived queries -- Spring generates the SQL
 * automatically based on the method signature.
 */
public interface ContactRepository extends JpaRepository<Contact, Long> {

    Optional<Contact> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    List<Contact> findByCategoryIgnoreCase(String category);

    /**
     * Case-insensitive search across name, phone number, and email.
     * Used by the "search and filter" optional feature.
     */
    @Query("""
            SELECT c FROM Contact c
            WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :term, '%'))
               OR c.phoneNumber LIKE CONCAT('%', :term, '%')
               OR LOWER(c.email) LIKE LOWER(CONCAT('%', :term, '%'))
            ORDER BY c.name ASC
            """)
    List<Contact> searchContacts(@Param("term") String term);
}
