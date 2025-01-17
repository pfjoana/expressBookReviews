const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios')


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    if(!isValid(username)){
      users.push({"username": username, "password": password})
      return res.status(200).json({message: "User successfully registered."})
    } else {
      return res.status(404).json({message: "User already exists."})
    }
  } else {
    return res.status(404).json({message: "Unable to register user. Username or password is missing."})
  }

});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  if(books) {
    return res.status(200).send(JSON.stringify(books, null, 4))
  } else {
    return res.status(404).json({message: "No books were found."})
  }
});


// fetch all using async-await and axios:
const fetchBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/')
    console.log('Books fetched successfully:', response.data)

  } catch (error) {
    console.error('Error fetching books:', error.message)
  }
}

fetchBooks()





// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn

  if(books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4))
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
  }
 });

 // fetch by ISBN using Promises, which Axios is based on
 const getBookISBN = (isbn) => {
  
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log('Book details fetched successfully:', response.data)
    })
    .catch((error) => {
      console.error('Error fetching books by ISBN, details:', error.message)
    })
};

getBookISBN(isbn);



// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let filtered_books = []

  if(author){

    for (let isbn in books) {
      if (books[isbn].author === author) {
        filtered_books.push(books[isbn])
      }
    }

    if(filtered_books.length > 0) {
      return res.status(200).send(JSON.stringify(filtered_books, null, 4))
    } else {
    return res.status(404).json({message: `No books found by the author ${author}`});
    }

  } else {
    return res.status(404).json({ message: "Author is missing."})
  }
});


// fetch by author using async-await and axios
async function getBookAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`)
    console.log('Books by author:', response.data);
  } catch (error) {
      console.error('Error fetching books by Author, details:', error.message)
    }
}


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let filtered_books = []

  if(title){

    for (let isbn in books) {
      if (books[isbn].title === title) {
        filtered_books.push(books[isbn])
      }
    }

    if(filtered_books.length > 0) {
      return res.status(200).send(JSON.stringify(filtered_books, null, 4))
    } else {
    return res.status(404).json({message: `No books found with the title ${title}`});
    }

  } else {
    return res.status(404).json({ message: "Title is missing."})
  }
});



// fetch books by title using async-await and axios
async function getBookTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`)
    console.log('Books by title:', response.data);
  } catch (error) {
      console.error('Error fetching books by Title, details:', error.message)
    }
}

getBookTitle(title)


//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn

  if(books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4))
  } else {
    return res.status(404).json({message: `No reviews found for the book with ISBN ${isbn}`});
  }

});

module.exports.general = public_users;
