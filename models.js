const db = require("./data/dbconfig");

module.exports = {
  getUsers,
  getUserByUsername,
  addUser
}

function getUsers() {
  return db('users')
}

function getUserByUsername(username) {
  return db('users')
    .where({username})
}

function addUser(body) {
  return db('users')
    .insert(body)
    .then(data => {
      return Promise.resolve(data);
    })
} 