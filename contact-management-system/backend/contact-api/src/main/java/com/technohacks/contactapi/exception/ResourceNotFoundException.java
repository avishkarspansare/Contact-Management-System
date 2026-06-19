package com.technohacks.contactapi.exception;

/**
 * Thrown when a requested contact does not exist.
 * Caught by GlobalExceptionHandler and translated to HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(Long id) {
        super("Contact not found with id: " + id);
    }
}
