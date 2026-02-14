# 📒 Phonebook CLI Application

A command-line phonebook application built with **TypeScript** and **Node.js** that supports full contact management — add, update, delete, search, and paginated viewing.

---

## 🛠 Tech Stack

| | |
|---|---|
| **Language** | TypeScript (Node.js runtime) |
| **Storage** | JSON file-based persistence |
| **Architecture** | Layered (Service + Storage + CLI) |

> No frameworks were used. The only runtime dependency on Node.js is the built-in `fs` module, required for reading and writing the JSON data file. Everything else — routing logic, validation, error handling — is implemented from scratch in pure TypeScript.

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/vedantkokane10/Bitamin_Backend_Test
cd Bitamin_Backend_Test
npm install
```

### Running the Application

```bash
npx ts-node Main.ts
```

You will be presented with an interactive menu:

```
--------------------------------------------
1. Add Contact
2. Fetch Contacts
3. Search Contact
4. Delete Contact
5. Update Contact
6. Exit
--------------------------------------------
Choose a option -
```

---

## Features

- **Add Contact** — Store a contact with country code, phone number, first name, and optionally last name and email.
- **Fetch Contacts** — Browse all contacts with paginated navigation (next/previous pages).
- **Search Contact** — Look up a contact by name, ID, or phone number.
- **Update Contact** — Modify a contact's phone number, email, first name, or last name individually.
- **Delete Contact** — Remove a contact by ID.

---

## Project Structure

```
├── Data/
│   └── data.json                  # Persistent contact storage
├── Models/
│   └── Contact.model.ts           # Contact interface/type definition
├── Services/
│   └── PhoneBook.service.ts       # Core business logic
├── Storage/
│   └── FileStorage.Storage.ts     # JSON file read/write operations
├── Utils/
│   ├── Errors.util.ts             # Custom error classes
│   ├── PaginatedResponse.util.ts  # Pagination response type
│   └── Sanitize.util.ts           # Input validation and sanitization
├── Main.ts                        # CLI entry point
├── package.json
└── package-lock.json
```

---

## Data Storage

Contacts are stored in a **local JSON file** at `Data/data.json`. The file is read into memory on startup and written back to disk after every mutating operation (add, update, delete).

Each contact has the following shape:

```json
{
  "id": 1,
  "phoneNo": "9876543210",
  "countryCode": "+91",
  "firstName": "john",
  "lastName": "doe",
  "email": "john@example.com",
  "createdAt": "2026-02-13T17:00:00.000Z",
  "updatedAt": "2026-02-13T18:00:00.000Z"
}
```

`lastName` and `email` are optional fields. `updatedAt` is only set when the contact is modified.

---

## Key Design Decisions

### Layered Architecture

The codebase is split into clear layers — `Main.ts` handles user I/O, `PhoneBookService` owns all business logic, `FileStorage` abstracts persistence, and `Sanitize` handles input validation. This keeps each layer independently testable and easy to extend.

### Input Sanitization

All user inputs are validated and normalised before being stored. Phone numbers are stripped of spaces and dashes, emails are lowercased and regex-validated, and names are trimmed and lowercased. Invalid inputs throw a `ValidationError` before any data is written.

### Custom Error Hierarchy

Three typed error classes (`ValidationError`, `NotFoundError`, `ConflictError`) allow the CLI layer to respond with specific, user-friendly messages rather than catching generic errors.

### Phone Number Uniqueness

Phone numbers are used as the uniqueness key. Adding a contact with a duplicate phone number throws a `ConflictError` immediately, preventing silent overwrites.

### Auto-incrementing IDs

IDs are auto-incremented integers. On startup, the service reads the current max ID from the loaded contacts so numbering continues correctly across sessions.

### Pagination

`fetchContacts` accepts a `page` and `offset` parameter and returns a `PaginatedResponse` with computed `next` and `previous` page numbers. By default, `page` starts at `1` and `offset` is set to `5` contacts per page. This keeps large contact lists navigable in the terminal.

---

## Assumptions

- Phone number uniqueness is enforced across the entire phonebook (two contacts cannot share the same number, regardless of country code).
- `lastName` and `email` are truly optional — the application accepts empty strings for these fields during contact creation.
- The `data.json` file is created and managed automatically; no manual setup is required.
- Names are stored in lowercase for consistency and case-insensitive searching.
- No authentication or multi-user support is in scope.