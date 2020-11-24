const db = require("../database");
const commentModel = require("../models/commentModel");

// récupérer tous les commentaires
exports.getAllComments = (req, res, next) => {
  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  return res.status(200).json({
    data: results,
  });
};

// créer un commentaire
exports.createComment = (req, res, next) => {
  const { id_article, id_user, body } = req.body;

  commentModel.createComment(
    id_article,
    id_user,
    body,
    (error, results) => {
      if (error) {
        return res.status(500).json({
          messageIntern: error.message,
          messagePublic: "Un erreur s'est produite, réessayer plus tard",
        });
      }
      return res.status(200).json({
        message: "Commentaire ajouté",
      });
    }
  );
};

//supprimer un commentaire
exports.deleteComment = (req, res, next) => {
  const id_commente = req.params.id;

  commentModel.deleteComment(id_commente, (error, results) => {
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
