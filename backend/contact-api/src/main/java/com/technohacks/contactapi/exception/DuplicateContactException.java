package com.technohacks.contactapi.exception;

/**
 * Thrown when attempting to create a contact whose phone number
 * already exists. Caught by GlobalExceptionHandler and translated to HTTP 409.
 */
public class DuplicateContactException extends RuntimeException {

    public DuplicateContactException(String message) {
        super(message);
    }
}
