require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const secrets = require("./config/secrets");
const jwt = require("jsonwebtoken");
const { getUsers, getUserByUsername, addUser } = require("./models");

const server = express();
server.use(express.json());
server.use("/api/users", protected);

server.post("/api/login", (req, res) => {
  getUserByUsername(req.body.username)
    .then(data => {
      if (data.length === 0 || !bcrypt.compareSync(req.body.password, data[0].password)) {
        return res.status(404).json(`Could not verify credentials.`);
      } else {
        const token = generateToken(data[0]); // new line
        res.status(200).json({
          message: `Welcome ${data[0].username}!, have a token...`,
          token, // attach the token as part of the response
        });
      }
    });
});

server.post("/api/register", (req, res) => {
  getUserByUsername(req.body.username)
    .then(data => {
      if (data.length > 0) {
        return res.status(400).json(`Username is already taken.`);
      } else {
        const credentials = req.body;
        const hash = bcrypt.hashSync(credentials.password, 14);
        credentials.password = hash;
        addUser(credentials)
          .then(data => {
            res.status(201).json(data);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          })
      }
    })
});

server.get("/api/users", (req, res) => {
  getUsers()
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json(`Could not find any users.`)
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

function protected(req, res, next) {
  const token = req.headers.authorization;
  !token && res.status(401).json(`Missing authorization token.`);
  jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
    err && res.status(500).json(`Could not verify JWT.`);
    res.token = decoded;
    next();
  })
}

function generateToken(user) {
  const payload = {
    subject: user.id
  }
  const options = {
    expiresIn: '1d' //check jwt module docs to see other options
  }
  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}


server.listen(5000, () => {
  console.log(`Server is up on 5000.`);
})