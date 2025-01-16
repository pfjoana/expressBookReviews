const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let filteredusernames = users.filter((user) => {
    return user.username === username;
  })
  if (filteredusernames.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password)=>{
  let filteredusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  })

  if (filteredusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"})
  }

  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).json({ message: "User successfully logged in"})
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

// Post or update review if user already posts a review in that book by isbn
//pseudocode:
// - request query: username must be the one stored in session
//   --- req.session.authorization.username
// - if same user post a dif review in the same isbn it should update thet one already exists

  // access user in session
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const review = req.query.review

  //if book exists
  if (books[isbn]) {

    //if this exists - if the user in session posted a review in this isbn, update
    if (books[isbn].reviews[username]) {
      //update the review done from that user with the review from the request
      books[isbn].reviews[username] = review
      return res.status(200).json({ message: `Review updated successfully for ISBN ${isbn}` });
    } else {
      books[isbn].reviews[username] = review
      return res.status(200).json({ message: `Review added successfully for ISBN ${isbn}` });
    }

  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` })
  }
});




regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn

  if (books[isbn]) {

    if (books[isbn].reviews){
      if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]
        return res.status(200).json({ message: "Your review has been successfully deleted." })
      } else {
        return res.status(404).json({ message: "You don't have reviews for this book." });
      }

    } else {
      return res.status(404).json({ message: "There are no reviews for this book yet." });
    }

  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
