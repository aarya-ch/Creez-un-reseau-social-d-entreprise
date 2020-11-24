const db = require("../database");
const fs = require("fs");

module.exports = {
  // créer un commentaire
  createComment: (id_article, id_user, body, cb) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const hour = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    const sec = String(today.getSeconds()).padStart(2, "0");

    const post_date = `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;

    db.query(
      "INSERT INTO comments SET ?",
      {
        id_article: id_article, 
        id_user: id_user,
        body: body,
        post_date: post_date, 
      },
      (error, results) => {
        cb(error, results);
      }
    );
  },
  //récupérer tous les commentaires
  getAllComments: (cb) => {
    db.query("SELECT * FROM comments", (error, results) => {
      cb(error, results);
    });
  },

  //récupérer un commmentaire grâce à son id
  getCommentById: (id, cb) => {
    db.query(
      `SELECT * FROM comments WHERE id_comment = ?`,
      [id],
      (error, results) => {
        cb(error, results);
      }
    );
  },

  //supprimer un commentaire grâce à son id
  deleteComment: (id_comment, cb) => {
    db.query(
      `DELETE FROM comments WHERE id_comment = ?`,
      [id_comment],
      (error, results) => {
        cb(error, results);
      }
    );
  },
};
