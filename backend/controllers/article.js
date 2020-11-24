const jwt = require("jsonwebtoken");
const db = require("../database");

const articleModel = require("../models/ArticleModel");

// récupérer tous les articles
exports.getAllArticles = (req, res, next) => {
  articleModel.getAllArticles((error, results) => {
    if (error) {
      return res.status(401).json({
        message: "Internal Error",
      });
    } else {
      return res.status(200).json({
        data: results,
      });
    }
  });
};

// créer un article

exports.createArticle = (req, res, next) => {
  const { title, text: description, userId } = req.body;
  let img_url = null;

  

  if (req.file) {
    img_url = `${req.file.filename}`;
  }

  articleModel.createArticle(
    title,
    description,
    userId,
    img_url,
    (error, results) => {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      } else {
        return res.status(200).json({
          message: "article ajouté",
        });
      }
    }
  );
};

//récupérer un article
exports.getOneArticle = (req, res, next) => {
  const articleId = req.params.id;

  articleModel.getArticleById(articleId, async (error, results) => {
    if (error) {
      return res.status(404).json({
        message: "aucun article",
      });
    }
    return res.status(200).json({
      data: results[0],
    });
  });
};

//récupérer les commentaires d'un article
exports.getArticleComments = (req, res, next) => {
  const articleId = req.params.id;

  articleModel.getArticleComments(articleId, (error, results) => {
    if (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
    return res.status(200).json({
      data: results,
    });
  });
};

//modifier un article
exports.modifyArticle = (req, res, next) => {
  const id_article = req.params.id;
  const { title, text: description, userId } = req.body;

  let img_url = null;

  if (req.file) {
    img_url = `${req.file.filename}`;
  }

  articleModel.getArticleById(id_article, (error, results) => {
    if (error) {
      return res.status(404).json({
        message: error.message,
      });
    } else {
      if (results[0].image_url) {
        articleModel.deleteImage(results[0].image_url, (error) => {
          if (error) {
            console.log(error.message);
          }
        });
      }

      articleModel.updateArticle(
        id_article,
        title,
        description,
        img_url,
        (error, results) => {
          if (error) {
            return res.status(404).json({
              message: error.message,
            });
          } else {
            return res.status(200).json({
              message: "article modifié",
            });
          }
        }
      );
    }
  });
};

//supprimer un article
exports.deleteArticle = (req, res, next) => {
  const id_article = req.params.id_article;

  articleModel.getArticleImageUrl(id_article, (error, results) => {
    if (error) {
      return res.status(404).json({
        message: error.message,
      });
    } else {
      if (results[0].image_url) {
        articleModel.deleteImage(results[0].image_url, (error) => {
          if (error) {
            return res.status(404).json({
              message: error.message,
            });
          } else {
            articleModel.deleteArticle(id_article, (error, results) => {
              if (error) {
                return res.status(404).json({
                  message: error.message,
                });
              }

              return res.status(200).json({
                data: results,
              });
            });
          }
        });
      } else {
        articleModel.deleteArticle(id_article, (error, results) => {
          if (error) {
            return res.status(404).json({
              message: error.message,
            });
          }
          return res.status(200).json({
            data: results,
          });
        });
      }
    }
  });
};
