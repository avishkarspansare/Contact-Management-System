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

---

## 8. Troubleshooting

**Seeing a 500 on `GET`/`POST` `/api/contacts/` (with a trailing slash)?**

Spring's path matching in Boot 3.x is strict: `@GetMapping`/`@PostMapping` with no path, on a controller mapped to `/api/contacts`, matches `/api/contacts` exactly — not `/api/contacts/`. A trailing-slash request used to fall through to the `/{id}` route with an empty `id`, which threw an unhandled `MethodArgumentTypeMismatchException` and surfaced as a 500.

This is fixed in two places:
- The React API client (`src/api/contactApi.js`) calls `apiClient.get("")` / `apiClient.post("")` instead of `"/"`, so it never sends the trailing slash in the first place.
- `GlobalExceptionHandler` now has a dedicated handler for `MethodArgumentTypeMismatchException` (returns 400, not 500) and for `NoHandlerFoundException` (returns a proper 404 JSON body instead of the servlet container's default error page), backed by `spring.mvc.throw-exception-if-no-handler-found=true` in `application.properties`.

If you're calling the API directly (curl, Postman, a different frontend), just avoid the trailing slash on the collection endpoints and you won't hit this.

**Seeing React warnings about `alignItems`, `justifyContent`, or `InputProps` not being recognized on a DOM element?**

This project uses MUI v9, which removed the old "system props" shorthand (`<Stack alignItems="center">`) and the legacy `InputProps`/`inputProps`/`InputLabelProps` API on `TextField`. Both are fixed here:
- `alignItems`/`justifyContent` now live inside the `sx` prop on `Stack` (e.g. `sx={{ alignItems: "center" }}`) instead of as bare component props.
- `TextField`'s `InputProps={{ startAdornment: ... }}` is now `slotProps={{ input: { startAdornment: ... } }}`.

If you add new MUI components and see this warning again, check the prop against the [MUI v9 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v9/) — most "prop not recognized" warnings on MUI components trace back to one of these two changes.
<<<<<<< HEAD

**Seeing Chrome's autofill dropdown ("Avishkar Sunil Pansare, you@gmail.com") pop up over the "Add contact" form, or your typed text landing in the wrong field (e.g. the header search box instead of the dialog)?**

This was a Chrome autofill heuristic issue, not a React bug. Chrome decides whether a field is a "name"/"email"/"address" field largely from the `name`/`id` attributes and label text, and it's known to ignore plain `autocomplete="off"` for those field types since ~2016 specifically because so many sites misused it. The original form had no `name` attributes at all, so Chrome guessed based on the "Full name" label and offered your saved browser profile — and in rare cases, applying an autofill suggestion can write into the wrong input if the browser's anchor tracking gets confused (e.g. by a modal overlapping other page content).

Fixed in `ContactFormDialog.jsx` by:
- Wrapping the fields in an explicit `<form autoComplete="off">` rather than a bare `Stack`.
- Giving every field a browser-meaningless `name`/`id` (`cms-field-a1`, `a2`, ...) instead of names like `email` or `address` that trigger Chrome's heuristics regardless of the `autocomplete` attribute.

If this resurfaces on a new field you add, give it the same treatment: an opaque `name`/`id` plus `autoComplete="off"`, not just `autoComplete="off"` alone.
=======
>>>>>>> 14cdaac30026e5a1de02c60386f83a415250116c
