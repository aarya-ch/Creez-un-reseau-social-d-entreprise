const form = document.querySelector('#update-post-form');
const titleInput = document.querySelector('#title-input');
const text = document.querySelector('#text-input');
const input = document.querySelector('#image-input');

const tokenInput = document.querySelector('#hidden-token-input');
const userIdInput = document.querySelector('#hidden-user-id-input');
const annuler = document.querySelector('#annuler');
import { getToken, getUser } from '/js/auth.js';
annuler.addEventListener('click', (e) => {
  window.location.replace('/forum.html');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  console.log('submit');
  var data = new FormData();
  data.append('articleImage', input.files[0]);

  data.append('title', titleInput.value);

  data.append('text', text.value);
  data.append('userId', getUser().id_user);


  if (titleInput.value !== null && titleInput.value !== ""  && text.value !== null  && text.value !== "") {

    await updateArticle(data);  
  }
  else{
  
    alert("le titre et la description sont requis");
  
  }
 
});

// envoyer l'article vers le serveur
async function updateArticle(data) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/article/` + getArticleIdFromUrl(),
      {
        method: 'POST',
        headers: {
          authorization: getToken(),
        },
        body: data,
      }
    );

    if (response.status === 200) {
      window.location.replace('/forum.html');
    }
  } catch (err) {
    console.log(err.message);
    return {
      message: err.message,
    };
  }
}

//recupere l'article
async function getArticle(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/article/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

// recuperer l'id de l'article a partir de l'url
function getArticleIdFromUrl() {
  const filtered = window.location.search
    .replace(/\D+/g, ' ')
    .trim()
    .split(' ')
    .map((e) => parseInt(e));
  return filtered[0];
}

//  aficher les informations de l'article a modifier dans le formulaire
function displayArticle(article) {
  titleInput.value = article.title;
  text.value = article.description;
}

// initialison du code
(async function () {
  const articleId = getArticleIdFromUrl();
  const article = await getArticle(articleId);
  displayArticle(article);
})();
