
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Initial book records
let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Function to validate book data
function validateBook(data) {
    return (
        typeof data.title === "string" &&
        data.title.trim() !== "" &&
        typeof data.author === "string" &&
        data.author.trim() !== "" &&
        typeof data.genre === "string" &&
        data.genre.trim() !== "" &&
        Number.isInteger(data.publishedYear) &&
        data.publishedYear > 0 &&
        typeof data.available === "boolean"
    );
}

// 1. GET all books
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// 2. POST a new book
app.post("/api/books", (req, res) => {
    const { title, author, genre, publishedYear, available } = req.body;

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data. Please provide all required fields."
        });
    }

    const newBook = {
        id: Math.max(100, ...books.map(book => book.id)) + 1,
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        publishedYear,
        available
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 3. Filter books by author
// IMPORTANT: Keep this route before /:id
app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (!author) {
        return res.status(400).json({
            message: "Please provide an author query parameter"
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
    );

    res.status(200).json(filteredBooks);
});

// 4. GET book by ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 5. PUT / Update book
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    const updatedBook = {
        id: id,
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        genre: req.body.genre.trim(),
        publishedYear: req.body.publishedYear,
        available: req.body.available
    };

    books[index] = updatedBook;

    res.status(200).json({
        message: "Book updated successfully",
        book: updatedBook
    });
});

// 6. DELETE book
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
