const articleContainer = document.querySelector("#article-container");
const commentsContainer = document.querySelector("#comments");
const newCommentForm = document.querySelector("#new-comment-form");
const bodyInput = document.querySelector("#body");

const supprimerBtn = document.querySelector("#supprimer");
const modifierBtn = document.querySelector("#modifier");

const form = document.querySelector("#profile-form");

const user = getUser();

const updateLink = document.querySelector("#modifier");

// importation token et user

import { getToken, getUser } from "/js/auth.js";

//attendre de récupérer les commentaires à partir du serveur
//pour ensuite ajouter les addEventListener pour le  button delete
setTimeout(() => {
  const commentaires = document.getElementsByClassName("deleteComment");
  for (let index = 0; index < commentaires.length; index++) {
    const element = commentaires[index];
    element.addEventListener("click", async (e) => {
      await delComment(e.path[1].id);
    });
  }
}, 2000);

// mettre a jour le lien du formulaire pour la requete du update
updateLink.href = `/updatePoste.html?id=${getArticleIdFromUrl()}`;

// si le user n'est pas le proprietaire du poste ou il n'est pas un admin
// on affiche pas les button modifier et supprimer
if (user.id_user != getuserIdFromUrl() && user.type !== "admin") {
  supprimerBtn.style.display = "none";
  modifierBtn.style.display = "none";
}

// requête pour la supression d'un commentaire par id

async function delComment(id) {
  const user = getUser();

  try {
    const response = await fetch(
      `http://localhost:3000/api/commentaire/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
      }
    );
    if (response.status !== 200) {
      alert(response.error);
      return null;
    } else {
      window.location.reload();
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// fonction pour la supression d'un article
async function delArticle(e) {
  e.preventDefault();

  const user = getUser();
  const id_article = Number(getArticleIdFromUrl());

  try {
    const response = await fetch(
      `http://localhost:3000/api/article/${id_article}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
      }
    );
    if (response.status !== 200) {
      alert(response.error);
      return null;
    } else {
      window.location.replace("/forum.html");
    }
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// ajouter un listener pour l'evenement submit sur le formulaire du button supprimer

form.addEventListener("submit", delArticle);

// requête pour poste un commentaire
async function postComment(data) {
  try {
    const response = await fetch(`http://localhost:3000/api/commentaire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getToken(),
      },
      body: JSON.stringify(data),
    });
    if (response.status !== 200) {
      return null;
    }
    const res = await response.json();
    return res.data;
  } catch (err) {
    console.err(err.message);
    return [];
  }
}

// ajouter un litsener pour recuperer un commentaire de l'url
newCommentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = bodyInput.value;
  const id_article = Number(getArticleIdFromUrl());
  const user = getUser();
  const id_user = user.id_user;
  const data = { id_article, id_user, body };

  await postComment(data);
  location.reload();
});

//recuprer l'article id a partir du formulaire
function getArticleIdFromUrl() {
  const filtered = window.location.search
    .replace(/\D+/g, " ")
    .trim()
    .split(" ")
    .map((e) => parseInt(e));

  return filtered[0];
}

//recuprer le user id a partir de l'url
function getuserIdFromUrl() {
  const filtered = window.location.search
    .replace(/\D+/g, " ")
    .trim()
    .split(" ")
    .map((e) => parseInt(e));

  return filtered[1];
}

//requête pour recuperer un article à partir du server

async function getArticle(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/article/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: getToken(),
      },
    });
    if (response.status !== 200) {
      return null;
    }
    const res = await response.json();
    return res.data;
  } catch (err) {
    console.err(err.message);
    return [];
  }
}

// requête pour recuperer les commentaires d'un article

async function getArticleComments(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/article/${id}/comments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
      }
    );
    if (response.status !== 200) {
      return null;
    }
    const res = await response.json();
    return res.data;
  } catch (err) {
    console.err(err.message);
    return [];
  }
}

// requête pour recuperer les users des commentaires

async function getUsers(ids) {
  const urlIds = ids.join("-");

  try {
    const response = await fetch(
      `http://localhost:3000/api/auth/users/${urlIds}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
      }
    );
    if (response.status !== 200) {
      return null;
    }
    const res = await response.json();
    return res.users;
  } catch (err) {
    console.err(err.message);
    return [];
  }
}

// fonction pour afficher les articles
function displayArticle(article) {
  let content = "";
  if (!article.image_url) {
    content += `<div class="card mb-3">
    
    <div class="card-body">
      <h2 class="card-title">${article.title}</h2>
      
      <p class="card-text">${article.description}</p>
     
    </div>
  </div>`;
  } else {
    content += `<div class="card mb-3">
    <img src="http://localhost:3000/images/${article.image_url}" alt=${
      article.title + " image "
    }>
    <div class="card-body">
      <h2 class="card-title">${article.title}</h2>
      <p class="card-text">${article.description}</p>
    </div>
  </div>`;
  }
  articleContainer.innerHTML = content;
}

// requête pour récuperer un username dans la base de donées
function getUsername(users, userId) {
  return users.find((user) => user.id_user === userId);
}
// gestion de la date
function timeAgo(comment) {
  let timeAgoStr = "";
  var postedDate = new Date(comment.post_date);
  var now = new Date();

  const seconds = (now.getTime() - postedDate.getTime()) / 1000;

  if (seconds > 3600) {
    timeAgoStr =
      Math.trunc(seconds / 3600) +
      " heure" +
      (Math.trunc(seconds / 3600) > 1 ? "s" : "");

    if (Math.trunc(seconds / 3600) > 24) {
      timeAgoStr =
        Math.trunc(Math.trunc(seconds / 3600) / 24) +
        " jour" +
        (Math.trunc(Math.trunc(seconds / 3600) / 24) > 1 ? "s" : "");
    }
  } else if (seconds > 60) {
    timeAgoStr =
      Math.trunc(seconds / 60) +
      " minute" +
      (Math.trunc(seconds / 60) > 1 ? "s" : "");
  } else {
    timeAgoStr = Math.trunc(seconds) + " seconde" + (seconds > 1 ? "s" : "");
  }

  return timeAgoStr;
}

// fonction pour l'affichage des commentaires

function displayComments(comments, users) {
  let content = "";

  const sortedComments = comments.sort((a, b) =>
    new Date(a.posted_date) < new Date(b.posted_date) ? 1 : -1
  );

  const user = getUser();
  sortedComments.forEach((comment) => {
    const timeAgoStr = timeAgo(comment);

    content += `
      <div class="card container">
        <p class="card-title">${
          getUsername(users, comment.id_user).username
        } </p>

        <div class="card-body">
        <p class="card-text">${comment.body}</p>

        <span>Il y a  ${timeAgoStr}</span>
        ${
          comment.id_user === user.id_user || user.type === "admin"
            ? '<button class="btn btn-danger deleteComment"  id=' +
              comment.id_comment +
              "> <i class='material-icons'>delete</i>  </button>"
            : ""
        } 
        </div>
      </div>
    `;
  });
  commentsContainer.innerHTML = content;
}

// initialisation du code pour le chargement de la page
(async function () {
  const articleId = getArticleIdFromUrl();
  const article = await getArticle(articleId);
  const comments = await getArticleComments(articleId);
  const ids = comments.map((comment) => comment.id_user);
  displayArticle(article);
  if (ids.length > 0) {
    const users = await getUsers(ids);
    displayComments(comments, users);
  }
})();
