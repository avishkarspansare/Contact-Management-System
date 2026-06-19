# Contact Management System (Advanced Level)
**TechnoHacks Internship — Java Development Track**

A full-stack contact management application with a Spring Boot 3 REST API backed by PostgreSQL, and a React + Material UI frontend. Built to satisfy the Advanced Level task plus both optional features (search/filter).

---

## Stack

| Layer        | Technology                                              |
|--------------|----------------------------------------------------------|
| Backend      | Java 17, Spring Boot 3.3, Spring Data JPA, Bean Validation, Lombok |
| Database     | PostgreSQL                                                |
| Frontend     | React 19 (Vite), Material UI 7, Axios                     |
| Testing      | JUnit 5, Mockito, AssertJ, Spring `@WebMvcTest` + MockMvc, H2 (test-only) |
| API testing  | Postman collection                                         |

---

## Project structure

```
contact-management-system/
├── backend/
│   └── contact-api/                  Spring Boot project (Maven)
│       ├── src/main/java/com/technohacks/contactapi/
│       │   ├── controller/           REST endpoints
│       │   ├── service/              Business logic (interface + impl)
│       │   ├── repository/           Spring Data JPA repository
│       │   ├── model/                JPA entity (Contact)
│       │   ├── dto/                  Request/response/error DTOs
│       │   ├── exception/            Custom exceptions + global handler
│       │   └── config/               CORS configuration
│       ├── src/main/resources/
│       │   └── application.properties
│       └── src/test/java/...         Unit + slice tests
├── frontend/
│   └── contact-ui/                   React app (Vite)
│       └── src/
│           ├── api/                  Axios client
│           ├── components/           UI components
│           └── theme/                MUI theme + category color mapping
├── database/
│   └── schema.sql                    Manual schema + seed data (optional)
└── postman/
    └── Contact-Management-System.postman_collection.json
```

---

## 1. Database setup

You need a running PostgreSQL instance.

```sql
CREATE DATABASE contact_management_db;
```

Hibernate will auto-create the `contacts` table on first run (`spring.jpa.hibernate.ddl-auto=update`), so this step is optional — but `database/schema.sql` is provided if you'd rather create the schema yourself or want some seed rows to test against immediately.

```bash
psql -U postgres -d contact_management_db -f database/schema.sql
```

---

## 2. Backend setup

Edit `backend/contact-api/src/main/resources/application.properties` if your PostgreSQL username/password differ from the defaults (`postgres` / `postgres`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/contact_management_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Then, from `backend/contact-api`:

```bash
mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

### Run the tests

```bash
mvn test
```

Tests run against an in-memory H2 database (configured in `src/test/resources/application.properties`), so they don't require PostgreSQL to be running.

> **Note on verification:** this Maven project was hand-assembled in a sandboxed environment without internet access to Maven Central, so `mvn test` could not actually be executed here to confirm a green build. Every file was written and reviewed carefully against Spring Boot 3.3 / Jakarta EE conventions, and the equivalent React side (which *could* be built and linted in-sandbox) caught several real mistakes before being committed — so I'd treat this backend with the same expectation: run `mvn clean test` yourself as the first step, and treat any compiler error as something to fix immediately rather than a sign something is fundamentally wrong with the structure.

---

## 3. Frontend setup

From `frontend/contact-ui`:

```bash
npm install
npm run dev
```

Opens on **http://localhost:5173** (Vite's default) and expects the backend at `http://localhost:8080` (see `src/api/contactApi.js` if you need to change this).

This part *was* fully built and verified in-sandbox: `npm run build` produces a clean production bundle and `npx eslint src` reports zero errors.

---

## 4. API endpoints

Base path: `/api/contacts`

| Method | Path                          | Description                          |
|--------|-------------------------------|----------------------------------------|
| POST   | `/api/contacts`                | Create a contact                      |
| GET    | `/api/contacts`                | List all contacts (sorted by name)    |
| GET    | `/api/contacts/{id}`           | Get one contact                       |
| PUT    | `/api/contacts/{id}`           | Update a contact                      |
| DELETE | `/api/contacts/{id}`           | Delete a contact                      |
| GET    | `/api/contacts/search?term=`   | Search by name, phone, or email       |
| GET    | `/api/contacts/category/{cat}` | Filter by category                    |

### Request body (POST / PUT)

```json
{
  "name": "Aarav Kapoor",
  "phoneNumber": "9876512340",
  "email": "aarav.kapoor@example.com",
  "address": "Pune, Maharashtra",
  "category": "Work"
}
```

`name` and `phoneNumber` are required. `email`, `address`, `category` are optional (`category` defaults to `"General"`).

### Validation rules

- `name`: 2–100 characters, required
- `phoneNumber`: 7–15 digits, optional leading `+`, required, **must be unique**
- `email`: standard email format if provided
- `address`: max 150 characters
- `category`: max 50 characters

### Error responses

All errors share one shape:

```json
{
  "timestamp": "2026-06-18T10:15:30",
  "status": 404,
  "error": "Not Found",
  "message": "Contact not found with id: 42",
  "path": "/api/contacts/42",
  "details": null
}
```

| Status | When                                          |
|--------|------------------------------------------------|
| 400    | Validation failure (`details` lists each field) |
| 404    | Contact id doesn't exist                        |
| 409    | Phone number already belongs to another contact |
| 500    | Unexpected server error                          |

---

## 5. Postman collection

Import `postman/Contact-Management-System.postman_collection.json` into Postman.

It's organized into three folders:

- **Happy Path** — run top to bottom once; each request after "Create Contact" reuses the id it returns (stored in the `contactId` collection variable).
- **Validation & Error Cases** — exercises 400/404/409 responses.
- **Standalone Examples** — extra request shapes (minimal fields, international phone format) you can run independently.

Every request includes test assertions (status code + key response fields), so you can also run the whole collection via the Postman Runner / Newman for a quick pass/fail check.

---

## 6. Design notes

- **Why an interface + impl for the service layer?** `ContactService` is an interface so it can be mocked cleanly in controller slice tests, and so an alternate implementation (e.g. with caching) could be swapped in without touching the controller.
- **Why DTOs instead of exposing the entity directly?** Keeps the JPA entity (and any future persistence-only fields) out of the public API contract.
- **Why a global exception handler?** Every error — validation, not-found, duplicate, unexpected — returns the same `ApiError` shape, which makes the React client's error handling trivial (`err.response.data.message`) instead of needing per-endpoint logic.
- **Why does the React app filter client-side instead of always hitting `/search`?** For a personal contact list (tens to low hundreds of entries), filtering an already-fetched array is instant and avoids a network round-trip per keystroke. The `/search` and `/category/{cat}` endpoints still exist and are fully covered by the Postman collection, in case you want to wire the UI to them directly (e.g. for a much larger dataset where server-side filtering would matter more).

---

## 7. Optional features implemented

Both optional items from the task brief are included:

- ✅ **Search and filter** — `/search?term=` (name/phone/email) and `/category/{category}`, both exposed in the UI via the search bar and category chips.
- The task's optional list also mentions "add input validation" (from the Medium tier) — covered here via Bean Validation annotations on both the entity and the request DTO, enforced server-side and mirrored client-side for instant feedback.
