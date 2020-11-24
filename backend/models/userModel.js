const db = require("../database");
module.exports = {
  // création d'utilisateur dans la base de données
  addUser: (email, password, username, type, cb) => {
    db.query(
      "INSERT INTO users SET ?",
      { username: username, email: email, password: password, type: type },
      (error, results) => {
        cb(error, results);
      }
    );
  },
  // récupérer un utilisateur dans la base de données grâce à son email
  getUserByEmail: (email, cb) => {
    db.query(
      "SELECT * from users WHERE email = ?",
      [email],
      (error, results) => {
        cb(error, results);
      }
    );
  },
  // récupérer un utilisateur dans la base de données grâce à son id
  getUserById: (id, cb) => {
    db.query(
      "SELECT * from users WHERE id_user = ?",
      [id],
      (error, results) => {
        cb(error, results);
      }
    );
  },
  // supprimer un utilisateur dans la base de données grâce à son id
  deleteUser: (id, cb) => {
    db.query(`DELETE FROM users WHERE id_user = ?`, [id], (error, results) => {
      cb(error, results);
    });
  },
};
