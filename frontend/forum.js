const articlesContainer = document.querySelector('#articles-container');
import { getUser } from './js/auth.js';
import { getToken } from '/js/auth.js';

//Récupérer l'utilisateur de l'api
async function getUserApi(id){
  try {
    const response = await fetch(
      `http://localhost:3000/api/auth/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: getToken(),
        },
      }
    );
    if (response.status !== 200) {
      const res = await response.json();
    return res.message;
    }
    const res = await response.json();
    return res.user[0];
  } catch (err) {

    return err.message;
  }

}
const user = getUser()

getUserApi(user.id_user).then(e=>{
})

// requête pour récupérer les articles
async function getArticles() {
  try {
    const response = await fetch('http://localhost:3000/api/article/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: getToken(),
      },
    });
    if (response.status !== 200) {
      return [];
    }
    const res = await response.json();
    return res.data;
  } catch (err) {
    console.err(err.message);
    return [];
  }
}

//fonction pour la date
function timeAgo(poste) {

  let timeAgoStr = "";
  var postedDate   = new Date(poste.posted_date);
  var now   = new Date();

  const seconds = (now.getTime() - postedDate.getTime()) / 1000

  if(seconds > 3600){
    timeAgoStr = Math.trunc(seconds/3600) + " heure" + (Math.trunc(seconds/3600) >1  ? 's' : "")  ;
    
    if(Math.trunc(seconds/3600) > 24){
      timeAgoStr = Math.trunc(Math.trunc(seconds/3600)/24) + " jour" + (Math.trunc(Math.trunc(seconds/3600)/24) >1  ? 's' : "");

    }
  }
  else if(seconds>60){
    timeAgoStr = Math.trunc(seconds/60) + " minute" + ( Math.trunc(seconds/60) > 1 ? "s" :"")  ;

  }
  else{

    timeAgoStr =  Math.trunc(seconds) + " seconde" + ( seconds > 1 ? "s" :"")  ;
  }
  return  timeAgoStr;
}

// fonction pour le display des articles 
async function displayArticles(articles, article_commentCount) {
  let content = '';

  const sortedArticle = articles.sort((a, b) =>
    new Date(a.posted_date) < new Date(b.posted_date) ? 1 : -1
  );

  sortedArticle.forEach((article) => {
    getUserApi(article.id_user).then(user =>{
      const timeAgoStr = timeAgo(article);
    
    if (!article.image_url) {
      articlesContainer.innerHTML +=   `<div class="card mb-3">
      
      <div class="card-body">
      
        <h4  class="text-info">Posté par ${user.username} </h4>
        <h5 class="card-title">Titre : ${article.title}</h5>
        <p class="card-text">${article.description.substring(0, 100)}...</p>
        <h5>  <span class="badge badge-pill badge-light">il y a ${timeAgoStr}</span></h5>
        <p class="card-text"><small class="text-muted">${
          article_commentCount[article.id_article] === 0
            ? '0 commentaire'
            : article_commentCount[article.id_article]=== 1 ? '1 commentaire' :  article_commentCount[article.id_article]  + ' commentaires'
        }</small></p>
        <a  href="/article.html?id=${article.id_article}?user=${article.id_user}" class="btn btn-outline-danger">Voir article</a>
      </div>
    </div>`;
    } else {

      articlesContainer.innerHTML +=   `<div class="card mb-3">
      <img src="http://localhost:3000/images/${article.image_url}" alt=${
          article.title + ' image '
        }>
      <div class="card-body">
      <h4 class="text-info">Posté par ${user.username} </h4>
        <h5 class="card-title">Titre : ${article.title}</h5>
        <h5>  <span class="badge badge-pill badge-light">il y a ${timeAgoStr}</span></h5>
        <p class="card-text">${article.description.substring(0, 100)}...</p>
        <p class="card-text"><small class="text-muted">${
          article_commentCount[article.id_article] === 0
          ? '0 commentaire'
          : article_commentCount[article.id_article]=== 1 ? ' 1 commentaire' :  article_commentCount[article.id_article]  + ' commentaires'
        }</small></p>
        <a  href="/article.html?id=${article.id_article}?user=${article.id_user}" class="btn btn-outline-danger">Voir article</a>
      </div>
    </div>`;
     
    }
  });
  })
}

// recuperer les commentaires des articles

async function getArticleComments(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/article/${id}/comments`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

// initialision du code 

(async function () {
  const articles = await getArticles();
  const article_commentCount = {};
  for (let index = 0; index < articles.length; index++) {
    const element = articles[index];
    const comments = await getArticleComments(element.id_article);
    article_commentCount[element.id_article] = comments.length;
  }
  
  displayArticles(articles, article_commentCount);
})();