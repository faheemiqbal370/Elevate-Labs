// 
//  STEP 1: IMPORT EXPRESS
//  Express is a framework that makes building APIs easy
// 
const express = require('express');
const app     = express();
const PORT    = 3000;


// 
//  STEP 2: MIDDLEWARE
//  express.json() lets us READ data sent in request body
//  Without this, req.body will be undefined
// 
app.use(express.json());


// 
//  STEP 3: IN-MEMORY DATA STORE
//  We use an array instead of a database (for now)
//  Each book has: id, title, author
// 
let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Andrew Hunt'    },
  { id: 2, title: 'Clean Code',               author: 'Robert Martin'  },
  { id: 3, title: 'You Don\'t Know JS',        author: 'Kyle Simpson'   },
];

// This helps us generate unique IDs for new books
// We always increment it, never reuse old IDs
let nextId = 4;


// 
//  ROUTE 1: GET /books
//  Returns ALL books in the array
//  HTTP Method : GET
//  URL         : http://localhost:3000/books
// 
app.get('/books', (req, res) => {

  res.status(200).json({
    success : true,
    count   : books.length,
    data    : books,
  });

});


// 
//  ROUTE 2: GET /books/:id
//  Returns ONE book by its ID
//  HTTP Method : GET
//  URL         : http://localhost:3000/books/1
// 
app.get('/books/:id', (req, res) => {

  // :id is a URL parameter → comes in as a STRING
  // We convert it to a Number with parseInt()
  const id   = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  // If book not found → send 404 error
  if (!book) {
    return res.status(404).json({
      success : false,
      message : `Book with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success : true,
    data    : book,
  });

});


// 
//  ROUTE 3: POST /books
//  Adds a NEW book to the array
//  HTTP Method : POST
//  URL         : http://localhost:3000/books
//  Body (JSON) : { "title": "...", "author": "..." }
// 
app.post('/books', (req, res) => {

  // Read data sent by the client in the request body
  const { title, author } = req.body;

  // --- VALIDATION: Both fields are required ---
  if (!title || !author) {
    return res.status(400).json({
      success : false,
      message : 'Please provide both title and author',
    });
  }

  // --- CREATE new book object ---
  const newBook = {
    id     : nextId++,   // assign ID then increment counter
    title  : title.trim(),
    author : author.trim(),
  };

  // --- ADD to our array ---
  books.push(newBook);

  // 201 = "Created" (more specific than 200)
  res.status(201).json({
    success : true,
    message : 'Book added successfully',
    data    : newBook,
  });

});


// 
//  ROUTE 4: PUT /books/:id
//  Updates an EXISTING book by ID
//  HTTP Method : PUT
//  URL         : http://localhost:3000/books/1
//  Body (JSON) : { "title": "...", "author": "..." }
// 
app.put('/books/:id', (req, res) => {

  const id    = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  // If book not found → send 404
  if (index === -1) {
    return res.status(404).json({
      success : false,
      message : `Book with ID ${id} not found`,
    });
  }

  // Get fields from request body
  const { title, author } = req.body;

  // --- VALIDATION ---
  if (!title || !author) {
    return res.status(400).json({
      success : false,
      message : 'Please provide both title and author',
    });
  }

  // --- UPDATE the book ---
  // Keep same ID, update title and author
  books[index] = {
    id     : id,
    title  : title.trim(),
    author : author.trim(),
  };

  res.status(200).json({
    success : true,
    message : 'Book updated successfully',
    data    : books[index],
  });

});


// 
//  ROUTE 5: DELETE /books/:id
//  Removes a book from the array by ID
//  HTTP Method : DELETE
//  URL         : http://localhost:3000/books/1
// 
app.delete('/books/:id', (req, res) => {

  const id    = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  // If book not found → send 404
  if (index === -1) {
    return res.status(404).json({
      success : false,
      message : `Book with ID ${id} not found`,
    });
  }

  // --- REMOVE from array ---
  // splice(index, 1) removes 1 item at that index
  const deletedBook = books.splice(index, 1)[0];

  res.status(200).json({
    success : true,
    message : 'Book deleted successfully',
    data    : deletedBook,
  });

});


// 
//  HANDLE UNKNOWN ROUTES
//  If someone hits a URL we didn't define → 404
// 
app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route ${req.method} ${req.url} not found`,
  });
});


// 
//  START THE SERVER
//  Makes our API listen for incoming requests
// 
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📚 Books API ready!`);
});