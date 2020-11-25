const newPostForm = document.querySelector('#new-post-form');
const titleInput = document.querySelector('#title-input');
const textInput = document.querySelector('#text-input');

const annuler = document.querySelector('#annuler');
import { getToken, getUser } from './js/auth.js';

annuler.addEventListener('click', (e) => {
  window.location.replace('/forum.html');
});

var input = document.querySelector('input[type="file"]');

console.log(getUser());
newPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  console.log('submit');
  var data = new FormData();
  data.append('articleImage', input.files[0]);

  data.append('title', titleInput.value);

  data.append('text', textInput.value);
  data.append('userId', getUser().id_user);

  
  if (titleInput.value !== null && titleInput.value !== ""  && textInput.value !== null  && textInput.value !== "") {
    await postArticle(data);    
  }else{
  
    alert("le titre et la description sont requis");
  
  }

});

// envoyer l'article vers le serveur
async function postArticle(data) {
  try {
    const response = await fetch(`http://localhost:3000/api/article`, {
      method: 'POST',
      headers: {
        authorization: getToken(),
      },
      body: data,
    });

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
