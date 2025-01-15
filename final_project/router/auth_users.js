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

  if(filteredusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("Login route hit");
  console.log("Request body:", req.params);

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    console.log("Missing username or password");
    return res.status(404).json({message: "Error logging in"})
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    }

    console.log("Login successful for username:", username);
    return res.status(200).json({ message: "User successfully logged in"})
  } else {
    console.log("Invalid login attempt for username:", username);
    return res.status(401).json({ message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
