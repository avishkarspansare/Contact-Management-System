-- ============================================================
-- Contact Management System - PostgreSQL Schema
-- TechnoHacks Internship - Advanced Level Task
-- ============================================================
-- Run this manually if you prefer to create the schema yourself
-- instead of relying on Hibernate's ddl-auto=update.
--
-- Usage:
--   psql -U postgres -f schema.sql
-- ============================================================

-- 1. Create the database (run this line separately, outside a transaction,
--    since CREATE DATABASE cannot run inside one)
-- CREATE DATABASE contact_management_db;

-- Connect to it before running the rest:
-- \c contact_management_db

DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    phone_number    VARCHAR(20)  NOT NULL UNIQUE,
    email           VARCHAR(150),
    address         VARCHAR(150),
    category        VARCHAR(50)  DEFAULT 'General',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_name ON contacts (LOWER(name));
CREATE INDEX idx_contacts_category ON contacts (category);

-- ============================================================
-- Seed data (optional) - useful for quickly testing the API
-- and the React UI without manually adding contacts first.
-- ============================================================
INSERT INTO contacts (name, phone_number, email, address, category) VALUES
('Avishkar Sharma', '9876543210', 'avishkar@example.com', 'Mumbai, Maharashtra', 'Work'),
('Priya Nair',       '9123456780', 'priya.nair@example.com', 'Pune, Maharashtra', 'Family'),
('Rohan Mehta',      '9988776655', 'rohan.mehta@example.com', 'Bengaluru, Karnataka', 'Friends'),
('Sneha Kulkarni',   '9090909090', 'sneha.k@example.com', 'Nagpur, Maharashtra', 'Work'),
('Karan Desai',      '9001122334', NULL, 'Ahmedabad, Gujarat', 'General');
