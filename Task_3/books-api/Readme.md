# Books REST API

A simple REST API to manage a list of books built with Node.js and Express.
Supports full CRUD operations with in-memory data storage.

---

##  Project Structure

books-api/
├── server.js       → Main server and all API routes
├── package.json    → Project dependencies
├── .gitignore      → Files ignored by Git
└── README.md       → Project documentation

---

## Built With

- Node.js
- Express.js
- Postman (API Testing)
- VS Code

---

## How to Run

1. Clone the repository
2. Install dependencies:
   npm install

3. Start the server:
   node server.js

4. Server runs at → http://localhost:3000

---

## API Endpoints

| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | /books         | Get all books      |
| GET    | /books/:id     | Get one book by ID |
| POST   | /books         | Add a new book     |
| PUT    | /books/:id     | Update a book      |
| DELETE | /books/:id     | Delete a book      |

---

## Request Examples

### GET All Books
GET http://localhost:3000/books

### GET One Book
GET http://localhost:3000/books/1

### POST — Add New Book
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "Atomic Habits",
  "author": "James Clear"
}

### PUT — Update a Book
PUT http://localhost:3000/books/1
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Updated Author"
}

### DELETE — Remove a Book
DELETE http://localhost:3000/books/1

---

##  HTTP Status Codes

| Code | Meaning               |
|------|-----------------------|
| 200  | Success               |
| 201  | Book Created          |
| 400  | Missing title/author  |
| 404  | Book not found        |

---

##  Concepts Practiced

- REST API design
- Express routing
- CRUD operations
- HTTP methods and status codes
- Input validation
- Testing with Postman

---

## Note

Data is stored in memory (JavaScript array).
All data resets when the server restarts.
A database (MongoDB) will be added in future tasks.
