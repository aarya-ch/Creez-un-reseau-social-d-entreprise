const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const db = require("../database");

const userModel = require("../models/UserModel");

exports.me = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};
//Création d'un utilisateur
exports.signup = (req, res) => {
  const { username, email, password, type } = req.body;

  userModel.getUserByEmail(email, (error, results) => {
    if (error) {
      console.log(error);
    }
    //email déjà utilisé
    if (results.length > 0) {
      return res.status(401).json({
        message: "L'email est déja utilisée",
      });
    }
    // sinon on crée un nouvel utilisateur
    let hashedPassword = bcrypt.hashSync(password, 10);
    userModel.addUser(
      email,
      hashedPassword,
      username,
      type,
      (error, results) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        } else {
          return res.status(201).json({
            message: "Utilisateur crée",
          });
        }
      }
    );
  });
};

//Connexion d'un utilisateur
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe sont requis",
      });
    }
    // recupère l'utilisateur grâce à son email
    userModel.getUserByEmail(email, (error, results) => {
      if (results.length === 0) {
        return res.status(401).json({
          message: "Email ou mot de passe incorrect",
        });
      } else if (!bcrypt.compareSync(password, results[0].password)) {
        return res.status(401).json({
          message: "Email ou mot de passe incorrect",
        });
      } else {
        const user = results[0];
        const token = jwt.sign(
          { id_user: user.id_user },
          'RANDOM_TOKEN_SECRET',
          {
            expiresIn: '2h',
          }
        );
        return res.status(200).json({
          message: "Utilisateur connecté",
          token: token,
          user: user,
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// récupération des utilisateurs grâce à leur ids
exports.getUsersByIds = (req, res) => {
  const ids = req.params.ids;
  const idsarray = ids.split("-");

  const users = [];

  idsarray.forEach(async (id, index, i) => {
    const long = i.length;
    const isLastRound = long === index + 1;
    userModel.getUserById(id, (err, result) => {
      if (!err) {
        console.log("res", result[0]);
        if (result[0]) {
          users.push(result[0]);
        }
        if (isLastRound) {
          return res.status(200).json({
            users,
          });
        }
      }
    });
  });
};

//récupérer l'utilisateur grâce à son id
exports.getUserById = (req, res) => {
  const id = req.params.id;

  userModel.getUserById(id, (error, result) => {
    if (error) {
      return res.status(401).json({
        message: error.message,
      });
    } else {
      return res.status(200).json({
        user: result,
      });
    }
  });
};

//Supprimer un utilisateur
exports.deleteUser = (req, res, next) => {
  const authUser = req.user;
  const userIdToDelete = req.params.id;

  if (!req.user) {
    return res.status(401).json({
      message: "You should authenticated",
    });
  }

  if (Number(authUser.id_user) !== Number(userIdToDelete)) {
    return res.status(401).json({
      message: "Permission denied",
    });
  }

  userModel.deleteUser(userIdToDelete, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    } else {
      return res.status(200).json({
        message: "Account deleted",
      });
    }
  });
};
