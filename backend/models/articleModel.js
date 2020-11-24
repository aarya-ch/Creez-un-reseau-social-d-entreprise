const db = require("../database");
const fs = require("fs");

module.exports = {
  // créer un article   
  createArticle: (title, description, user_id, img_url, cb) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const hour = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    const sec = String(today.getSeconds()).padStart(2, "0");

    const date = `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;

    db.query(
      "INSERT INTO articles SET ?",
      {
        title: title,
        description: description,
        id_user: user_id,
        posted_date: date,
        image_url: img_url,
      },
      (error, results) => {
        cb(error, results);
      }
    );
  },
  //récupérer tous les articles
  getAllArticles: (cb) => {
    db.query("SELECT * FROM articles", (error, results) => {
      cb(error, results);
    });
  },
  //récupérer un article grâce à son id
  getArticleById: (id, cb) => {
    db.query(
      `SELECT * FROM articles WHERE id_article = ?`,
      [id],
      (error, results) => {
        cb(error, results);
      }
    );
  },
  //récupérer les commentaires d'un article
  getArticleComments: (id, cb) => {
    db.query(
      `SELECT * FROM comments WHERE id_article = ?`,
      [id],
      (error, results) => {
        cb(error, results);
      }
    );
  },

  //supprimer l'image
  deleteImage: (img_url, cb) => {
    fs.unlink("./public/images/" + img_url, (err) => {
      cb(err);
    });
  },

  //récupérer l'url de l'image
  getArticleImageUrl: (id_article, cb) => {
    db.query(
      `select image_url FROM articles WHERE id_article = ?`,
      [id_article],
      (error, results) => {
        cb(error, results);
      }
    );
  },

  //supprimer l'article
  deleteArticle: (id_article, cb) => {
    db.query(
      `DELETE FROM articles WHERE id_article = ?`,
      [id_article],
      (error, results) => {
        cb(error, results);
      }
    );
  },

  //modifier l'article
  updateArticle: (id_article, title, description, img_url, cb) => {
    db.query(
      `update  articles  set title=?, description=? , image_url=?  where id_article = ?`,
      [title, description, img_url, id_article],
      (error, results) => {
        cb(error, results);
      }
    );
  },
};
