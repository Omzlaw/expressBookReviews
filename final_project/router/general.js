const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const bookPromise = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4))
    });

    bookPromise.then((data) => {
        res.send(data)
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookPromise = new Promise((resolve, reject) => {
        const book = books[isbn];

        if(book) {
            resolve(JSON.stringify(books[isbn], null, 4))
        }else {
            reject("Book not found")
        }
    });

    bookPromise.then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksKeys = Object.keys(books);

    const bookPromise = new Promise((resolve, reject) => {
        let book = null
        booksKeys.forEach(key => {
            const currentBook = books[key];
            if (currentBook.author === author) {
                book = currentBook
            }
        });
        if (book) {
            resolve(book)
        } else {
            res.send("No book found")
        }
    });

    bookPromise.then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e);
    });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const booksKeys = Object.keys(books);

    const bookPromise = new Promise((resolve, reject) => {
        let book = null
        booksKeys.forEach(key => {
            const currentBook = books[key];
            if (currentBook.title === title) {
                book = currentBook
            }
        });
        if (book) {
            resolve(book)
        } else {
            res.send("No book found")
        }
    });

    try {
        const data = await bookPromise;
        res.send(data)
    } catch (error) {
        res.send(e);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const review = request.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(JSON.stringify(book.reviews))
    } else {
        res.send("Book not found");
    }

});

module.exports.general = public_users;
