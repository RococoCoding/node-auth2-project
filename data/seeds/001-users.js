
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "Jorge", password: 'pass123', department: "French"},
        {username: "Frank", password: 'pass123', department: "Poli-sci"},
        {username: "Albert", password: 'pass123', department: "Maths"}
      ]);
    });
};
